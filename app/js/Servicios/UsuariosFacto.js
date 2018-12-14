angular.module('auditoriaApp')

.factory('UsuariosFacto', ['ConexionServ', '$q', '$http', 'rutaServidor', 'AuthServ', function(ConexionServ, $q, $http, rutaServidor, AuthServ){
    return {
        insertar: function(usu){
            var defer = $q.defer();
            
            if (!usu.password) {
                usu.password = "123";
            }
            if (!usu.username) {
                usu.username = usu.nombres+(window.getRandomInt(999, 9999));
            }
            usu.fecha_new = null;
            if (usu.fecha) {
                usu.fecha_new = window.fixDate(usu.fecha);
            }
            
            function insertarLocal(id){
                if (!id) {
                    id = null;
                }
                consulta = "INSERT INTO usuarios(nombres, apellidos, sexo, username, password, email, fecha, tipo, celular) VALUES(?,?,?,?,?,?,?,?,?) ";
                ConexionServ.query(consulta, [usu.nombres, usu.apellidos, usu.sexo, usu.username, usu.password, usu.email, usu.fecha_new, usu.tipo, usu.celular]).then(function(result) {
                    defer.resolve(result);
                }, function(tx) {
                    defer.reject('Error: ', consulta);
                });
            }
            
            
            if(localStorage.modo_offline == 'true'){
                
                insertarLocal();
                
            }else{
                
                $user = AuthServ.get_user();
                data = { data: usu, auth: $user.auth };
                
                $http.post(rutaServidor.root+'/au_usuarios/store', data).then(function(result){
                    defer.resolve(result);
                }, function(er) {
                    defer.reject('Error: ', er);
                })
                
            }
            
            return defer.promise;
        },
        
        // *********************** TRAER LOS USUARIOS
        traer: function(tipo){
            var defer = $q.defer();
            
            $user = AuthServ.get_user();
            data = { auth: $user.auth };
            
            if(localStorage.modo_offline == 'true'){
            
                consulta 	= '';
                datos 		= [];
                
                if (tipo == 'Auditor' || tipo == 'Tesorero asociación' || tipo == 'Admin') {
                    consulta 	= "SELECT rowid, * FROM usuarios WHERE eliminado is null ORDER BY rowid DESC";
                }else if(tipo == 'Tesorero' || tipo == 'Pastor'){
                    consulta 	= "SELECT rowid, * FROM usuarios WHERE eliminado is null and (tipo=? or tipo=?) ORDER BY rowid DESC";
                    datos 		= ['Tesorero', 'Pastor'];
                }
                
                ConexionServ.query(consulta, datos).then(function(result) {
                    defer.resolve(result);
                }, function(tx) {
                    console.log("Error, no es posbile traer usuarios. ", tx, consulta, datos);
                });
                
            }else{
                
                $http.put(rutaServidor.root+'/au_usuarios/all', data).then(function(result){
                    defer.resolve(result.data.usuarios);
                }, function(er) {
                    defer.reject('Error: ', er);
                })
                
            }
            
            return defer.promise;
        },
        
        
        // *********************** ACTUALIZAR USUARIO
        actualizar: function(usu){
            var defer = $q.defer();
            
            
            usu.fecha_new = null;
            if (usu.fecha) {
                usu.fecha_new = window.fixDate(usu.fecha);
            }
            
            if(localStorage.modo_offline == 'true'){
            
                now = window.fixDate(new Date(), true);
                
                consulta = "UPDATE usuarios SET nombres=?, apellidos=?, sexo=?, username=?, password=?, " +
                    "fecha=?, tipo=?, celular=?, modificado=? WHERE rowid=? ";
                    
                ConexionServ.query(consulta, [usu.nombres, usu.apellidos, usu.sexo, usu.username, usu.password, 
                    usu.fecha_new, usu.tipo, usu.celular, now, usu.rowid])
                    .then(function(result) {
                        
                    defer.resolve(result);
                    
                }, function(tx) {
                    defer.reject('Error: ', er);
                });
                
            }else{
                
                $user = AuthServ.get_user();
                data = { data: usu, auth: $user.auth };
                
                $http.put(rutaServidor.root+'/au_usuarios/update', data).then(function(result){
                    defer.resolve(result.data);
                }, function(er) {
                    defer.reject('Error: ', er);
                })
                
            }
            
            return defer.promise;
        },
        
        
        // *********************** ACTUALIZAR USUARIO CAMPO
        actualizar_campo: function(field, newValue, rowid){
            var defer = $q.defer();
            
            
            if(localStorage.modo_offline == 'true'){
            
                now = window.fixDate(new Date(), true);
                ConexionServ.query("UPDATE usuarios SET "+field+"='"+newValue+"', modificado=? WHERE rowid=?", [ now, rowid ] ).then(function(result) {
					defer.resolve(result);
				}, function(r2) {
                    defer.reject(r2);
				});
                
            }else{
                
                $user   = AuthServ.get_user();
                data    = { data: 
                    { field: field, valor: newValue, id: rowid }, 
                    auth: $user.auth 
                };
                
                $http.put(rutaServidor.root+'/au_usuarios/update-field', data).then(function(result){
                    defer.resolve(result.data);
                }, function(er) {
                    defer.reject('Error: ', er);
                })
                
            }
            
            return defer.promise;
        },
        
        
        
        // *********************** ELIMINAR USUARIO
        eliminar: function(rowid, id){
            var defer = $q.defer();
            
            
            if(localStorage.modo_offline == 'true'){
                prom = {};
                
                if (id > 0) {
                    now     = window.fixDate(new Date(), true);
                    prom    = ConexionServ.query("UPDATE usuarios SET eliminado=? WHERE rowid=?", [ now, rowid ] );
                }else{
                    prom    = ConexionServ.query("DELETE FROM usuarios WHERE rowid=?", [ rowid ] );
                }
                
                prom.then(function(result) {
                    defer.resolve(result);
                }, function(r2) {
                    defer.reject(r2);
                });
                
                
            }else{
                
                $user   = AuthServ.get_user();
                data    = { data: { id: rowid }, auth: $user.auth };
                console.log(data);
                $http.put(rutaServidor.root+'/au_usuarios/destroy', data).then(function(result){
                    defer.resolve(result.data);
                }, function(er) {
                    defer.reject('Error: ', er);
                })
                
            }
            
            return defer.promise;
        },
        
        
    }
}])
