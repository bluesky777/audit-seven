angular.module('auditoriaApp')

.directive('recomendacionesDir', function() {
	return {
	  restrict: 'E',
	  //scope: {},
	  controller: 'recomendacionesCtrl',
	  templateUrl: 'templates/recomendacionesDir.html'
	};
})

.controller('recomendacionesCtrl' , function($scope, ConexionServ, $filter, AuthServ, toastr, $location, $anchorScroll, $timeout, $uibModal){
	
	$scope.$parent.sidebar_active 	= false;
	$scope.reco_crear 				= {};

	$scope.reco_crear = {
		superada: 0,
		hallazgo: '',
		tipo: '',
		recomendacion: '',
		justificacion: ''
	};
	
	$scope.recomendaciones 	= [];
	
	$scope.tipos_recomend 	= [
		{tipo: 'Otra'}
	];
	

	 
	
	$scope.vercrearrecomendacion = function(){
		if (!$scope.USER.auditoria_id) {
			toastr.warning('Primero debe seleccionar una auditoria.');
			return;
		}
		$scope.vermostrarreco = true;
	};

	$scope.cancelarVerCrearReco = function(){
		$scope.vermostrarreco = false;
	};



	$scope.verDtosrecomendacion = function(){

		consulta = "SELECT rowid, * from recomendaciones WHERE eliminado !='1'";

		ConexionServ.query(consulta, []).then(function(result) {

			for (var i = result.length - 1; i >= 0; i--) {
				result[i].fecha = new Date(result[i].fecha);
				
				if (result[i].superada == 0) {
					result[i].superada = "no"
				}else{
					result[i].superada = "sí"
				}
			
			}
			$scope.vermostrarreco 	= false;
			$scope.recomendaciones 	= result;
		},function(tx) {
			console.log("Error no es posbile traer recomendaciones", tx);
		});

	};
	$scope.verDtosrecomendacion();



	$scope.insertarrecomendacion = function(reco){
		if (reco.fecha) {
			fecha_fix = window.fixDate(reco.fecha);
		}
		 
	    

	 	consulta ="INSERT INTO recomendaciones(fecha, auditoria_id, hallazgo, justificacion, superada, recomendacion, modificado) VALUES(?,?,?,?,?,?,?)  "
		ConexionServ.query(consulta,[reco.fecha, $scope.USER.auditoria_id, reco.hallazgo, reco.justificacion, reco.superada, reco.recomendacion, '0']).then(function(result){

			toastr.success('Recomendación creada.');
			$scope.verDtosrecomendacion();

		} , function(tx){
			toastr.error('Recomendación no se pudo crear.')
		});
	} 





      $scope.VerActualizarReco = function(reco){
      	if (!$scope.USER.auditoria_id) {
			toastr.warning('Primero debe seleccionar una auditoria.');
			return;
		}
      	$scope.VerCreandoReco = true;

		$scope.act_reco = reco;

		$timeout(function() {
			$location.hash("editar-recomendaciones");
			$anchorScroll();
		}, 100);



		if (reco.fecha ) {
			text = reco.fecha ;
			console.log(text);
			reco.hora_new = new Date(text);
			console.log(reco.hora);
		}
		
		if (reco.fecha) {
			reco.fecha = new Date(reco .fecha);
		}
		
			

      };

    $scope.closeActualizarReco = function(){
      	$scope.VerCreandoReco = false;
    };




	$scope.actureco = function(reco){
		
		superada = reco.superada=='si' ? 1 : 0;
		
	 	consulta ="UPDATE recomendaciones SET fecha=?, hallazgo=?, justificacion=?, superada=?, recomendacion=?, modificado=? WHERE rowid=? "
		ConexionServ.query(consulta,[reco.fecha, reco.hallazgo, reco.justificacion, superada, reco.recomendacion, '1', reco.rowid]).then(function(result){

		   toastr.success('Recomendación actualizada.');
		   $scope.verDtosrecomendacion();
		   $scope.VerCreandoReco = false;

		} , function(tx){
			toastr.error('Recomendación no se pudo actualizar' , tx)
		});
	} 




	 $scope.eliminarreco = function(recomendacion){
	  	
	 	var res = confirm("¿Seguro que desea eliminar ? ");

		if (res == true) {
			consulta = 'UPDATE recomendaciones SET eliminado=? WHERE rowid=? '
			ConexionServ.query(consulta, ['1', recomendacion.rowid]).then( function(result) {
				toastr.success("Recomendación eliminada.");
				$scope.verDtosrecomendacion();
			},function(tx) {
				toastr.info("La recomendacion que intenta eliminar no se pudo actualizar.");
			});
		}

	 } 








});


