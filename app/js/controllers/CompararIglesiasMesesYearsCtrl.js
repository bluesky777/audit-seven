angular.module('auditoriaApp')

.controller('CompararIglesiasMesesYearsCtrl', function($scope, ConexionServ, CompararRemesasFactory){
    
    $scope.dato = {};
    
    consulta = "SELECT a.rowid, a.* FROM asociaciones a " +
        "INNER JOIN distritos d ON a.rowid = d.asociacion_id and d.eliminado is null " + 
        "WHERE d.rowid=?";       

    ConexionServ.query(consulta, [$scope.USER.distrito_id]).then(function(result) {
        $scope.asociacion = result[0];
    }, function(tx) {
        toastr.warning("Parece que no tienes iglesia seleccionada", tx);
    });
    
    consulta = "SELECT d.rowid, d.* FROM distritos d " +
        "WHERE d.asociacion_id=? and d.eliminado is null";       

    ConexionServ.query(consulta, [$scope.USER.asociacion_id]).then(function(result) {
        $scope.distritos_asoc = result;
        
        for (let i = 0; i < $scope.distritos_asoc.length; i++) {
            const element = $scope.distritos_asoc[i];
            if (element.rowid == $scope.USER.distrito_id) {
                $scope.dato.distrito = element;
            }
        }
    }, function(tx) {
        toastr.warning("Parece que no tienes iglesia seleccionada", tx);
    });
    
    
    year            = new Date().getUTCFullYear();
    $scope.years    = [year-1, year];
    
    
    $scope.compararDistrito = function(distrito_id){
        CompararRemesasFactory.traer(distrito_id, '611110', $scope.years).then(function(resp){
            $scope.iglesias     = resp.iglesias;
        })
        
        CompararRemesasFactory.traer(distrito_id, '634110', $scope.years).then(function(resp){
            $scope.iglesias_desarrollo     = resp.iglesias;
        })
    }
    
    $scope.compararDistrito($scope.USER.distrito_id);
    
    
    
});