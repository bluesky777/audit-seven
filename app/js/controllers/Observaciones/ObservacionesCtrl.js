angular.module('auditoriaApp')

.controller('ObservacionesCtrl' , function($scope, $http, ConexionServ, rutaServidor, $filter, $timeout, tipos_recomendacion, toastr, $location, $anchorScroll, AuthServ, $uibModal){
	
	$scope.$parent.sidebar_active 	= false;
	$scope.reco_crear 							= {};
	$scope.datos 										= {};
	$scope.ver_editando_recom 			= false;
	$scope.act_reco 								= {};
	$scope.datos.tiposRecomendaciones = 'Iglesia';

	
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
	
	$scope.recomendaciones 	= [];
	
	$scope.tipos_recomend 	= tipos_recomendacion.tipos;
	
	
	// Traemos las observaciones correspondientes a este usuario.
	function traerCorrespondientes() {
		
		$user   			= AuthServ.get_user();
		data    			= { auth: $user.auth };
		data.observs_por 	= $scope.datos.observs_por;
		
		$http.put(rutaServidor.root + '/au_observaciones/correspondientes', data).then(function(r){
			res 	= r.data;
		
			$scope.recomendaciones_distritos 	= r.data.distritos;
			
			switch ($scope.datos.observs_por) {
				case 'Iglesias':
					for (let i = 0; i < $scope.recomendaciones_distritos.length; i++) {
					
						for (let j = 0; j < $scope.recomendaciones_distritos[i].iglesias.length; j++) {
							const iglesia = $scope.recomendaciones_distritos[i].iglesias[j];
							
							for (let k = 0; k < iglesia.recom_auditorias.length; k++) {
								const recom_auditoria = iglesia.recom_auditorias[k];
								recom_auditoria.fecha = new Date(recom_auditoria.fecha);
							}
							
							for (let k = 0; k < iglesia.recomendaciones.length; k++) {
								const recom = iglesia.recomendaciones[k];
								recom.fecha = new Date(recom.fecha);
							}
						}
					}
					break;
			
				case 'Distritos':
					for (let i = 0; i < $scope.recomendaciones_distritos.length; i++) {
						const distrito = $scope.recomendaciones_distritos[i];

						for (let k = 0; k < distrito.recomendaciones.length; k++) {
							const recom = distrito.recomendaciones[k];
							recom.fecha = new Date(recom.fecha);
						}
					}
					break;
			
				case 'Asociaciones':
					$scope.recomendaciones_asociaciones 	= r.data.asociaciones;
					for (let i = 0; i < $scope.recomendaciones_asociaciones.length; i++) {
						const asociacion = $scope.recomendaciones_asociaciones[i];

						for (let k = 0; k < asociacion.recomendaciones.length; k++) {
							const recom = asociacion.recomendaciones[k];
							recom.fecha = new Date(recom.fecha);
						}
					}
					break;
			
				default:
					break;
			}
				
				
			
			
			
		
		}, function(){
				toastr.error('No se trajeron tus recomendaciones');
		})
	}
	
	
	$timeout(function() {
		if (localStorage.observs_por) {
			$scope.datos.observs_por = localStorage.observs_por;
		}else{
			$scope.datos.observs_por = 'Iglesias';
			localStorage.observs_por = 'Iglesias';
		}
		traerCorrespondientes()
	}, 10);
	
	
	$scope.seleccObservsPor = function(){
		localStorage.observs_por = $scope.datos.observs_por;
		traerCorrespondientes();
	}
    
	

	$scope.$on('craer_recomendacion_campo', function($event, campo){

		for (let i = 0; i < $scope.tipos_recomend.length; i++) {
			const element = $scope.tipos_recomend[i];
			
			if (element.tipo == campo) {
				$scope.reco_crear.tipo = element;
			}
			
		}
		$scope.ver_crear_recomendacion();
	})
	
	
	
	$scope.mostrarRecomAuditorias = function(iglesia){
		iglesia.mostrar_recom_auditorias = !iglesia.mostrar_recom_auditorias
	}



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
			$scope.verCrearReco 	= false;
			$scope.recomendaciones 	= result;
		},function(tx) {
			console.log("Error no es posbile traer recomendaciones", tx);
		});

	};
	$scope.verDtosrecomendacion();




	$scope.VerActualizarRecomendacion = function(reco){
		$scope.act_reco 						= reco;
		$scope.ver_editando_recom 	= true;
		$timeout(function() {
			$location.hash("editar-recomendacion");
			$anchorScroll();
		}, 100);
	};

	$scope.VerActualizarRespuesta = function(reco){
		reco.editando_justificacion = true;
	};
	

  $scope.cancelarEditarJustificacion = function(reco){
		reco.editando_justificacion = false;
	};

  $scope.guardarJustificacion = function(reco){
		data  = { auth: $user.auth };
		data.recomendacion = reco;
		
		$http.put(rutaServidor.root + '/au_observaciones/guardar-justificacion', data).then(function(r){
			reco.editando_justificacion = false;
			toastr.success('Justificación guardada.');
		}, function(){
			toastr.error('No se guardó la respuesta');
		})
		
	
	};
	
	
	$scope.cerrarActualizarReco = function(){
		$scope.ver_editando_recom = false;
	};




	$scope.actualizarRecomendacion = function(reco){
		
		superada = reco.superada=='si' ? 1 : 0;
		
	 	consulta ="UPDATE recomendaciones SET fecha=?, hallazgo=?, tipo=?, justificacion=?, superada=?, recomendacion=?, modificado=? WHERE rowid=? "
		ConexionServ.query(consulta,[reco.fecha, reco.hallazgo, reco.tipo.tipo, reco.justificacion, superada, reco.recomendacion, '1', reco.rowid]).then(function(result){

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


