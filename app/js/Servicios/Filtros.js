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

.filter('getVariacionDistrito', function(){
    return function(elementos, distrito_cod){
        if (!elementos && elementos.length!=2) {
            return 0;
        }
        resp = 0;
        
        for (let j = 0; j < elementos.length; j++) {
            const anio = elementos[j];
            
            for (let i = 0; i < anio.registros.length; i++) {
                const registro = elementos[i];
                
                if (registro.funcion == distrito_cod) {
                    resp = registro.suma;
                    return resp;
                }
            }
        }
        
        
        return resp;
        
    }
})