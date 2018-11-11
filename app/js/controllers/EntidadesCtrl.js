angular.module("auditoriaApp")

.controller("EntidadesCtrl", function($scope, ConexionServ, $filter, toastr, $location, $anchorScroll, $timeout, $uibModal) {
	$scope.entidades = true;
    $scope.distrito_new = {};
    $scope.modentidades = false;
    $scope.verCrearDistrito = false;
	$scope.usuarios = [];
	
	$scope.tpl_igle = {
		nombre: '',
		distrito_id: null,
		zona: null,
		tipo: 'IGLESIA',
		
		tipo_propiedad: '',
		anombre_propiedad: '',
		fecha_propiedad: null,
		fecha_fin: null,
	}
	
	$scope.tpl_distr = {
		nombre: '',
		zona: null,
		codigo: null
	}
	
	$scope.iglesia_new 	= angular.copy($scope.tpl_igle);
	$scope.distrito_new = angular.copy($scope.tpl_distr);
	
	$scope.ver_uniones 		= false;
	$scope.ver_asociaciones = false;
	$scope.ver_distritos 	= false;
	$scope.ver_iglesias 	= false;
	
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
	

    btGrid1 ='<a uib-tooltip="Editar" tooltip-placement="left" tooltip-append-to-body="true" class="btn btn-default btn-xs icon-only" ng-click="grid.appScope.Ver_actualizar_iglesia(row.entity)"><i class="glyphicon glyphicon-pencil "></i></a>';
    btGrid2 ='<a uib-tooltip=" Eliminar" tooltip-placement="right" tooltip-append-to-body="true" class="btn btn-danger btn-xs icon-only" ng-click="grid.appScope.EliminarIglesia(row.entity)"><i class="glyphicon glyphicon-remove  "></i></a>';
    bt2 ='<span style="padding-left: 2px; padding-top: 4px;" class="btn-group">' + btGrid1 +btGrid2 +"</span>";

    $scope.gridOptions = {
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
        { field: "nombre", minWidth:150 },
        { field: "alias", minWidth: 90 },
        { field: "codigo", minWidth: 90 },
        { field: "tipo", minWidth: 90 },
        { field: "distrito_nombre", displayName: 'Distrito', enableCellEdit: false, minWidth: 90 },
        { field: "tipo_propiedad", minWidth: 80, displayName: "Propiedad" },
        { field: "zona", minWidth: 80 },
        { field: "tesorero_nombres", minWidth: 60 }
      ],
      onRegisterApi: function(gridApi) {
        $scope.grid1Api = gridApi;
        gridApi.edit.on.afterCellEdit($scope, function(rowEntity,colDef,newValue,oldValue) {
			if (newValue != oldValue) {
				if (colDef.field === "tipo") {
					newValue = newValue.toUpperCase();
					if (!(newValue === "IGLESIA" || newValue === "GRUPO")) {
						toastr.warning("Debe usar IGLESIA o GRUPO");
						rowEntity.tipo = oldValue;
						return;
					}
				}
				ConexionServ.query("UPDATE iglesias SET "+colDef.field+"='"+newValue+"', modificado=1 WHERE rowid=?", [ rowEntity.rowid ] ).then(function(r) {
					return toastr.success("Iglesia actualizada con éxito");
				}, function(r2) {
					rowEntity[colDef.field] = oldValue;
					return toastr.error("Cambio no guardado", "Error");
				});
			}
        });
        $timeout(function() {
          $scope.$apply();
        }, 0);
      }
    };

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
				toastr.success("Se ha creado un nuevo Distrito Exitosamente.");
				$scope.guardando_distrito 	= false;
				$scope.verCrearDistrito 	= false;
			},function(tx) {
				console.log("Error no es posbile traer Distritos", tx);
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
			// Traemos USUARIOS
			consulta = "SELECT rowid, nombres, apellidos, sexo, tipo, celular, username from usuarios";

			ConexionServ.query(consulta, []).then(function(result) {
				$scope.usuarios = result;
			},function(tx) {
				console.log("Error no es posbile traer usuarios", tx);
			});

			// Traemos IGLESIAS
			$scope.consulta_igle =
				"SELECT i.rowid, i.nombre, i.alias, i.distrito_id, i.zona, d.nombre as distrito_nombre, i.tesorero_id, i.secretario_id, " +
					"t.nombres as tesorero_nombres, t.apellidos as tesorero_apellidos, i.tipo, " + 
					"i.tipo_propiedad, i.anombre_propiedad, i.fecha_propiedad, i.fecha_fin, " + 
					"i.tipo_propiedad2, i.anombre_propiedad2, i.fecha_propiedad2, i.fecha_fin2, " + 
					"i.tipo_propiedad3, i.anombre_propiedad3, i.fecha_propiedad3, i.fecha_fin3 " + 
				"FROM iglesias i " +
				"LEFT JOIN distritos d ON d.rowid=i.distrito_id " +
				"LEFT JOIN usuarios t ON t.tipo='Tesorero' and t.rowid=i.tesorero_id " + 
				"where i.eliminado is null or i.eliminado=='0'";

			ConexionServ.query($scope.consulta_igle, []).then(function(result) {
				$scope.iglesias = result;
				$scope.gridOptions.data = result;
			}, function(tx) {
				console.log("Error no es posbile traer iglesias", tx);
			});

			// Traemos DISTRITOS
			consulta = "SELECT d.rowid, d.*, p.nombres as pastor_nombres, p.apellidos as pastor_apellidos, " +
					"p.nombres as pastor_nombres, p.apellidos as pastor_apellidos, " +
					"t.nombres as tesorero_nombres, t.apellidos as tesorero_apellidos " +
				"FROM distritos d " +
				"LEFT JOIN usuarios t ON t.tipo='Tesorero' and t.rowid=d.tesorero_id " +
				"LEFT JOIN usuarios p ON p.tipo='Pastor' and p.rowid=d.pastor_id  where d.eliminado = '0'";


			ConexionServ.query(consulta, []).then(function(result) {
				$scope.distritos = result;
			}, function(tx) {
				console.log("Error no es posbile traer distritos", tx);
			});

			// Traemos Uniones
			consulta = "SELECT rowid, nombre, alias, codigo, division_id from uniones  where eliminado ='0'";

			ConexionServ.query(consulta, []).then(function(result) {
				$scope.uniones = result;
			}, function(tx) {
				console.log("Error no es posbile traer Uniones", tx);
			});

			// Traemos Asociaciones
			consulta = "SELECT aso.rowid, aso.* , un.nombre as nombre_union  from asociaciones  aso INNER JOIN uniones un ON aso.union_id = un.rowid  WHERE aso.eliminado=0 ";

			ConexionServ.query(consulta, []).then(function(result) {
				$scope.asociaciones = result;
				console.log('asociaciones',	$scope.asociaciones)
			}, function(tx) {
				console.log("Error no es posbile traer asociaciones", tx);
			});
    };

    $scope.traerDatos();

    $scope.Insertentidad = function(entidad_crear) {
			consulta = "INSERT INTO entidades(nombres, alias, pastor, celular) VALUES(?, ?, ?, ?) ";
			ConexionServ.query(consulta, [entidad_crear.nombres,entidad_crear.alias,entidad_crear.pastor,entidad_crear.celular]).then(function(result) {
				console.log("entidad creada", result);
				toastr.success("Entidad creada exitosamente");
			}, function(tx) {
				console.log("entidad no se pudo crear", tx);
			});
    };

    $scope.actuentidad = function(entidad_cambiar) {
			consulta = "UPDATE entidades SET nombres=?, alias=?, pastor=?, celular=?, modificado=? WHERE rowid=? ";
			ConexionServ.query(consulta, [entidad_cambiar.nombres, entidad_cambiar.alias, entidad_cambiar.pastor,entidad_cambiar.celular, 1, entidad_cambiar.rowid]).then(function(result) {
				console.log("entidad Actualizada", result);
			}, function(tx) {
				console.log("entidad no se pudo actualizar", tx);
			});
    };

    $scope.eliminarentidad = function(entidad) {
			consulta = "DELETE FROM entidades WHERE rowid=? ";

			ConexionServ.query(consulta, [entidad.rowid]).then(function(result) {
				console.log("entidad eliminida", result);
				$scope.entidades = $filter("filter")($scope.entidades, {rowid: "!" + entidad.rowid});
			}, function(tx) {
				console.log("Entidad no se pudo Eliminar", tx);
			});
    };

    $scope.EliminarDistrito = function(distrito) {
			var res = confirm("¿Seguro que desea eliminar ? ");

		if (res == true) {
			consulta = "UPDATE  distritos SET eliminado=? WHERE rowid=? ";
		ConexionServ.query(consulta, ['1', distrito.rowid]).then( function(result) {
			console.log("distrito Eliminada", result);
			toastr.success("distrito eliminado Exitosamente.");
		},function(tx) {
			toastr.info("El distrito que intenta eliminar no se pudo eliminar.");
		});
	}
    };

    $scope.VerActualizarDistrito = function(distrito) {
			$scope.VerActualizandoDistrito = true;

			$scope.distrito_new_distric = distrito;

			for (var i = 0; i < $scope.usuarios.length; i++) {
				if (distrito.pastor_id == $scope.usuarios[i].rowid) {
					$scope.distrito_new_distric.pastor = $scope.usuarios[i];
				}
				if (distrito.tesorero_id == $scope.usuarios[i].rowid) {
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
			console.log(distrito);
			consulta = "UPDATE distritos SET nombre=?, alias=?, codigo=?, zona=?, pastor_id=?, tesorero_id=?, modificado=? WHERE rowid=? ";
			ConexionServ.query(consulta, [distrito.nombre, distrito.alias, distrito.codigo, distrito.zona, pastor_id, tesorero_id, '1', distrito.rowid]).then( function(result) {
				console.log("Distrito Actualizado", result);
				toastr.success("Distrito Actualizado Exitosamente.");
				$scope.VerActualizandoDistrito = false;
			}, function(tx) {
				console.log("Distrito no se pudo actualizar", tx);
				toastr.info("Distrito no se pudo actualizar.");
			});
    };

    $scope.Cancelar_Actualizar_Distrito = function() {
      	$scope.VerActualizandoDistrito = false;
    };

    $scope.ActualizarIglesia = function(iglesia) {
			$scope.guardando_iglesia = true;
			
			if (iglesia.fecha_propiedad) { iglesia.fecha_propiedad_new = window.fixDate(iglesia.fecha_propiedad); }
			if (iglesia.fecha_fin) { iglesia.fecha_fin_new 		= window.fixDate(iglesia.fecha_fin); }
			
			if (iglesia.fecha_propiedad2) { iglesia.fecha_propiedad_new2 = window.fixDate(iglesia.fecha_propiedad2); }
			if (iglesia.fecha_fin2) { iglesia.fecha_fin_new2 		= window.fixDate(iglesia.fecha_fin2); }
			
			if (iglesia.fecha_propiedad3) { iglesia.fecha_propiedad_new3 = window.fixDate(iglesia.fecha_propiedad3); }
			if (iglesia.fecha_fin3) { iglesia.fecha_fin_new3 		= window.fixDate(iglesia.fecha_fin3); }
			
			
			distrito_id = null;
			if (iglesia.distrito) {
				distrito_id 		= iglesia.distrito.rowid;
			}
			teso_id = null;
			if (iglesia.tesorero) {
				teso_id 		= iglesia.tesorero.rowid;
			}

			consulta = "UPDATE iglesias SET nombre=?, alias=?,  distrito_id=?, zona=?, tesorero_id=?, codigo=?, tipo=?, tipo_propiedad=?, anombre_propiedad=?, fecha_propiedad=?, fecha_fin=?, " + 
					"tipo_propiedad2=?, anombre_propiedad2=?, fecha_propiedad2=?, fecha_fin2=?, tipo_propiedad3=?, anombre_propiedad3=?, fecha_propiedad3=?, fecha_fin3=?, modificado=1 " +
				"WHERE rowid=? ";
			ConexionServ.query(consulta, [iglesia.nombre, iglesia.alias, distrito_id, iglesia.zona, teso_id, iglesia.codigo, iglesia.tipo, iglesia.tipo_propiedad, iglesia.anombre_propiedad, iglesia.fecha_propiedad, iglesia.fecha_fin, 
				iglesia.tipo_propiedad2, iglesia.anombre_propiedad2, iglesia.fecha_propiedad2, iglesia.fecha_fin2, 
				iglesia.tipo_propiedad3, iglesia.anombre_propiedad3, iglesia.fecha_propiedad3, iglesia.fecha_fin3, iglesia.modificado, iglesia.rowid 
			]).then(function(result) {
				console.log("Iglesia Actualizado", result);
				toastr.success("Iglesia Actualizado Exitosamente.");
				$scope.guardando_iglesia 		= false;
				$scope.ver_Actualizando_iglesia = false;
			}, function(tx) {
				console.log("Iglesia no se pudo actualizar", tx);
				toastr.info("Iglesia no se pudo actualizar.");
				$scope.guardando_iglesia = false;
			});
    };

    $scope.Cancelar_Actualizar_Iglesia = function() {
      	$scope.ver_Actualizando_iglesia = false;
    };

    $scope.Ver_actualizar_iglesia = function(iglesia) {
			console.log(iglesia);
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
			if ($scope.iglesia_edit.fecha_propiedad)
				$scope.iglesia_edit.fecha_propiedad 	= new Date($scope.iglesia_edit.fecha_propiedad);
			if ($scope.iglesia_edit.fecha_fin)
				$scope.iglesia_edit.fecha_fin 			= new Date($scope.iglesia_edit.fecha_fin);
			if ($scope.iglesia_edit.fecha_propiedad2)
				$scope.iglesia_edit.fecha_propiedad2 	= new Date($scope.iglesia_edit.fecha_propiedad2);
			if ($scope.iglesia_edit.fecha_fin2)
				$scope.iglesia_edit.fecha_fin2 			= new Date($scope.iglesia_edit.fecha_fin2);
			if ($scope.iglesia_edit.fecha_propiedad3)
				$scope.iglesia_edit.fecha_propiedad3 	= new Date($scope.iglesia_edit.fecha_propiedad3);
			if ($scope.iglesia_edit.fecha_fin3)
				$scope.iglesia_edit.fecha_fin3 			= new Date($scope.iglesia_edit.fecha_fin3);

			$timeout(function() {
				$location.hash("editar-iglesia");
				$anchorScroll();
			}, 100);
    };

    $scope.EliminarIglesia = function(iglesia) {
		var res = confirm("¿Seguro que desea eliminar ? ");

		if (res == true) {
			consulta = "UPDATE  iglesias SET eliminado=? WHERE rowid=? ";
			ConexionServ.query(consulta, ['1', iglesia.rowid]).then( function(result) {
				console.log("iglesia Eliminada", result);
				toastr.success("iglesia Eliminada Exitosamente.");
			},function(tx) {
				toastr.info("La iglesia que intenta eliminar no se pudo eliminar.");
			});
		}
			
    };

    $scope.CrearIglesia_insertar = function(iglesia) {

		$scope.guardando_iglesia = true;
		
		if (iglesia.fecha_propiedad) { iglesia.fecha_propiedad_new = window.fixDate(iglesia.fecha_propiedad); }
		if (iglesia.fecha_fin) { iglesia.fecha_fin_new 		= window.fixDate(iglesia.fecha_fin); }
		
		if (iglesia.fecha_propiedad2) { iglesia.fecha_propiedad_new2 = window.fixDate(iglesia.fecha_propiedad2); }
		if (iglesia.fecha_fin2) { iglesia.fecha_fin_new2 		= window.fixDate(iglesia.fecha_fin2); }
		
		if (iglesia.fecha_propiedad3) { iglesia.fecha_propiedad_new3 = window.fixDate(iglesia.fecha_propiedad3); }
		if (iglesia.fecha_fin3) { iglesia.fecha_fin_new3 		= window.fixDate(iglesia.fecha_fin3); }
		
		distrito_id = null;
		if (iglesia.distrito) {
			distrito_id 		= iglesia.distrito.rowid;
		}
		teso_id = null;
		if (iglesia.tesorero) {
			teso_id 		= iglesia.tesorero.rowid;
		}
		
		
		consulta = "INSERT INTO iglesias(nombre, alias, distrito_id, zona, tesorero_id, tipo_propiedad, anombre_propiedad, fecha_propiedad, fecha_fin, tipo_propiedad2, anombre_propiedad2, fecha_propiedad2, fecha_fin2, tipo_propiedad3, anombre_propiedad3, fecha_propiedad3, fecha_fin3) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

		ConexionServ.query(consulta, [ iglesia.nombre, iglesia.alias, distrito_id, iglesia.zona, teso_id, iglesia.tipo_propiedad, iglesia.anombre_propiedad, iglesia.fecha_propiedad_new, iglesia.fecha_fin_new, iglesia.tipo_propiedad2, iglesia.anombre_propiedad2, iglesia.fecha_propiedad_new2, iglesia.fecha_fin_new2, iglesia.tipo_propiedad3, iglesia.anombre_propiedad3, iglesia.fecha_propiedad_new3, iglesia.fecha_fin_new3]).then(function(result) {
			$scope.traerDatos();
			toastr.success("Iglesia creada exitosamente.");
			$scope.guardando_iglesia 	= false;
			$scope.ver_creando_iglesia 	= false;
		}, function(tx) {
			console.log("Error al guardar iglesia", tx);
			toastr.success("Error al guardar iglesia.");
			$scope.guardando_iglesia 	= false;
			$scope.ver_creando_iglesia 	= false;
		});
    };

    $scope.VerCreandoIglesia = function() {
		$scope.ver_creando_iglesia = true;

		$timeout(function() {
			$location.hash("nueva_new_new_iglesia");
			$anchorScroll();
		}, 100);
    };

    $scope.cancelar_crear_iglesia = function() {
		$scope.ver_creando_iglesia = false;
		$scope.iglesia_new = angular.copy($scope.tpl_igle);
    };

    $scope.inserter_union = function(creatar_union) {
		consulta = "INSERT INTO uniones(nombre, alias, codigo) VALUES(?,?,?)";

		ConexionServ.query(consulta, [creatar_union.nombre, creatar_union.alias, creatar_union.codigo]).then(function(result) {
			$scope.traerDatos();
			toastr.success("Se ha creado una Nueva Union Exitosamente.");
		}, function(tx) {
			console.log("Error no es posbile traer Uniones", tx);
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
		consulta = "UPDATE  uniones SET nombre=?, alias=?, codigo=?, modificado=? WHERE rowid=? ";
		ConexionServ.query(consulta, [ actuali_union.nombre, actuali_union.alias, actuali_union.codigo, '1', actuali_union.rowid ]).then( function(result) {
			console.log("Union Actualizada", result);
			toastr.success("Union Actualizada Exitosamente.");
		},function(tx) {
			toastr.info("La Union que intenta actualizar no se pudo actualizar.");
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
			consulta = "UPDATE  uniones SET eliminado=? WHERE rowid=? ";
		ConexionServ.query(consulta, ['1', union.rowid]).then( function(result) {
			console.log("Union Eliminada", result);
			toastr.success("Union Eliminada Exitosamente.");
		},function(tx) {
			toastr.info("La Union que intenta eliminar no se pudo actualizar.");
		});
	}
    };

    $scope.Insertar_asociaciones = function(creater_asociaciones) {
		console.log(creater_asociaciones, 'bruto');

		consulta = "INSERT INTO asociaciones(nombre, alias, codigo, union_id) VALUES(?,?,?,?)";

		ConexionServ.query(consulta, [ creater_asociaciones.nombre, creater_asociaciones.alias, creater_asociaciones.codigo, creater_asociaciones.union.rowid ]).then( function(result) {
			$scope.traerDatos();
			toastr.success("Se ha creado una Nueva asocación  Exitosamente.");
		}, function(tx) {
			console.log("Error no es posbile traer asocaciones", tx);
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
			consulta = "UPDATE  asociaciones SET eliminado=? WHERE rowid=? ";
		ConexionServ.query(consulta, ['1', asociation.rowid]).then( function(result) {
			console.log("asociacion Eliminada", result);
			toastr.success("asociacion Eliminada Exitosamente.");
		},function(tx) {
			toastr.info("La Union que intenta eliminar no se pudo actualizar.");
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
		consulta = "UPDATE  asociaciones SET nombre=?, alias=?, codigo=?, union_id=?, modificado=?  WHERE rowid=? ";
		ConexionServ.query(consulta, [ actuali_asociation.nombre, actuali_asociation.alias, actuali_asociation.codigo, actuali_asociation.union.rowid, '1', actuali_asociation.rowid,]).then( function(result) {
			console.log("Asocacion Actualizada", result);
			toastr.success("Asociación Actualizada Exitosamente.");
		}, function(tx) {
			toastr.info("La Asociación que intenta actualizar no se pudo actualizar.");
		});
    };

    $scope.CancelarVerActualizarAsociaciones = function() {
      	$scope.VerActualizandoAsociaciones = false;
	};
	
	
})





.controller('RemoveIglesiaCtrl', ['$scope', '$uibModalInstance', 'elemento', 'toastr', 'ConexionServ', ($scope, $modalInstance, elemento, toastr, ConexionServ)=>{
	$scope.elemento = elemento;
	console.log('elemento', elemento);

	$scope.ok = ()=>{

		
		consulta = "DELETE FROM iglesias WHERE rowid=? ";

		ConexionServ.query(consulta, [elemento.rowid]).then(function(result) {
			console.log("Iglesia eliminada", elemento);
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
