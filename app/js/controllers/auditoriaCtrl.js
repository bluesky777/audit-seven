angular.module('auditoriaApp')

.controller('auditoriasctrl' , function($scope, ConexionServ, $filter, AuthServ, toastr){
	
	$scope.iglesias = [];
	
	
	consulta = 'SELECT i.*, i.rowid, d.nombre as nombre_distrito, d.alias as alias_distrito ' +
		'FROM iglesias i INNER JOIN distritos d ON d.rowid=i.distrito_id';
		
	ConexionServ.query(consulta, []).then(function(result){
		$scope.iglesias = result;
	} , function(tx){
		console.log('Error no es posbile traer Entidades' , tx)
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
		}
		hora_fix = new Date(audit.hora);
		hora_fix = '' + audit.hora.getHours() + ':' + audit.hora.getMinutes() + ':' + audit.hora.getSeconds() ;

	 	consulta ="INSERT INTO auditorias(fecha, hora, iglesia_id, saldo_ant) VALUES(?,?,?,?) "
		ConexionServ.query(consulta,[fecha_fix, hora_fix, audit.iglesia.rowid, audit.saldo_ant]).then(function(result){

			console.log('Auditoria creada', result);
			$scope.verMostrarAuditoriasTabla();
			toastr.success('Auditoria creada exitosamente')

		} , function(tx){
			console.log('Auditoria no se pudo crear' , tx)
		});
	} 

	$scope.verMostrarAuditoriasTabla = function(){

		ConexionServ.query('SELECT a.*, a.rowid, i.nombre, i.alias from auditorias a INNER JOIN iglesias i ON a.iglesia_id = i.rowid  ', []).then(function(result){
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

		console.log(auditoria_cambiar);

		fecha = '' + auditoria_cambiar.fecha_new.getFullYear() + '-' + auditoria_cambiar.fecha_new.getMonth() + '-' + auditoria_cambiar.fecha_new.getDate();

		hora = '' + auditoria_cambiar.hora_new.getHours() + ':' + auditoria_cambiar.hora_new.getMinutes();

	 	consulta ="UPDATE auditorias SET fecha=?, hora=?, iglesia_id=?, saldo_ant=? WHERE rowid=? "
		ConexionServ.query(consulta,[fecha, hora, auditoria_cambiar.iglesia.rowid, auditoria_cambiar.saldo_ant, auditoria_cambiar.rowid]).then(function(result){

           toastr.success('Actualizado correctamente. Presione F5 para recargar');

		} , function(tx){
			console.log('auditoria no se pudo actualizar' , tx)
		});
	} 




	 $scope.elimninaradutiroiar = function(auditoria){
	  	
	 	consulta ="DELETE FROM auditorias WHERE rowid=? ";

	   ConexionServ.query(consulta,[auditoria.rowid]).then(function(result){


           console.log('auditoria eliminido', result);
           $scope.auditorias = $filter('filter') ($scope.auditorias, {rowid: '!' + auditoria.rowid})
	   } , function(tx){

	   	console.log('auditoria no se pudo Eliminar' , tx)

	   });

	 } 


	$scope.seleccionarAuditoria = function(auditoria) {

		ConexionServ.query('UPDATE usuarios SET auditoria_id=? WHERE rowid=? ', [ auditoria.rowid, $scope.USER.rowid ]).then(function(result) {
			$scope.USER.auditoria_id 		= auditoria.rowid;

			AuthServ.update_user_storage($scope.USER).then(function(usuario){
				
			});
		});
	}



	$scope.InsertarMesAño = function(){
   
	};





});


