angular.module('auditoriaApp')
.controller('InformesCtrl', function($scope, ConexionServ, $state, toastr, $location, $anchorScroll, $timeout){
	
	$scope.$parent.sidebar_active 	= false;
	$scope.config 	= {}
  
	$scope.imprimir = function() {
	
		try {
			const {ipcRenderer} = require('electron');
			window.print();
		} catch(e) {
				console.error("electron no encontrado");
				window.print();
		}
		
	};
	
	
	if(localStorage.config){
		$scope.config = JSON.parse(localStorage.config);
	}else{
		$scope.config.orientacion   = 'vertical'
		$scope.config.cant_imagenes = 7
	}




	// Traemos todos los datos que necesito para trabajar
	$scope.traerDatos = function() {

		// Traemos USUARIOS
		consulta = "SELECT rowid, nombres, apellidos, sexo, tipo, celular, username FROM usuarios";

		ConexionServ.query(consulta, []).then(function(result) {
			$scope.usuarios = result;

		}, function(tx) {
			console.log("Error no es posbile traer usuarios", tx);
		});
		
	};

	$scope.traerDatos();



	$scope.VerUniones = function(){
		$state.go('panel.informes.uniones');
	}


	$scope.VerAsociaciones = function(){
		$state.go('panel.informes.asociaciones');
	}

	$scope.VerDistritos = function(){
		$state.go('panel.informes.distritos');
	}

	$scope.VerIglesias = function(){
		$state.go('panel.informes.iglesias');
	}
	
	$scope.compararIglesiasMesesYears = function(){
		$scope.config.orientacion = 'oficio_horizontal'
		$state.go('panel.informes.comparar_iglesias_meses_years');
	}
	
	$scope.compararDistritosYears = function(){
		$scope.config.orientacion = 'oficio_horizontal'
		$state.go('panel.informes.comparar_distritos_years');
	}
	
	$scope.compararIglesiasYears = function(){
		$scope.config.orientacion = 'oficio_horizontal'
		$state.go('panel.informes.comparar_iglesias_years');
	}


	
	

	$scope.$watch('config', function(newVal, oldVal){
		localStorage.config = JSON.stringify(newVal);

		$scope.$broadcast('change_config');

	}, true);




});