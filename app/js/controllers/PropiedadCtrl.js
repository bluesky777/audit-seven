angular.module("auditoriaApp")

.controller("PropiedadCtrl", function($scope, Upload, ConexionServ, $filter, toastr, $uibModal, rutaServidor,$http, $timeout) {

    $scope.perfil       = rutaServidor.root + '/images/perfil/';
    $scope.imagenes     = [];
    $scope.documentos   = [];
    $scope.datos        = {};
    
    $scope.estados_propiedad = [
      {estado: 'Prestada'},
      {estado: 'Propio'},
      {estado: 'Arriendo'}
    ];
    $scope.tipos_documentos_prop = [
      {tipo: 'Escritura'},
      {tipo: 'Escritura mejora'},
      {tipo: 'Compraventa'},
      {tipo: 'Sin documento'},
    ];

    
    data = {
      usu_id: $scope.USER.id,
      tipo_usu: $scope.USER.tipo,
      iglesia_id: $scope.USER.iglesia_id
    }
    
    $scope.traerDatos = function(){
        $http.put(rutaServidor.root + '/au_propiedad', data).then(function(r){
          $scope.propiedad    = r.data.iglesia;
          $scope.imagenes     = r.data.imagenes;
          $scope.documentos   = r.data.documentos;
          $scope.distritos    = r.data.distritos;
          
          
          for (let i = 0; i < $scope.estados_propiedad.length; i++) {
            if ($scope.propiedad.estado_propiedad == $scope.estados_propiedad[i].estado) {
              $scope.propiedad.estado_propiedad = $scope.estados_propiedad[i];
            }
            if ($scope.propiedad.estado_propiedad_pastor == $scope.estados_propiedad[i].estado) {
              $scope.propiedad.estado_propiedad_pastor = $scope.estados_propiedad[i];
            }
          }
          
          
        }, function(r2){
            toastr.error('No se pudo traer las imágenes');
        })
    }
    $scope.traerDatos();
    
    
    
    $scope.cambiaDescripcion = function(imagen){
        $http.put(rutaServidor.root + '/au_imagenes/update', imagen).then(function(r){
            console.log(r);
            toastr.success('Descripción guardada');
        }, function(r2){
            toastr.error('No se pudo guardar');
        })
    }

    $scope.addImagen = function(imagen){
      console.log(imagen);
      $http.put(rutaServidor.root + '/au_imagenes/add-to-iglesia', {imagen_id: imagen.id, iglesia_id: $scope.USER.iglesia_id}).then(function(){
        toastr.success('Documento asignado');
        imagen.iglesia_id = imagen.id;
        $scope.documentos.push(imagen);
        $filter('filter')($scope.imagenes, {id: '!'+imagen.id});
        
        $timeout(function() {
          $scope.$apply();
        }, 0);
      }, function(){
        toastr.error('No se pudo asignar');
      })
      
    }
    
    $scope.quitarImagen = function(imagen){
      $http.put(rutaServidor.root + '/au_imagenes/quitar-iglesia', {imagen_id: imagen.id}).then(function(){
        toastr.success('Documento desasignado');
        imagen.iglesia_id = null;
        $timeout(function() {
          $scope.$apply();
        }, 0);
      }, function(){
        toastr.error('No se pudo asignar');
      })
      
    }
    
    
    $scope.eliminarImagen = function(imagen){
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
            $scope.traerDatos();
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
            $scope.imagenes.push(data);
            $scope.documentos.push(data);
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
