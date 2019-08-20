angular.module("auditoriaApp")

.directive('iglesiasDir', function(){
	return {
		restrict: 'E',
		templateUrl: "templates/Entidades/iglesiasDir.html",
		controller: 'IglesiasCtrl',
		scope: false
	}
})

.controller("IglesiasCtrl", function($scope, ConexionServ, $filter, toastr, $location, $anchorScroll, $timeout, $uibModal, rutaServidor, $http, EntidadesFacto) {
    

	btTesorero = "templates/entidades/botonSelectTesoreroIglesia.html";
	btDistrito = "templates/entidades/botonSelectDistrito.html";
	btTipoIglesia = "templates/entidades/botonSelectTipoIglesia.html";
    btGrid1 ='<a uib-tooltip="Editar" tooltip-placement="left" tooltip-append-to-body="true" class="btn btn-default btn-xs icon-only" ng-click="grid.appScope.Ver_actualizar_iglesia(row.entity)"><i class="glyphicon glyphicon-pencil "></i></a>';
    btGrid2 ='<a uib-tooltip=" Eliminar" tooltip-placement="right" tooltip-append-to-body="true" class="btn btn-danger btn-xs icon-only" ng-click="grid.appScope.EliminarIglesia(row.entity)"><i class="glyphicon glyphicon-remove  "></i></a>';
    bt2 ='<span style="padding-left: 2px; padding-top: 4px;" class="btn-group">' + btGrid1 +btGrid2 +"</span>";

    $scope.$parent.gridOptions = {
      showGridFooter: true,
      enableSorting: true,
      enableFiltering: true,
      enebleGridColumnMenu: false,
      enableCellEdit: true,
      enableCellEditOnFocus: true,
      columnDefs: [
        {
          name: "no", displayName: "No", width: 45, enableCellEdit: false, enableColumnMenu: false,
          cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'
				},
				{ field: "rowid", displayName: "Id", pinnedLeft: true, width: 40, enableCellEdit: false },
        { name: "edicion", displayName: "Edición", width: 60, enableSorting: false, enableFiltering: false, cellTemplate: bt2, enableCellEdit: false, enableColumnMenu: true },
        { field: "nombre", minWidth:200 },
        //{ field: "alias", minWidth: 90 },
        { field: "codigo", minWidth: 90 },
        { field: "tipo", minWidth: 90, cellTemplate: btTipoIglesia, enableCellEdit: false },
        { field: "distrito", displayName: 'Distrito', cellTemplate: btDistrito, enableCellEdit: false, minWidth: 200 },
        { field: "estado_propiedad", minWidth: 80, displayName: "Propiedad" },
        { field: "zona", minWidth: 80 },
        { field: "tesorero", minWidth: 170, cellTemplate: btTesorero, enableCellEdit: false }
      ],
      onRegisterApi: function(gridApi) {
        $scope.grid1Api = gridApi;
        gridApi.edit.on.afterCellEdit($scope, function(rowEntity,colDef,newValue,oldValue) {
			if (newValue != oldValue) {

                $scope.guardarValor(newValue, rowEntity, colDef.field, oldValue);
                
			}
        });
        $timeout(function() {
          $scope.$apply();
        }, 0);
      }
    };


	$scope.VerCreandoIglesia = function() {
		$scope.ver_creando_iglesia = true;
		$scope.iglesia_new = angular.copy($scope.tpl_igle);
		
		$timeout(function() {
			$location.hash("nueva_new_new_iglesia");
			$anchorScroll();
		}, 100);
    };
    

	$scope.addImagen = function(imagen){

		$http.put(rutaServidor.root + '/au_imagenes/add-to-iglesia', {imagen_id: imagen.id, iglesia_id: $scope.iglesia_edit.rowid}).then(function(){
			toastr.success('Documento asignado');
			imagen.iglesia_id = imagen.id;
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
    
	
    $scope.cambiaDescripcion = function(imagen){
        $http.put(rutaServidor.root + '/au_imagenes/update', imagen).then(function(r){
            toastr.success('Descripción guardada');
        }, function(r2){
            toastr.error('No se pudo guardar');
        })
    }

    

    $scope.ActualizarIglesia = function(iglesia) {
		$scope.guardando_iglesia = true;
		
		
		estado_propiedad = null;
		if (iglesia.estado_propiedad) { estado_propiedad = iglesia.estado_propiedad.estado; }
		
		estado_propiedad_pastor = null;
		if (iglesia.estado_propiedad_pastor) { estado_propiedad_pastor = iglesia.estado_propiedad_pastor.estado; }
		
		tipo_doc_propiedad = null;
		if (iglesia.tipo_doc_propiedad) { tipo_doc_propiedad = iglesia.tipo_doc_propiedad.tipo; }
		
		tipo_doc_propiedad_pastor = null;
		if (iglesia.tipo_doc_propiedad_pastor) { tipo_doc_propiedad_pastor = iglesia.tipo_doc_propiedad_pastor.tipo; }
		
		distrito_id = null;
		if (iglesia.distrito) {
			distrito_id 		= iglesia.distrito.rowid;
		}
		
		teso_id = null;
		if (iglesia.tesorero) {
			teso_id 		= iglesia.tesorero.rowid;
		}
		
		fecha_update = window.fixDate(new Date(), true);
		
		consulta = "UPDATE iglesias SET nombre=?, alias=?, distrito_id=?, zona=?, tesorero_id=?, codigo=?, tipo=?, estado_propiedad=?, estado_propiedad_pastor=?, tipo_doc_propiedad=?, tipo_doc_propiedad_pastor=?, " + 
				"anombre_propiedad=?, anombre_propiedad_pastor=?, num_matricula=?, predial=?, municipio=?, direccion=?, observaciones=?, modificado=? " +
			"WHERE rowid=? ";
		ConexionServ.query(consulta, [iglesia.nombre, iglesia.alias, distrito_id, iglesia.zona, teso_id, iglesia.codigo, iglesia.tipo, estado_propiedad, estado_propiedad_pastor, tipo_doc_propiedad, tipo_doc_propiedad_pastor, 
			iglesia.anombre_propiedad, iglesia.anombre_propiedad_pastor, iglesia.num_matricula, iglesia.predial, 
			iglesia.municipio, iglesia.direccion, iglesia.observaciones, fecha_update, iglesia.rowid 
		]).then(function(result) {
			toastr.success("Iglesia actualizado.");
			$scope.guardando_iglesia 		= false;
			$scope.ver_Actualizando_iglesia = false;
		}, function(tx) {
			toastr.error("Iglesia no se pudo actualizar.");
			$scope.guardando_iglesia = false;
		});
    };

    $scope.Cancelar_Actualizar_Iglesia = function() {
      	$scope.ver_Actualizando_iglesia = false;
    };

    $scope.Ver_actualizar_iglesia = function(iglesia) {

			$scope.ver_Actualizando_iglesia = true;
			$scope.iglesia_edit 			= iglesia;

			for (var i = 0; i < $scope.distritos.length; i++) {
				if (iglesia.distrito_id == $scope.distritos[i].rowid) {
					$scope.iglesia_edit.distrito = $scope.distritos[i];
				}
			}

			for (var i = 0; i < $scope.usuarios.length; i++) {
				if (iglesia.tesorero_id == $scope.usuarios[i].rowid) {
					$scope.iglesia_edit.tesorero = $scope.usuarios[i];
				}
				if (iglesia.secretario_id == $scope.usuarios[i].rowid) {
					$scope.iglesia_edit.secretario = $scope.usuarios[i];
				}
			}
			
			for (let i = 0; i < $scope.estados_propiedad.length; i++) {
				if ($scope.iglesia_edit.estado_propiedad == $scope.estados_propiedad[i].estado) {
					$scope.iglesia_edit.estado_propiedad = $scope.estados_propiedad[i];
				}
				if ($scope.iglesia_edit.estado_propiedad_pastor == $scope.estados_propiedad[i].estado) {
					$scope.iglesia_edit.estado_propiedad_pastor = $scope.estados_propiedad[i];
				}
			}
			
			for (let i = 0; i < $scope.tipos_documentos_prop.length; i++) {
				if ($scope.iglesia_edit.tipo_doc_propiedad == $scope.tipos_documentos_prop[i].tipo) {
					$scope.iglesia_edit.tipo_doc_propiedad = $scope.tipos_documentos_prop[i];
				}
				if ($scope.iglesia_edit.tipo_doc_propiedad_pastor == $scope.tipos_documentos_prop[i].tipo) {
					$scope.iglesia_edit.tipo_doc_propiedad_pastor = $scope.tipos_documentos_prop[i];
				}
			}
		
		/*
		for (let i = 0; i < $scope.imagenes.length; i++) {
			
			if($scope.imagenes[i].iglesia_id == iglesia.rowid){
				
			}
			
		}*/
		

			$timeout(function() {
				$location.hash("editar-iglesia");
				$anchorScroll();
			}, 100);
    };

    $scope.EliminarIglesia = function(iglesia) {
		var res = confirm("¿Seguro que desea eliminar ? ");

		if (res == true) {
			fecha_update = window.fixDate(new Date(), true);
			
			consulta = "UPDATE iglesias SET eliminado=? WHERE rowid=? ";
			ConexionServ.query(consulta, [fecha_update, iglesia.rowid]).then( function(result) {
				toastr.success("iglesia eliminada.");
				$scope.traerDatos();
			},function(tx) {
				toastr.info("La iglesia que intenta eliminar no se pudo eliminar.");
			});
		}
			
    };

    $scope.CrearIglesia_insertar = function(iglesia) {

		$scope.guardando_iglesia = true;
		
		estado_propiedad = null;
		if (iglesia.estado_propiedad) { estado_propiedad = iglesia.estado_propiedad.estado; }
		
		estado_propiedad_pastor = null;
		if (iglesia.estado_propiedad_pastor) { estado_propiedad_pastor = iglesia.estado_propiedad_pastor.estado; }
		
		tipo_doc_propiedad = null;
		if (iglesia.tipo_doc_propiedad) { tipo_doc_propiedad = iglesia.tipo_doc_propiedad.tipo; }
		
		tipo_doc_propiedad_pastor = null;
		if (iglesia.tipo_doc_propiedad_pastor) { tipo_doc_propiedad_pastor = iglesia.tipo_doc_propiedad_pastor.tipo; }
		
        datos = [];
        
        if ($scope.modo_offline) {

            distrito_id = null;
            if (iglesia.distrito) {
                distrito_id 		= iglesia.distrito.rowid;
            }
            
            teso_id = null;
            if (iglesia.tesorero) {
                teso_id 		= iglesia.tesorero.rowid;
            }
            
            datos = [ iglesia.nombre, iglesia.alias, iglesia.codigo, distrito_id, iglesia.tipo, iglesia.zona, teso_id, estado_propiedad, estado_propiedad_pastor, tipo_doc_propiedad, tipo_doc_propiedad_pastor, iglesia.anombre_propiedad, iglesia.anombre_propiedad_pastor, iglesia.num_matricula, iglesia.predial, iglesia.municipio, iglesia.direccion, iglesia.observaciones];
        }else{
            distrito_id = null;
            if (iglesia.distrito) {
                distrito_id 		= iglesia.distrito.id;
            }
            
            teso_id = null;
            if (iglesia.tesorero) {
                teso_id 		= iglesia.tesorero.id;
            }
        
            datos = { nombre: iglesia.nombre, alias: iglesia.alias, codigo: iglesia.codigo, distrito_id: distrito_id, tipo: iglesia.tipo, zona: iglesia.zona, teso_id: teso_id, estado_propiedad: estado_propiedad, estado_propiedad_pastor: estado_propiedad_pastor, tipo_doc_propiedad: tipo_doc_propiedad, tipo_doc_propiedad_pastor: tipo_doc_propiedad_pastor, 
                anombre_propiedad: iglesia.anombre_propiedad, anombre_propiedad_pastor: iglesia.anombre_propiedad_pastor, num_matricula: iglesia.num_matricula, predial: iglesia.predial, municipio: iglesia.municipio, direccion: iglesia.direccion, observaciones: iglesia.observaciones, created_by: $scope.$parent.$parent.USER.id};
        }
		

		EntidadesFacto.insertarIglesia(datos, $scope.modo_offline).then(function(){
			$scope.traerDatos();
			toastr.success("Iglesia creada exitosamente.");
			$scope.guardando_iglesia 	= false;
			$scope.ver_creando_iglesia 	= false;
		}, function(tx) {
			toastr.error("Error al guardar iglesia.");
			$scope.guardando_iglesia 	= false;
		})


    };

    $scope.cancelar_crear_iglesia = function() {
			$scope.ver_creando_iglesia = false;
			$scope.iglesia_new = angular.copy($scope.tpl_igle);
    };

    $scope.filtrarIglesiasPorAsociacion = function(item) {
		$scope.gridOptions.data = $filter('filter')($scope.iglesias, {asociacion_id: item.id})
    };

    $scope.guardarValor = function(newValue, entity, propiedad, oldValue){

        if ( $scope.modo_offline == true){
            
            fecha_update = window.fixDate(new Date(), true);
            ConexionServ.query("UPDATE iglesias SET "+colDef+"='"+newValue+"', modificado=? WHERE rowid=?", [ fecha_update, rowEntity.rowid ] ).then(function(r) {
                return toastr.success("Iglesia actualizada.");
            }, function(r2) {
                rowEntity[colDef] = oldValue;
                return toastr.error("Cambio no guardado", "Error");
            });

        }else{

            data.propiedad      = propiedad;
            data.valor          = newValue;
            data.user_id        = $scope.$parent.$parent.USER.id;
            data.tipo_usu       = $scope.$parent.$parent.USER.tipo;
            data.iglesia_id     = entity.id;

            $http.put(rutaServidor.root+'/au_iglesias/guardar-valor', data).then(function(r){
                console.log(r.data);
                toastr.success('Iglesia guardada');
                
            }, function(){
                toastr.error('Cambio no guardado', 'Error');
            })
        }
    }


})




.controller('RemoveIglesiaCtrl', ['$scope', '$uibModalInstance', 'elemento', 'toastr', 'ConexionServ', ($scope, $modalInstance, elemento, toastr, ConexionServ)=>{
	$scope.elemento = elemento;
	console.log('elemento', elemento);

	$scope.ok = ()=>{

		fecha_update = window.fixDate(new Date(), true);
		
		consulta = "UPDATE iglesias SET eliminado=? WHERE rowid=? ";

		ConexionServ.query(consulta, [ fecha_update, elemento.rowid]).then(function(result) {
			$modalInstance.close(elemento)
		}, function(tx) {
			console.log("iglesia no se pudo Eliminar", tx);
			$modalInstance.dismiss('Error')
		})
		
	}
	
	$scope.cancel = ()=>{
		$modalInstance.dismiss('cancel')
	}

}])

