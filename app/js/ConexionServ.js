angular.module('auditoriaApp')

.factory('ConexionServ', function($q, $http, $timeout) {

    var db;


    db = window.openDatabase("AuditFast.db", '1', 'AuditFast', 1024 * 1024 * 49);

    sqlUniones = "CREATE TABLE IF NOT EXISTS uniones (id integer," +
                "nombre varchar(200)  NOT NULL collate nocase," +
                "alias varchar(100)  DEFAULT NULL collate nocase," +
                "codigo varchar(100)  DEFAULT NULL collate nocase," +
                "presidente integer DEFAULT NULL," +
                "pais varchar(100)  DEFAULT NULL collate nocase," +
                "modificado varchar(100)  DEFAULT NULL collate nocase," +
                "eliminado integer  DEFAULT '0'," +
                "division_id integer DEFAULT NULL)"; // Tesorero del distrito

   sqlRecomendaciones = "CREATE TABLE IF NOT EXISTS recomendaciones (id integer, " +
                "hallazgo text  DEFAULT NULL collate nocase, " +
                "recomendacion text  DEFAULT NULL collate nocase, " +
                "justificacion text  DEFAULT NULL collate nocase, " +
                "superada integer(1) DEFAULT '0', " +
                "fecha varchar(100)  DEFAULT NULL collate nocase, " +
                "tipo varchar(250)  DEFAULT NULL collate nocase, " +
                "auditoria_id integer DEFAULT NULL," +
                "modificado varchar(100)  DEFAULT NULL collate nocase, " +
                "eliminado integer  DEFAULT '0' )";
                

    sqlAsociaciones = "CREATE TABLE IF NOT EXISTS asociaciones (id integer," +
                "nombre varchar(200)  NOT NULL collate nocase," +
                "alias varchar(100)  DEFAULT NULL collate nocase," +
                "codigo varchar(100)  DEFAULT NULL collate nocase," +
                "zona varchar(100)  DEFAULT NULL collate nocase," +
                "union_id integer DEFAULT NULL," +
                "modificado varchar(100)  DEFAULT NULL collate nocase," +
                "eliminado integer  DEFAULT '0'," +
                "tesorero_id integer DEFAULT NULL)"; // Tesorero del distrito

    sqlDistritos = "CREATE TABLE IF NOT EXISTS distritos (id integer," +
                "nombre varchar(200)  NOT NULL collate nocase," +
                "alias varchar(100)  DEFAULT NULL collate nocase," +
                "codigo varchar(100)  DEFAULT NULL collate nocase," +
                "zona varchar(100)  DEFAULT NULL collate nocase," +
                "asociacion_id integer DEFAULT NULL," +
                "pastor_id integer DEFAULT NULL," +
                "modificado varchar(100)  DEFAULT 0 collate nocase," +
                "eliminado varchar(100)  DEFAULT 0 collate nocase," +
                "tesorero_id integer DEFAULT NULL)"; // Tesorero del distrito

   sqlIglesias = "CREATE TABLE IF NOT EXISTS iglesias (id integer," +
                "nombre varchar(200)  NOT NULL collate nocase," +
                "alias varchar(100)  DEFAULT NULL collate nocase," +
                "codigo varchar(100)  DEFAULT NULL collate nocase," +
                "distrito_id integer DEFAULT NULL," +
                "tipo varchar(100)  DEFAULT 'IGLESIA' collate nocase," + // IGLESIA O GRUPO
                "zona varchar(100)  DEFAULT NULL collate nocase," +
                
                "tipo_propiedad varchar(255)  DEFAULT NULL collate nocase," +
                "anombre_propiedad varchar(255)  DEFAULT NULL collate nocase," +
                "fecha_propiedad varchar(100)  DEFAULT NULL collate nocase," +
                "fecha_fin varchar(100)  DEFAULT NULL collate nocase," +
                
                "tipo_propiedad2 varchar(255)  DEFAULT NULL collate nocase," +
                "anombre_propiedad2 varchar(255)  DEFAULT NULL collate nocase," +
                "fecha_propiedad2 varchar(100)  DEFAULT NULL collate nocase," +
                "fecha_fin2 varchar(100)  DEFAULT NULL collate nocase," +
                
                "tipo_propiedad3 varchar(255)  DEFAULT NULL collate nocase," +
                "anombre_propiedad3 varchar(255)  DEFAULT NULL collate nocase," +
                "fecha_propiedad3 varchar(100)  DEFAULT NULL collate nocase," +
                "fecha_fin3 varchar(100)  DEFAULT NULL collate nocase," +

                "modificado varchar(100)  DEFAULT NULL collate nocase," +
                "eliminado varchar(100)  DEFAULT NULL collate nocase," +
                
                "tesorero_id integer DEFAULT NULL," + // Tesorero de la iglesia
                "secretario_id integer DEFAULT NULL)";

                
    sqlusuarios = "CREATE TABLE IF NOT EXISTS usuarios (id integer," +
                "nombres varchar(100)  NOT NULL collate nocase," +
                "apellidos varchar(100)  DEFAULT NULL collate nocase," +
                "email varchar(200)  DEFAULT NULL collate nocase," +
                "sexo varchar(100)  NOT NULL," +
                "fecha varchar(100)  DEFAULT NULL collate nocase," +
                "tipo varchar(100)  NOT NULL," + // Auditor, Pastor, Tesorero
                "is_active integer(1)  DEFAULT '1'," +
                "distrito_id integer DEFAULT NULL," +
                "iglesia_id integer DEFAULT NULL," +
                "auditoria_id integer DEFAULT NULL," +
                "celular varchar(100)  NULL," +
                "modificado varchar(100)  DEFAULT NULL collate nocase," +
                "eliminado varchar(100)  DEFAULT NULL collate nocase," +
                "username varchar(100)  NOT NULL , " +  
                "password varchar(100)  NOT NULL)" ;

    sqlauditorias = "CREATE TABLE IF NOT EXISTS auditorias (id integer," +
                "fecha varchar(100)  DEFAULT NULL collate nocase," +
                "hora varchar(100)  DEFAULT NULL collate nocase," +
                "saldo_ant integer  DEFAULT NULL," +
                "ingre_por_registrar integer  DEFAULT NULL," +
                "ingre_sabados integer  DEFAULT NULL," + // Sábados que no se registran en libro mes porque no ha pasado el mes
                "cta_por_pagar integer  DEFAULT NULL," +
                "ajuste_por_enviar integer  DEFAULT NULL," +
                "saldo_banco integer  DEFAULT NULL," + // Respaldos de por qué no está el total del dinero
                "consig_fondos_confia integer  DEFAULT NULL," + // Consignación en fondos confiados en la asociación
                "gastos_mes_por_regis integer  DEFAULT NULL," +  // Gastos de mes sin registrar en ningún libro mes
                "dinero_efectivo integer  DEFAULT NULL," + // Dinero en efectivo
                "cta_por_cobrar integer  DEFAULT NULL," + // Cuentas por pagar
                
                "modificado varchar(100)  DEFAULT NULL collate nocase," +
                "eliminado varchar(100)  DEFAULT NULL collate nocase," +
                "iglesia_id integer  NOT NULL )" ;

    sqlLibMes = "CREATE TABLE IF NOT EXISTS lib_mensuales (id integer," +
                "year integer  NOT NULL," +
                "mes varchar(100)  NOT NULL collate nocase," +
                "orden integer  DEFAULT NULL," +
                "auditoria_id integer  NOT NULL," +
                "diezmos integer  DEFAULT 0 ," +
                "ofrendas integer  DEFAULT 0 ," +
                "especiales integer  DEFAULT 0 ," + 
                "gastos integer  DEFAULT 0 ," + 
                "gastos_soportados integer  DEFAULT 0 ," + 
                "modificado varchar(100)  DEFAULT NULL collate nocase," +
                "eliminado varchar(100)  DEFAULT NULL collate nocase," +                
                "remesa_enviada integer  DEFAULT 0 )";




    // Dinero recogido en los 5 o 4 sábados del mes. Puede especificar por sábado o por total
    sqlLibSem = "CREATE TABLE IF NOT EXISTS lib_semanales (id integer," +
                "libro_mes_id integer  NOT NULL," +
                "diezmo_1 integer DEFAULT 0," + // Diezmos recogidos el primer sábado del mes
                "ofrenda_1 integer  DEFAULT 0 ," + // Ofrendas recogidas el primer sábado del mes
                "especial_1 integer  DEFAULT 0 ," +  // Ofrendas especiales recogidas el primer sábado del mes
                "diezmo_2 integer DEFAULT 0," + // Diezmos recogidos el SEGUNDO sábado del mes
                "ofrenda_2 integer  DEFAULT 0 ," +
                "especial_2 integer  DEFAULT 0 ," + 
                "diezmo_3 integer DEFAULT 0," + // Diezmos recogidos el TERCERO sábado del mes
                "ofrenda_3 integer  DEFAULT 0 ," +
                "especial_3 integer  DEFAULT 0 ," + 
                "diezmo_4 integer DEFAULT 0," + // Diezmos recogidos el CUARTO sábado del mes
                "ofrenda_4 integer  DEFAULT 0 ," +
                "especial_4 integer  DEFAULT 0 ," + 
                "diezmo_5 integer DEFAULT 0," + // Diezmos recogidos el QUINTO sábado del mes
                "ofrenda_5 integer  DEFAULT 0 ," +
                "especial_5 integer  DEFAULT 0 ," + 
                "diaconos_1 integer  DEFAULT 0," + // Suma del libro de diáconos por sábado
                "diaconos_2 integer  DEFAULT 0 ," +
                "diaconos_3 integer  DEFAULT 0 ," + 
                "diaconos_4 integer  DEFAULT 0 ," + 
                "diaconos_5 integer  DEFAULT 0 ," + 
                "total_diezmos integer  DEFAULT 0 ," +  // Diezmos recogidos del mes, no por sábados
                "total_ofrendas integer  DEFAULT 0 ," +  // Ofrendas recogidas del mes, no por sábados
                "total_especiales integer  DEFAULT 0 ," +  // Ofrendas especiales recogidas del mes, no por sábados
                "por_total integer  DEFAULT 0 ," +
                "modificado varchar(100)  DEFAULT NULL collate nocase," +
                "eliminado integer  DEFAULT '0' )" ; // 0 o 1. Si es por total, se ignoran los valores de los 5 sábados

    // Obligaciones fijas que tiene la iglesia mensuales
    sqlDestinos = "CREATE TABLE IF NOT EXISTS destinos (id integer," +
                "iglesia_id integer  NOT NULL," +
                "nombre varchar(250)  NOT NULL collate nocase," +
                "descripcion varchar(250)  DEFAULT NULL collate nocase ," +
                "modificado varchar(100)  DEFAULT NULL collate nocase," +
                "eliminado integer  DEFAULT '0' )";


    // Pagos que ha hecho la iglesia en ese mes en los destinos fijos
    sqlPagosDest = "CREATE TABLE IF NOT EXISTS destinos_pagos (id integer," +
                "destino_id integer  NOT NULL," +
                "libro_mes_id integer  NOT NULL," +
                "pago integer  NOT NULL," +
                "fecha varchar(100)  DEFAULT NULL collate nocase," +
                "descripcion varchar(250)  DEFAULT NULL collate nocase ," +
                "modificado varchar(100)  DEFAULT NULL collate nocase," +
                "eliminado integer  DEFAULT '0')";

    /*
    // Sumatorias de las facturas que tiene la iglesia por mes
    sqlSoportesMes = "CREATE TABLE IF NOT EXISTS soportes_mes (id integer," +
                "libro_mes_id integer  NOT NULL," +
                "valor integer  NOT NULL," +
                "descripcion varchar(250)  DEFAULT NULL collate nocase )";
    */
   
    // Gastos registrados. Tiene que coincidir con los gastos que tienen soporte en soportes_mes
    sqlGastosMes = "CREATE TABLE IF NOT EXISTS gastos_mes (id integer," +
                "libro_mes_id integer DEFAULT NULL," + // Si es un gasto de mes
                "auditoria_id integer DEFAULT NULL," + // o si es un gasto sin asignar a mes, sino a la auditoría
                "valor integer  NOT NULL," +
                "descripcion varchar(250)  DEFAULT NULL collate nocase ," +
                "modificado varchar(100)  DEFAULT NULL collate nocase," +
                "eliminado integer  DEFAULT '0')";

    // Gastos registrados. Tiene que coincidir con los gastos que tienen soporte en soportes_mes
    sqlDinero = "CREATE TABLE IF NOT EXISTS dinero_efectivo (id integer," +
                "auditoria_id integer DEFAULT NULL," + // o si es un gasto sin asignar a mes, sino a la auditoría
                "valor integer  NOT NULL," +
                "descripcion varchar(250)  DEFAULT NULL collate nocase ," +
                "modificado varchar(100)  DEFAULT NULL collate nocase," +
                "eliminado integer  DEFAULT '0')";

    sqlpreguntas = "CREATE TABLE IF NOT EXISTS preguntas (id integer," +
                "definition varchar(100)  NOT NULL collate nocase," +
                "tipo varchar(100)  DEFAULT NULL collate nocase," +
                "option1 varchar(100)  NOT NULL, " +
                "option2 varchar(100)  NOT NULL, " +
                "option3 varchar(100)  NOT NULL, " +
                "option4 varchar(100)  NOT NULL, " +
                "auditoria_id varchar(100) NOT NULL, " +
                "modificado varchar(100)  DEFAULT NULL collate nocase," +
                "eliminado integer  DEFAULT '0')";   



    sqlrespuestas = "CREATE TABLE IF NOT EXISTS respuestas (id integer," +
                "pregunta_id varchar(100)  NOT NULL collate nocase," +
                "respuestas varchar(100)  NOT NULL, " +
                "modificado varchar(100)  DEFAULT NULL collate nocase," +
                "eliminado integer  DEFAULT '0')";       

           



                
    result = {
          
        createTables: function(){
            var defered = $q.defer();
            
            db.transaction(function (tx) {

                console.log(tx);
                
                tx.executeSql(sqlDistritos, [], function (tx, result) {
                    // console.log('Distritos Tabla creada');
                    defered.resolve('Distritos Tabla creada');
                }, function(tx,error){
                    console.log("Distritos Tabla No se pudo crear", error.message);
                })

                tx.executeSql( sqlRecomendaciones, [], function (tx, result) {
                    // console.log('Distritos Tabla creada');
                    defered.resolve('Recomendaciones Tabla creada');
                }, function(tx,error){
                    console.log("Recomendaciones Tabla No se pudo crear", error.message);
                })
                
                tx.executeSql(sqlIglesias, [], function (tx, result) {
                    // console.log('Iglesias Tabla creada');
                    defered.resolve('Iglesias Tabla creada');
                }, function(tx,error){
                    console.log("Iglesias Tabla No se pudo crear", error.message);
                })


                 tx.executeSql( sqlusuarios , [], function (tx, result) {
                    // console.log('usuarios Tabla creada');
                    defered.resolve('usuarios Tabla creada');
                }, function(tx,error){
                    console.log("usuarios Tabla No se pudo crear", error.message);
                })

                tx.executeSql( sqlauditorias , [], function (tx, result) {
                    // console.log('auditorias Tabla creada');
                    defered.resolve('auditorias Tabla creada');
                }, function(tx,error){
                    console.log("auditorias Tabla No se pudo crear", error.message);
                })


                tx.executeSql( sqlLibMes , [], function (tx, result) {
                    // console.log('Libros mensuales Tabla creada');
                    defered.resolve('Libros mensuales Tabla creada');
                }, function(tx,error){
                    console.log("Libros mensuales Tabla No se pudo crear", error.message);
                })

                tx.executeSql( sqlLibSem , [], function (tx, result) {
                    // console.log('Libros Semanales Tabla creada');
                    defered.resolve('Libros Semanales Tabla creada');
                }, function(tx,error){
                    console.log("Libros Semanales Tabla No se pudo crear", error.message);
                })

                tx.executeSql( sqlUniones , [], function (tx, result) {
                    // console.log('Libros mensuales Tabla creada');
                    defered.resolve('uniones Tabla creada');
                }, function(tx,error){
                    console.log("uniones Tabla No se pudo crear", error.message);
                })


                tx.executeSql( sqlDestinos , [], function (tx, result) {
                    console.log('Destinos Tabla creada');
                    defered.resolve('Destinos Tabla creada');
                }, function(tx,error){
                    console.log("Destinos Tabla No se pudo crear", error.message);
                })

                 tx.executeSql( sqlAsociaciones , [], function (tx, result) {
                    console.log('Asociaciones Tabla creada');
                    defered.resolve('Asociaciones Tabla creada');
                }, function(tx,error){
                    console.log("Asociaciones Tabla No se pudo crear", error.message);
                })

                tx.executeSql( sqlPagosDest , [], function (tx, result) {
                    // console.log('Pagos Destinos Tabla creada');
                    defered.resolve('Pagos Destinos Tabla creada');
                }, function(tx,error){
                    console.log("Pagos Destinos Tabla No se pudo crear", error.message);
                })
                
                /*
                tx.executeSql( sqlSoportesMes , [], function (tx, result) {
                    // console.log('Soportes Mes Tabla creada');
                    defered.resolve('Soportes Mes Tabla creada');
                }, function(tx,error){
                    console.log("Soportes Mes Tabla No se pudo crear", error.message);
                })
                */


               tx.executeSql( sqlGastosMes , [], function (tx, result) {
                    // console.log('Gastos Mes Tabla creada');
                    defered.resolve('Gastos Mes Tabla creada');
                }, function(tx,error){
                    console.log("Gastos Mes Tabla No se pudo crear", error.message);
                })


                tx.executeSql( sqlDinero , [], function (tx, result) {
                    // console.log('Dinero_efectivo Tabla creada');
                    defered.resolve('Dinero_efectivo Tabla creada');
                }, function(tx,error){
                    console.log("Dinero_efectivo Tabla No se pudo crear", error.message);
                })

                tx.executeSql( sqlpreguntas , [], function (tx, result) {
                    // console.log('preguntas Tabla creada');
                    defered.resolve('preguntas Tabla creada');
                }, function(tx,error){
                    console.log("preguntas Tabla No se pudo crear", error.message);
                })


                   tx.executeSql( sqlrespuestas , [], function (tx, result) {
                    // console.log('respuestas Tabla creada');
                    defered.resolve('respuestas Tabla creada');
                }, function(tx,error){
                    console.log("respuestas Tabla No se pudo crear", error.message);
                })
          
          
            });
  
        return defered.promise;
        
        },
        query: function(sql, datos, datos_callback){ // datos_callback para los alumnos en for, porque el i cambia
            var defered = $q.defer();
      
            if(typeof datos === "undefined") {
              datos = [];
            }
      
            db.transaction(function (tx) {
              tx.executeSql(sql, datos, function (tx, result) {

                if (sql.substring(0,6).toLowerCase() == 'insert' || sql.substring(0,6).toLowerCase() == 'update') {
                    defered.resolve(result);
                };
 

                var items = [];
                for (i = 0, l = result.rows.length; i < l; i++) {
                  items.push(result.rows.item(i));
                }
                if (datos_callback) {
                  defered.resolve({items: items, callback: datos_callback});
                }else{
                  defered.resolve(items);
                }
      
                
      
              }, function(tx,error){
                console.log(error.message, sql, datos);
                defered.reject(error.message, datos_callback)
              }) // db.executeSql
            }); // db.transaction
            return defered.promise;
          },
    }
    
    
    return result;

});