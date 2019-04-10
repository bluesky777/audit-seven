angular.module("auditoriaApp")

.controller('SeleccionarDistritoModalCtrl', function ($uibModalInstance, ConexionServ, $scope, USER, AuthServ, $timeout, $filter, $http, rutaServidor, toastr) {
	
	$scope.USER 			= USER;
	$scope.distritos 		= [];
	$scope.distrito_id 		= USER.distrito_id;
	$scope.distritos_ori 	= [];
	
	
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
		
		
	}else{
		
		datos = {
			tipo_usu: 		$scope.USER.tipo,
			usu_id: 		$scope.USER.id,
			asociacion_id: 	$scope.USER.asociacion_id
		}
		
		$http.put(rutaServidor.root + '/au_iglesias', datos).then(function(r){

			$scope.distritos = r.data;
			
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
	

	
	$timeout(()=>{
		$scope.focusSearchIglesia = true;
	})

	
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
				
				AuthServ.update_user_storage($scope.USER).then(function(usuario){
					
					$http.put(rutaServidor.root + '/au_usuario/cambiar-iglesia', { iglesia_id: $scope.USER.iglesia_id, user_id: id }).then(function(){
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
  