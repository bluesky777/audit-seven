angular.module("auditoriaApp")


.directive('revisionAuditoriasDir', function () {
    return {
		restrict: 'E',
        templateUrl: "templates/Auditorias/revisionAuditoriasDir.html",
        controller: 'RevisionAuditoriasCtrl'
	}
})


.controller("RevisionAuditoriasCtrl", function($scope, $http, toastr, rutaServidor, AuthServ, $uibModal, ConexionServ) {
    $user           = AuthServ.get_user();
    data            = { auth: $user.auth };
    $scope.datos    = {};

    $scope.traerRevision = function(){
        
        if ($scope.datos.anioSeleccionado) {
            data.anio = $scope.datos.anioSeleccionado;
        }

        $http.put(rutaServidor.root + '/auditorias/revision', data).then(function(r){

            $scope.asociacion 	    = r.data.asociacion;
            $scope.distritos 	    = r.data.distritos;
            $scope.cant_iglesias 	= r.data.cant_iglesias;
            $scope.cant_auditadas 	= r.data.cant_auditadas;
            $scope.anio 	        = r.data.anio;

            if (!$scope.anios) {
                $scope.anios 	= r.data.anios;
                $scope.datos.anioSeleccionado = $scope.anio;
            }
        
        }, function(r2){
            toastr.error('No se pudo traer recision de auditorías');
        })
    }

    $scope.traerRevision();



	$scope.abrirAuditoria = function(auditoria){
		modalInstance = $uibModal.open({
            templateUrl: 'templates/abrirAuditoriaModal.html',
            resolve: {
                elemento: function () {
                    return auditoria;
                }
            },
            controller: 'AbrirAuditoriaModalCtrl' 
        });

        modalInstance.result.then(function (result) {
			toastr.success('Cambiada');
			

			consulta 	= 'SELECT m.*, m.rowid, s.*, s.rowid as lib_semanal_id FROM lib_mensuales m ' + 
						'INNER JOIN lib_semanales s ON m.rowid=s.libro_mes_id and m.eliminado is null and m.auditoria_id =? '
						'ORDER BY s.periodo';
			ConexionServ.query(consulta, [auditoria.rowid]).then(function(result) {
				$scope.lib_meses 	= result;
				saldo_final 		= 0;
				
				for (let i = 0; i < $scope.lib_meses.length; i++) {
					lib_mes = $scope.lib_meses[i];
					
					if (i == 0) {
						lib_mes.saldo_mes 			= auditoria.saldo_ant;
						lib_mes.saldo_mes_final 	= (auditoria.saldo_ant + lib_mes.especiales + (lib_mes.ofrendas * 0.6)) - lib_mes.gastos;
					}else{
						lib_mes.saldo_mes 			= $scope.lib_meses[i-1].saldo_mes_final;
						lib_mes.saldo_mes_final 	= (lib_mes.saldo_mes + lib_mes.especiales + (lib_mes.ofrendas * 0.6)) - lib_mes.gastos;
					}
					saldo_final 		= lib_mes.saldo_mes_final;
				}
				
				consulta 	= 'UPDATE auditorias SET saldo_final=? WHERE rowid=?';
				ConexionServ.query(consulta, [saldo_final, auditoria.rowid]).then(function(result) {
					console.log(result);
					$scope.verMostrarAuditoriasTabla();
				})
			})
			

            
        });
	}

	
});
