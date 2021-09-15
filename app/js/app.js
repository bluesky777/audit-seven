angular
  .module("auditoriaApp", [
    "ngSanitize",
    "ngTouch",
    "ngAnimate",
    "ngSanitize",
    "ui.router",
    "ui.bootstrap",
    "ui.select",
    "ui.grid",
    "ui.grid.edit",
    "ui.grid.resizeColumns",
    "ui.grid.exporter",
    "ui.grid.selection",
    "ui.grid.cellNav",
    "ui.grid.autoResize",
    "ui.grid.pinning",
    "ui.grid.expandable",
    "ui.grid.moveColumns",
    "toastr",
    "ui.utils.masks",
    "ngFileUpload",
    "cfp.hotkeys",
    "angular-loading-bar",
    "pascalprecht.translate",
  ])

  .config(function (
    $stateProvider,
    $urlRouterProvider,
    uiSelectConfig,
    toastrConfig
  ) {
    uiSelectConfig.theme = "select2";
    uiSelectConfig.resetSearchInput = true;

    angular.extend(toastrConfig, {
      maxOpened: 3,
      preventDuplicates: true,
    });

    $stateProvider

      .state("panel", {
        url: "/panel",
        controller: "PanelCtrl",
        templateUrl: "templates/panel.html",
        resolve: {
          USER: [
            "AuthServ",
            function (AuthServ) {
              return AuthServ.verificar_user_logueado();
            },
          ],
        },
      })

      .state("login", {
        url: "/login",
        controller: "LoginCtrl",
        templateUrl: "templates/login.html",
      })

      .state("panel.entidades", {
        url: "/entidades",
        controller: "EntidadesCtrl",
        templateUrl: "templates/Entidades/entidades.html",
      })

      .state("panel.imagenes", {
        url: "/imagenes",
        controller: "ImagenesCtrl",
        templateUrl: "templates/imagenes.html",
      })

      .state("panel.usuarios", {
        url: "/usuarios",
        controller: "usuariosCtrl",
        templateUrl: "templates/usuarios/usuarios.html",
      })

      .state("panel.auditorias", {
        url: "/auditorias",
        controller: "auditoriasctrl",
        templateUrl: "templates/auditorias.html",
      })

      .state("panel.preguntas", {
        url: "/preguntas",
        controller: "preguntasctrl",
        templateUrl: "templates/preguntas.html",
      })

      .state("panel.respuestas", {
        url: "/respuestas",
        controller: "respuestasctrl",
        templateUrl: "templates/respuestas.html",
      })
      .state("panel.remesas", {
        url: "/remesas",
        controller: "RemesasCtrl",
        templateUrl: "templates/remesas.html",
      })

      .state("panel.sincronizacion", {
        url: "/sincronizacion",
        controller: "sincronizacionCtrl",
        templateUrl: "templates/sincronizacion.html",
      })

      .state("panel.observaciones", {
        url: "/observaciones",
        controller: "ObservacionesCtrl",
        templateUrl: "templates/Observaciones/observaciones.html",
      })

      .state("panel.propiedad", {
        url: "/propiedad",
        controller: "PropiedadCtrl",
        templateUrl: "templates/propiedad.html",
      })

      .state("panel.libromes", {
        url: "/libromes",
        controller: "libroMesCtrl",
        templateUrl: "templates/libroMes.html",
      });

    $urlRouterProvider.otherwise("/panel");
  })

  .constant(
    "rutaServidor",
    (function () {
      if (location.hostname == "www.micolevirtual.com") {
        return {
          ruta: "https://edilson.micolevirtual.com/feryz_server/public/auditorias",
          root: "https://edilson.micolevirtual.com/feryz_server/public/api",
        };
      } else {
        if (localStorage.ruta) {
          // http://192.168.0.100
          return {
            ruta: localStorage.ruta + "/feryz_server/public/auditorias",
            root: localStorage.ruta + "/feryz_server/public",
          };
        } else {
          // https://edilson.micolevirtual.com
          // http://192.168.0.100
          return {
            ruta: "https://edilson.micolevirtual.com/feryz_server/public/api/auditorias",
            root: "https://edilson.micolevirtual.com/feryz_server/public/api",
          };
        }
      }
    })()
  )

  .constant("tipos_recomendacion", {
    tipos: [
      { tipo: "Libro registro semanal" },
      { tipo: "Libro tesorería mensual" },
      { tipo: "Libro de envío de remesas" },
      { tipo: "Libro de fondos locales" },
      { tipo: "Saldo cuadre de caja" },
      { tipo: "Libro de iglesia" },
      { tipo: "Asuntos generales" },
      { tipo: "Diezmo" },
      { tipo: "Ofrenda" },
      { tipo: "Especial" },
      { tipo: "Escrituras" },
      { tipo: "Total diezmo-ofren-espe" },
      { tipo: "Gastos" },
      { tipo: "Gastos soportados" },
      { tipo: "Diferencia gastos" },
      { tipo: "Remesa" },
      { tipo: "Remesa enviada" },
      { tipo: "Ingresos por registrar" },
      { tipo: "Ingreso Sábados" },
      { tipo: "Cuenta por pagar" },
      { tipo: "Ajuste de auditoría por enviar" },
      { tipo: "Saldo de banco" },
      { tipo: "Consig. en fondos confiados" },
      { tipo: "Gastos del mes por registrar" },
      { tipo: "Dinero efectivo" },
      { tipo: "Cuentas por cobrar" },
      { tipo: "Otra" },
    ],
  })

  .constant("MESES", [
    { num: 0, mes: "Enero" },
    { num: 1, mes: "Febrero" },
    { num: 3, mes: "Marzo" },
    { num: 4, mes: "Abril" },
    { num: 5, mes: "Mayo" },
    { num: 6, mes: "Junio" },
    { num: 7, mes: "Julio" },
    { num: 8, mes: "Agosto" },
    { num: 9, mes: "Septiembre" },
    { num: 10, mes: "Octubre" },
    { num: 11, mes: "Noviembre" },
    { num: 12, mes: "Diciembre" },
  ])

  .constant("Tiempos", {
    meses: [
      { num: 0, mes: "Enero", per: "001" },
      { num: 1, mes: "Febrero", per: "002" },
      { num: 3, mes: "Marzo", per: "003" },
      { num: 4, mes: "Abril", per: "004" },
      { num: 5, mes: "Mayo", per: "005" },
      { num: 6, mes: "Junio", per: "006" },
      { num: 7, mes: "Julio", per: "007" },
      { num: 8, mes: "Agosto", per: "008" },
      { num: 9, mes: "Septiembre", per: "009" },
      { num: 10, mes: "Octubre", per: "010" },
      { num: 11, mes: "Noviembre", per: "011" },
      { num: 12, mes: "Diciembre", per: "012" },
    ],
    years: [
      { year: 2015 },
      { year: 2016 },
      { year: 2017 },
      { year: 2018 },
      { year: 2019 },
      { year: 2020 },
      { year: 2021 },
      { year: 2022 },
      { year: 2023 },
      { year: 2024 },
      { year: 2025 },
    ],
  });

// Para las fechas
window.fixDate = function (fec, con_hora) {
  dia = fec.getDate();
  mes = fec.getMonth() + 1;
  year = fec.getFullYear();

  if (dia < 10) {
    dia = "0" + dia;
  }

  if (mes < 10) {
    mes = "0" + mes;
  }

  fecha = "" + year + "/" + mes + "/" + dia;

  if (con_hora) {
    hora = fec.getHours();
    if (hora < 10) {
      hora = "0" + hora;
    }
    min = fec.getMinutes();
    if (min < 10) {
      min = "0" + min;
    }
    sec = fec.getSeconds();
    if (sec < 10) {
      sec = "0" + sec;
    }
    fecha = fecha + " " + hora + ":" + min + ":" + sec;
  }

  return fecha;
};
window.fixHora = function (ti) {
  hora = ti.getHours();
  if (hora < 10) {
    hora = "0" + hora;
  }
  min = ti.getMinutes();
  if (min < 10) {
    min = "0" + min;
  }
  sec = ti.getSeconds();
  if (sec < 10) {
    sec = "0" + sec;
  }
  time = hora + ":" + min + ":" + sec;

  return time;
};
window.getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
