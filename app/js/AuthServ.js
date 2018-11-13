angular.module('auditoriaApp')

.factory('AuthServ', function($q, $http, $timeout, ConexionServ, $state, toastr, rutaServidor) {

    var consulta_user = 'SELECT u.rowid, u.id, u.nombres, u.apellidos, u.tipo, u.username, u.password, u.sexo, u.distrito_id, u.iglesia_id, u.celular,  '+
                'd.nombre as distrito_nombre, u.auditoria_id, d.alias as distrito_alias, i.nombre as iglesia_nombre, i.alias as iglesia_alias, '+
                'a.fecha as fecha_audit, a.hora as hora_audit, a.saldo_ant, a.ingre_por_registrar, a.iglesia_id as iglesia_audit_id, ' +
                't.nombres as tesorero_nombres, t.apellidos as tesorero_apellidos, i.tipo as iglesia_tipo, ' +
                'p.nombres as pastor_nombres, p.apellidos as pastor_apellidos ' +
            'FROM usuarios u '+
            'LEFT JOIN distritos d ON d.rowid=u.distrito_id '+
            'LEFT JOIN iglesias i ON i.rowid=u.iglesia_id '+
            'LEFT JOIN auditorias a ON a.rowid=u.auditoria_id '+
            "LEFT JOIN usuarios t ON t.tipo='Tesorero' and t.rowid=i.tesorero_id " +
			"LEFT JOIN usuarios p ON p.tipo='Pastor' and p.rowid=d.pastor_id " +
            'WHERE  ';


    function loguear_online(datos){
        toastr.info('Entrando online...');
        return $http.post(rutaServidor.ruta + '/loguear', datos);
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
          
        loguear: function(datos){
            var defered = $q.defer();
            
            
            ConexionServ.query('SELECT * FROM usuarios', []).then(function(result){
                
                if (result.length > 0) {
                    // LOGUEAMOS EN LA DB LOCAL OFFLINE
                    ConexionServ.query(consulta_user+' u.username=? and u.password=? ', [datos.username, datos.password]).then(function(result){
                        
                        if (result.length > 0) {
                            localStorage.logueado   = true
                            localStorage.USER       = JSON.stringify(result[0]);
                            defered.resolve(result[0]);
                        }else{
                            loguear_online(datos).then(function(usu){
                                usu                     = usu.data[0];
                                localStorage.logueado   = true
                                localStorage.USER       = JSON.stringify(usu);
                                
                                ConexionServ.query('DELETE FROM usuarios').then(function(){
                                    consulta = 'INSERT INTO usuarios(rowid, id, nombres, apellidos, sexo, username, password, email, fecha, tipo, celular) VALUES(?,?,?,?,?,?,?,?,?,?,?)';
                                    ConexionServ.query(consulta, [usu.id, usu.id, usu.nombres, usu.apellidos, usu.sexo, usu.username, usu.password, usu.email, usu.fecha, usu.tipo, usu.celular]).then(function(result){
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
            ConexionServ.query(consulta_user+' u.rowid=? ', [datos.rowid]).then(function(result){
                if (result.length > 0) {
                    localStorage.logueado   = true
                    localStorage.USER       = JSON.stringify(result[0]);
                    defered.resolve(result[0]);
                }else{
                    console.log('Cero usuarios');
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
            $state.go('login');
        },
          
    }
    
    
    return result;

});
