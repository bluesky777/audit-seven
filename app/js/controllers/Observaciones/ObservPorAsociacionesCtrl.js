angular.module('auditoriaApp')


.directive('observacionesPorAsociacionesDir', function() {
	return {
	  restrict: 'E',
	  //scope: {},
	  controller: 'ObservPorAsociacionesCtrl',
	  templateUrl: 'templates/Observaciones/observPorAsociaciones.html'
	};
})


.controller('ObservPorAsociacionesCtrl' , function($scope, $http, ConexionServ, rutaServidor, tipos_recomendacion, EntidadesFacto, toastr, AuthServ){
	

});


