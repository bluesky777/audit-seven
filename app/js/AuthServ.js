angular.module('auditoriaApp')

.factory('AuthServ', function($q, $http, $timeout, ConexionServ, $state, toastr, rutaServidor) {

    var consulta_user = 'SELECT u.rowid, u.id, u.nombres, u.apellidos, u.tipo, u.username, u.password, u.sexo, u.distrito_id, u.iglesia_id, u.celular,  '+
                'u.union_id, u.asociacion_id, u.idioma, u.tema, u.auditoria_id, ' + 
                'a.fecha as fecha_audit, a.hora as hora_audit, a.saldo_ant, a.ingre_por_registrar, a.iglesia_id as iglesia_audit_id ' +
                //'t.nombres as tesorero_nombres, t.apellidos as tesorero_apellidos, ' +
                //'p.nombres as pastor_nombres, p.apellidos as pastor_apellidos ' +
            'FROM usuarios u '+
            'LEFT JOIN auditorias a ON a.rowid=u.auditoria_id '+
            //"LEFT JOIN usuarios t ON t.tipo='Tesorero' and t.rowid=i.tesorero_id " +
			//"LEFT JOIN usuarios p ON p.tipo='Pastor' and p.rowid=d.pastor_id " +
            'WHERE  ';


    function loguear_online(datos){
        toastr.info('Entrando online...');
        return $http.post(rutaServidor.root + '/au_login/loguear', datos);
    }
            

                
    result = {
          
        verificar_user_logueado: function(){
            var defered = $q.defer();
            
            if (localStorage.logueado){
                if (localStorage.logueado == 'true'){
                    
                    usu = localStorage.USER;
                    usu = JSON.parse(usu);
                    defered.resolve(usu);
                    
                }else{
                    $state.go('login');
                    defered.reject('No logueado');
                }
            }else{
                $state.go('login');
                defered.reject('No logueado')
            }
            
  
            return defered.promise;
        
        },
          
        hasDivisionRole: function(tipo, incluir_admin){
            
            if (tipo == 'Admin' 
                || tipo=='Tesorero de unión' 
                || tipo=='Coordinador de unión' 
                || tipo=='Tesorero de división' 
                || tipo=='Coordinador de división'){
                    
                return true;
            }else{
                if (incluir_admin) {
                    if (tipo == 'Admin'){
                        return true;
                    }else{
                        return false;
                    }
                }
            }
        
        },
          
        hasUnionRole: function(tipo, incluir_admin){
            
            if (tipo=='Tesorero de unión' 
                || tipo=='Coordinador de unión'){
                    
                return true;
            }else{
                if (incluir_admin) {
                    if (tipo == 'Admin'){
                        return true;
                    }else{
                        return false;
                    }
                }
            }
        
        },
          
        hasAsociacionRole: function(tipo){
            
            if (tipo=='Auditor' 
                || tipo=='Tesorero asociación'
                || tipo=='Cajero de asociación'){
                    
                return true;
            }else{
                return false;
            }
        
        },
          
        loguear: function(datos){
            var defered = $q.defer();
            
            
            ConexionServ.query('SELECT * FROM usuarios', []).then(function(result){
                
                if (result.length > 0) {
                    //'d.nombre as distrito_nombre, d.alias as distrito_alias, i.nombre as iglesia_nombre, i.alias as iglesia_alias, '+
                    // LOGUEAMOS EN LA DB LOCAL OFFLINE
                    ConexionServ.query(consulta_user+' u.username=? and u.password=? ', [datos.username, datos.password]).then(function(result){
                        
                        if (result.length > 0) {
                            localStorage.logueado   = true
                            localStorage.USER       = JSON.stringify(result[0]);
                            defered.resolve(result[0]);
                        }else{
                            loguear_online(datos).then(function(usu){
                                usu                     = usu.data[0];
                                usu.password            = datos.password;
                                localStorage.logueado   = true
                                localStorage.USER       = JSON.stringify(usu);
                                
                                ConexionServ.query('DELETE FROM usuarios').then(function(){
                                    consulta = 'INSERT INTO usuarios(rowid, id, nombres, apellidos, sexo, tema, idioma, username, password, email, fecha, tipo, union_id, asociacion_id, distrito_id, iglesia_id, celular) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
                                    ConexionServ.query(consulta, [usu.id, usu.id, usu.nombres, usu.apellidos, usu.sexo, usu.tema, usu.idioma, usu.username, usu.password, usu.email, usu.fecha, usu.tipo, usu.union_id, usu.asociacion_id, usu.distrito_id, usu.iglesia_id, usu.celular]).then(function(result){
                                        defered.resolve(usu);
                                    }, function(){
                                        console.log('Error logueando');
                                        defered.reject('Error logueando')
                                    })
                                })
                                
                            }, function(){
                                defered.reject('DATOS INVÁLIDOS')
                            });
                        }
                        
                    }, function(){
                        console.log('Error logueando');
                        defered.reject('Error logueando')
                    })
                    
                }else{
                    // LLAMAMOS A INTERNET PARA LOGUEAR, YA QUE NO HAY DATOS LOCALES
                    loguear_online(datos).then(function(usu){
                        usu                     = usu.data[0];
                        usu.rowid               = usu.id;
                        localStorage.logueado   = true
                        localStorage.USER       = JSON.stringify(usu); 
                         
                        consulta = 'INSERT INTO usuarios(rowid, id, nombres, apellidos, sexo, username, password, email, fecha, tipo, celular) VALUES(?,?,?,?,?,?,?,?,?,?,?)';
                        ConexionServ.query(consulta, [usu.id, usu.id, usu.nombres, usu.apellidos, usu.sexo, usu.username, usu.password, usu.email, usu.fecha, usu.tipo, usu.celular]).then(function(result){
                            defered.resolve({to_sync: true});
                        }, function(){
                            console.log('Error logueando');
                            defered.reject('Error logueando')
                        })
                        
                    });
                    
                }
                
            }, function(){
                console.log('Error logueando');
                defered.reject('Error logueando')
            })
            
  
            return defered.promise;
        
        },
        
        get_user: function(){
            
            if (localStorage.logueado){
                if (localStorage.logueado == 'true'){
                    
                    usu = localStorage.USER;
                    usu = JSON.parse(usu);
                    usu.auth = {username: usu.username, password: usu.password}
                    return usu;
                }else{
                    $state.go('login');
                }
            }else{
                $state.go('login');
            }
        
        },
        
        update_user_storage: function(datos){

            var defered = $q.defer();
            id = datos.rowid;
            if (!id) {
                id = datos.id;
            }
            
            ConexionServ.query(consulta_user+' u.rowid=? ', [id]).then(function(result){

                if (result.length > 0) {
                    localStorage.logueado   = true;
                    result[0].asociaciones  = datos.asociaciones;
                    result[0].uniones       = datos.uniones;
                    
                    if (!result[0].union_id && datos.union_id) {
                        result[0].union_id = datos.union_id;
                        ConexionServ.query('UPDATE usuarios SET union_id=? WHERE rowid=? ', [datos.union_id, id]).then(function(result){
                            console.log('Union_id modificada');
                        })
                    }
                    if (!result[0].asociacion_id && datos.asociacion_id) {
                        result[0].asociacion_id = datos.asociacion_id;
                        ConexionServ.query('UPDATE usuarios SET asociacion_id=? WHERE rowid=? ', [datos.asociacion_id, id]).then(function(result){
                            console.log('Asociacion_id modificada');
                        })
                    }
                    
                    
                    localStorage.USER       = JSON.stringify(result[0]);
                    defered.resolve(result[0]);
                }else{
                    console.log('Cero usuarios', datos);
                    defered.reject('Cero usuarios')
                }
                
            }, function(){
                console.log('Error logueando');
                defered.reject('Error logueando')
            })
            
            return defered.promise;
            
        },
        
        cerrar_sesion: function(datos){
            localStorage.logueado   = false
            delete localStorage.USER;
            delete localStorage.observs_por;
            delete localStorage.iglesia_alias_selected;
            delete localStorage.iglesia_codigo_selected;
            delete localStorage.iglesia_nombre_selected;
            $state.go('login');
        },
          
    }
    
    
    return result;

});
