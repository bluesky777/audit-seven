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

	.state('panel.informes.uniones', {
		url: '/uniones',
		controller: 'informesUnionesCtrl',
		templateUrl: 'templates/informes/todas-uniones.html'
	})

	.state('panel.informes.asociaciones', {
		url: '/Asociaciones',
		controller: 'informesAsociacionesCtrl',
		templateUrl: 'templates/informes/todas-asociaciones.html'
	})



	.state('panel.informes.distritos', {
		url: '/Distritos',
		controller: 'informesDistritosCtrl',
		templateUrl: 'templates/informes/todos-distritos.html'
	})

	.state('panel.informes.iglesias', {
		url: '/Iglesias',
		controller: 'informesiglesiasCtrl',
		templateUrl: 'templates/informes/todos-iglesias.html'
	})

	.state('panel.informes.comparar_iglesias_meses_years', {
		url: '/comparar_iglesias_meses_years',
		controller: 'CompararIglesiasMesesYearsCtrl',
		templateUrl: 'templates/informes/compararIglesiasMesesYears.html'
	})

	.state('panel.informes.comparar_distritos_years', {
		url: '/comparar_distritos_years',
		controller: 'CompararDistritosYearsCtrl',
		templateUrl: 'templates/informes/compararDistritosYears.html'
	})

	.state('panel.informes.comparar_iglesias_years', {
		url: '/comparar_iglesias_years',
		controller: 'CompararIglesiasYearsCtrl',
		templateUrl: 'templates/informes/compararIglesiasYears.html'
	})



})

