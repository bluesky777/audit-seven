angular.module("auditoriaApp")

.controller("usuariosCtrl", function($scope, ConexionServ, $filter, toastr, uiGridConstants, uiGridEditConstants, $uibModal) {
	  
	$scope.gridScope 				= $scope
	$scope.gridOptions 				= {};
	$scope.$parent.sidebar_active 	= false;

	
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
		$scope.creando = true;
		
		if (!usu.password) {
			usu.password = "123";
		}
		if (!usu.username) {
			usu.username = usu.nombres+(window.getRandomInt(999, 9999));
		}
		fecha_new = null;
		if (usu.fecha) {
			fecha_new = window.fixDate(usu.fecha);
		}
		
	  	consulta = "INSERT INTO usuarios(nombres, apellidos, sexo, username, password, email, fecha, tipo, celular) VALUES(?,?,?,?,?,?,?,?,?) ";
	  	ConexionServ.query(consulta, [usu.nombres, usu.apellidos, usu.sexo, usu.username, usu.password, usu.email, fecha_new, usu.tipo, usu.celular]).then(function(result) {

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
			$scope.traerUsuarios($scope.USER.tipo);
		}, function(tx) {
		  $scope.creando 			= false;
		});
	};

	$scope.traerUsuarios = function(tipo) {
		consulta 	= '';
		datos 		= [];
		
		if (tipo == 'Auditor' || tipo == 'Admin') {
			consulta 	= "SELECT rowid, * FROM usuarios WHERE eliminado is null ORDER BY rowid DESC";
		}else if(tipo == 'Tesorero' || tipo == 'Pastor'){
			consulta 	= "SELECT rowid, * FROM usuarios WHERE eliminado is null and (tipo=? or tipo=?) ORDER BY rowid DESC";
			datos 		= ['Tesorero', 'Pastor'];
		}
		
		ConexionServ.query(consulta, datos).then(function(result) {
			$scope.usuarios 			= result;
			$scope.gridOptions.data 	= $scope.usuarios;
		}, function(tx) {
			console.log("Error, no es posbile traer usuarios. ", tx, consulta, datos);
		});
	};
	

	$scope.traerUsuarios($scope.USER.tipo);

	

	$scope.actUsers = function(usu) {
		$scope.guardando_cambios = true;
		
		fecha_new = null;
		if (usu.fecha) {
			fecha_new = window.fixDate(usu.fecha);
		}
		
		fecha_update = window.fixDate(new Date(), true);
		
		consulta = "UPDATE usuarios SET nombres=?, apellidos=?, sexo=?, username=?, password=?, fecha=?, tipo=?, celular=?, modificado=? WHERE rowid=? ";
		ConexionServ.query(consulta, [usu.nombres, usu.apellidos, usu.sexo, usu.username, usu.password, fecha_new, usu.tipo, usu.celular, fecha_update, usu.rowid]).then(function(result) {
			$scope.ver_edit_usu 		= false;
			$scope.guardando_cambios 	= false;
			console.log("usuario Actualizado", result);
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
			$scope.traerUsuarios($scope.USER.tipo);
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
				condition: function(searchTerm, cellValue, row) {
					var entidad;
					entidad = row.entity;
					return ( entidad.nombres.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 );
				}
				},
				enableHiding: false,
			},
			{ field: "apellidos", minWidth: 110, filter: { condition: uiGridConstants.filter.CONTAINS } },
			{ name: "edicion", displayName: "Editar", width: 70, enableSorting: false, enableFiltering: false, cellTemplate: bt2, enableCellEdit: false, enableColumnMenu: true },
			{ field: "sexo", displayName: "Sex", width: 40 },
			{ field: "username", filter: { condition: uiGridConstants.filter.CONTAINS }, displayName: "Usuario", cellTemplate: btUsuario, editableCellTemplate: btEditUsername, minWidth: 135
			},
			{ field: "fecha", displayName: "Nacimiento", cellFilter: "date:mediumDate", type: "date", minWidth: 100 },
			{ field: "celular", displayName: "Celular", minWidth: 80 },
			{ field: "tipo", displayName: "Tipo", minWidth: 80 },
			{ field: "email", displayName: "Email", type: "email", minWidth: 80 },
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
				ConexionServ.query("UPDATE usuarios SET "+colDef.field+"='"+newValue+"' WHERE rowid=?", [ rowEntity.rowid ] ).then(function(r) {
					return toastr.success("Usuario(a) actualizado con éxito");
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



.controller('ResetPassCtrl', function($scope, $uibModalInstance, usuario, ConexionServ, toastr){
	$scope.usuario 		= usuario;
	$scope.newpassword 	= '';
	$scope.showPassword = false;

	$scope.ok = function(){

		ConexionServ.query('UPDATE usuarios SET password=? WHERE rowid=?', [$scope.newpassword, usuario.rowid]).then((r)=>{
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



.controller('RemoveUsuarioCtrl', ['$scope', '$uibModalInstance', 'elemento', 'toastr', 'ConexionServ', ($scope, $modalInstance, elemento, toastr, ConexionServ)=>{
	$scope.elemento = elemento;
	console.log('elemento', elemento);

	$scope.ok = ()=>{
		
		fecha_del = window.fixDate(new Date(), true);
		
		consulta = "UPDATE usuarios SET eliminado=? WHERE rowid=? ";

		ConexionServ.query(consulta, [fecha_del, elemento.rowid]).then(function(result) {
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

