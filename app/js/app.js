angular.module('auditoriaApp', [
	'ngSanitize', 
	'ngTouch',
	'ngAnimate',
	'ui.router', 
	'ui.bootstrap',
	'ui.select',
	'ui.grid',
	'ui.grid.edit',
	'ui.grid.resizeColumns',
	'ui.grid.exporter',
	'ui.grid.selection',
	'ui.grid.cellNav',
	'ui.grid.autoResize',
	'ui.grid.pinning',
	'ui.grid.expandable',
	'ui.grid.moveColumns',
	'toastr',
	'ui.utils.masks'
])

.config(function($stateProvider, $urlRouterProvider, uiSelectConfig, toastrConfig){
	
	
	uiSelectConfig.theme = 'select2'
	uiSelectConfig.resetSearchInput = true
	
	angular.extend(toastrConfig, {
	    maxOpened: 3,    
	    preventDuplicates: true,
	});


	$stateProvider

	.state('panel', {
		url: '/panel',
		controller: 'PanelCtrl',
		templateUrl: 'templates/panel.html',
		resolve: {
			USER: ['AuthServ', function(AuthServ){
				return AuthServ.verificar_user_logueado();
			}]
		}
	})

	.state('login', {
		url: '/login',
		controller: 'LoginCtrl',
		templateUrl: 'templates/login.html'
	})

	.state('panel.entidades', {
		url: '/entidades',
		controller: 'EntidadesCtrl',
		templateUrl: 'templates/entidades.html'
	})

	.state('panel.usuarios', {
		url: '/usuarios',
		controller: 'usuariosCtrl',
		templateUrl: 'templates/usuarios/usuarios.html'
	})

	.state('panel.auditorias', {
		url: '/auditorias',
		controller: 'auditoriasctrl',
		templateUrl: 'templates/auditorias.html'
	})



	.state('panel.preguntas', {
		url: '/preguntas',
		controller: 'preguntasctrl',
		templateUrl: 'templates/preguntas.html'
	})

	.state('panel.respuestas', {
		url: '/respuestas',
		controller: 'respuestasctrl',
		templateUrl: 'templates/respuestas.html'
	})

	.state('panel.informe', {
		url: '/informe',
		controller: 'informectrl',
		templateUrl: 'templates/informes.html'
	})

	.state('panel.informe.uniones', {
		url: '/uniones',
		controller: 'informesUnionesCtrl',
		templateUrl: 'templates/informes/todas-uniones.html'
	})

	.state('panel.sincronizacion', {
		url: '/sincronizacion',
		controller: 'sincronizacionCtrl',
		templateUrl: 'templates/sincronizacion.html'
	})

	.state('panel.recomendaciones', {
		url: '/recomendaciones',
		controller: 'recomendacionesCtrl',
		templateUrl: 'templates/recomendaciones.html'
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



	.state('panel.libromes', {
		url: '/libromes',
		controller: 'libroMesCtrl',
		templateUrl: 'templates/libroMes.html'
	})


	$urlRouterProvider.otherwise('/panel');

})


.constant('rutaServidor', {
    //ruta: 'http://edilson.micolevirtual.com/feryz_server/public/auditorias'
    ruta: 'http://192.168.100.31/feryz_server/public/auditorias'
})



// Para las fechas
window.fixDate = function(fec, con_hora){
	dia   = fec.getDate();
	mes   = (fec.getMonth() + 1 );
	year  = fec.getFullYear();
  
	if (dia < 10) {
	  dia = '0' + dia;
	}
  
	if (mes < 10) {
	  mes = '0' + mes;
	}
  
	fecha   = '' + year + '/' + mes  + '/' + dia;
	
	if (con_hora){
		hora 	= fec.getHours();
		if (hora<10) { hora = '0' + hora; };
		min 	= fec.getMinutes();
		if (min<10) { min = '0' + min; };
		sec 	= fec.getSeconds();
		if (sec<10) { sec = '0' + sec; };
		fecha 	= fecha + ' ' + hora + ':' + min + ':' + sec
	}
	
	return fecha;
}
window.fixHora = function(ti){
	hora 	= ti.getHours();
	if (hora<10) { hora = '0' + hora; };
	min 	= ti.getMinutes();
	if (min<10) { min = '0' + min; };
	sec 	= ti.getSeconds();
	if (sec<10) { sec = '0' + sec; };
	time 	= hora + ':' + min + ':' + sec;
	
	return time;
}
window.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}