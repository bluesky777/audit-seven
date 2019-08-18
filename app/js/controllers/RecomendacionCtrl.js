angular.module('auditoriaApp')

.directive('recomendacionesDir', function() {
	return {
	  restrict: 'E',
	  //scope: {},
	  controller: 'recomendacionesCtrl',
	  templateUrl: 'templates/recomendacionesDir.html'
	};
})

.controller('recomendacionesCtrl' , function($scope, ConexionServ, $filter, tipos_recomendacion, toastr, $location, $anchorScroll, $timeout, $uibModal){
	
	$scope.$parent.sidebar_active 	= false;
	$scope.reco_crear 				= {};

	$scope.reco_crear = {
		superada: 0,
		hallazgo: '',
		tipo: '',
		recomendacion: '',
		justificacion: '',
		fecha: new Date()
	};
	
	$scope.recomendaciones 	= [];
	
	$scope.tipos_recomend 	= tipos_recomendacion.tipos;
	

	$scope.$on('craer_recomendacion_campo', function($event, campo){

		for (let i = 0; i < $scope.tipos_recomend.length; i++) {
			const element = $scope.tipos_recomend[i];
			
			if (element.tipo == campo) {
				$scope.reco_crear.tipo = element;
			}
			
		}
		$scope.ver_crear_recomendacion();
	})
	
	
	$scope.ver_crear_recomendacion = function(){
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

		consulta = "SELECT r.rowid, r.* FROM recomendaciones r " +
			"INNER JOIN auditorias a ON a.iglesia_id=? and r.auditoria_id=a.rowid and a.eliminado is null " + 
			"WHERE r.eliminado is null";

		ConexionServ.query(consulta, [$scope.USER.iglesia_id]).then(function(result) {

			for (var i = result.length - 1; i >= 0; i--) {
				result[i].fecha = new Date(result[i].fecha);
				
				if (result[i].superada == 0) {
					result[i].superada = "no"
				}else{
					result[i].superada = "si"
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
		console.log(reco.fecha);
		
		if (!reco.tipo) {
			
			for (let i = 0; i < $scope.tipos_recomend.length; i++) {
				const element = $scope.tipos_recomend[i];
				if (element.tipo == 'Otra') {
					reco.tipo = element;
				}
			}
		}
	    

	 	consulta ="INSERT INTO recomendaciones(fecha, auditoria_id, hallazgo, tipo, justificacion, superada, recomendacion, modificado) VALUES(?,?,?,?,?,?,?,?)  "
		ConexionServ.query(consulta,[reco.fecha, $scope.USER.auditoria_id, reco.hallazgo, reco.tipo.tipo, reco.justificacion, reco.superada, reco.recomendacion, '0']).then(function(result){

			$scope.reco_crear = {
				superada: 0,
				hallazgo: '',
				tipo: '',
				recomendacion: '',
				justificacion: '',
				fecha: new Date()
			};
			
			toastr.success('Recomendación creada.');
			$scope.verDtosrecomendacion();
			$scope.$emit('contar_recomendaciones');
			$scope.contarRecomendaciones();

		} , function(tx){
			toastr.error('Recomendación no se pudo crear.')
		});
	} 





      $scope.VerActualizarReco = function(reco){
      	if (!$scope.USER.auditoria_id) {
			toastr.warning('Primero debe seleccionar una auditoria.');
			return;
		}
		
		for (let i = 0; i < $scope.tipos_recomend.length; i++) {
			const element = $scope.tipos_recomend[i];
			if (reco.tipo == element.tipo) {
				reco.tipo = element;
			}
		}
		
      	$scope.VerCreandoReco = true;

		$scope.act_reco = reco;


		$timeout(function() {
			$location.hash("editar-recomendaciones");
			$anchorScroll();
		}, 100);

		/*
		if (reco.fecha ) {
			text = reco.fecha;
			reco.hora_new = new Date(text);
		}*/
		
		if (reco.fecha) {
			reco.fecha = new Date(reco .fecha);
		}
		
			

      };

    $scope.closeActualizarReco = function(){
      	$scope.VerCreandoReco = false;
    };




	$scope.actualizarRecomendacion = function(reco){

		superada 		= reco.superada=='si' ? 1 : 0;
		
		tipo_reco 	= reco.tipo;
		
		if (reco.tipo) {
			if (reco.tipo.tipo) {
				tipo_reco 	= reco.tipo.tipo;
			}
		}
		
		
	 	consulta ="UPDATE recomendaciones SET fecha=?, hallazgo=?, tipo=?, justificacion=?, superada=?, recomendacion=?, modificado=? WHERE rowid=? "
		ConexionServ.query(consulta,[reco.fecha, reco.hallazgo, tipo_reco, reco.justificacion, superada, reco.recomendacion, '1', reco.rowid]).then(function(result){

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


