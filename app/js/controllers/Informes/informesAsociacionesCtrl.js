angular.module('auditoriaApp')

.controller('informesAsociacionesCtrl', function($scope, ConexionServ){

    	consulta = "SELECT aso.rowid, aso.* , un.nombre as nombre_union, t.nombres as tesorero_nombres, t.apellidos as tesorero_apellidos from asociaciones aso " + 
		" INNER JOIN uniones un ON aso.union_id = un.rowid " +
		   " LEFT JOIN usuarios t ON t.tipo='Tesorero' and t.rowid= aso.tesorero_id ";

    	ConexionServ.query(consulta, []).then(function(result) {
          $scope.asociaciones = result;
        }, function(tx) {
          console.log("Error no es posbile traer asociaciones", tx);
        });
    
});