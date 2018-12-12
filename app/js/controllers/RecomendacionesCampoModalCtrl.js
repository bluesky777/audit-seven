angular.module("auditoriaApp")


.controller("RecomendacionesCampoModalCtrl", function($uibModalInstance, $scope, auditoria, campo, ConexionServ, toastr, $filter) {
    
    $scope.auditoria                = auditoria;
    $scope.campo                    = campo;
    
    $scope.recomendaciones_actuales = $scope.auditoria['reco_cont_'+campo];
    
    
    $scope.getConcordancias = function(val, campo) {
        consulta 	= 'SELECT DISTINCT r.'+campo+' FROM recomendaciones r WHERE r.'+campo+' like "%' + val + '%"';
        return ConexionServ.query(consulta).then(function(response){
            return response.map(function(item){
                return item.descripcion;
            });
        });
    };
      

   	$scope.eliminar = function(recomend){
	  	
	  	var res = confirm("¿Seguro que desea eliminar recomendación?");

		if (res == true) {
            fecha_update    = window.fixDate(new Date(), true);
		 	consulta        = "UPDATE recomendaciones SET eleminado=? WHERE rowid=? ";

			ConexionServ.query(consulta,[fecha_update, recomend.rowid]).then(function(result){

				console.log('Recomendación mes eliminido', result);
				$scope.auditoria.recomendaciones = $filter('filter') ($scope.auditoria.recomendaciones, {rowid: '!' + recomend.rowid})
                toastr.success('Recomendación eliminado.');
                
			} , function(tx){
				console.log('Recomendación no se pudo Eliminar' , tx)
			});
		}
	}
	 

    $scope.crearRecomendacion = function(){
        $uibModalInstance.close({crear_recomend: true, campo: $scope.campo});
    }
    
    
	$scope.cambiaValor = function(elemento, columna) {
        console.log(elemento, columna);
		consulta 	= 'UPDATE recomendaciones SET ' + columna + '=? WHERE rowid=?';
        colum 		= columna.charAt(0).toUpperCase() + columna.slice(1);
        
		
		ConexionServ.query(consulta, [elemento[columna], elemento.rowid]).then(function(){
			toastr.success(colum + ' guardado');
		}, function(){
			toastr.error(colum + ' NO guardado');
		});

	}

    


	
    $scope.ok = function () {
        $uibModalInstance.close($scope.auditoria);
    };
	
});
