angular.module("auditoriaApp")

.controller("usuariosCtrl", function($scope, ConexionServ, $state, toastr, UsuariosFacto, $uibModal, Acentos) {

	if ($scope.USER.tipo=='Pastor' || $scope.USER.tipo=='Tesorero') {
		toastr.warning('No tienes permiso para editar usuarios.');
		$state.go('panel');
		return
	}
	
	$scope.gridScope 				= $scope
	$scope.gridOptions 				= {};
	$scope.$parent.sidebar_active 	= false;
	$scope.ver_crear_usu 			= false;
	
	
	
	$scope.avatar = {
	  masculino: {
		abrev: "M",
		def: "Masculino",
		img: "img/male1.png"
	  },
	  femenino: {
		abrev: "F",
		def: "Femenino",
		img: "img/female1.png"
	  }
	};

	$scope.usuario_crear = {
	  sexo: "M",
	  tipo: "Pastor",
	  apellidos: "",
	  email: "",
	  celular: ""
	};
	
	$scope.verCreandoUsuario = function() {
	  $scope.ver_crear_usu = !$scope.ver_crear_usu;
	};

	$scope.CancelarNuevo = function() {
		$scope.ver_crear_usu = false;
		$scope.usuario_crear = {
		  sexo: "M",
		  tipo: "Pastor",
		  apellidos: "",
		  email: "",
		  celular: ""
		};
	};
  
	$scope.CancelarEdicion = function() {
		$scope.ver_edit_usu = false;
	};
  
	$scope.verActuaUsers = function(usuario) {
		if (usuario.fecha) {
			usuario.fecha 		= new Date(usuario.fecha);
		}
		
		$scope.ver_edit_usu = !$scope.ver_edit_usu;
		$scope.user_editars = usuario;
	};

	$scope.insertarUsuario = function(usu) {
		$scope.creando 			= true;
		usu.asociacion_id 	= $scope.USER.asociacion_id;
		usu.union_id 				= $scope.USER.union_id;
		
		UsuariosFacto.insertar(usu).then(function(result) {

			toastr.success("Usuario creado.");
			$scope.ver_crear_usu 	= false;
			$scope.creando 			= false;

			$scope.usuario_crear = {
				sexo: "M",
				tipo: "Pastor",
				apellidos: "",
				email: "",
				celular: ""
			};
			$scope.traerUsuarios();
		}, function(tx) {
			$scope.creando 			= false;
		});
		
	  	
	};

	$scope.traerUsuarios = function() {
		UsuariosFacto.traer($scope.USER.tipo).then(function(result){
			$scope.usuarios 			= result;
            $scope.gridOptions.data 	= $scope.usuarios;
		}, function(){
			toastr.error('No se pudo descargar usuarios');
		});
	};
	

	$scope.traerUsuarios();

	

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

	$scope.eliminarUser = function(user) {
		
		modalInstance = $uibModal.open({
			templateUrl: 'templates/usuarios/removeUsuario.html',
			controller: 'RemoveUsuarioCtrl',
			resolve: {
				elemento: ()=> user
			}
		})
		modalInstance.result.then( (usuario)=>{
			/*
			dato = { rowid: "!" + usuario.rowid };
			console.log(dato, usuario, $scope.gridOptions.data);
			$scope.gridOptions.data = $filter("filter")($scope.gridOptions.data, dato, true);
			*/
			$scope.traerUsuarios();
		})
	};



	btGrid1 = '<a uib-tooltip="Editar" tooltip-append-to-body="true" tooltip-placement="left" class="btn btn-default btn-xs icon-only info" ng-click="grid.appScope.verActuaUsers(row.entity)"><i class="glyphicon glyphicon-edit "></i></a>'
	btGrid2 = '<a uib-tooltip="X Eliminar" tooltip-append-to-body="true" tooltip-placement="right" class="btn btn-default btn-xs icon-only danger" ng-click="grid.appScope.eliminarUser(row.entity)"><i class="glyphicon glyphicon-trash "></i></a>';
	bt2 = '<span style="padding-left: 2px; padding-top: 4px;" class="btn-group">' +
		btGrid1 + btGrid2 + "</span>";
	btUsuario = "templates/usuarios/botonesResetPassword.html";
	btEditUsername = "templates/usuarios/botonEditUsername.html";

	
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
			{
				field: "no", pinnedLeft: true,
				cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>',
				width: 40, enableCellEdit: false
			},
			{ field: "rowid", displayName: "Id", pinnedLeft: true, width: 40, enableCellEdit: false },
			{
				field: "nombres", minWidth: 130, pinnedLeft: true,
				filter: {
					condition: Acentos.buscarEnGrid
				},
				enableHiding: false,
			},
			{ field: "apellidos", minWidth: 110, filter: { condition: Acentos.buscarEnGrid } },
			{ name: "edicion", displayName: "Editar", width: 70, enableSorting: false, enableFiltering: false, cellTemplate: bt2, enableCellEdit: false, enableColumnMenu: true },
			{ field: "sexo", displayName: "Sex", width: 40 },
			{ field: "username", filter: { condition: Acentos.buscarEnGrid }, displayName: "Usuario", cellTemplate: btUsuario, editableCellTemplate: btEditUsername, minWidth: 135
			},
			//{ field: "fecha", displayName: "Nacimiento", cellFilter: "date:mediumDate", type: "date", minWidth: 100 },
			{ field: "celular", displayName: "Celular", minWidth: 80 },
			{ field: "tipo", displayName: "Tipo", minWidth: 100, enableCellEdit: false },
			{ field: "email", displayName: "Email", type: "email", minWidth: 100 },
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
				if (colDef.field === "sexo") {
					newValue = newValue.toUpperCase();
					if (!(newValue === "M" || newValue === "F")) {
						toastr.warning("Debe usar M o F");
						rowEntity.sexo = oldValue;
						return;
					}
				}
				UsuariosFacto.actualizar_campo(colDef.field, newValue, rowEntity.rowid || rowEntity.id).then(function(r) {
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



.controller('RemoveUsuarioCtrl', ['$scope', '$uibModalInstance', 'elemento', 'UsuariosFacto', 'toastr', ($scope, $modalInstance, elemento, UsuariosFacto, toastr)=>{
	$scope.elemento = elemento;
	
	$scope.ok = ()=>{

		UsuariosFacto.eliminar(elemento.rowid || elemento.id, elemento.id).then(function(result) {
			console.log("Usuario eliminado", elemento);
			$modalInstance.close(elemento)
		}, function(tx) {
			console.log("usuario no se pudo Eliminar", tx);
			$modalInstance.dismiss('Error')
		})
		
	}
	
	$scope.cancel = ()=>{
		$modalInstance.dismiss('cancel')
	}

}])

