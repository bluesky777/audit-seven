

angular.module("auditoriaApp")

.directive('destinosSyncDir',['toastr', function(toastr){
	return {
		restrict: 'E',
		templateUrl: "templates/Sincronizacion/destinosSyncDir.html"
	}
}])

.controller("sincronizacionCtrl", function($scope, ConexionServ, DescargarTodoServ, toastr, AuthServ, $anchorScroll, $timeout, $uibModal,  $http, rutaServidor, SincronizarServ) {
	$scope.entidades 				= true;
    $scope.distrito_new 			= {};
    $scope.modentidades 			= false;
    $scope.verCrearDistrito 		= false;
	$scope.usuarios 				= [];
	$scope.$parent.sidebar_active 	= false;
	$scope.datos_eliminados 		= false;
	
	
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
	$scope.ver_usuarios     = false;
	$scope.ver_auditorias 	= false;
	$scope.ver_libromes 	= false;
	$scope.ver_preguntas 	= false;
	$scope.ver_respuestas 	= false;
	$scope.ver_recomendaciones 	= false;
	
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
	$scope.toggleusuarios = ()=>{
		$scope.ver_usuarios = !$scope.ver_usuarios;
	}
	$scope.toggleauditorias = ()=>{
		$scope.ver_auditorias = !$scope.ver_auditorias;
	}
	$scope.togglelibromes = ()=>{
		$scope.ver_libromes = !$scope.ver_libromes;
	}
	$scope.togglepreguntas = ()=>{
		$scope.ver_preguntas = !$scope.ver_preguntas;
	}
	$scope.togglerespuestas = ()=>{
		$scope.ver_respuestas = !$scope.ver_respuestas;
	}
	$scope.togglerecomendaciones = ()=>{
		$scope.ver_recomendaciones = !$scope.ver_recomendaciones;
	}
	$scope.toggleDestinos = ()=>{
		$scope.ver_destinos = !$scope.ver_destinos;
	}
	

    btGrid1 ='<a uib-tooltip="Editar" ng-show="row.entity.modificado" tooltip-placement="left" tooltip-append-to-body="true" class="btn btn-default btn-xs icon-only" ng-click="grid.appScope.subir_datos({iglesias: [row.entity]} )"><i class="glyphicon glyphicon-pencil "></i></a>';
    btGrid2 ='<a uib-tooltip=" Eliminar" ng-show="row.entity.eliminado" tooltip-placement="right" tooltip-append-to-body="true" class="btn btn-danger btn-xs icon-only" ng-click="grid.appScope.subir_datos({iglesias: [row.entity]} )"><i class="glyphicon glyphicon-remove  "></i></a>';
    bt2 ='<span style="padding-left: 2px; padding-top: 4px;" class="btn-group">' + btGrid1 +btGrid2 +"</span>";

    $scope.gridOptions = {
      showGridFooter: true,
      enableSorting: true,
      enableFiltering: true,
      enebleGridColumnMenu: false,
      enableCellEdit: false,
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
        { field: "zona", minWidth: 80 }
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
				ConexionServ.query("UPDATE iglesias SET "+colDef.field+"='"+newValue+"' WHERE rowid=?", [ rowEntity.rowid ] ).then(function(r) {
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

	

    $scope.subir_datos = function (elemento){
    	
    	datos = {};

    	if (elemento) {
			datos = elemento;
    	}else{
    		datos = {
    			iglesias: 			$scope.iglesias,
    			distritos: 			$scope.distritos,
    			asociaciones: 		$scope.asociaciones,
    			auditorias: 		$scope.auditorias,
    			uniones: 			$scope.uniones,
    			usuarios: 			$scope.usuarios,
    			lib_mensuales: 		$scope.lib_mensuales,
    			lib_semanales: 		$scope.lib_semanales,
    			gastos_mes: 		$scope.gastos_mes,
    			preguntas: 			$scope.preguntas,
    			respuestas: 		$scope.respuestas,
    			recomendaciones: 	$scope.recomendaciones
    		};
    	}

		$http.put(rutaServidor.ruta + '/subir-datos', datos).then (function(r){

			r = r.data;
			SincronizarServ.uniones(r.uniones);
			SincronizarServ.asociaciones(r.asociaciones);
			SincronizarServ.distritos(r.distritos);
            SincronizarServ.iglesias(r.iglesias);
            SincronizarServ.usuarios(r.usuarios);
            SincronizarServ.auditorias(r.auditorias);
            SincronizarServ.lib_mensuales(r.lib_mensuales);
            SincronizarServ.lib_semanales(r.lib_semanales);
            SincronizarServ.gastos_meses(r.gastos_mes);
            SincronizarServ.preguntas(r.preguntas);
            SincronizarServ.respuestas(r.respuestas);
            SincronizarServ.recomendaciones(r.recomendaciones);


			 toastr.success('Datos subidos');
		}, function(){
			toastr.error('No se pudo subir datos');
		})
	}

	

    $scope.eliminar_datos_locales = function (elemento){
		
		res = confirm('¿Seguro que desea eliminar los datos locales? (no afecta la nube)');
		
		if(res){
			$scope.datos_eliminados = false;
		
			promesas = [];
			
			prom = ConexionServ.query('DROP TABLE auditorias')
			prom.then(function(result){
				console.log('Eliminado auditorias');
			});
			promesas.push(prom);
			prom = ConexionServ.query('DROP TABLE iglesias').then(function(result){
				console.log('Eliminado iglesias');
			});
			promesas.push(prom);
			prom = ConexionServ.query('DROP TABLE uniones').then(function(result){
				console.log('Eliminado uniones');
			});
			promesas.push(prom);
			prom = ConexionServ.query('DROP TABLE distritos').then(function(result){
				console.log('Eliminado distritos');
			});
			promesas.push(prom);
			prom = ConexionServ.query('DROP TABLE asociaciones').then(function(result){
				console.log('Eliminado asociaciones');
			});
			promesas.push(prom);
			prom = ConexionServ.query('DROP TABLE usuarios').then(function(result){
				console.log('Eliminado usuarios');
			});
			promesas.push(prom);
			prom = ConexionServ.query('DROP TABLE lib_mensuales').then(function(result){
				console.log('Eliminado lib_mensuales');
			});
			promesas.push(prom);
			prom = ConexionServ.query('DROP TABLE lib_semanales').then(function(result){
				console.log('Eliminado lib_semanales');
			});
			promesas.push(prom);
			prom = ConexionServ.query('DROP TABLE recomendaciones').then(function(result){
				console.log('Eliminado recomendaciones');
			});
			promesas.push(prom);
			prom = ConexionServ.query('DROP TABLE preguntas').then(function(result){
				console.log('Eliminado preguntas');
			});
			promesas.push(prom);
			prom = ConexionServ.query('DROP TABLE respuestas').then(function(result){
				console.log('Eliminado respuestas');
			});
			promesas.push(prom);
			prom = ConexionServ.query('DROP TABLE dinero_efectivo').then(function(result){
				console.log('Eliminado dinero_efectivo');
			});
			promesas.push(prom);
			prom = ConexionServ.query('DROP TABLE destinos').then(function(result){
				console.log('Eliminado destinos');
			});
			promesas.push(prom);
			prom = ConexionServ.query('DROP TABLE destinos_pagos').then(function(result){
				console.log('Eliminado destinos_pagos');
			});
			promesas.push(prom);
			prom = ConexionServ.query('DROP TABLE gastos_mes').then(function(result){
				console.log('Eliminado gastos_mes');
			})
			promesas.push(prom);
			prom = ConexionServ.query('DROP TABLE remesas').then(function(result){
				console.log('Eliminado remesas');
			})
			promesas.push(prom);
			
			Promise.all(promesas).then(function(result){
				$scope.datos_eliminados = true;
				toastr.success('Tablas borradas.');
			})
		}
		
	}
	
	

    $scope.descargar_datos = function (elemento){
		
		if (!$scope.datos_eliminados) {
			toastr.info('Primero debes eliminar los datos locales');
			return;
		}
		
		$scope.estado_descarga = 'Descargando';
    	
		$http.get(rutaServidor.ruta + '/all', {params: {username: $scope.USER.username, password: $scope.USER.password}}).then (function(result){
			$scope.estado_descarga = 'insertando';
			
			$scope.valor_insertado 	= function(){
				return DescargarTodoServ._valor_insertado;
			};
			$scope.valor_maximo 	= function(){
				return DescargarTodoServ._valor_maximo;
			};
			
			ConexionServ.createTables().then(function(){
				toastr.info('Datos descargados.', 'Tablas creadas.');
				
				DescargarTodoServ.insertar_datos_descargados(result.data).then(function(result){
					$scope.estado_descarga = 'Insertados';
					console.log('Todas los datos Insertados', result);
				})
			})
			
			

		}), function(){
			console.log('error db')
		}

	}


    // Traemos todos los datos que necesito para trabajar
    $scope.traerDatos = function() {
			// Traemos USUARIOS
			consulta = "SELECT count(*) as cant FROM sqlite_master WHERE type='table' AND name='usuarios'";
			
			ConexionServ.query(consulta, []).then(function(result) {
				cant = result[0].cant;
				if (cant==0) {
					AuthServ.cerrar_sesion();
				}
			},function(tx) {
				console.log("Error no es posbile verificar si existe la tabla usuarios", tx);
			});

			
			
			consulta = "SELECT rowid, * from usuarios where modificado=1 or eliminado=1 or id is null";

			ConexionServ.query(consulta, []).then(function(result) {
				$scope.usuarios = result;
			},function(tx) {
				console.log("Error no es posbile traer usuarios", tx);
			});

			// Traemos IGLESIAS
			$scope.consulta_igle =
				"SELECT i.rowid, i.* FROM iglesias i " +
				"where i.modificado= '1'  or eliminado=1  or i.id is null ";


				

			ConexionServ.query($scope.consulta_igle, []).then(function(result) {
				$scope.iglesias = result;
				$scope.gridOptions.data = result;
			}, function(tx) {
				console.log("Error no es posbile traer iglesias", tx);
			});

			// Traemos DISTRITOS
			consulta = "SELECT d.rowid, d.* from distritos d WHERE d.modificado is not null or eliminado is not null or id is null " ;

			ConexionServ.query(consulta, []).then(function(result) {
				$scope.distritos = result;
			}, function(tx) {
				console.log("Error no es posbile traer distritos", tx);
			});

			// Traemos Uniones
			consulta = "SELECT rowid, * from uniones un WHERE un.modificado is not null or eliminado is not null or id is null";

			ConexionServ.query(consulta, []).then(function(result) {
				$scope.uniones = result;
			}, function(tx) {
				console.log("Error no es posbile traer Uniones", tx);
			});

			// Traemos Asociaciones
			consulta = "SELECT aso.rowid, aso.*  from asociaciones aso WHERE aso.modificado is not null or eliminado is not null or id is null ";

			ConexionServ.query(consulta, []).then(function(result) {
				$scope.asociaciones = result;
			}, function(tx) {
				console.log("Error no es posbile traer asociaciones", tx);
			});

			// Traemos Auditoria
			consulta = "SELECT rowid, * from auditorias WHERE auditorias.modificado is not null or auditorias.eliminado is not null or auditorias.id is null";

			ConexionServ.query(consulta, []).then(function(result) {
				$scope.auditorias = result;
			},function(tx) {
				console.log("Error no es posbile traer auditorias", tx);
			});


			consulta = "SELECT rowid, * from lib_mensuales libm WHERE libm.modificado is not null or libm.eliminado is not null or libm.id is null";

			ConexionServ.query(consulta, []).then(function(result) {
				$scope.lib_mensuales = result;
			},function(tx) {
				console.log("Error no es posbile traer libromes", tx);
			});

			
			consulta = "SELECT rowid, * from lib_semanales WHERE modificado is not null OR eliminado is not null OR id is null";

			ConexionServ.query(consulta, []).then(function(result) {
				$scope.lib_semanales = result;
			},function(tx) {
				console.log("Error no es posbile traer libro semanales", tx);
			});

			consulta = "SELECT rowid, * from preguntas preg WHERE preg.modificado is not null OR preg.eliminado is not null OR preg.id is null";

			ConexionServ.query(consulta, []).then(function(result) {
				$scope.preguntas = result;
			},function(tx) {
				console.log("Error no es posbile traer preguntas", tx);
			});

			consulta = "SELECT rowid, * from respuestas res WHERE res.modificado is not null or res.eliminado is not null or res.id is null ";

			ConexionServ.query(consulta, []).then(function(result) {
				$scope.respuestas = result;
			},function(tx) {
				console.log("Error no es posbile traer respuestas", tx);
			});

			consulta = "SELECT rowid, * from recomendaciones rec WHERE id is null or rec.modificado is not null or rec.eliminado is not null or rec.id is null ";
			ConexionServ.query(consulta, []).then(function(result) {
				$scope.recomendaciones = result;
			},function(tx) {
				console.log("Error no es posbile traer recomendaciones", tx);
			});

			consulta = "SELECT rowid, * from destinos rec WHERE id is null or rec.modificado is not null or rec.eliminado is not null or rec.id is null ";
			ConexionServ.query(consulta, []).then(function(result) {
				$scope.destinos = result;
			},function(tx) {
				console.log("Error no es posbile traer recomendaciones", tx);
			});
			
			consulta = "SELECT rowid, * from dinero_efectivo rec WHERE id is null or rec.modificado is not null or rec.eliminado is not null or rec.id is null ";
			ConexionServ.query(consulta, []).then(function(result) {
				$scope.dinero_efectivo = result;
			},function(tx) {
				console.log("Error no es posbile traer recomendaciones", tx);
			});


			consulta = "SELECT rowid, * from destinos_pagos rec WHERE id is null OR rec.modificado is not null OR rec.eliminado is not null OR rec.id is null ";
			ConexionServ.query(consulta, []).then(function(result) {
				$scope.destinos_pagos = result;
			},function(tx) {
				console.log("Error no es posbile traer recomendaciones", tx);
			});
			
			
			consulta = "SELECT rowid, * from gastos_mes WHERE id is null OR modificado is not null OR eliminado is not null OR id is null ";
			ConexionServ.query(consulta, []).then(function(result) {
				$scope.gastos_mes = result;
			},function(tx) {
				console.log("Error no es posbile traer recomendaciones", tx);
			});
			/*
			consulta = "SELECT rowid, * from respuestas where res.modificado is not null or res.elimiado is not null";

			ConexionServ.query(consulta, []).then(function(result) {
				$scope.respuestas = result;
			},function(tx) {
				console.log("Error no es posbile traer respuestas", tx);
			});*/
    };

	$scope.traerDatos();    
	
  

	
	
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
