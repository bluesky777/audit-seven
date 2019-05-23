
angular.module('auditoriaApp')

.config(function($translateProvider){
    
    $translateProvider.preferredLanguage('ES');
    
    
	$translateProvider.translations('English',{
        INICIO_MENU: 'Home',
        USERS_MENU: 'Users',
        ENTIDADES_MENU: 'Entities',
        AUDITORIAS_MENU: 'Audits',
        PREGUNTAS_MENU: 'Questions',
        RESPUESTAS_MENU: 'Answers',
        REMESAS_MENU: 'Remesas',
        OBSERVACIONES_MENU: 'Observations',
        PROPIEDAD_MENU: 'Property',
        IDIOMA_MENU: 'Language / Theme',
        INFORMES_MENU: 'Reports',
        CAPTURA_DATOS_MENU: 'Data Capture',
        SINCRONIZACION_MENU: 'Synchronization',
        DATOS_MENU: 'Data',
        REFRESH: 'Refresh',
        SALIR: 'Sign out',

        PERFIL: 'Profile',
        IGLESIA: 'Church'
        
    })
    .translations('Español', {
        INICIO_MENU: 'Inicio',
        USERS_MENU: 'Usuarios',
        ENTIDADES_MENU: 'Entidades',
        AUDITORIAS_MENU: 'Auditorías',
        PREGUNTAS_MENU: 'Preguntas',
        RESPUESTAS_MENU: 'Respuestas',
        REMESAS_MENU: 'Remesas',
        OBSERVACIONES_MENU: 'Observaciones',
        PROPIEDAD_MENU: 'Propiedad',
        IDIOMA_MENU: 'Idioma / Tema',
        INFORMES_MENU: 'Informes',
        CAPTURA_DATOS_MENU: 'Captura de datos',
        SCANNER_MENU: 'Escaner QR',
        SINCRONIZACION_MENU: 'Sincronización',
        DATOS_MENU: 'Datos',
        REFRESH: 'Actualizar',
        SALIR: 'Salir',

        PERFIL: 'Perfil',
        IGLESIA: 'Iglesia',

    })
    .translations('Francais', {
        INICIO_MENU: 'Initiation',
        EVENTS_MENU: 'Événements',
        ENTIDADES_MENU: 'Entités',
        AUDITORIAS_MENU: 'Audits',
        PREGUNTAS_MENU: 'Questionnement',
        RESPUESTAS_MENU: 'Réponses',
        REMESAS_MENU: 'Remesas',
        OBSERVACIONES_MENU: 'Observations',
        PROPIEDAD_MENU: 'La propriété',
        USERS_MENU: 'Utilisateurs',
        IDIOMA_MENU: 'Langue / Thème',
        INFORMES_MENU: 'Rapports',
        CAPTURA_DATOS_MENU: 'Capture de donnés',
        SCANNER_MENU: 'QR Scanner',
        SINCRONIZACION_MENU: 'La synchronisation',
        DATOS_MENU: 'Les données',
        REFRESH: 'Rafraîchir',
        SALIR: 'Laisser',

        PERFIL: 'Profil',
        IGLESIA: 'Église',

    })


    
})