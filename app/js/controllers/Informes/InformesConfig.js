angular.module('auditoriaApp')

.config(function($stateProvider, $urlRouterProvider){
	

	$stateProvider

	.state('panel.informe_pastor', {
		url: '/informe_pastor',
		controller: 'InformesPastorCtrl',
		templateUrl: 'templates/informes_pastor.html'
	})
	
	.state('panel.informes', {
		url: '/informes',
		controller: 'InformesCtrl',
		templateUrl: 'templates/informes.html'
	})

	.state('panel.informes_offline', {
		url: '/informes_offline',
		controller: 'InformesOfflineCtrl',
		templateUrl: 'templates/informesOffline.html'
	})

	.state('panel.informe.uniones', {
		url: '/uniones',
		controller: 'informesUnionesCtrl',
		templateUrl: 'templates/informes/todas-uniones.html'
	})

	.state('panel.informe.asociaciones', {
		url: '/Asociaciones',
		controller: 'informesAsociacionesCtrl',
		templateUrl: 'templates/informes/todas-asociaciones.html'
	})



	.state('panel.informe.distritos', {
		url: '/Distritos',
		controller: 'informesDistritosCtrl',
		templateUrl: 'templates/informes/todos-distritos.html'
	})

	.state('panel.informe.iglesias', {
		url: '/Iglesias',
		controller: 'informesiglesiasCtrl',
		templateUrl: 'templates/informes/todos-iglesias.html'
	})

	.state('panel.informe.comparar_iglesias_meses_years', {
		url: '/comparar_iglesias_meses_years',
		controller: 'CompararIglesiasMesesYearsCtrl',
		templateUrl: 'templates/informes/compararIglesiasMesesYears.html'
	})

	.state('panel.informe.comparar_distritos_years', {
		url: '/comparar_distritos_years',
		controller: 'CompararDistritosYearsCtrl',
		templateUrl: 'templates/informes/compararDistritosYears.html'
	})

	.state('panel.informe.comparar_iglesias_years', {
		url: '/comparar_iglesias_years',
		controller: 'CompararIglesiasYearsCtrl',
		templateUrl: 'templates/informes/compararIglesiasYears.html'
	})



})

