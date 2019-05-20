angular.module('auditoriaApp')


.directive('observacionesPorTodoPastorDir', function() {
	return {
	  restrict: 'E',
	  //scope: {},
	  controller: 'ObservPorTodoPastorCtrl',
	  templateUrl: 'templates/Observaciones/observPorTodoPastor.html'
	};
})


.controller('ObservPorTodoPastorCtrl' , function($scope, $http, ConexionServ, rutaServidor, tipos_recomendacion, EntidadesFacto, toastr, AuthServ){
	

});


