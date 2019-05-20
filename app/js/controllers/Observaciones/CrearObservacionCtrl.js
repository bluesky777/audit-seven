angular.module('auditoriaApp')


.directive('crearObservacionDir', function() {
	return {
	  restrict: 'E',
	  //scope: {},
	  controller: 'CrearObservacionCtrl',
	  templateUrl: 'templates/Observaciones/crearObservacion.html'
	};
})


.controller('CrearObservacionCtrl' , function($scope, $http, ConexionServ, rutaServidor, tipos_recomendacion, EntidadesFacto, toastr, AuthServ){
	
	$scope.reco_crear 				= {};
	$scope.datos 					= {};

	
	$scope.hasDivisionRole 	= AuthServ.hasDivisionRole;
	$scope.hasUnionRole 		= AuthServ.hasUnionRole;

	$scope.reco_crear = {
		superada: 0,
		hallazgo: '',
		tipo: '',
		recomendacion: '',
		justificacion: '',
		fecha: new Date()
	};
	
	$scope.tipos_recomend 	= tipos_recomendacion.tipos;
    
	datos_usu = {username: $scope.USER.username, password: 
		$scope.USER.password, 
		tipo_usu: $scope.USER.tipo, 
		id_usu: $scope.USER.id 
	};
    

	
	// Cuando se selecciona una UNIÓN
	$scope.traerAsociaciones = function(union_id){
		EntidadesFacto.asociaciones(union_id).then(function(r){
			$scope.datos.asociaciones = r;
		})
	}
	
	
	// Cuando se selecciona una ASOCIACIÓN
	$scope.traerIglesias = function(asociacion_id){
		EntidadesFacto.iglesias(asociacion_id, $scope.USER.tipo).then(function(r){
			$scope.datos.distritos = r;
		})
	}
	

	
	$scope.ver_crear_recomendacion = function(){
		$scope.verCrearReco = true;
	};

	$scope.cancelarVerReco = function(){
		$scope.verCrearReco = false;
	};







	$scope.insertarRecomendacion = function(reco){
		if (reco.fecha) {
			fecha_fix = window.fixDate(reco.fecha);
		}
		
		if (!reco.tipo) {
			
			for (let i = 0; i < $scope.tipos_recomend.length; i++) {
				const element = $scope.tipos_recomend[i];
				if (element.tipo == 'Otra') {
					reco.tipo = element;
				}
			}
		}
		
		
		reco.para 		= $scope.datos.radioPara;
		
		if (reco.para == 'Unión') {
			if (!$scope.datos.union.id) {
				toastr.warning('Debe seleccionar la unión');
				return;
			}
			reco.para_id 	= $scope.datos.union.id;
			
		}else if (reco.para == 'Asociación') {
			if (!$scope.datos.asociacion.id) {
				toastr.warning('Debe seleccionar la asociación');
				return;
			}
			reco.para_id 	= $scope.datos.asociacion.id;
			
		}else if (reco.para == 'Distrito') {
			if (!$scope.datos.distrito.id) {
				toastr.warning('Debe seleccionar distrito');
				return;
			}
			reco.para_id 	= $scope.datos.asociacion.id;
			
		}else if (reco.para == 'Iglesia') {
			if (!$scope.datos.iglesia.id) {
				toastr.warning('Debe seleccionar iglesia');
				return;
			}
			reco.para_id 	= $scope.datos.iglesia.id;
			
		}else{
			toastr.warning('Debe seleccionar para quien');
			return;
		}
		
		
		EntidadesFacto.insertarRecomendacion(reco).then(function(r){
			toastr.success('Creada con éxito.');
			$scope.reco_crear = {
				superada: 0,
				hallazgo: '',
				tipo: '',
				recomendacion: '',
				justificacion: '',
				fecha: new Date()
			};
		})
		
	} 





});


