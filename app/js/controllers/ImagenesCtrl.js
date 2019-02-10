angular.module("auditoriaApp")

.controller("ImagenesCtrl", function($scope,Upload,ConexionServ,$filter,toastr,$uibModal,rutaServidor,$http) {
    $scope.imagenes     = [];
    $scope.perfil       = rutaServidor.root + '/images/perfil/';
    
    $scope.traerImagenes = function(){
        $http.get(rutaServidor.root + '/au_imagenes').then(function(r){
            $scope.imagenes = r.data;
        }, function(r2){
            toastr.error('No se pudo traer las imágenes');
        })
    }
    $scope.traerImagenes();
    
    
    
    $scope.cambiaDescripcion = function(imagen){
        $http.put(rutaServidor.root + '/au_imagenes/update', imagen).then(function(r){
            console.log(r);
            toastr.success('Descripción guardada');
        }, function(r2){
            toastr.error('No se pudo guardar');
        })
    }

    
    $scope.elimninarImagen = function(imagen){
        var modalInstance = $uibModal.open({
            templateUrl: 'templates/removeImagen.html',
            resolve: {
                elemento: function () {
                    return imagen;
                }
            },
            controller: 'RemoveImagenModalCtrl' 
        });

        modalInstance.result.then(function (result) {
            toastr.success('Eliminada');
            $scope.traerImagenes();
        });
    }
    
    $scope.openModalImage = function (image) {
        $uibModal.open({
            templateUrl: "templates/modalImage.html",
            resolve: {
                image: function () {
                    return image;
                },
                perfil: function(){
                    return $scope.perfil;
                }
            },
            controller: [
                "$scope", "image", "perfil",
                function ($scope, image, perfil) {
                    $scope.perfil = perfil;
                    return $scope.image = image;
                }
            ]
       });
    };
      
    //##########################################################
    //############## 	SUBIDA DE IMÁGENES 		###############
    //##########################################################
    $scope.uploadFiles = function(files) {
      var file, i, j, ref, results;

      $scope.imgFiles = files;
      $scope.errorMsg = "";
      if (files && files.length) {
        results = [];
        for (i = j = 0, ref = files.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          file = files[i];
          results.push(generateThumbAndUpload(file));
        }
        return results;
      }
    };
    
    generateThumbAndUpload = function(file) {
      $scope.errorMsg = null;
      uploadUsing$upload(file);
      return $scope.generateThumb(file);
    };
    
    $scope.generateThumb = function(file) {
      if (file !== null) {
        if ($scope.fileReaderSupported && file.type.indexOf("image") > -1) {
          return $timeout(function() {
            var fileReader;
            fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            return (fileReader.onload = function(e) {
              return $timeout(function() {
                return (file.dataUrl = e.target.result);
              });
            });
          });
        }
      }
    };
    
    uploadUsing$upload = function(file) {

      if (file.size > 10000000) {
        $scope.errorMsg = "Archivo excede los 10MB permitidos.";
        return;
      }
      return Upload
        .upload({
          url: rutaServidor.root + "/au_imagenes/store",
          fields: {'user_id': $scope.USER.rowid},
          file: file
        })
        .progress(function(evt) {
          var progressPercentage;
          progressPercentage = parseInt((100.0 * evt.loaded) / evt.total);
          return (file.porcentaje = progressPercentage);
          //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name, evt.config)
        })
        .success(function(data, status, headers, config) {
            toastr.success('Imagen subida con éxito');
            return $scope.imagenes.push(data);
        })
        .error(function(r2) {
          return console.log("Falla uploading: ", r2);
        })
        .xhr(function(xhr) {}); //.then((), error, progress)
    };
})



.controller("RemoveImagenModalCtrl", ["$scope","$uibModalInstance","elemento","rutaServidor","ConexionServ","$http", ($scope, $modalInstance, elemento, rutaServidor, ConexionServ, $http) => {
    $scope.elemento = elemento;
    console.log("elemento", elemento);

    $scope.ok = () => {
        $http.delete(rutaServidor.root + '/au_imagenes/destroy/'+elemento.id).then(function(r){
            $modalInstance.close(elemento);
        }, function(r2){
            $modalInstance.dismiss("Error");
        })
    
    };

    $scope.cancel = () => {
        $modalInstance.dismiss("cancel");
    };
}])


.controller("RemoveImagenModalCtrl", ["$scope","$uibModalInstance","elemento","rutaServidor","ConexionServ","$http", ($scope, $modalInstance, elemento, rutaServidor, ConexionServ, $http) => {
    $scope.elemento = elemento;
    console.log("elemento", elemento);

    $scope.ok = () => {
        $http.delete(rutaServidor.root + '/au_imagenes/destroy/'+elemento.id).then(function(r){
            $modalInstance.close(elemento);
        }, function(r2){
            $modalInstance.dismiss("Error");
        })
    
    };

    $scope.cancel = () => {
        $modalInstance.dismiss("cancel");
    };
}])
