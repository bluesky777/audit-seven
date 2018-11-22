angular.module('auditoriaApp')

.controller('auditoriasctrl' , function($scope, ConexionServ, $filter, AuthServ, toastr){
	
	$scope.$parent.sidebar_active 	= false;
	$scope.iglesias 				= [];
	$scope.auditorias 				= [];
	$scope.auditoria_crear 			= {
		fecha: new Date(),
		saldo_ant: 0
	}
	
	
	consulta = 'SELECT i.*, i.rowid, d.nombre as nombre_distrito, d.alias as alias_distrito ' +
		'FROM iglesias i INNER JOIN distritos d ON d.rowid=i.distrito_id';
		
	ConexionServ.query(consulta, []).then(function(result){
		$scope.iglesias = result;
		
		for (let i = 0; i < $scope.iglesias.length; i++) {
			if ($scope.iglesias[i].rowid == $scope.USER.iglesia_id) {
				$scope.auditoria_crear.iglesia = $scope.iglesias[i];
			}
		}
		
	} , function(tx){
		console.log('Error no es posbile traer Entidades', tx)
	});
	 
	
	$scope.vercrearauditorias = function(){
		$scope.vermostrandocrarauditorias = !$scope.vermostrandocrarauditorias
	}
	
	$scope.cancelar_crear_distrito = function(){
		$scope.vermostrandocrarauditorias = false;
	}


	$scope.verActuAuditoria = function(auditoria){
		
		if (auditoria.fecha && auditoria.hora) {
			text = auditoria.fecha + ' ' + auditoria.hora;
			console.log(text);
			auditoria.hora_new = new Date(text);
			console.log(auditoria.hora_new);
		}
		
		if (auditoria.fecha) {
			auditoria.fecha_new = new Date(auditoria.fecha);
		}
		
		for (let i = 0; i < $scope.iglesias.length; i++) {
			const igl = $scope.iglesias[i];
			if (igl.rowid == auditoria.iglesia_id) {
				auditoria.iglesia = igl;
			}
		}
   		$scope.modusers 			= !$scope.modusers;
		$scope.auditoria_editars 	= auditoria;
	}

	$scope.InsertEntidadAuditoria = function(audit){
		if (audit.fecha) {
			fecha_fix = window.fixDate(audit.fecha);
		}else{
			toastr.warning('Elige fecha.');
			return
		}
		
		hora_fix = null;
		
		if (audit.hora) {
			hora_fix = window.fixHora(audit.hora);
			console.log(hora_fix);
		}
		
		if (audit.iglesia) {
			
			consulta ="INSERT INTO auditorias(fecha, hora, iglesia_id, saldo_ant) VALUES(?,?,?,?) "
			ConexionServ.query(consulta,[fecha_fix, hora_fix, audit.iglesia.rowid, audit.saldo_ant]).then(function(resInsert){

				ConexionServ.query('UPDATE usuarios SET auditoria_id=?, distrito_id=?, iglesia_id=? WHERE rowid=? ', [ resInsert.insertId, audit.iglesia.distrito_id, audit.iglesia.rowid, $scope.USER.rowid ]).then(function(result) {
					$scope.USER.iglesia_id 			= audit.iglesia.rowid;
					$scope.USER.distrito_id 		= audit.iglesia.distrito_id;
					$scope.USER.iglesia_nombre 		= audit.iglesia.iglesia_nombre;
					$scope.USER.iglesia_tipo 		= audit.iglesia.iglesia_tipo;
					$scope.USER.distrito_nombre 	= audit.iglesia.distrito_nombre;
					$scope.USER.iglesia_alias 		= audit.iglesia.iglesia_alias;
					$scope.USER.auditoria_id 		= resInsert.insertId;
					$scope.USER.fecha_audit 		= fecha_fix;
					$scope.USER.hora_audit 			= hora_fix;
					$scope.USER.iglesia_audit_id 	= audit.iglesia.rowid;
					
					AuthServ.update_user_storage($scope.USER).then(function(usuario){
						const {ipcRenderer} = require('electron');
						ipcRenderer.send('refrescar-app');
					});
					
				});
					
				$scope.verMostrarAuditoriasTabla();
				//$scope.vermostrandocrarauditorias = false;
				toastr.success('Auditoria creada exitosamente');
	
			} , function(tx){
				console.log('Auditoria no se pudo crear' , tx)
			});
			
		}else{
			toastr.warning('Debes seleccionar una iglesia.');
			return
		}

	} 

	$scope.verMostrarAuditoriasTabla = function(){
		consulta = 'SELECT a.*, a.rowid, i.nombre, i.alias from auditorias a ' +
			'INNER JOIN iglesias i ON a.iglesia_id = i.rowid and a.iglesia_id=? ';

		ConexionServ.query(consulta, [$scope.USER.iglesia_id]).then(function(result){
			if(result.length == 0){
				toastr.warning('Debes seleccionar una iglesia.');
				return;
			}
			$scope.auditorias = result;
		} , function(tx){
		   	console.log('Error no es posbile traer auditorias' , tx)
		})
		

	} 


	$scope.verMostrarAuditoriasTabla();


	$scope.agruparPorDistrito = function (item){
		return item.nombre_distrito;
	};
	


	$scope.actusersauditoria = function(auditoria_cambiar){

		fecha_update = window.fixDate(new Date(), true);
		
		fecha = null;
		if (auditoria_cambiar.fecha_new) {
			fecha = window.fixDate(auditoria_cambiar.fecha_new);
		}
		
		hora = null;
		if (auditoria_cambiar.hora_new) {
			hora = window.fixHora(auditoria_cambiar.hora_new);
		}
		

	 	consulta ="UPDATE auditorias SET fecha=?, hora=?, iglesia_id=?, saldo_ant=?, modificado=? WHERE rowid=? "
		ConexionServ.query(consulta,[fecha, hora, auditoria_cambiar.iglesia.rowid, auditoria_cambiar.saldo_ant, fecha_update, auditoria_cambiar.rowid]).then(function(result){

			toastr.success('Actualizado correctamente.');
			$scope.modusers = false;
			$scope.verMostrarAuditoriasTabla();
		} , function(tx){
			toastr.error('Auditoria no se pudo actualizar');
		});
	} 




	 $scope.elimninaradutiroiar = function(auditoria){
		 
		res = confirm('¿Seguro que desea eliminar auditoría?');
		
		if (res) {
			fecha_update = window.fixDate(new Date(), true);
		
			consulta ="UPDATE auditorias SET eliminado=? WHERE rowid=? ";

			ConexionServ.query(consulta,[fecha_update, auditoria.rowid]).then(function(result){
				toastr.success('Auditoría eliminada.');
				$scope.verMostrarAuditoriasTabla();
			} , function(tx){
				toastr.error('Auditoria no se pudo Eliminar' , tx)
			});

		}
		
	} 


	$scope.seleccionarAuditoria = function(auditoria) {

		ConexionServ.query('UPDATE usuarios SET auditoria_id=? WHERE rowid=? ', [ auditoria.rowid, $scope.USER.rowid ]).then(function(result) {
			$scope.USER.auditoria_id 		= auditoria.rowid;

			AuthServ.update_user_storage($scope.USER).then(function(usuario){
				
			});
		});
	}







});


