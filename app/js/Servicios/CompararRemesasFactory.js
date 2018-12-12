angular.module('auditoriaApp')

.factory('CompararRemesasFactory', function($q, $http, ConexionServ) {

                
    result = {
        
        traer: function(distrito_id, codigo_cuenta, years){ 
            var defered     = $q.defer();
            var resp        = {};
            
            resp.years      = years;
            
    
            consulta_igle = "SELECT i.rowid, i.*, dis.codigo as cod_distrito " +
                "FROM iglesias i " +
                "INNER JOIN distritos dis ON i.distrito_id = dis.rowid " + 
                "WHERE i.distrito_id=?";       

            ConexionServ.query(consulta_igle, [distrito_id]).then(function(result) {
                resp.iglesias = result;
                
                var promesas = [];
                
                function traerRemesas(iglesia, indice){
                    iglesia.anios = [];
                    
                    // Año anterior:
                    consulta = "SELECT r.rowid, r.* FROM remesas r " +
                        "WHERE r.org_id=? and cod_cuenta=? and r.periodo like '"+resp.years[0]+"%' order by periodo";       

                    prom = ConexionServ.query(consulta, [iglesia.codigo, codigo_cuenta]).then(function(remesasRes) {
                        
                        res = {};
                        total = 0;
                        for (let j = 0; j < remesasRes.length; j++) {
                            const remesa = remesasRes[j];
                            total = total + remesa.cantidad;
                            
                            if (remesa.periodo == resp.years[0]+'/001') {
                                res[resp.years[0]+'/001'] = remesa;
                            }
                            if (remesa.periodo == resp.years[0]+'/002') {
                                res[resp.years[0]+'/002'] = remesa;
                            }
                            if (remesa.periodo == resp.years[0]+'/003') {
                                res[resp.years[0]+'/003'] = remesa;
                            }
                            if (remesa.periodo == resp.years[0]+'/004') {
                                res[resp.years[0]+'/004'] = remesa;
                            }
                            if (remesa.periodo == resp.years[0]+'/005') {
                                res[resp.years[0]+'/005'] = remesa;
                            }
                            if (remesa.periodo == resp.years[0]+'/006') {
                                res[resp.years[0]+'/006'] = remesa;
                            }
                            if (remesa.periodo == resp.years[0]+'/007') {
                                res[resp.years[0]+'/007'] = remesa;
                            }
                            if (remesa.periodo == resp.years[0]+'/008') {
                                res[resp.years[0]+'/008'] = remesa;
                            }
                            if (remesa.periodo == resp.years[0]+'/009') {
                                res[resp.years[0]+'/009'] = remesa;
                            }
                            if (remesa.periodo == resp.years[0]+'/010') {
                                res[resp.years[0]+'/010'] = remesa;
                            }
                            if (remesa.periodo == resp.years[0]+'/011') {
                                res[resp.years[0]+'/011'] = remesa;
                            }
                            if (remesa.periodo == resp.years[0]+'/012') {
                                res[resp.years[0]+'/012'] = remesa;
                            }
                            
                        }
                        anio = {
                            anio: resp.years[0],
                            remesas: res,
                            total: total
                        }
                        iglesia.anios[0] = anio;
                    }, function(tx) {
                        console.log("Error trayendo año", tx);
                    });
                    
                    promesas.push(prom);
                    
                    
                    // Año actual:
                    consulta = "SELECT r.rowid, r.*, abs(r.cantidad) as cantidad FROM remesas r " +
                        "WHERE r.org_id=? and cod_cuenta=? and r.periodo like '"+resp.years[1]+"%' order by periodo";       

                    prom = ConexionServ.query(consulta, [iglesia.codigo, codigo_cuenta]).then(function(remesasRes) {

                        res = {};
                        total = 0;
                        for (let j = 0; j < remesasRes.length; j++) {
                            const remesa = remesasRes[j];
                            total = total + remesa.cantidad;
                            
                            if (remesa.periodo == resp.years[1]+'/001') {
                                res[resp.years[1]+'/001'] = remesa;
                            }
                            if (remesa.periodo == resp.years[1]+'/002') {
                                res[resp.years[1]+'/002'] = remesa;
                            }
                            if (remesa.periodo == resp.years[1]+'/003') {
                                res[resp.years[1]+'/003'] = remesa;
                            }
                            if (remesa.periodo == resp.years[1]+'/004') {
                                res[resp.years[1]+'/004'] = remesa;
                            }
                            if (remesa.periodo == resp.years[1]+'/005') {
                                res[resp.years[1]+'/005'] = remesa;
                            }
                            if (remesa.periodo == resp.years[1]+'/006') {
                                res[resp.years[1]+'/006'] = remesa;
                            }
                            if (remesa.periodo == resp.years[1]+'/007') {
                                res[resp.years[1]+'/007'] = remesa;
                            }
                            if (remesa.periodo == resp.years[1]+'/008') {
                                res[resp.years[1]+'/008'] = remesa;
                            }
                            if (remesa.periodo == resp.years[1]+'/009') {
                                res[resp.years[1]+'/009'] = remesa;
                            }
                            if (remesa.periodo == resp.years[1]+'/010') {
                                res[resp.years[1]+'/010'] = remesa;
                            }
                            if (remesa.periodo == resp.years[1]+'/011') {
                                res[resp.years[1]+'/011'] = remesa;
                            }
                            if (remesa.periodo == resp.years[1]+'/012') {
                                res[resp.years[1]+'/012'] = remesa;
                            }
                            
                        }
                        anio = {
                            anio: resp.years[1],
                            remesas: res,
                            total: total
                        }
                        iglesia.anios[1] = anio;
                    }, function(tx) {
                        console.log("Error trayendo año", tx);
                    });
                    
                    promesas.push(prom);
                    
                }
                
                for (let i = 0; i < resp.iglesias.length; i++) {
                    const iglesia = resp.iglesias[i];
                    traerRemesas(iglesia, i);
                }
                
                Promise.all(promesas).then(function(){
                    defered.resolve(resp);
                })
                
            
            }, function(tx) {
                console.log("Error no es posbile traer Iglesias", tx);
            });
            
            return defered.promise;
          },
    }
    
    
    return result;

});