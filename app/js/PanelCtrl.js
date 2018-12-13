angular.module('auditoriaApp')

.controller('PanelCtrl', function($scope, ConexionServ, $timeout, $uibModal, USER, AuthServ, Upload, rutaServidor, toastr){
	
	$scope.USER                     = USER;
	$scope.sidebar_active           = false;
	$scope.version                  = 'X.Y.Z';
	$scope.sidebar_active 	        = false;
	$scope.modo_offline 	        = false;
	
	if (localStorage.modo_offline) {
		if (localStorage.modo_offline == 'true') {
			$scope.modo_offline = true;
		}
	}
	
	//ConexionServ.createTables()
	
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
		console.error("electron no encontrado");
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
	
	
	
	$scope.refresh = function () {
		try {
			const {ipcRenderer} = require('electron');
			ipcRenderer.send('refrescar-app');
		} catch(e) {
			console.error("electron no encontrado");
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
			templateUrl: 'templates/Entidades/seleccionarDistritoModal.html',
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

