angular.module("auditoriaApp")


.controller("EntidadesCtrl", function($scope, ConexionServ, $filter, toastr, $location, $anchorScroll, $timeout, $uibModal, rutaServidor, $http, EntidadesFacto) {
	$scope.entidades 				= true;
	$scope.distrito_new 			= {};
	$scope.datos 					= {};
	$scope.modentidades 			= false;
	$scope.verCrearDistrito 		= false;
	$scope.usuarios 				= [];
	$scope.$parent.sidebar_active 	= false;
	$scope.perfil 					= rutaServidor.root + '/images/perfil/';
	$scope.gridOptions 				= {};
    $scope.tipos_iglesia = [
        {id: 'Iglesia'}, {id: 'Grupo'}
    ]
	
	$scope.tpl_igle = {
		nombre: '',
		distrito_id: null,
		zona: null,
		tipo: 'Iglesia',
		
		anombre_propiedad: '',
		anombre_propiedad_pastor: '',
		num_matricula: '',
		predial: '',
		municipio: '',
		direccion: '',
		observaciones: ''
	}
	
	$scope.tpl_distr = {
		nombre: '',
		zona: null,
		codigo: null
	}
	
	
	$scope.estados_propiedad = [
		{estado: 'Prestada'},
		{estado: 'Propio'},
		{estado: 'Arriendo'},
		{estado: 'Federal'}
	];
	$scope.tipos_documentos_prop = [
		{tipo: 'Escritura'},
		{tipo: 'Escritura mejora'},
		{tipo: 'Compraventa'},
		{tipo: 'Sin documento'},
	];


	
	$scope.iglesia_new 		= angular.copy($scope.tpl_igle);
	$scope.distrito_new 	= angular.copy($scope.tpl_distr);
	
	$scope.ver_uniones 		= false;
	$scope.ver_asociaciones = false;
	$scope.ver_distritos 	= false;
	$scope.ver_iglesias 	= true;
	
	$scope.toggleUniones = ()=>{
		$scope.ver_uniones = !$scope.ver_uniones;
	}
	$scope.toggleAsociaciones = ()=>{
		$scope.ver_asociaciones = !$scope.ver_asociaciones;
	}
	$scope.toggleDistritos = ()=>{
		$scope.ver_distritos = !$scope.ver_distritos;
	}
	$scope.toggleIglesias = ()=>{
		$scope.ver_iglesias = !$scope.ver_iglesias;
	}
	
	

	$scope.tipoDocSeleccionado = function($item, row){
		console.log($item, row);
		return;
		
		consulta = "UPDATE usuarios SET tesorero_id=? WHERE id=?";

		ConexionServ.query(consulta, [$scope.pastor_new_id,$scope.tesorero_new_id]).then(function(result) {
			$scope.traerDatos();
			toastr.success("Distrito creado.");
			$scope.guardando_distrito 	= false;
			$scope.verCrearDistrito 	= false;
		},function(tx) {
			toastr.error("Error creando distrito.", tx);
			$scope.guardando_distrito 	= false;
		});
	}

	
    $scope.crear_distrito = function() {
      $scope.verCrearDistrito = true;

      $timeout(function() {
        $location.hash("nueva_new_new_distrito");
        $anchorScroll();
      }, 100);
    };
    $scope.cancelar_crear_distrito = function() {
	  $scope.distrito_new = angular.copy($scope.tpl_distr);
      $scope.verCrearDistrito = false;
    };

    $scope.insertar_distrito = function(distrito) {
			console.log(distrito);
			$scope.guardando_distrito 	= true;
			$scope.pastor_new_id 		= null;
			$scope.tesorero_new_id 		= null;

			if (distrito.pastor) {
				if (distrito.pastor.rowid) {
					$scope.pastor_new_id = distrito.pastor.rowid;
				}
			}

			if (distrito.tesorero) {
				if (distrito.tesorero.rowid) {
					$scope.tesorero_new_id = distrito.tesorero.rowid;
				}
			}

			consulta = "INSERT INTO distritos(nombre, alias, codigo, zona, pastor_id, tesorero_id) VALUES(?,?,?,?,?,?)";

			ConexionServ.query(consulta, [distrito.nombre,distrito.alias,distrito.codigo,distrito.zona,$scope.pastor_new_id,$scope.tesorero_new_id]).then(function(result) {
				$scope.traerDatos();
				toastr.success("Distrito creado.");
				$scope.guardando_distrito 	= false;
				$scope.verCrearDistrito 	= false;
			},function(tx) {
				toastr.error("Error creando distrito.", tx);
				$scope.guardando_distrito 	= false;
			});
    };

    $scope.crearI = function() {
      $scope.vercrear = !$scope.vercrear;
    };

    $scope.modentidad = function(entidad) {
      $scope.modentidades = !$scope.modentidades;
      $scope.entidad_editar = entidad;
    };

    // Traemos todos los datos que necesito para trabajar
    $scope.traerDatos = function() {

		if ( $scope.modo_offline == true){

			// Traemos USUARIOS
			consulta = "SELECT rowid, nombres, apellidos, sexo, tipo, celular, username FROM usuarios WHERE eliminado is null";

			ConexionServ.query(consulta, []).then(function(result) {
				$scope.usuarios = result;
			},function(tx) {
				toastr.error("Error, no es posbile traer usuarios");
			});


			// Traemos DISTRITOS
			consulta = "SELECT d.rowid, d.*, p.nombres as pastor_nombres, p.apellidos as pastor_apellidos, " +
					"p.nombres as pastor_nombres, p.apellidos as pastor_apellidos, " +
					"t.nombres as tesorero_nombres, t.apellidos as tesorero_apellidos " +
				"FROM distritos d " +
				"LEFT JOIN usuarios t ON t.tipo='Tesorero' AND t.rowid=d.tesorero_id AND t.eliminado is null " +
				"LEFT JOIN usuarios p ON p.tipo='Pastor' AND p.rowid=d.pastor_id AND p.eliminado is null  " +
				"WHERE d.eliminado is null";


			ConexionServ.query(consulta, []).then(function(result) {
				$scope.distritos = result;

				// Traemos IGLESIAS
				$scope.consulta_igle =
					"SELECT i.rowid, i.nombre, i.alias, i.codigo, i.distrito_id, i.zona, d.asociacion_id, d.nombre as distrito_nombre, i.tesorero_id, i.secretario_id, " +
						"t.nombres as tesorero_nombres, t.apellidos as tesorero_apellidos, i.tipo, " + 
						"i.estado_propiedad, i.estado_propiedad_pastor, i.tipo_doc_propiedad, i.tipo_doc_propiedad_pastor, " + 
						"i.anombre_propiedad, i.anombre_propiedad_pastor, i.num_matricula, i.predial, " + 
						"i.municipio, i.direccion, i.observaciones " + 
					"FROM iglesias i " +
					"LEFT JOIN distritos d ON d.rowid=i.distrito_id AND d.eliminado is null " +
					"LEFT JOIN usuarios t ON t.tipo='Tesorero' AND t.rowid=i.tesorero_id AND t.eliminado is null " + 
					"WHERE i.eliminado is null";

				ConexionServ.query($scope.consulta_igle, []).then(function(result) {
					for (let j = 0; j < result.length; j++) {
						const iglesia = result[j];

						for (let i = 0; i < $scope.distritos.length; i++) {
							if (iglesia.distrito_id == $scope.distritos[i].rowid) {
								iglesia.distrito = $scope.distritos[i];
							}
						}
						for (let i = 0; i < $scope.tipos_iglesia.length; i++) {
							if (iglesia.tipo == $scope.tipos_iglesia[i].tipo) {
								iglesia.tipo = $scope.tipos_iglesia[i];
							}
						}
						for (let i = 0; i < $scope.usuarios.length; i++) {
							if (iglesia.tesorero_id == $scope.usuarios[i].rowid) {
								iglesia.tesorero = $scope.usuarios[i];
							}
						}
					}
					
					$scope.iglesias = result;
					$scope.gridOptions.data = result;
				}, function(tx) {
					toastr.error("Error no es posbile traer iglesias", tx);
				});
			
			}, function(tx) {
				toastr.error("Error no es posbile traer distritos", tx);
			});

			// Traemos Uniones
			consulta = "SELECT rowid, nombre, alias, codigo, division_id FROM uniones WHERE eliminado is null";

			ConexionServ.query(consulta, []).then(function(result) {
				$scope.uniones = result;
			}, function(tx) {
				toastr.error("Error no es posbile traer Uniones", tx);
			});

			// Traemos Asociaciones
			consulta = "SELECT aso.rowid, aso.* , un.nombre as nombre_union FROM asociaciones aso " +
				"INNER JOIN uniones un ON aso.union_id = un.rowid and un.eliminado is null " +
				"WHERE aso.eliminado is null ";

			ConexionServ.query(consulta, []).then(function(result) {
				$scope.asociaciones = result;
			}, function(tx) {
				toastr.error("Error no es posbile traer asociaciones", tx);
			});
			
		}else{

			EntidadesFacto.traerDatosEntidades().then(function(datos){
				$scope.uniones 				= datos.uniones;
				$scope.iglesias 			= datos.iglesias;
				$scope.distritos 			= datos.distritos;
				$scope.asociaciones 		= datos.asociaciones;
				$scope.usuarios 			= datos.usuarios;


				for (let j = 0; j < $scope.iglesias.length; j++) {
					const iglesia = $scope.iglesias[j];

					for (let i = 0; i < $scope.distritos.length; i++) {
						if (iglesia.distrito_id == $scope.distritos[i].id) {
							iglesia.distrito = $scope.distritos[i];
						}
					}
					for (let i = 0; i < $scope.tipos_iglesia.length; i++) {
						if (iglesia.tipo == $scope.tipos_iglesia[i].id) {
							iglesia.tipo = $scope.tipos_iglesia[i];
						}
					}
					for (let i = 0; i < $scope.usuarios.length; i++) {
						if (iglesia.tesorero_id == $scope.usuarios[i].id) {
							iglesia.tesorero = $scope.usuarios[i];
						}
					}
				}


				

				$timeout(function(){
					$scope.gridOptions.data 	= $scope.iglesias;
					$scope.$apply();
				}, 100)

			});

		}


    };

	$scope.traerDatos();
	
	
	$scope.traerImagenes = function(){
		$http.get(rutaServidor.root+ '/au_imagenes').then(function(r){
            $scope.imagenes = r.data;
        }, function(r2){
            toastr.error('No se pudo traer las imágenes');
        });
	}
	$scope.traerImagenes();
	

	/*
    $scope.InsertarEntidad = function(entidad_crear) {
			consulta = "INSERT INTO entidades(nombres, alias, pastor, celular) VALUES(?, ?, ?, ?) ";
			ConexionServ.query(consulta, [entidad_crear.nombres,entidad_crear.alias,entidad_crear.pastor,entidad_crear.celular]).then(function(result) {
				console.log("entidad creada", result);
				toastr.success("Entidad creada exitosamente");
			}, function(tx) {
				toastr.error("Entidad no se pudo crear", tx);
			});
	};
	*/

    $scope.actuentidad = function(entidad_cambiar) {
		fecha_update = window.fixDate(new Date(), true);
		
		consulta = "UPDATE entidades SET nombres=?, alias=?, pastor=?, celular=?, modificado=? WHERE rowid=? ";
		ConexionServ.query(consulta, [entidad_cambiar.nombres, entidad_cambiar.alias, entidad_cambiar.pastor,entidad_cambiar.celular, fecha_update, entidad_cambiar.rowid]).then(function(result) {
			toastr.success("Entidad actualizada");
		}, function(tx) {
			toastr.error("Entidad no se pudo actualizar", tx);
		});
	};
	

    $scope.EliminarDistrito = function(distrito) {
		var res = confirm("¿Seguro que desea eliminar ? ");

		if (res == true) {
			fecha_del = window.fixDate(new Date(), true);
			
			consulta = "UPDATE distritos SET eliminado=? WHERE rowid=? ";
			ConexionServ.query(consulta, [fecha_del, distrito.rowid]).then( function(result) {
				toastr.success("Distrito eliminado.");
				$scope.traerDatos();
			},function(tx) {
				toastr.error("Distrito no se pudo eliminar.");
			});
		}
    };

    $scope.VerActualizarDistrito = function(distrito) {
			$scope.VerActualizandoDistrito = true;

			$scope.distrito_new_distric = distrito;

			for (var i = 0; i < $scope.usuarios.length; i++) {
				if (distrito.pastor_id == $scope.usuarios[i].rowid && distrito.tipo=='Pastor') {
					$scope.distrito_new_distric.pastor = $scope.usuarios[i];
				}
				if (distrito.tesorero_id == $scope.usuarios[i].rowid && distrito.tipo=='Tesorero') {
					$scope.distrito_new_distric.tesorero = $scope.usuarios[i];
				}
			}

			$timeout(function() {
				$location.hash("editar-distrito");
				$anchorScroll();
			}, 100);
    };

    $scope.ActualizarDistrito = function(distrito) {
			pastor_id = null;
			if (distrito.pastor) {
				pastor_id 		= distrito.pastor.rowid;
			}
			tesorero_id = null;
			if (distrito.tesorero) {
				tesorero_id 		= distrito.tesorero.rowid;
			}
			fecha_update = window.fixDate(new Date(), true);
			
			consulta = "UPDATE distritos SET nombre=?, alias=?, codigo=?, zona=?, pastor_id=?, tesorero_id=?, modificado=? WHERE rowid=? ";
			ConexionServ.query(consulta, [distrito.nombre, distrito.alias, distrito.codigo, distrito.zona, pastor_id, tesorero_id, fecha_update, distrito.rowid]).then( function(result) {
				toastr.success("Distrito actualizado.");
				$scope.VerActualizandoDistrito = false;
			}, function(tx) {
				toastr.error("Distrito no se pudo actualizar.");
			});
    };

    $scope.Cancelar_Actualizar_Distrito = function() {
      	$scope.VerActualizandoDistrito = false;
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
		
		distrito_id = null;
		if (iglesia.distrito) {
			distrito_id 		= iglesia.distrito.rowid;
		}
		
		teso_id = null;
		if (iglesia.tesorero) {
			teso_id 		= iglesia.tesorero.rowid;
		}
		
		datos = [ iglesia.nombre, iglesia.alias, iglesia.codigo, distrito_id, iglesia.zona, teso_id, estado_propiedad, estado_propiedad_pastor, tipo_doc_propiedad, tipo_doc_propiedad_pastor, iglesia.anombre_propiedad, iglesia.anombre_propiedad_pastor, iglesia.num_matricula, iglesia.predial, iglesia.municipio, iglesia.direccion, iglesia.observaciones];

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
			console.log(item);
			$scope.gridOptions.data = $filter('filter')($scope.iglesias, {asociacion_id: item.id})
    };

    $scope.inserter_union = function(creatar_union) {
			consulta = "INSERT INTO uniones(nombre, alias, codigo) VALUES(?,?,?)";

			ConexionServ.query(consulta, [creatar_union.nombre, creatar_union.alias, creatar_union.codigo]).then(function(result) {
				$scope.traerDatos();
				toastr.success("Unión creada.");
				$scope.verCreandoUniones = false;
			}, function(tx) {
				console.log("Error creando unión", tx);
			});
    };

    $scope.CancelarCrearUnion = function() {
      $scope.verCreandoUniones = false;
    };

    $scope.verCrearUnion = function() {
			$scope.verCreandoUniones = true;

			$timeout(function() {
				$location.hash("nueva_new_new_union");
				$anchorScroll();
			}, 100);
    };

    $scope.ActualizarUniones = function(actuali_union) {
		fecha_update = window.fixDate(new Date(), true);
		
		consulta = "UPDATE uniones SET nombre=?, alias=?, codigo=?, modificado=? WHERE rowid=? ";
		ConexionServ.query(consulta, [ actuali_union.nombre, actuali_union.alias, actuali_union.codigo, fecha_update, actuali_union.rowid ]).then( function(result) {
			$scope.VeractualizandoUniones = false;
			toastr.success("Unión actualizada.");
		},function(tx) {
			toastr.error("No se pudo actualizar unión.");
		});
    };

    $scope.VerActualizarUniones = function(union) {
		$scope.VeractualizandoUniones = true;

		$scope.union_creatar_new = union;

		$timeout(function() {
			$location.hash("editar-uniones");
			$anchorScroll();
		}, 100);
    };

    $scope.CancelarActualizarUniones = function() {
      	$scope.VeractualizandoUniones = false;
    };

    $scope.EliminarUnion = function(union) {
		var res = confirm("¿Seguro que desea eliminar ? ");

		if (res == true) {
			fecha_update = window.fixDate(new Date(), true);
			
			consulta = "UPDATE uniones SET eliminado=? WHERE rowid=? ";
			ConexionServ.query(consulta, [fecha_update, union.rowid]).then( function(result) {
				$scope.traerDatos();
				toastr.success("Unión eliminada.");
			},function(tx) {
				toastr.error("La unión no se pudo eliminar.");
			});
		}
    };

    $scope.Insertar_asociaciones = function(creater_asociaciones) {
		
		consulta = "INSERT INTO asociaciones(nombre, alias, codigo, union_id) VALUES(?,?,?,?)";

		ConexionServ.query(consulta, [ creater_asociaciones.nombre, creater_asociaciones.alias, creater_asociaciones.codigo, creater_asociaciones.union.rowid ]).then( function(result) {
			$scope.traerDatos();
			toastr.success("Asocación creada.");
			$scope.MostrandoAsociaciones = false;
		}, function(tx) {
			toastr.error("Error creando asociación.", tx);
    	});
    };

    $scope.VerCrearAsociaciones = function() {
		$scope.MostrandoAsociaciones = true;

			$timeout(function() {
				$location.hash("nueva_asociacion");
				$anchorScroll();
			}, 100);
    };

    $scope.CancelarVerCreandoAsoaciones = function() {
      	$scope.MostrandoAsociaciones = false;
    };

    $scope.EliminarAsociacion = function(asociation) {
		var res = confirm("¿Seguro que desea eliminar ? ");

		if (res == true) {
			fecha_update = window.fixDate(new Date(), true);
			
			consulta = "UPDATE  asociaciones SET eliminado=? WHERE rowid=? ";
			ConexionServ.query(consulta, [fecha_update, asociation.rowid]).then( function(result) {
				toastr.success("Asociación eliminada.");
				$scope.traerDatos();
			},function(tx) {
				toastr.error("No se pudo eliminar.");
			});
		}
    };

    $scope.VerActualizarAsociaciones = function(asociation) {
		$scope.VerActualizandoAsociaciones = true;
		$scope.actuali_new_asociation = asociation;

		for (var i = 0; i < $scope.uniones.length; i++) {
			if (asociation.union_id == $scope.uniones[i].rowid) {
				$scope.actuali_new_asociation.union = $scope.uniones[i];
			}
		}

		$timeout(function() {
			$location.hash("editar_new_new_asociation");
			$anchorScroll();
		}, 100);
    };

    $scope.ActualizarAsociaciones = function(actuali_asociation) {
		fecha_update = window.fixDate(new Date(), true);
		consulta = "UPDATE asociaciones SET nombre=?, alias=?, codigo=?, union_id=?, modificado=?  WHERE rowid=? ";
		ConexionServ.query(consulta, [ actuali_asociation.nombre, actuali_asociation.alias, actuali_asociation.codigo, actuali_asociation.union.rowid, fecha_update, actuali_asociation.rowid ]).then( function(result) {
			toastr.success("Asociación actualizada.");
			$scope.VerActualizandoAsociaciones = false;
		}, function(tx) {
			toastr.error("No se pudo actualizar.");
		});
    };

    $scope.CancelarVerActualizarAsociaciones = function() {
      	$scope.VerActualizandoAsociaciones = false;
	};
	
	
})



