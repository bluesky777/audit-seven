angular.module('auditoriaApp')

.controller('PanelCtrl', function($scope, ConexionServ, $uibModal, USER, AuthServ){
    
    $scope.USER                     = USER;
    $scope.sidebar_active           = false;
    $scope.version                  = 'X.Y.Z';
    $scope.sidebar_active 	        = false;
    
    //ConexionServ.createTables()
	
	if (require) {
        const {ipcRenderer} = require('electron');
        ipcRenderer.on('message', function(event, text) {
          var container = document.getElementById('messages');
          var message   = document.createElement('div');
          message.innerHTML = text;
          container.appendChild(message);
        })
        
        
        ipcRenderer.on('toma-version', function(event, arg) {
            $scope.version = arg;
        })
        
        ipcRenderer.send('dame-version');
	}
    
    
    
    $scope.sidebar_activar = function () {
        $scope.sidebar_active = !$scope.sidebar_active;
    }
    
    $scope.seleccionarDistrito = function () {
        var modal = $uibModal.open({
            templateUrl: 'templates/Entidades/seleccionarDistritoModal.html',
            size: 'lg',
            resolve: {
                USER: function () {
                    return $scope.USER;
                }
            },
            controller: 'SeleccionarDistritoModalCtrl'
        });
        
        modal.result.then(function (usuario_new) {
            $scope.USER = usuario_new;
        });
    }
    
    
    $scope.cerrar_sesion = function(){
        AuthServ.cerrar_sesion();
    }
    
    
    
})

