angular.module('auditoriaApp')


.directive('observacionesPorIglesiasDir', function() {
	return {
	  restrict: 'E',
	  //scope: {},
	  controller: 'ObservPorIglesiasCtrl',
	  templateUrl: 'templates/Observaciones/observPorIglesias.html'
	};
})


.controller('ObservPorIglesiasCtrl' , function($scope, $http, ConexionServ, rutaServidor, tipos_recomendacion, EntidadesFacto, toastr, AuthServ){
	

});


