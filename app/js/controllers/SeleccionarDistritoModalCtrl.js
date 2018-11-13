angular.module("auditoriaApp")

.controller('SeleccionarDistritoModalCtrl', function ($uibModalInstance, ConexionServ, $scope, USER, AuthServ, $timeout, $filter) {
	
	$scope.USER 			= USER;
	$scope.distritos 		= [];
	$scope.distrito_id 		= USER.distrito_id;
	$scope.distritos_ori 	= [];
	

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
	
	
	$timeout(()=>{
		$scope.focusSearchIglesia = true;
	})

	
	$scope.seleccionarIglesia = function(iglesia) {

		ConexionServ.query('UPDATE usuarios SET distrito_id=?, iglesia_id=? WHERE rowid=? ', [ iglesia.distrito_id, iglesia.rowid, $scope.USER.rowid ]).then(function(result) {
			$scope.USER.iglesia_id 		= iglesia.rowid;
			$scope.USER.distrito_id 	= iglesia.distrito_id;
			
			AuthServ.update_user_storage($scope.USER).then(function(usuario){
				$uibModalInstance.close(usuario);
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
		$uibModalInstance.dismis('Sin nada');
	};
  
});
  