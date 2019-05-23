angular.module('auditoriaApp')

.factory('RemesasCrudFacto', ['ConexionServ', '$q', '$http', 'rutaServidor', 'AuthServ', function(ConexionServ, $q, $http, rutaServidor, AuthServ){
    return {
        
        insertar: function(rem){
            var defer = $q.defer();
            
            $user = AuthServ.get_user();
            data = { data: rem, auth: $user.auth };
            
            $http.post(rutaServidor.root+'/remesas/store', data).then(function(result){
                defer.resolve(result);
            }, function(er) {
                defer.reject('Error: ', er);
            })
            
            
            return defer.promise;
        },
        
        // *********************** TRAER LAS REMESAS
        traer: function(){
            var defer = $q.defer();
            
            $user = AuthServ.get_user();
            data = { auth: $user.auth };
            
            $http.put(rutaServidor.root+'/remesas/all', data).then(function(result){
                defer.resolve(result.data.remesas);
            }, function(er) {
                defer.reject('Error: ', er);
            })
                
            return defer.promise;
        },
        
        
        // *********************** ACTUALIZAR CAMPO REMESA
        actualizar_campo: function(field, newValue, id){
            var defer = $q.defer();
            
            $user   = AuthServ.get_user();
            data    = { data: 
                { field: field, valor: newValue, id: id }, 
                auth: $user.auth 
            };
            
            $http.put(rutaServidor.root+'/remesas/update-field', data).then(function(result){
                defer.resolve(result.data);
            }, function(er) {
                defer.reject('Error: ', er);
            })
            
            return defer.promise;
        },
        
        
        
        // *********************** ELIMINAR REMESA
        eliminar: function(id){
            var defer = $q.defer();
            
                
            $user   = AuthServ.get_user();
            data    = { data: { id: id }, auth: $user.auth };
            
            $http.put(rutaServidor.root+'/remesas/destroy', data).then(function(result){
                defer.resolve(result.data);
            }, function(er) {
                defer.reject('Error: ', er);
            })
            return defer.promise;
        },
        
        
        template_new: function () {
            return {
                num_diario: '', 
                linea: '', 
                tipo_diario: '', 
                num_secuencia: '', 
                periodo: '', 
                fecha: new Date, 
                referencia: '', 
                cod_cuenta: '611110', 
                nombre_cuenta: '', 
                descripcion_transaccion: '', 
                cantidad: '', 
                iva: '', 
                moneda: '', 
                recurso: '', 
                funcion: '', 
                restr: '', 
                org_id: '', 
                empleados: '', 
                concepto: ''
            };
        }
        
    }
}])
