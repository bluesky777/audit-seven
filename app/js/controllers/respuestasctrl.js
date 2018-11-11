angular.module('auditoriaApp')

.controller('respuestasctrl' , function($scope, ConexionServ, $filter, toastr){


	$scope.vercreandorespuestas = function() {

		$scope.vercradasdrepsuestas = !$scope.vercradasdrepsuestas;
    

  

   

	}


	$scope.insertandorespuesats = function(respuestas_crear){

	  	

	 	consulta ="INSERT INTO respuestas(pregunta_id, respuestas ) VALUES(?, ?) "
	   ConexionServ.query(consulta, [respuestas_crear.pregunta_id, respuestas_crear.respuestas]).then(function(result){

           console.log('respuesta creada', result)
           toastr.success('respuesta creado exitosamente, presiona F5 Para recargar')

	   } , function(tx){

	   	console.log('respuesta no se pudo crear' , tx)

	   });

	 } 

	$scope.vermostrandotablarespuestas = function(){

		consulta = "SELECT  re.*, re.rowid, p.definition, p.tipo ,  a.fecha, a.hora " + 
	   				"from respuestas re " + 
	   				"INNER JOIN preguntas p ON re.pregunta_id = p.rowid " + 
	   				"INNER JOIN auditorias a ON a.rowid = p.auditoria_id  ";
	   
		ConexionServ.query(consulta, []).then(function(result){
	   		console.log(result);
	        $scope.respuestas = result;
	        console.log( $scope.respuestas)

		} , function(tx){

		   	console.log('Error no es posbile traer Respuestas' , tx)

		})

	    ConexionServ.query('SELECT *, rowid  from preguntas', []).then(function(result){

	          $scope.preguntas = result;

		} , function(tx){

		   	console.log('Error no es posbile traer preguntas' , tx)

		})


	    ConexionServ.query('SELECT  a.*, a.rowid, e.nombre, e.alias  from auditorias a INNER JOIN iglesias e ON a.iglesia_id=e.rowid  ', []).then(function(result){
 			console.log(result);
	        $scope.auditorias = result;


		   	for (var i = 0; i < $scope.auditorias.length; i++) {
		   		fecha = new Date($scope.auditorias[i].fecha);
			  	$scope.auditorias[i].fecha = fecha.getFullYear() +  '/'  + fecha.getMonth() +  '/'  + fecha.getDate();
			}

		} , function(tx){

		   	console.log('Error no es posbile traer auditorias' , tx)

		})

		ConexionServ.query('SELECT *, rowid  from iglesias', []).then(function(result){

	          $scope.entidades = result;

		} , function(tx){

		   	console.log('Error no es posbile traer entidades' , tx)

		});

		ConexionServ.query('SELECT  p.*, p.rowid from preguntas p  ', []).then(function(result){
 			console.log(result);
	        $scope.preguntas = result;

		} , function(tx){

		   	console.log('Error no es posbile traer preguntas' , tx)

		})



	 } 

	 $scope.vermostrandotablarespuestas();


	$scope.veractuausers = function(respuesta){

		$scope.mostrarrespuesta = !$scope.mostrarrespuesta;

		
		
		$scope.respuestaActua = respuesta;
	}



  $scope.actu_res = function(respuesta_cambiar){

  	console.log(respuesta_cambiar)
	  	
	 consulta ="UPDATE respuestas SET pregunta_id=?, respuestas=?, modificado=? WHERE rowid=? "
	   ConexionServ.query(consulta,[respuesta_cambiar.pregunta_id, respuesta_cambiar.respuestas, '1' ,  respuesta_cambiar.rowid]).then(function(result){

           console.log('respuesta Actualizado', result)
           toastr.success('respuesta actualizado correctamente presione F5 para recargar')

	   } , function(tx){

	   	console.log('respuesta no se pudo actualizar' , tx)

	   });

	 } 

	 $scope.elimninarespuestas = function(respuesta){
	  	
	 		var res = confirm("¿Seguro que desea eliminar ? ");

		if (res == true) {
			consulta = "UPDATE  respuestas SET eliminado=? WHERE rowid=? ";
		ConexionServ.query(consulta, ['1', respuesta.rowid]).then( function(result) {
			console.log("respuestas Eliminada", result);
			toastr.success("respuestas Eliminada Exitosamente.");
		},function(tx) {
			toastr.info("La respuestas que intenta eliminar no se pudo actualizar.");
		});
	}
	 } 




});


