angular.module("auditoriaApp")

.controller("RemesasCtrl", function($scope, AuthServ, ConexionServ, $filter, toastr, RemesasCrudFacto, $uibModal, Acentos) {
	/* Para grado once
	ConexionServ.query('SELECT * FROM USUARIOS').then(function(usuarios){
		for (let i = 0; i < usuarios.length; i++) {
			const usu = usuarios[i];
			consulta = 'SELECT * FROM asistencias WHERE usuario_id=?';
			ConexionServ.query(consulta, [usu.rowid]).then(function(asistencias){
				usu.asistencias = asistencias;
			})
		}
	})
	*/
	
	$scope.gridScope 								= $scope
	$scope.gridOptions 							= {};
	$scope.$parent.sidebar_active 	= false;
	$scope.ver_crear    						= false;
	$scope.hasUnionRole 						= AuthServ.hasUnionRole;
	$scope.hasDivisionRole 		    	= AuthServ.hasDivisionRole;
	$scope.remesa_crear 						= RemesasCrudFacto.template_new();
	
	$scope.verCreando = function() {
	  $scope.ver_crear = !$scope.ver_crear;
	};

	$scope.CancelarNuevo = function() {
		$scope.ver_crear        = false;
		$scope.remesa_crear     = RemesasCrudFacto.template_new();
	};
  
	$scope.CancelarEdicion = function() {
		$scope.ver_edit = false;
	};
  
	$scope.verActualizar = function(rem) {
		if (rem.fecha) {
			rem.fecha 		= new Date(rem.fecha);
		}
		
		$scope.ver_edit = !$scope.ver_edit;
		$scope.rem_editar = rem;
	};

	$scope.insertarRemesa = function(rem) {
		$scope.creando 			= true;
		rem.asociacion_id 	    = $scope.USER.asociacion_id;
		
		RemesasCrudFacto.insertar(rem).then(function(result) {

			toastr.success("Remesa creada.");
			$scope.ver_crear    	= false;
			$scope.creando 			= false;

			$scope.remesa_crear = RemesasCrudFacto.template_new();
			$scope.traerRemesas();
		}, function(tx) {
            toastr.error("Error creando Remesa.");
            $scope.creando 			= false;
		});
		
	  	
	};

	$scope.traerRemesas = function() {
		RemesasCrudFacto.traer().then(function(result){
			$scope.remesas 			= result;
            $scope.gridOptions.data 	= $scope.remesas;
		}, function(){
			toastr.error('No se pudo descargar remesas');
		});
	};
	

	$scope.traerRemesas();

	

	$scope.actUsers = function(usu) {
		$scope.guardando_cambios = true;
		
		UsuariosFacto.actualizar(usu).then(function(result) {
			$scope.ver_edit_usu 		= false;
			$scope.guardando_cambios 	= false;
			toastr.success("Usuario actualizado correctamente");
		}, function(tx) {
			$scope.guardando_cambios = false;
			toastr.error("Usuario no se pudo actualizar");
		});
	};

	$scope.eliminar = function(rem) {
		
		modalInstance = $uibModal.open({
			templateUrl: 'templates/usuarios/removeUsuario.html',
			controller: 'RemoveRemesaCtrl',
			resolve: {
				elemento: ()=> rem
			}
		})
		modalInstance.result.then( (rem)=>{
			dato = { id: "!" + rem.id };
			console.log(dato, rem, $scope.gridOptions.data);
			$scope.gridOptions.data = $filter("filter")($scope.gridOptions.data, dato);
		})
	};



	btGrid1 = '<a uib-tooltip="Editar" tooltip-append-to-body="true" tooltip-placement="left" class="btn btn-default btn-xs icon-only info" ng-click="grid.appScope.verActualizar(row.entity)"><i class="glyphicon glyphicon-edit "></i></a>'
	btGrid2 = '<a uib-tooltip="X Eliminar" tooltip-append-to-body="true" tooltip-placement="right" class="btn btn-default btn-xs icon-only danger" ng-click="grid.appScope.eliminar(row.entity)"><i class="glyphicon glyphicon-trash "></i></a>';
	bt2 = '<span style="padding-left: 2px; padding-top: 4px;" class="btn-group">' +
		 btGrid2 + "</span>";
	

	
	$scope.gridOptions = {
		showGridFooter: true,
		enableSorting: true,
		enableFiltering: true,
		exporterSuppressColumns: ["edicion"],
		exporterCsvColumnSeparator: ";",
		exporterMenuPdf: false,
		exporterMenuExcel: false,
		exporterCsvFilename: "Usuarios - Auditorias.csv",
		enableGridMenu: true,
		enebleGridColumnMenu: false,
		enableCellEditOnFocus: true,
		columnDefs: [
			{ name: "edicion", displayName: "Edit", width: 50, enableSorting: false, enableFiltering: false, cellTemplate: bt2, enableCellEdit: false, enableColumnMenu: true },
            { field: "id", minWidth: 50, enableCellEdit: false },
            { field: "num_diario", minWidth: 100, type: 'number' },
			{ field: "linea", displayName: "Línea", width: 60, type: 'number' },
			{ field: "tipo_diario", minWidth: 55 },
			{ field: "num_secuencia", minWidth: 100 },
            { field: "periodo", minWidth: 90 },
            { field: "fecha", minWidth: 90 },
            { field: "referencia", minWidth: 140 },
            { field: "cod_cuenta", minWidth: 100, type: 'number' },
            { field: "nombre_cuenta", minWidth: 140 },
            { field: "descripcion_transaccion", minWidth: 140 },
            { field: "cantidad", minWidth: 100 },
            { field: "iva", minWidth: 40 },
            { field: "moneda", minWidth: 70 },
            { field: "recurso", minWidth: 90 },
            { field: "funcion", minWidth: 120 },
            { field: "restr", minWidth: 40, type: 'number' },
            { field: "org_id", minWidth: 100 },
            { field: "empleados", minWidth: 80, type: 'number' },
            { field: "concepto", minWidth: 120 }
		],
		multiSelect: false,
		exporterFieldCallback: function(grid, row, col, input) {
		if (col.name === "no") {
			return ( grid.renderContainers.body.visibleRowCache.indexOf(row) + 1 );
		}
		},
		onRegisterApi: function(gridApi) {
		$scope.gridApi = gridApi;
		return gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
			if (newValue !== oldValue) {
				
				RemesasCrudFacto.actualizar_campo(colDef.field, newValue, rowEntity.rowid || rowEntity.id).then(function(r) {
					return toastr.success("Usuario actualizado");
				}, function(r2) {
					rowEntity[colDef.field] = oldValue;
					return toastr.error("Cambio no guardado", "Error");
				});
			}
		});
		}
	};
	
	$scope.cambiaUsernameCheck = function(texto) {
		$scope.verificandoUsername = true;
		return ConexionServ.query('SELECT * FROM usuarios WHERE username like "%'+texto+'%"').then(function(result) {
			$scope.username_match = result;
			$scope.verificandoUsername = false;
			return $scope.username_match.map(function(item) {
				return item.username;
			});
		});
	};
	
	$scope.resetPass = function(row) {
		var modalInstance;
		modalInstance = $uibModal.open({
		  templateUrl: 'templates/usuarios/resetPass.html',
		  controller: 'ResetPassCtrl',
		  resolve: {
			usuario: function() {
			  return row;
			}
		  }
		});
		return modalInstance.result.then(function(user) {});
	};
})



.controller('ResetPassCtrl', function($scope, $uibModalInstance, usuario, ConexionServ, toastr, UsuariosFacto){
	$scope.usuario 		= usuario;
	$scope.newpassword 	= '';
	$scope.showPassword = false;

	$scope.ok = function(){
		UsuariosFacto.actualizar_campo('password', $scope.newpassword, usuario.rowid || usuario.id).then((r)=>{
			toastr.success('Contraseña cambiada.')
		}, function(r2){
			toastr.warning('No se pudo cambiar contraseña.', 'Problema')
		})
		$uibModalInstance.close(usuario)
	}
	
	$scope.cancel = function(){
		$uibModalInstance.dismiss('cancel')
	}

})



.controller('RemoveRemesaCtrl', ['$scope', '$uibModalInstance', 'elemento', 'RemesasCrudFacto', ($scope, $modalInstance, elemento, RemesasCrudFacto)=>{
	$scope.elemento = elemento;
	
	$scope.ok = ()=>{

		RemesasCrudFacto.eliminar(elemento.rowid || elemento.id, elemento.id).then(function(result) {
			console.log("Remesa eliminada", elemento);
			$modalInstance.close(elemento)
		}, function(tx) {
			console.log("Remesa no se pudo Eliminar", tx);
			$modalInstance.dismiss('Error')
		})
		
	}
	
	$scope.cancel = ()=>{
		$modalInstance.dismiss('cancel')
	}

}])

