angular.module('auditoriaApp')

.filter('getSumaDistrito', function(){
    return function(elementos, distrito_cod){
        if (!elementos) {
            return 0;
        }
        resp = 0;

        for (let i = 0; i < elementos.length; i++) {
            const registro = elementos[i];
            if (registro.funcion == distrito_cod) {
                resp = registro.suma;
                return resp;
            }
        }
        
        return resp;
        
    }
})


.filter('getSumaIglesia', function(){
    return function(elementos, iglesia_cod){
        if (!elementos) {
            return 0;
        }
        resp = 0;

        for (let i = 0; i < elementos.length; i++) {
            const registro = elementos[i];
            if (registro.org_id == iglesia_cod) {
                resp = registro.suma;
                return resp;
            }
        }
        
        return resp;
        
    }
})

