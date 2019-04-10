angular.module('auditoriaApp')

.controller('PanelCtrl', function($scope, ConexionServ, $timeout, $uibModal, USER, AuthServ, Upload, rutaServidor, toastr, $http, $translate){
	
	$scope.USER                     = USER;
	$scope.sidebar_active           = false;
	$scope.version                  = '0.0.12';
	$scope.sidebar_active 	        = false;
	$scope.modo_offline 	        = false;
	$scope.tema 					= USER.tema;
	$scope.idioma 					= USER.idioma;
	
	
	if (localStorage.modo_offline) {
		if (localStorage.modo_offline == 'true') {
			$scope.modo_offline = true;
		}
	}else{
		localStorage.modo_offline == $scope.modo_offline;
	}
	
	if (USER.idioma) {
		$translate.use(USER.idioma);
	}else{
		$translate.use('Español');
	}
	

	
	try {
		const {ipcRenderer} = require('electron');
		
		ipcRenderer.on('message', function(event, text) {
			var container = document.getElementById('messages');
			var message   = document.createElement('div');
			message.innerHTML = text;
			container.appendChild(message);
		})
		
		
		ipcRenderer.on('toma-version', function(event, arg) {
			$scope.version = arg;
		})
		
		ipcRenderer.send('dame-version');
	} catch(e) {
		console.log("electron no encontrado");
	}
	
	
	$scope.rutaServidor = rutaServidor.ruta;
	
	if (localStorage.ruta){
		$scope.rutaServidor = localStorage.ruta;
	}
	
	$scope.verCambiarRuta = function(){
		$scope.cambiando_ruta = true;
	}
	$scope.cancelarVerCambiarRuta = function(){
		$scope.cambiando_ruta = false;
	}
	
	$scope.guardarRuta = function(rutaServidor){
		localStorage.ruta = rutaServidor;
		$scope.cambiando_ruta = false;
	}
	
	
	consulta = "SELECT a.rowid, a.* FROM asociaciones a " +
			"INNER JOIN distritos d ON a.rowid = d.asociacion_id and d.eliminado is null " + 
			"WHERE d.rowid=?";       

	ConexionServ.query(consulta, [$scope.USER.distrito_id]).then(function(result) {
			$scope.asociacion = result[0];
	}, function(tx) {
			toastr.warning("Parece que no tienes iglesia seleccionada", tx);
	});
    

		
	
	$scope.cambiarOffline = function () {
		$scope.modo_offline 		= !$scope.modo_offline;
		localStorage.modo_offline 	= $scope.modo_offline;
		toastr.warning('Aún no funciona.');
	}	
	
	$scope.cambiarTema = function (themeName) {

		if (themeName == 'classic') {
			$('#bs-css').attr('href', 'bower_components/bootstrap/dist/css/bootstrap.min.css');
		} else {
			if (themeName) {
				$('#bs-css').attr('href', 'css/bootstrap-' + themeName + '.min.css');
			}else{
				$('#bs-css').attr('href', 'css/bootstrap-cerulean.min.css');
			}
		}
		
		$http.put(rutaServidor.root + '/au_usuario/cambiar-tema', { tema: themeName, user_id: $scope.USER.rowid }).then(function(){
			$scope.USER.tema 		= themeName;
			$scope.tema 			= $scope.USER.tema;
			
			
			ConexionServ.query('UPDATE usuarios SET tema=? WHERE rowid=?', [themeName, $scope.USER.rowid]).then(function(result) {
				AuthServ.update_user_storage($scope.USER);
			}, function(){
				toastr.warning('Se requiere internet');
			});

		})
	}

	if ($scope.tema == 'classic') {
		$('#bs-css').attr('href', 'bower_components/bootstrap/dist/css/bootstrap.min.css');
	} else {
		if ($scope.tema) {
			$('#bs-css').attr('href', 'css/bootstrap-' + $scope.tema + '.min.css');
		}else{
			$('#bs-css').attr('href', 'css/bootstrap-cerulean.min.css');
		}
		
	}
	
	
	$scope.cambiarIdioma = function (idioma) {
		$translate.use(idioma);
		
		$http.put(rutaServidor.root + '/au_usuario/cambiar-idioma', { idioma: idioma, user_id: $scope.USER.rowid }).then(function(){
			$scope.USER.idioma 		= idioma;
			$scope.idioma 			= $scope.USER.idioma;
			console.log('UPDATE usuarios SET idioma=? WHERE rowid=?', [idioma, $scope.USER.rowid]);
			ConexionServ.query('UPDATE usuarios SET idioma=? WHERE rowid=?', [idioma, $scope.USER.rowid]).then(function(result) {
				AuthServ.update_user_storage($scope.USER);
			}, function(){
				toastr.warning('Se requiere internet');
			});
			
		})
	}
	
	
	
	$scope.refresh = function () {
		try {
			const {ipcRenderer} = require('electron');
			ipcRenderer.send('refrescar-app');
		} catch(e) {
			console.log("electron no encontrado");
			location.reload();
		}
	}
	
	
	
	$scope.uploadFiles = function (files, $invalidFiles) {
		console.log(files, $invalidFiles);
		if (files && files.length) {
			for (var i = 0; i < files.length; i++) {
			  var file = files[i];
			  
			  if (!file.$error) {
				Upload.upload({
					url: rutaServidor.root + '/remesas/upload',
					data: {
					  file: file,
					  asociacion_id: $scope.USER.asociacion_id,
					}
				}).then(function (resp) {
					$timeout(function() {
						$scope.log = 'Archivo: ' +
						resp.config.data.file.name +
						', ' + resp.data.length + ' registros subidos.'
						'\n' + $scope.log;
						
						$scope.estado_descarga = 'insertando';
						promesas        = [];
						$now            = window.fixDate(new Date(), true);
						$scope.porc     = 0;
						$scope.total    = resp.data.length;
						
						
						consulta = 'DELETE FROM remesas';
						ConexionServ.query(consulta).then(function(borr) {
							
							
							function insertarRemesa($remesa){
								
								if ($remesa.fecha) {
									$remesa.fecha = $remesa.fecha.replace(/-/g, '/');
								}
								
								nombre_cuenta = null;
								if ($remesa.nombre_cuenta) {
									nombre_cuenta = $remesa.nombre_cuenta;
								}
								
								
								concepto = null;
								if ($remesa.concepto) {
									concepto = $remesa.concepto;
								}
								
								consulta = 'INSERT INTO remesas(rowid, id, asociacion_id, num_diario, linea, tipo_diario, num_secuencia, periodo, fecha, referencia, cod_cuenta, nombre_cuenta, descripcion_transaccion, cantidad, ' + 
										'iva, moneda, recurso, funcion, restr, org_id, empleados, concepto, created_at) ' + 
									'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);';
									
								
								datos   = [ $remesa.id, $remesa.id, $remesa.asociacion_id, $remesa.num_diario, $remesa.linea, $remesa.tipo_diario, $remesa.num_secuencia, $remesa.periodo, $remesa.fecha, $remesa.referencia, $remesa.cod_cuenta, $remesa.nombre_cuenta, $remesa.descripcion_transaccion, $remesa.cantidad, 
										$remesa.iva, $remesa.moneda, $remesa.recurso, $remesa.funcion, $remesa.restr, $remesa.org_id, $remesa.empleados, concepto, $now ];
								
								prom    = ConexionServ.query(consulta, datos)
								
								prom.then(function(result) {
									$scope.porc++;
								});
								promesas.push(prom);
							}
							
							for ($i=0; $i < resp.data.length; $i++) {
								$remesa = resp.data[$i];
								insertarRemesa($remesa);
							}
							
							Promise.all(promesas).then(function(result){
								toastr.success('Remesas insertadas con éxito');
								$scope.estado_descarga = '';
							});
							
						});
						
						
						
					});
				}, function(){
					toastr.error('Hubo un error subiendo archivo');
				}, function (evt) {
					$scope.log = evt.config.data.file.name + ' subido' + '. Esperando registros...';
				});
			  }
			}
		}
	}
	
	
	$scope.porcentajeInsertado = function(){
		if ($scope.total > 0) {
			porce = $scope.porc/$scope.total*100;
			return parseInt(porce);
		}
		
	}
	
	
	$scope.sidebar_activar = function () {
		$scope.sidebar_active = !$scope.sidebar_active;
	}
	
	$scope.seleccionarDistrito = function () {
		var modal = $uibModal.open({
			templateUrl: 'templates/entidades/seleccionarDistritoModal.html',
			size: 'lg',
			resolve: {
				USER: function () {
					return $scope.USER;
				}
			},
			controller: 'SeleccionarDistritoModalCtrl'
		});
		
		modal.result.then(function (usuario_new) {
			$scope.USER = usuario_new;
		});
	}
	
	
	$scope.cerrar_sesion = function(){
		AuthServ.cerrar_sesion();
	}
	
	
	
})

