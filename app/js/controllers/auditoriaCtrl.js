angular.module('auditoriaApp')

.controller('auditoriasctrl' , function($scope, ConexionServ, $uibModal, AuthServ, toastr, MESES){
	
	$scope.$parent.sidebar_active 	= false;
	$scope.iglesias 				= [];
	$scope.auditorias 				= [];
	$scope.auditoria_crear 			= {
		fecha: new Date(),
		saldo_ant: 0
	}
	
	consulta = 'SELECT i.*, i.rowid, d.nombre as nombre_distrito, d.alias as alias_distrito ' +
		'FROM iglesias i ' +
		'INNER JOIN distritos d ON d.rowid=i.distrito_id and d.eliminado is null and i.eliminado is null;';
		
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
		
		if ($scope.vermostrandocrarauditorias) {
			$scope.vermostrandocrarauditorias = false;
			
		}else{
			
			consulta 	= 'SELECT m.*, m.rowid FROM lib_mensuales m ' + 
				'WHERE m.auditoria_id =? and m.eliminado is null ' +
				'ORDER BY m.periodo DESC LIMIT 1'; // SELECT m.*, m.rowid FROM lib_mensuales m WHERE m.auditoria_id=1 ORDER BY m.periodo DESC LIMIT 1
				
			id = 0;
			if ($scope.auditorias[$scope.auditorias.length-1]) {
				if ($scope.auditorias[$scope.auditorias.length-1].rowid) {
					id = $scope.auditorias[$scope.auditorias.length-1].rowid;
				}else{
					id = $scope.auditorias[$scope.auditorias.length-1].id;
				}
			}


			ConexionServ.query(consulta, [id]).then(function(result) {
				
				$scope.vermostrandocrarauditorias 	= true;
				
				if ($scope.auditorias.length>0 && result.length>0) {
					
					libro = result[result.length-1];
					$scope.auditoria_crear.saldo_ant 	= $scope.auditorias[$scope.auditorias.length-1].saldo_final;
					
					anio 		= libro.periodo.slice(0,4);
					mes_temp 	= libro.periodo.slice(6, 8);
					
					// Movemos al siguiente mes
					if (libro.mes=='Enero') {libro.mes = 'Febrero'; mes_temp='002'}else if(libro.mes=='Febrero'){libro.mes = 'Marzo'; mes_temp='003'}else if(libro.mes=='Marzo'){libro.mes = 'Abril'; mes_temp='004'}
					else if(libro.mes=='Abril'){libro.mes = 'Mayo'; mes_temp='005'}else if(libro.mes=='Mayo'){libro.mes = 'Junio'; mes_temp='006'}else if(libro.mes=='Junio'){libro.mes = 'Julio'; mes_temp='007'}
					else if(libro.mes=='Julio'){libro.mes = 'Agosto'; mes_temp='008'}else if(libro.mes=='Agosto'){libro.mes = 'Septiembre'; mes_temp='009'}
					else if(libro.mes=='Septiembre'){libro.mes = 'Octubre'; mes_temp='010'}else if(libro.mes=='Octubre'){libro.mes = 'Noviembre'; mes_temp='011'}
					else if(libro.mes=='Noviembre'){libro.mes = 'Diciembre'; mes_temp='012'}
					else if(libro.mes=='Diciembre'){
						anio 	= '' + (parseInt(anio) + 1);
						libro.mes 	= 'Enero';
						mes_temp 	= '001'
					};
					$scope.auditoria_crear.periodo_mes 	= anio + '/' + mes_temp;
					$scope.auditoria_crear.mes 			= libro.mes;
				}
				
			})
		}
		
	}
	
	$scope.cancelar_crear_distrito = function(){
		$scope.vermostrandocrarauditorias = false;
	}
	
	$scope.abrirAuditoria = function(auditoria){
		modalInstance = $uibModal.open({
            templateUrl: 'templates/abrirAuditoriaModal.html',
            resolve: {
                elemento: function () {
                    return auditoria;
                }
            },
            controller: 'AbrirAuditoriaModalCtrl' 
        });

        modalInstance.result.then(function (result) {
			toastr.success('Cambiada');
			

			consulta 	= 'SELECT m.*, m.rowid, s.*, s.rowid as lib_semanal_id FROM lib_mensuales m ' + 
						'INNER JOIN lib_semanales s ON m.rowid=s.libro_mes_id and m.eliminado is null and m.auditoria_id =? '
						'ORDER BY s.periodo';
			ConexionServ.query(consulta, [auditoria.rowid]).then(function(result) {
				$scope.lib_meses 	= result;
				saldo_final 		= 0;
				
				for (let i = 0; i < $scope.lib_meses.length; i++) {
					lib_mes = $scope.lib_meses[i];
					
					if (i == 0) {
						lib_mes.saldo_mes 			= auditoria.saldo_ant;
						lib_mes.saldo_mes_final 	= (auditoria.saldo_ant + lib_mes.especiales + (lib_mes.ofrendas * 0.6)) - lib_mes.gastos;
					}else{
						lib_mes.saldo_mes 			= $scope.lib_meses[i-1].saldo_mes_final;
						lib_mes.saldo_mes_final 	= (lib_mes.saldo_mes + lib_mes.especiales + (lib_mes.ofrendas * 0.6)) - lib_mes.gastos;
					}
					saldo_final 		= lib_mes.saldo_mes_final;
				}
				
				consulta 	= 'UPDATE auditorias SET saldo_final=? WHERE rowid=?';
				ConexionServ.query(consulta, [saldo_final, auditoria.rowid]).then(function(result) {
					console.log(result);
					$scope.verMostrarAuditoriasTabla();
				})
			})
			

            
        });
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
			
			consulta ="INSERT INTO auditorias(fecha, hora, auditor_id, iglesia_id, saldo_ant) VALUES(?,?,?,?,?) "
			ConexionServ.query(consulta,[fecha_fix, hora_fix, $scope.USER.rowid, audit.iglesia.rowid, audit.saldo_ant]).then(function(resInsert){
				
				if (audit.periodo_mes) {
					consulta 	= 'INSERT INTO lib_mensuales(year, mes, periodo, auditoria_id, diezmos, ofrendas, especiales, remesa_enviada) VALUES(?,?,?,?,?,?,?,?)';
				
					datos = [audit.periodo_mes.slice(0,4), audit.mes, audit.periodo_mes, resInsert.insertId,0,0,0,0];

					ConexionServ.query(consulta, datos).then(function(result) {

						consulta 	= 'INSERT INTO lib_semanales(libro_mes_id) VALUES(?)';
						ConexionServ.query(consulta, [result.insertId]).then(function(result) {
							
							$scope.actualizar_usuario(audit, resInsert, fecha_fix, hora_fix);
							
						});
						

					}, function(tx) {
						console.log("Error no es posbile crear mes", tx);
						$scope.creando_libro = false;
					});
				}else{
					$scope.actualizar_usuario(audit, resInsert, fecha_fix, hora_fix);
				}
				
				
	
			} , function(tx){
				console.log('Auditoria no se pudo crear' , tx)
			});
			
		}else{
			toastr.warning('Debes seleccionar una iglesia.');
			return
		}

	} 
	
	$scope.actualizar_usuario = function(audit, resInsert, fecha_fix, hora_fix){
		
		ConexionServ.query('UPDATE usuarios SET auditoria_id=?, distrito_id=?, iglesia_id=? WHERE rowid=? ', [ resInsert.insertId, audit.iglesia.distrito_id, audit.iglesia.rowid, $scope.USER.rowid ]).then(function(result) {
			$scope.USER.iglesia_id 			= audit.iglesia.rowid;
			$scope.USER.distrito_id 		= audit.iglesia.distrito_id;
			$scope.USER.iglesia_nombre 		= audit.iglesia.iglesia_nombre;
			$scope.USER.distrito_nombre 	= audit.iglesia.distrito_nombre;
			$scope.USER.iglesia_alias 		= audit.iglesia.iglesia_alias;
			$scope.USER.auditoria_id 		= resInsert.insertId;
			$scope.USER.fecha_audit 		= fecha_fix;
			$scope.USER.hora_audit 			= hora_fix;
			$scope.USER.iglesia_audit_id 	= audit.iglesia.rowid;
			
			AuthServ.update_user_storage($scope.USER).then(function(usuario){
				try {
					const {ipcRenderer} = require('electron');
					ipcRenderer.send('refrescar-app');
				} catch(e) {
					console.error("electron no encontrado");
					location.reload();
				}
			});
			
			
		});
			
		$scope.verMostrarAuditoriasTabla();
		//$scope.vermostrandocrarauditorias = false;
		toastr.success('Auditoria creada exitosamente');
	}

	$scope.verMostrarAuditoriasTabla = function(){
		consulta = 'SELECT a.*, a.rowid, i.nombre, i.alias FROM auditorias a ' +
			'INNER JOIN iglesias i ON a.iglesia_id = i.rowid and a.iglesia_id=? and a.eliminado is null and i.eliminado is null';
		
		
		ConexionServ.query(consulta, [ $scope.USER.iglesia_id ]).then(function(result){
			if(result.length == 0){
				if ($scope.USER.iglesia_id) {
					toastr.warning('Esta iglesia aún no tiene auditorías.');
				}else{
					toastr.warning('Debes seleccionar una iglesia.');
				}
				
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







})




.controller('AbrirAuditoriaModalCtrl', ['$scope', '$uibModalInstance', 'elemento', 'toastr', 'ConexionServ', ($scope, $modalInstance, elemento, toastr, ConexionServ)=>{
	$scope.elemento = elemento;
	console.log('elemento', elemento);

	$scope.ok = ()=>{
		fecha_update = window.fixDate(new Date(), true);
		
		if (elemento.cerrada) {
		
			consulta = "UPDATE auditorias SET cerrada=0, modificado=? WHERE rowid=? ";

			ConexionServ.query(consulta, [ fecha_update, elemento.rowid]).then(function(result) {
				$modalInstance.close(elemento)
			}, function(tx) {
				console.log("Auditoría no se pudo cambiar", tx);
				$modalInstance.dismiss('Error');
			})
		}else{
			
			consulta = "UPDATE auditorias SET cerrada=1, cerrada_fecha=?, modificado=? WHERE rowid=? ";

			ConexionServ.query(consulta, [ fecha_update, fecha_update, elemento.rowid]).then(function(result) {
				$modalInstance.close(elemento)
			}, function(tx) {
				console.log("Auditoría no se pudo cambiar", tx);
				$modalInstance.dismiss('Error');
			})
		}
		
		
	}
	
	$scope.cancel = ()=>{
		$modalInstance.dismiss('cancel')
	}

}])

