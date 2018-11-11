angular.module('auditoriaApp')



.controller('informesUnionesCtrl', function($scope, ConexionServ){

    consulta = "SELECT rowid, nombre, alias, codigo, division_id from uniones";
	ConexionServ.query(consulta, []).then(function(result) {
        $scope.uniones = result;
    }, function(tx) {
        console.log("Error no es posible traer Uniones", tx);
    });
    
    
});



