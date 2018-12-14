angular.module('auditoriaApp')

.factory('Acentos', [function(){
    return {
        remove: function(texto){
            texto = texto
                .toLowerCase()
                .replace(/á/g, 'a')
                .replace(/â/g, 'a')
                .replace(/é/g, 'e')
                .replace(/è/g, 'e')
                .replace(/í/g, 'i')
                .replace(/ì/g, 'i')
                .replace(/ó/g, 'o')
                .replace(/ú/g, 'u')
                .replace(/ü/g, 'u')
                .replace(/ç/g, 'c');

            return texto
        },
        
        buscarEnGrid: function(searchTerm, cellValue, row){
            this.remove = function(txt){
                txt = txt
                    .toLowerCase()
                    .replace(/á/g, 'a')
                    .replace(/â/g, 'a')
                    .replace(/é/g, 'e')
                    .replace(/è/g, 'e')
                    .replace(/í/g, 'i')
                    .replace(/ì/g, 'i')
                    .replace(/ó/g, 'o')
                    .replace(/ú/g, 'u')
                    .replace(/ü/g, 'u')
                    .replace(/ç/g, 'c')
                return txt
            }
            
            texto       = this.remove(cellValue);
            search      = this.remove(searchTerm);

            return (texto.indexOf(search) != -1)
        
        }
    }
}])
