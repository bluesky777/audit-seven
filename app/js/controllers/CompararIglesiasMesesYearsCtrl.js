angular.module('auditoriaApp')

.controller('CompararIglesiasMesesYearsCtrl', function($scope, ConexionServ, CompararRemesasFactory, $http, rutaServidor, toastr){
	
	$scope.dato = {};
	
	
	
	// Configuramos los datos si es OFFLINE
	if ( ($scope.USER.tipo == 'Auditor' && $scope.modo_offline == true) || 
		($scope.USER.tipo == 'Admin' && $scope.modo_offline == true) ) {
				
		consulta = "SELECT a.rowid, a.* FROM asociaciones a " +
			"INNER JOIN distritos d ON a.rowid = d.asociacion_id and d.eliminado is null " + 
			"WHERE d.rowid=?";       

		ConexionServ.query(consulta, [$scope.USER.distrito_id]).then(function(result) {
			$scope.asociacion = result[0];
		}, function(tx) {
			toastr.warning("Parece que no tienes distrito seleccionada", tx);
		});
		
		consulta = "SELECT d.rowid, d.* FROM distritos d " +
			"WHERE d.asociacion_id=? and d.eliminado is null";       

		ConexionServ.query(consulta, [$scope.USER.asociacion_id]).then(function(result) {
			$scope.distritos_asoc = result;
			
			for (let i = 0; i < $scope.distritos_asoc.length; i++) {
				const element = $scope.distritos_asoc[i];
				if (element.rowid == $scope.USER.distrito_id) {
					$scope.dato.distrito = element;
				}
			}
		}, function(tx) {
			toastr.warning("Parece que no tienes asociación seleccionada", tx);
		});
	
	// Configuramos los datos si es ONLINE
	}else{
		
		$http.put(rutaServidor.root + '/au_asociaciones/asociacion-con-distritos', {distrito_id: $scope.USER.distrito_id}).then(function(r){
			$scope.asociacion 		= r.data.asociacion;
			$scope.distritos_asoc 	= $scope.asociacion.distritos;
			
			for (let i = 0; i < $scope.distritos_asoc.length; i++) {
				const element = $scope.distritos_asoc[i];
				if (element.id == $scope.USER.distrito_id) {
					$scope.dato.distrito = element;
				}
			}
			
		}, function(r2){
			toastr.error('No se pudo descargar iglesias');
		})
		
	}
		
	// Año después y anterior
	$scope.yearDes     = new Date().getUTCFullYear();
	$scope.yearAnt     = $scope.yearDes - 1;
	
	
	$scope.compararDistrito = function(distrito_id){
		$scope.years    = [$scope.yearAnt, $scope.yearDes];
		
		is_online = !$scope.USER.modo_offline;
		
		CompararRemesasFactory.traer(distrito_id, '611110', $scope.years, is_online).then(function(resp){
			$scope.iglesias     = resp.iglesias;
		})
		
		CompararRemesasFactory.traer(distrito_id, '634110', $scope.years, is_online).then(function(resp){
			$scope.iglesias_desarrollo     = resp.iglesias;
		})
	}
	
	$scope.compararDistrito($scope.USER.distrito_id);
	
	
	
});