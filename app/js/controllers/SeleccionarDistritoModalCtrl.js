angular.module("auditoriaApp")

.controller('SeleccionarDistritoModalCtrl', function ($uibModalInstance, ConexionServ, $scope, USER, AuthServ, $timeout, $filter, $http, rutaServidor, toastr) {
	
	$scope.USER 			= USER;
	$scope.distritos 		= [];
	$scope.distrito_id 		= USER.distrito_id;
	$scope.distritos_ori 	= [];
	$scope.hasDivisionRole 	= AuthServ.hasDivisionRole;
	$scope.hasUnionRole 	= AuthServ.hasUnionRole;
	$scope.datos 			= {};
	
	
	
	$scope.traerIglesias = function(asociacion_id, cargando){

		datos = {
			tipo_usu: 		$scope.USER.tipo,
			usu_id: 		$scope.USER.id,
			asociacion_id: 	asociacion_id,
			cambiando_asociacion: true
		}
		
		$http.put(rutaServidor.root + '/au_iglesias/de-asociacion', datos).then(function(r){

			$scope.distritos 			= r.data;
			$scope.USER.asociacion_id 	= asociacion_id;
			
			AuthServ.update_user_storage($scope.USER).then(function(usuario){
				if (!cargando) {
					toastr.success('Asociación cambiada');
				}
			})
			
			if ($scope.distritos.length == 1) {
				$scope.distritos[0].seleccionado = true;
			}else if($scope.distritos.length > 1){
				
				$scope.distritos.map((distrito, i)=>{
					
					if (USER.distrito_id == distrito.id) {
						distrito.seleccionado = true;
					}
					
				})
			}
			
			$scope.distritos_ori = angular.copy($scope.distritos);
			
        }, function(r2){
            toastr.error('No se pudo descargar iglesias');
        })
	}
	
	
	// Cuando seleccione una UNIÓN
	$scope.traerAsociaciones = function(union_id, cargando){

		datos = {
			tipo_usu: 		$scope.USER.tipo,
			usu_id: 		$scope.USER.id,
			union_id: 		union_id,
			cambiando_union: true
		}
		
		$http.put(rutaServidor.root + '/au_asociaciones/de-union', datos).then(function(r){

			$scope.USER.asociaciones 	= r.data;
			$scope.USER.union_id 		= union_id;
			
			console.log($scope.USER, union_id);
			
			AuthServ.update_user_storage($scope.USER).then(function(usuario){
				if (!cargando) {
					toastr.success('Unión cambiada');
				}
				
			})
			
        }, function(r2){
            toastr.error('No se pudo descargar iglesias');
        })
	}
	

	
	// Configuramos los datos si es OFFLINE
	if ( ($scope.USER.tipo == 'Auditor' && $scope.modo_offline == true) || 
		($scope.USER.tipo == 'Admin' && $scope.modo_offline == true) ) {
		
		
		ConexionServ.query('SELECT *, rowid FROM distritos', []).then(function(result) {
			
			$scope.distritos = result;
			
			let mapeando = $scope.distritos.map((distrito, i)=>{
				return new Promise((resolve, reject)=>{
					
					if (USER.distrito_id == distrito.rowid) {
						distrito.seleccionado = true;
					}
					
					ConexionServ.query('SELECT *, rowid FROM iglesias WHERE distrito_id=?', [distrito.rowid]).then(function(result) {
						distrito.iglesias = result;
						resolve(distrito.iglesias);
					}, function(tx) {
						console.log("Error no es posbile traer iglesias", distrito, tx);
					});
				})
			})
			
			Promise.all(mapeando).then(()=>{
				$scope.distritos_ori = angular.copy($scope.distritos);
			})
			
		}, function(tx) {
			console.log("Error no es posbile traer Distritos", tx);
		});
		
		
	// Configuramos los datos si es ONLINE
	}else{

		if ($scope.USER.union_id > 0 && AuthServ.hasDivisionRole($scope.USER.tipo, true)) {
			
			// Para cuando ya tengamos las uniones
			function continuarConAsociaciones() {
				// Selecciono la unión del usuario
				for (let i = 0; i < $scope.USER.uniones.length; i++) {
					if ($scope.USER.union_id == $scope.USER.uniones[i].id) {
						$scope.datos.union = $scope.USER.uniones[i];
					}
				}
				
				// Si tiene asociacion_id, la buscamos y la seleccionamos
				if ($scope.USER.asociacion_id > 0) {
					
					for (let i = 0; i < $scope.USER.asociaciones.length; i++) {
						if ($scope.USER.asociacion_id == $scope.USER.asociaciones[i].id) {
							$scope.datos.asociacion = $scope.USER.asociaciones[i];
						}
					}
					$scope.traerIglesias($scope.USER.asociacion_id, true)
				}else{
					$scope.traerAsociaciones($scope.USER.union_id, true)
				}
			}

			if ($scope.USER.uniones) {
				if ($scope.USER.uniones.length>1) {
					continuarConAsociaciones()
				}
			}else{
				$http.put(rutaServidor.root + '/au_uniones').then(function(r){

					$scope.USER.uniones 		= r.data;
					AuthServ.update_user_storage($scope.USER).then(function(usuario){})
					continuarConAsociaciones()
					
				}, function(r2){
					toastr.error('No se pudo descargar iglesias');
				})
			}
			
		}else if (AuthServ.hasAsociacionRole($scope.USER.tipo) || AuthServ.hasUnionRole($scope.USER.tipo)) {
			
			$scope.traerIglesias($scope.USER.asociacion_id, true)
	
		}
		
	}
	
	// Focus cuando todo 
	$timeout(()=>{
		$scope.focusSearchIglesia = true;
	})

	
	// Cuando el usuario seleccione una iglesia del Modal:
	$scope.seleccionarIglesia = function(iglesia) {
		
		auditoria_id = null;
		
		// Traigo auditorias de la iglesia seleccionada
		ConexionServ.query('SELECT *, rowid FROM auditorias WHERE iglesia_id=? and eliminado is null', [ iglesia.rowid ]).then(function(auditorias) {
			if(auditorias.length > 0){
				auditoria_id = auditorias[auditorias.length-1].rowid;
			}
			
			// Guardo la iglesia y última auditoría
			id = $scope.USER.rowid;
            if (!id) {
                id = $scope.USER.id;
            }
			ConexionServ.query('UPDATE usuarios SET distrito_id=?, iglesia_id=?, auditoria_id=? WHERE rowid=? ', [ iglesia.distrito_id, iglesia.rowid, auditoria_id, id ]).then(function(result) {
				$scope.USER.iglesia_id 		= iglesia.rowid;
				$scope.USER.distrito_id 	= iglesia.distrito_id;
				$scope.USER.auditoria_id 	= auditoria_id;
				
				// Para que aparezca en la barra superior del panel
				localStorage.iglesia_nombre_selected 	= iglesia.nombre;
				localStorage.iglesia_alias_selected 	= iglesia.alias;
				localStorage.iglesia_codigo_selected 	= iglesia.codigo;
				
				AuthServ.update_user_storage($scope.USER).then(function(usuario){
					
					$http.put(rutaServidor.root + '/au_usuario/cambiar-iglesia', { iglesia_id: $scope.USER.iglesia_id, distrito_id: $scope.USER.distrito_id, user_id: id }).then(function(){
						try {
							const {ipcRenderer} = require('electron');
							ipcRenderer.send('refrescar-app');
						} catch(e) {
							console.log("electron no encontrado");
							location.reload();
						}
						
					}, function(){
						try {
							const {ipcRenderer} = require('electron');
							ipcRenderer.send('refrescar-app');
						} catch(e) {
							console.log("electron no encontrado");
							location.reload();
						}
					})
					
					
					$uibModalInstance.close(usuario);
				});
				
			});
			
		});
		
	}

	
	$scope.changeSearch = function (textSearchIglesia) {
		
		if (!textSearchIglesia) {
			$scope.distritos = angular.copy($scope.distritos_ori);
			return;
		}
		
		result 					= [];
		textSearchIglesia 		= textSearchIglesia.toLowerCase();
		$scope.distritos_temp 	= angular.copy($scope.distritos_ori);
		
		$scope.distritos_temp.map((distrito, i)=>{
			
			iglesias = $filter('filter')(distrito.iglesias, (item, expected)=> { 
				if ((item.nombre.toLowerCase().indexOf(textSearchIglesia) != -1) || (item.alias.toLowerCase().indexOf(textSearchIglesia) != -1) ){
					return true;
				}
				return false;
			});
			
			if (iglesias.length > 0) {
				distrito.iglesias = iglesias;
				result.push(distrito);
			}
		})
		
		$scope.distritos = result;
	};
	
  
	$scope.ok = function () {
		$uibModalInstance.close($scope.USER);
	};
  
});
  