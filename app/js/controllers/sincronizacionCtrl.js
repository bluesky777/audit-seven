

angular.module("auditoriaApp")

.controller("sincronizacionCtrl", function($scope, ConexionServ, $filter, toastr, $location, $anchorScroll, $timeout, $uibModal,  $http, rutaServidor, SincronizarServ) {
	$scope.entidades 				= true;
    $scope.distrito_new 			= {};
    $scope.modentidades 			= false;
    $scope.verCrearDistrito 		= false;
	$scope.usuarios 				= [];
	$scope.$parent.sidebar_active 	= false;
	
	
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
            SincronizarServ.preguntas(r.preguntas);
            SincronizarServ.respuestas(r.respuestas);
            SincronizarServ.recomendaciones(r.recomendaciones);


			 toastr.success('Datos subidos');
		}, function(){
			toastr.error('No se pudo subir datos');
		})
	}



    $scope.descargar_datos = function (elemento){
		
		$scope.estado_descarga = 'descargando';
    	
		$http.get(rutaServidor.ruta + '/all', {params: {username: $scope.USER.username, password: $scope.USER.password}}).then (function(result){
			$scope.estado_descarga = 'insertando';
			
			auditorias 		= result.data.auditorias;
			iglesias 		= result.data.iglesias;
			uniones 		= result.data.uniones;
			distritos 		= result.data.distritos;
			asociaciones 	= result.data.asociaciones;
			usuarios 		= result.data.usuarios;
			lib_mensuales 	= result.data.lib_mensuales;
			lib_semanales 	= result.data.lib_semanales;
			recomendaciones = result.data.recomendaciones;
			preguntas 		= result.data.preguntas;
			respuestas 		= result.data.respuestas;
			
			promesas 				= [];
			$scope.valor_insertado 	= 0;
			$scope.valor_maximo 	= auditorias.length + iglesias.length + uniones.length + distritos.length + 
				asociaciones.length + usuarios.length + lib_mensuales.length + lib_semanales.length + 
				recomendaciones.length + preguntas.length + respuestas.length;
			
				
				
			for (var i = 0; i < auditorias.length; i++) {
			 	
				consulta 	= 'INSERT INTO auditorias (rowid, id, fecha, saldo_ant, iglesia_id) VALUES(?, ?, ?, ?, ?)';
				prome 		= ConexionServ.query(consulta, [auditorias[i].id, auditorias[i].id, auditorias[i].fecha, auditorias[i].saldo_ant, auditorias[i].iglesia_id]);
				prome.then(function(result){
					$scope.valor_insertado++;
				}, function(tx){
					console.log('error', tx);
				});
				promesas.push(prome);
			}

			for (var i = 0; i < distritos.length; i++) {
 
				consulta 	= 'INSERT INTO distritos (rowid, id, nombre, alias, codigo, pastor_id) VALUES(?, ?, ?, ?, ?, ?)';
				prome 		= ConexionServ.query(consulta, [distritos[i].id, distritos[i].id, distritos[i].nombre, distritos[i].alias, distritos[i].codigo, distritos[i].pastor_id]).then(function(result){
					$scope.valor_insertado++;
				}, function(tx){
					console.log('error', tx);
				});
				promesas.push(prome);
			} 

			for (var i = 0; i < asociaciones.length; i++) {
			
				consulta 	= 'INSERT INTO asociaciones(rowid, id, nombre, alias, codigo, union_id) VALUES(?, ?, ?, ?, ?, ?)';
				prome 		= ConexionServ.query(consulta, [asociaciones[i].id, asociaciones[i].id, asociaciones[i].nombre, asociaciones[i].alias, asociaciones[i].codigo, asociaciones[i].union_id]);
				prome.then(function(result){
					$scope.valor_insertado++;
				}, function(tx){
					console.log('error', tx);
				});
				promesas.push(prome);
			} 
			
			
			ConexionServ.query('DELETE FROM usuarios').then(function(){
				for (var i = 0; i < usuarios.length; i++) {
					usu 		= usuarios[i];
					consulta 	= 'INSERT INTO usuarios(rowid, id, nombres, apellidos, sexo, username, password, email, fecha, tipo, celular) VALUES(?,?,?,?,?,?,?,?,?,?,?) ';
					prome 		= ConexionServ.query(consulta, [usu.id, usu.id, usu.nombres, usu.apellidos, usu.sexo, usu.username, usu.password, usu.email, usu.fecha_new, usu.tipo, usu.celular]);
					prome.then(function(result){
						$scope.valor_insertado++;
					}, function(tx){
						console.log('error', tx);
					});
					promesas.push(prome);
				} 
			})
			
			
			for (var i = 0; i < iglesias.length; i++) {

				consulta	= 'INSERT INTO iglesias (id, nombre, alias, codigo, distrito_id) VALUES(?, ?, ?, ?, ?)';
				prome 		= ConexionServ.query(consulta, [iglesias[i].id, iglesias[i].nombre, iglesias[i].alias, iglesias[i].codigo, iglesias[i].distrito_id]);
				prome.then(function(result){
					$scope.valor_insertado++;
				}, function(tx){
					console.log('error', tx);
				});
				promesas.push(prome);
			} 
			
			for (var i = 0; i < uniones.length; i++) {

				consulta 	= 'INSERT INTO uniones (id, nombre, alias, codigo) VALUES(?, ?, ?, ?)';
				prome 		= ConexionServ.query(consulta, [uniones[i].id, uniones[i].nombre, uniones[i].alias, uniones[i].codigo]);
				prome.then(function(result){
					$scope.valor_insertado++;
				}, function(tx){
					console.log('error', tx);
				});
				promesas.push(prome);
			} 
			
			for (var i = 0; i < lib_mensuales.length; i++) {
				lib 		= lib_mensuales[i];
				consulta	= 'INSERT INTO lib_mensuales(rowid, id, year, mes, orden, auditoria_id, diezmos, ofrendas, especiales, gastos, gastos_soportados, remesa_enviada) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)';
				prome 		= ConexionServ.query(consulta, [lib.id, lib.id, lib.year, lib.mes, lib.orden, lib.auditoria_id, lib.diezmos, lib.ofrendas, lib.especiales, lib.gastos, lib.gastos_soportados, lib.remesa_enviada]);
				prome.then(function(result){
					$scope.valor_insertado++;
				}, function(tx){
					console.log('error', tx);
				});
				promesas.push(prome);
			} 
			
			for (var i = 0; i < lib_semanales.length; i++) {
				lib 		= lib_semanales[i];
				consulta	= 'INSERT INTO lib_semanales(rowid, id, libro_mes_id, diezmo_1, ofrenda_1, especial_1, diezmo_2, ofrenda_2, especial_2, diezmo_3, ofrenda_3, especial_3, ' + 
					'diezmo_4, ofrenda_4, especial_4, diezmo_5, ofrenda_5, especial_5, diaconos_1, diaconos_2, diaconos_3, diaconos_4, diaconos_5, total_diezmos, total_ofrendas, total_especiales, por_total) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
				prome 		= ConexionServ.query(consulta, [lib.id, lib.id, lib.libro_mes_id, lib.diezmo_1, lib.ofrenda_1, lib.especial_1, lib.diezmo_2, lib.ofrenda_2, lib.especial_2, lib.diezmo_3, lib.ofrenda_3, lib.especial_3, 
					lib.diezmo_4, lib.ofrenda_4, lib.especial_4, lib.diezmo_5, lib.ofrenda_5, lib.especial_5, lib.diaconos_1, lib.diaconos_2, lib.diaconos_3, lib.diaconos_4, lib.diaconos_5, lib.total_diezmos, lib.total_ofrendas, lib.total_especiales, lib.por_total]);
					
				prome.then(function(result){
					$scope.valor_insertado++;
				}, function(tx){
					console.log('error', tx);
				});
				promesas.push(prome);
			} 
			

			for (var i = 0; i < recomendaciones.length; i++) {

				consulta 	= 'INSERT INTO recomendaciones (rowid, id, auditoria_id, recomendacion, justificacion, superada, fecha, modificado) VALUES(?, ?, ?, ?, ?, ?, 0)';
				prome 		= ConexionServ.query(consulta, [recomendaciones[i].id, recomendaciones[i].id, recomendaciones[i].auditoria_id, recomendaciones[i].recomendacion, recomendaciones[i].justificacion, recomendaciones[i].superada, recomendaciones[i].fecha]);
				prome.then(function(result){
					$scope.valor_insertado++;
				}, function(tx){
					console.log('error', tx);
				});
				promesas.push(prome);
			} 

			
			for (var i = 0; i < preguntas.length; i++) {
				rec 		= preguntas[i];
				consulta 	= 'INSERT INTO preguntas (rowid, id, definition, tipo, option1, option2, option3, option4) VALUES(?,?,?,?,?,?,?,?)';
				prome 		= ConexionServ.query(consulta, [rec.id, rec.id, rec.definition, rec.tipo, rec.option1, rec.option2, rec.option3, rec.option4]);
				prome.then(function(result){
					$scope.valor_insertado++;
				}, function(tx){
					console.log('error', tx);
				});
				promesas.push(prome);
			} 

			for (var i = 0; i < respuestas.length; i++) {
				rec 		= respuestas[i];
				consulta 	= 'INSERT INTO respuestas (rowid, id, pregunta_id, auditoria_id, respuestas) VALUES(?,?,?,?,?)';
				prome 		= ConexionServ.query(consulta, [rec.id, rec.id, rec.pregunta_id, rec.auditoria_id, rec.respuestas]);
				prome.then(function(result){
					$scope.valor_insertado++;
				}, function(tx){
					console.log('error', tx);
				});
				promesas.push(prome);
			} 

			
			Promise.all(promesas).then(function(result){
				$scope.estado_descarga = 'insertados';
				console.log('Todas los datos insertados', result);
				$scope.valor_insertado = $scope.valor_maximo;
			})
			

		}), function(){
			console.log('error db')
		}

	}


    // Traemos todos los datos que necesito para trabajar
    $scope.traerDatos = function() {
			// Traemos USUARIOS
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
			consulta = "SELECT d.rowid, d.* from distritos d WHERE d.modificado=1 or eliminado=1 or id is null " ;

			ConexionServ.query(consulta, []).then(function(result) {
				$scope.distritos = result;
			}, function(tx) {
				console.log("Error no es posbile traer distritos", tx);
			});

			// Traemos Uniones
			consulta = "SELECT rowid, * from uniones un WHERE un.modificado=1 or eliminado=1 or id is null";

			ConexionServ.query(consulta, []).then(function(result) {
				$scope.uniones = result;
			}, function(tx) {
				console.log("Error no es posbile traer Uniones", tx);
			});

			// Traemos Asociaciones
			consulta = "SELECT aso.rowid, aso.*  from asociaciones aso WHERE aso.modificado=1 or eliminado=1 or id is null ";

			ConexionServ.query(consulta, []).then(function(result) {
				$scope.asociaciones = result;
			}, function(tx) {
				console.log("Error no es posbile traer asociaciones", tx);
			});

			// Traemos Auditoria
			consulta = "SELECT rowid, * from auditorias where auditorias.modificado=1 or auditorias.eliminado=1 or auditorias.id is null";

			ConexionServ.query(consulta, []).then(function(result) {
				$scope.auditorias = result;
			},function(tx) {
				console.log("Error no es posbile traer auditorias", tx);
			});


			consulta = "SELECT rowid, * from lib_mensuales libm where libm.modificado=1 or libm.eliminado=1 or libm.id is null";

			ConexionServ.query(consulta, []).then(function(result) {
				$scope.lib_mensuales = result;
			},function(tx) {
				console.log("Error no es posbile traer libromes", tx);
			});

			consulta = "SELECT rowid, * from preguntas preg where preg.modificado=1 or preg.eliminado=1 or preg.id is null";

			ConexionServ.query(consulta, []).then(function(result) {
				$scope.preguntas = result;
			},function(tx) {
				console.log("Error no es posbile traer preguntas", tx);
			});

			consulta = "SELECT rowid, * from respuestas res where res.modificado=1 or res.eliminado=1 or res.id is null ";

			ConexionServ.query(consulta, []).then(function(result) {
				$scope.respuestas = result;
			},function(tx) {
				console.log("Error no es posbile traer respuestas", tx);
			});

			consulta = "SELECT rowid, * from recomendaciones rec where id is null or rec.modificado=1 or rec.eliminado=1 or rec.id is null ";

			ConexionServ.query(consulta, []).then(function(result) {
				$scope.recomendaciones = result;
			},function(tx) {
				console.log("Error no es posbile traer recomendaciones", tx);
			});


			/*
			consulta = "SELECT rowid, * from respuestas where res.modificado=1 or res.elimiado=1";

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
