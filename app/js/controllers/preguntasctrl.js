angular.module('auditoriaApp')

.controller('preguntasctrl' , function($scope, ConexionServ, $filter,toastr){

  



ConexionServ.createTables();

$scope.veractpregunta = function(pregunta){

	$scope.actuasdpregunta = !$scope.actuasdpregunta;


	 
		
		$scope.pregunta_editar = pregunta;
	}


 

 


	 $scope.Insert_preguntas = function(pregunta_crear){


	  	
	 	consulta ="INSERT INTO preguntas(definition, tipo, option1 ,option2, option3, option4, auditoria_id) VALUES(?, ?, ?, ?, ?, ?, ?) "
	   ConexionServ.query(consulta, [pregunta_crear.definition, pregunta_crear.tipo, pregunta_crear.option1, pregunta_crear.option2, pregunta_crear.option3, pregunta_crear.option4, pregunta_crear.auditoria]).then(function(result){

           console.log('pregunta creada', result)
           toastr.success('pregunta creado exitosamente')

           $scope.vertablapreguntarosmostrar();

	   } , function(tx){

	   	console.log('pregunta no se pudo crear' , tx)

	   });

	 } 


	 $scope.vercrearpregunta = function() {


	 	$scope.vercreando = !$scope.vercreando;

	 }

	   $scope.Actualizarpreguntas = function(actuali_preg) {
		consulta = "UPDATE  preguntas SET definition=?, tipo=?, option1=?, option2=?, option3=?, option4=?, auditoria_id=?,  modificado=? WHERE rowid=? ";
		ConexionServ.query(consulta, [ actuali_preg.definition, actuali_preg.tipo, actuali_preg.option1, actuali_preg.option2, actuali_preg.option3, actuali_preg.option4, actuali_preg.auditoria_id, '1', actuali_preg.rowid ]).then( function(result) {
			console.log("pregunta Actualizada", result);
			toastr.success("pregunta Actualizada Exitosamente.");
		},function(tx) {
			toastr.info("La pregunta que intenta actualizar no se pudo actualizar.");
		});
    };

     $scope.Eliminarpreg = function(dele_preg) {
		consulta = "UPDATE  preguntas SET eliminado=? WHERE rowid=? ";
		ConexionServ.query(consulta, ['1', dele_preg.rowid ]).then( function(result) {
			console.log("pregunta eliminada", result);
			toastr.success("pregunta eliminada Exitosamente.");
		},function(tx) {
			toastr.info("La pregunta que intenta eliminada no se pudo actualizar.");
		});
    };


	$scope.vertablapreguntarosmostrar = function(){

	    
	   ConexionServ.query("SELECT p.*, p.rowid, a.fecha from preguntas p INNER JOIN auditorias a ON p.auditoria_id = a.rowid and p.eliminado = 0  "    
	   	, []).then(function(result){
	   		console.log(result);
	          $scope.preguntas = result;
	          console.log(result);

		   } , function(tx){

		   	console.log('Error no es posbile traer preguntas' , tx)

		   })

	   	ConexionServ.query('SELECT *, rowid from auditorias', []).then(function(result){

	          $scope.auditorias = result;

		   } , function(tx){

		   	console.log('Error no es posbile traer auditorias' , tx)

		   })

	   }

 
	  

	   
		 
	 



	 $scope.vertablapreguntarosmostrar();
	 


	 



	  $scope.elimninpreguntas = function(pregunta){
	  	
	 	var res = confirm("¿Seguro que desea eliminar ? ");

		if (res == true) {
			consulta = "UPDATE  preguntas SET eliminado=? WHERE rowid=? ";
		ConexionServ.query(consulta, ['1', union.rowid]).then( function(result) {
			console.log("pregunta Eliminada", result);
			toastr.success("pregunta Eliminada Exitosamente.");
		},function(tx) {
			toastr.info("La pregunta que intenta eliminar no se pudo actualizar.");
		});
	}

	 } 

});