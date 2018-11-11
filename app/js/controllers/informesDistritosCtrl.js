angular.module('auditoriaApp')

.controller('informesDistritosCtrl', function($scope, ConexionServ){

    	consulta = "SELECT d.rowid, d.*, "+
					"p.nombres as pastor_nombres, p.apellidos as pastor_apellidos, t.nombres as tesorero_nombres, t.apellidos as tesorero_apellidos " +
				"from distritos d " + 
	  			"LEFT JOIN usuarios p ON p.tipo='Pastor' and p.rowid=d.pastor_id "  +
	  			"LEFT JOIN usuarios t ON t.tipo='Tesorero' and t.rowid=d.tesorero_id ";


     

       
    	ConexionServ.query(consulta, []).then(function(result) {
          $scope.distritos = result;

        }, function(tx) {
          console.log("Error no es posbile traer Distritos", tx);
        });
    
});