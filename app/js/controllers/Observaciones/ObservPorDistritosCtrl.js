angular.module('auditoriaApp')


.directive('observacionesPorDistritosDir', function() {
	return {
	  restrict: 'E',
	  //scope: {},
	  controller: 'ObservPorDistritosCtrl',
	  templateUrl: 'templates/Observaciones/observPorDistritos.html'
	};
})


.controller('ObservPorDistritosCtrl' , function($scope, $http, ConexionServ, rutaServidor, tipos_recomendacion, EntidadesFacto, toastr, AuthServ){
	

});


