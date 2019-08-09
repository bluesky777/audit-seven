angular.module('auditoriaApp')

.factory('EntidadesFacto', ['ConexionServ', '$q', '$http', 'rutaServidor', 'AuthServ', function(ConexionServ, $q, $http, rutaServidor, AuthServ){
    return {
        
        // *********************** TRAER LAS ASOCIACIONES
        asociaciones: function(union_id){
            var defer = $q.defer();
            
            if (union_id==undefined) {
                defer.reject('Falta union_id');
            }
            
            $user   = AuthServ.get_user();
            data    = { auth: $user.auth };
            
            data.union_id = union_id;
            
            $http.put(rutaServidor.root+'/au_asociaciones/de-union', data).then(function(result){
                defer.resolve(result.data);
            }, function(er) {
                defer.reject('Error: ', er);
            })
            
            return defer.promise;
        },
        
        
        // *********************** TRAER LAS IGLESIAS POR distritos
        iglesias: function(asociacion_id, tipo){
            var defer = $q.defer();
            
            if (asociacion_id==undefined) {
                defer.reject('Falta asociacion_id');
            }
            
            $user   = AuthServ.get_user();
            data    = { auth: $user.auth };
            
            data.asociacion_id  = asociacion_id;
            data.tipo_usu       = tipo;
            
            $http.put(rutaServidor.root+'/au_iglesias/de-asociacion', data).then(function(result){
                defer.resolve(result.data);
            }, function(er) {
                defer.reject('Error: ', er);
            })
            
            return defer.promise;
        },
        
        
        
        
        insertarRecomendacion: function(reco){
            var defer = $q.defer();
            
            if (reco==undefined) {
                defer.reject('Falta asociacion_id');
            }
            
            $user   = AuthServ.get_user();
            data    = { auth: $user.auth };
            data.recomendacion = reco
            
            
            $http.put(rutaServidor.root + '/au_observaciones/guardar-recomendacion', data).then(function(result){
                defer.resolve(result.data);
            }, function(er) {
                defer.reject('Error: ', er);
            })
            
            return defer.promise;
        },
        

        // *********************** TRAER LOS DATOS DE LAS ENTIDADES
        traerDatosEntidades: function(asociacion_id, tipo){
            var defer = $q.defer();
            
            $user   = AuthServ.get_user();
            data    = { auth: $user.auth };
            
            data.asociacion_id  = asociacion_id;
            data.tipo_usu       = tipo;
            
            $http.put(rutaServidor.root+'/au_entidades/datos', data).then(function(result){
                defer.resolve(result.data);
            }, function(er) {
                defer.reject('Error: ', er);
            })
            
            return defer.promise;
        },
        
        
        insertarIglesia: function(datos, is_modo_offline){
            var defer = $q.defer();
            
            
            if ( is_modo_offline == true){
            
                consulta = "INSERT INTO iglesias(nombre, alias, codigo, distrito_id, zona, tesorero_id, estado_propiedad, estado_propiedad_pastor, tipo_doc_propiedad, tipo_doc_propiedad_pastor, anombre_propiedad, anombre_propiedad_pastor, num_matricula, predial, municipio, direccion, observaciones) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                
                ConexionServ.query(consulta, datos).then(function(result) {
                    defer.resolve(result.data);
                }, function(tx) {
                    defer.reject('Error: ', er);
                });

            }else{
            
                $user           = AuthServ.get_user();
                data            = {auth: $user.auth};
                data

                $http.put(rutaServidor.root+'/au_entidades/store', data).then(function(result){
                    defer.resolve(result.data);
                }, function(er) {
                    defer.reject('Error: ', er);
                })

            }
            
            
            return defer.promise;
        },
        
        
        
    }
}])
