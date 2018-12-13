angular.module('auditoriaApp')

.controller('CompararIglesiasYearsCtrl', function($scope, ConexionServ, toastr, Tiempos, $timeout){
    
    $scope.dato         = {
        cod_cuenta: '611110',
        ordenar_col: 'nombre'
    };
    $scope.meses_sel    = Tiempos.meses;
    $scope.year_sel     = Tiempos.years;
    
    year            = new Date().getUTCFullYear();
    $scope.years    = [year-1, year];
    
    // Cuando seleccione algún Año
    $scope.selectIniYear = function(year, evitar_carga){
        for (let i = 0; i < $scope.year_sel.length; i++) {
            $scope.year_sel[i].ini_seleccionado = false;
        }
        year.ini_seleccionado       = true;
        $scope.dato.year_inicial    = year.year;
        
        if (!evitar_carga) {
            $timeout(function(){
                $scope.compararIglesias();
            })
        }
        
    }
    
    $scope.selectFinYear = function(year, evitar_carga){
        for (let i = 0; i < $scope.year_sel.length; i++) {
            $scope.year_sel[i].fin_seleccionado = false;
        }
        year.fin_seleccionado       = true;
        $scope.dato.year_final      = year.year;
        
        if (!evitar_carga) {
            $timeout(function(){
                $scope.compararIglesias();
            })
        }
    }
    
    // Seleccinamos los años por defecto, el pasado y el actual
    for (let i = 0; i < $scope.year_sel.length; i++) {
        if ($scope.year_sel[i].year == year-1) {
            $scope.selectIniYear($scope.year_sel[i], true);
        }
        if ($scope.year_sel[i].year == year) {
            $scope.selectFinYear($scope.year_sel[i], true);
        }
        
    }
    
    // Filtramos los selectores finales para que solo salgan desde el valor inicial
    $scope.greaterEqualThan = function(prop, val){
        return function(item){
          return item[prop] >= val;
        }
    }
    
    
    // Cuando seleccione algún mes
    $scope.selectIniMes = function(mes, evitar_carga){
        for (let i = 0; i < $scope.meses_sel.length; i++) {
            $scope.meses_sel[i].ini_seleccionado = false;
        }
        mes.ini_seleccionado        = true;
        $scope.dato.mes_inicial     = mes;
        
        if (!evitar_carga) {
            $timeout(function(){
                $scope.compararIglesias();
            })
        }
    }
    $scope.selectFinMes = function(mes, evitar_carga){
        for (let i = 0; i < $scope.meses_sel.length; i++) {
            $scope.meses_sel[i].fin_seleccionado = false;
        }
        mes.fin_seleccionado        = true;
        $scope.dato.mes_final     = mes;
        
        if (!evitar_carga) {
            $timeout(function(){
                $scope.compararIglesias();
            })
        }
       
    }
    
    // Cuando seleccione el tipo de cuenta - Diezmo, Desarrollo
    $scope.cambiaCodCuenta = function(cod_cuenta){
        if (!evitar_carga) {
            $timeout(function(){
                $scope.compararIglesias();
            });
        }
    }
    
    // Selecciono los meses por defecto - Enero y el actual
    mes_hoy = new Date().getMonth();
    
    for (let i = 0; i < $scope.meses_sel.length; i++) {
        if ($scope.meses_sel[i].num == 0) {
            $scope.selectIniMes($scope.meses_sel[i], true);
        }
        if ($scope.meses_sel[i].num == mes_hoy) {
            $scope.selectFinMes($scope.meses_sel[i], true);
        }
        
    }
    
    $scope.distritoSeleccionado = function(distrito_id){
        
        // Traemos las iglesias del distrito seleccionado
        consulta = "SELECT i.rowid, i.* FROM iglesias i " +
            "WHERE i.distrito_id=? and i.eliminado is null";       

        ConexionServ.query(consulta, [distrito_id]).then(function(result) {
            $scope.iglesias_registros = result;
            $scope.compararIglesias();
        }, function(tx) {
            toastr.warning("Parece que no tienes iglesia seleccionada", tx);
        });
    }
    
    
    
    // Traemos los distritos de la asociación actual
    consulta = "SELECT d.rowid, d.* FROM distritos d " +
        "WHERE d.asociacion_id=? and d.eliminado is null";       

    ConexionServ.query(consulta, [$scope.USER.asociacion_id]).then(function(result) {
        $scope.distritos_registros = result;
        $scope.dato.distrito = $scope.distritos_registros[0];
        $scope.distritoSeleccionado($scope.distritos_registros[0].rowid);
    }, function(tx) {
        toastr.warning("Parece que no tienes iglesia seleccionada", tx);
    });
    
    
    // Traemos la asociación actual
    consulta = "SELECT a.rowid, a.* FROM asociaciones a " +
        "INNER JOIN distritos d ON a.rowid = d.asociacion_id and d.eliminado is null " + 
        "WHERE d.rowid=?";       

    ConexionServ.query(consulta, [$scope.USER.distrito_id]).then(function(result) {
        $scope.asociacion = result[0];
    }, function(tx) {
        toastr.warning("Parece que no tienes iglesia seleccionada", tx);
    });
    
    
    
    
    
    $scope.compararIglesias = function(){
        
        $scope.consulta_suma = "SELECT r.*, r.rowid, abs(sum(r.cantidad)) suma, i.nombre FROM remesas r " +
            "INNER JOIN iglesias i ON i.codigo=r.org_id and i.eliminado is null and i.distrito_id=? " + 
            "WHERE r.cod_cuenta=? AND r.asociacion_id=? AND CAST( replace(r.periodo, '/', '') as integer)>=? AND CAST( replace(r.periodo, '/', '') as integer)<=? " +
            "group by r.org_id";
            
        promesas = [];
        
        function ejecutarConsulta(i){
            per_ini = ''+$scope.years_verdaderos[i].year+$scope.dato.mes_inicial.per;
            per_fin = ''+$scope.years_verdaderos[i].year+$scope.dato.mes_final.per;

            prom = ConexionServ.query($scope.consulta_suma, [$scope.dato.distrito.rowid, $scope.dato.cod_cuenta, $scope.USER.asociacion_id, per_ini, per_fin]).then(function(result) {
                $scope.years_verdaderos[i].registros    = result;
                $scope.years_verdaderos[i].total        = 0;
                
                for (let j = 0; j < $scope.years_verdaderos[i].registros.length; j++) {
                    $scope.years_verdaderos[i].total += $scope.years_verdaderos[i].registros[j].suma;
                }
                
            }, function(tx) {
                toastr.warning("Parece que no tienes iglesia seleccionada", tx);
            });
            promesas.push(prom);
        }

        num_years = $scope.dato.year_final - $scope.dato.year_inicial;
        
        $scope.years_verdaderos = [];
        
        for (let i = 0; i < num_years+1; i++) {
            $scope.years_verdaderos[i] = {year: $scope.dato.year_inicial + i};
        }
        
        for (let i = 0; i < $scope.years_verdaderos.length; i++) {
            ejecutarConsulta(i);
        }
        
        Promise.all(promesas).then(function(){
            $timeout(function(){
                $scope.getVariacionIglesia();
            })
            
        })

    }
    
    
    
    $scope.getVariacionIglesia = function(){
        if ($scope.years_verdaderos.length!=2) {
            return 0;
        }
        
        
        for (let k = 0; k < $scope.iglesias_registros.length; k++) {
            const iglesia = $scope.iglesias_registros[k];
            iglesia.variacion      = 0;
            iglesia.porcentaje     = 0;

            for (let j = 0; j < $scope.years_verdaderos.length; j++) {
                const anio = $scope.years_verdaderos[j];
                
                for (let i = 0; i < anio.registros.length; i++) {
                    const registro = anio.registros[i];
                    
                    if (registro.org_id == iglesia.codigo) {
                        iglesia.variacion   = iglesia.variacion - registro.suma;
                        iglesia.porcentaje  = iglesia.variacion / registro.suma * 100;
                    }
                }
            }
        }
        
        variacion_total = 0;
        for (let j = 0; j < $scope.years_verdaderos.length; j++) {
            variacion_total = variacion_total - $scope.years_verdaderos[j].total;
            
            if (j == 1) {
                /*
                for (let i = 0; i < $scope.years_verdaderos[1].registros.length; i++) {
                    regist = $scope.years_verdaderos[1].registros[i];
                    regist.porcentaje = regist.variacion / regist.suma * 100
                }
                */
            }
            
        }
        $scope.variacion_total = variacion_total;
        
        return resp;
        
    }
    
});