angular.module('auditoriaApp')

.factory('DescargarTodoServ', function($q, $rootScope, ConexionServ) {

    
    funciones = {};


    
    funciones._valor_insertado      = 0,
    funciones._valor_maximo         = 0,
          
    funciones.insertar_datos_descargados = function(data){
        var defered = $q.defer();
        
    
        funciones._valor_insertado      = 0,
        funciones._valor_maximo         = 0,
        
        auditorias 			= data.auditorias;
        iglesias 			= data.iglesias;
        uniones 			= data.uniones;
        distritos 			= data.distritos;
        asociaciones 		= data.asociaciones;
        usuarios 			= data.usuarios;
        lib_mensuales 		= data.lib_mensuales;
        lib_semanales 		= data.lib_semanales;
        recomendaciones 	= data.recomendaciones;
        preguntas 			= data.preguntas;
        respuestas 			= data.respuestas;
        dinero_efectivo 	= data.dinero_efectivo;
        destinos 			= data.destinos;
        destinos_pagos 		= data.destinos_pagos;
        gastos_mes 			= data.gastos_mes;
        remesas 			= data.remesas;
        
        
        promesas 				    = [];
        funciones._valor_insertado 	= 0;
        funciones._valor_maximo 	= auditorias.length + iglesias.length + uniones.length + distritos.length + 
            asociaciones.length + usuarios.length + lib_mensuales.length + lib_semanales.length + 
            recomendaciones.length + preguntas.length + respuestas.length + dinero_efectivo.length + 
            destinos.length + destinos_pagos.length + gastos_mes.length + remesas.length;
        
            
            
        for (var i = 0; i < auditorias.length; i++) {
            
            consulta 	= 'INSERT INTO auditorias (rowid, id, fecha, saldo_ant, iglesia_id) VALUES(?, ?, ?, ?, ?)';
            prome 		= ConexionServ.query(consulta, [auditorias[i].id, auditorias[i].id, auditorias[i].fecha, auditorias[i].saldo_ant, auditorias[i].iglesia_id]);
            prome.then(function(result){
                funciones._valor_insertado++;
            }, function(tx){
                console.log('error', tx);
            });
            promesas.push(prome);
        }

        for (var i = 0; i < distritos.length; i++) {

            consulta 	= 'INSERT INTO distritos (rowid, id, nombre, alias, codigo, asociacion_id, pastor_id) VALUES(?, ?, ?, ?, ?, ?, ?)';
            prome 		= ConexionServ.query(consulta, [distritos[i].id, distritos[i].id, distritos[i].nombre, distritos[i].alias, distritos[i].codigo, distritos[i].asociacion_id, distritos[i].pastor_id]).then(function(result){
                funciones._valor_insertado++;
            }, function(tx){
                console.log('error', tx);
            });
            promesas.push(prome);
        } 

        for (var i = 0; i < asociaciones.length; i++) {
        
            consulta 	= 'INSERT INTO asociaciones(rowid, id, nombre, alias, codigo, union_id) VALUES(?, ?, ?, ?, ?, ?)';
            prome 		= ConexionServ.query(consulta, [asociaciones[i].id, asociaciones[i].id, asociaciones[i].nombre, asociaciones[i].alias, asociaciones[i].codigo, asociaciones[i].union_id]);
            prome.then(function(result){
                funciones._valor_insertado++;
            }, function(tx){
                console.log('error', tx);
            });
            promesas.push(prome);
        } 
        
        
        ConexionServ.query('DELETE FROM usuarios').then(function(){
            for (var i = 0; i < usuarios.length; i++) {
                usu 		= usuarios[i];
                fecha_new   = null;
                if (usu.fecha) {
                    fecha_new   = usu.fecha;
                }
                console.log(usu.fecha, usu);
                consulta 	= 'INSERT INTO usuarios(rowid, id, nombres, apellidos, sexo, union_id, asociacion_id, username, password, email, fecha, tipo, celular) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?) ';
                prome 		= ConexionServ.query(consulta, [usu.id, usu.id, usu.nombres, usu.apellidos, usu.sexo, usu.union_id, usu.asociacion_id, usu.username, usu.password, usu.email, fecha_new, usu.tipo, usu.celular]);
                prome.then(function(result){
                    funciones._valor_insertado++;
                }, function(tx){
                    console.log('error', tx);
                });
                promesas.push(prome);
            } 
        })
        
        
        for (var i = 0; i < iglesias.length; i++) {

            consulta	= 'INSERT INTO iglesias(id, nombre, alias, codigo, distrito_id, zona, tesorero_id, estado_propiedad, estado_propiedad_pastor, tipo_doc_propiedad, tipo_doc_propiedad_pastor, anombre_propiedad, anombre_propiedad_pastor, num_matricula, predial, municipio, direccion, observaciones) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
            prome 		= ConexionServ.query(consulta, [iglesias[i].id, iglesias[i].nombre, iglesias[i].alias, iglesias[i].codigo, iglesias[i].distrito_id, iglesias[i].zona, 
                iglesias[i].tesorero_id, iglesias[i].estado_propiedad, iglesias[i].estado_propiedad_pastor, iglesias[i].tipo_doc_propiedad, iglesias[i].tipo_doc_propiedad_pastor, iglesias[i].anombre_propiedad, iglesias[i].anombre_propiedad_pastor, iglesias[i].num_matricula, iglesias[i].predial, iglesias[i].municipio, iglesias[i].direccion, iglesias[i].observaciones]);
            prome.then(function(result){
                funciones._valor_insertado++;
            }, function(tx){
                console.log('error', tx);
            });
            promesas.push(prome);
        } 
        
        for (var i = 0; i < uniones.length; i++) {

            consulta 	= 'INSERT INTO uniones (id, nombre, alias, codigo) VALUES(?, ?, ?, ?)';
            prome 		= ConexionServ.query(consulta, [uniones[i].id, uniones[i].nombre, uniones[i].alias, uniones[i].codigo]);
            prome.then(function(result){
                funciones._valor_insertado++;
            }, function(tx){
                console.log('error', tx);
            });
            promesas.push(prome);
        } 
        
        for (var i = 0; i < lib_mensuales.length; i++) {
            lib 		= lib_mensuales[i];
            consulta	= 'INSERT INTO lib_mensuales(rowid, id, year, mes, periodo, orden, auditoria_id, diezmos, ofrendas, especiales, gastos, gastos_soportados, remesa_enviada) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)';
            prome 		= ConexionServ.query(consulta, [lib.id, lib.id, lib.year, lib.mes, lib.periodo, lib.orden, lib.auditoria_id, lib.diezmos, lib.ofrendas, lib.especiales, lib.gastos, lib.gastos_soportados, lib.remesa_enviada]);
            prome.then(function(result){
                funciones._valor_insertado++;
            }, function(tx){
                console.log('error', tx);
            });
            promesas.push(prome);
        } 
        
        for (var i = 0; i < lib_semanales.length; i++) {
            lib 		= lib_semanales[i];
            consulta	= 'INSERT INTO lib_semanales(rowid, id, libro_mes_id, diezmo_1, ofrenda_1, especial_1, diezmo_2, ofrenda_2, especial_2, diezmo_3, ofrenda_3, especial_3, ' + 
                'diezmo_4, ofrenda_4, especial_4, diezmo_5, ofrenda_5, especial_5, diaconos_1, diaconos_2, diaconos_3, diaconos_4, diaconos_5, total_diezmos, total_ofrendas, total_especiales, por_total) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
            prome 		= ConexionServ.query(consulta, [lib.id, lib.id, lib.libro_mes_id, lib.diezmo_1, lib.ofrenda_1, lib.especial_1, lib.diezmo_2, lib.ofrenda_2, lib.especial_2, lib.diezmo_3, lib.ofrenda_3, lib.especial_3, 
                lib.diezmo_4, lib.ofrenda_4, lib.especial_4, lib.diezmo_5, lib.ofrenda_5, lib.especial_5, lib.diaconos_1, lib.diaconos_2, lib.diaconos_3, lib.diaconos_4, lib.diaconos_5, lib.total_diezmos, lib.total_ofrendas, lib.total_especiales, lib.por_total]);
                
            prome.then(function(result){
                funciones._valor_insertado++;
            }, function(tx){
                console.log('error', tx);
            });
            promesas.push(prome);
        } 
        

        for (var i = 0; i < recomendaciones.length; i++) {

            consulta 	= 'INSERT INTO recomendaciones (rowid, id, auditoria_id, recomendacion, justificacion, superada, fecha, fecha_respuesta) VALUES(?,?,?,?,?,?,?,?)';
            prome 		= ConexionServ.query(consulta, [recomendaciones[i].id, recomendaciones[i].id, recomendaciones[i].auditoria_id, recomendaciones[i].recomendacion, recomendaciones[i].justificacion, recomendaciones[i].superada, recomendaciones[i].fecha, recomendaciones[i].fecha_respuesta]);
            prome.then(function(result){
                funciones._valor_insertado++;
            }, function(tx){
                console.log('error', tx);
            });
            promesas.push(prome);
        } 

        
        for (var i = 0; i < preguntas.length; i++) {
            rec 		= preguntas[i];
            consulta 	= 'INSERT INTO preguntas (rowid, id, definition, tipo, option1, option2, option3, option4) VALUES(?,?,?,?,?,?,?,?)';
            prome 		= ConexionServ.query(consulta, [rec.id, rec.id, rec.definition, rec.tipo, rec.option1, rec.option2, rec.option3, rec.option4]);
            prome.then(function(result){
                funciones._valor_insertado++;
            }, function(tx){
                console.log('error', tx);
            });
            promesas.push(prome);
        } 

        for (var i = 0; i < respuestas.length; i++) {
            rec 		= respuestas[i];
            consulta 	= 'INSERT INTO respuestas (rowid, id, pregunta_id, auditoria_id, respuestas) VALUES(?,?,?,?,?)';
            prome 		= ConexionServ.query(consulta, [rec.id, rec.id, rec.pregunta_id, rec.auditoria_id, rec.respuestas]);
            prome.then(function(result){
                funciones._valor_insertado++;
            }, function(tx){
                console.log('error', tx);
            });
            promesas.push(prome);
        } 

        for (var i = 0; i < dinero_efectivo.length; i++) {
            rec 		= dinero_efectivo[i];
            consulta 	= 'INSERT INTO dinero_efectivo (rowid, id, auditoria_id, valor, descripcion) VALUES(?,?,?,?,?)';
            prome 		= ConexionServ.query(consulta, [rec.id, rec.id, rec.auditoria_id, rec.valor, rec.descripcionr]);
            prome.then(function(result){
                funciones._valor_insertado++;
            }, function(tx){
                console.log('error', tx);
            });
            promesas.push(prome);
        } 

        for (var i = 0; i < destinos.length; i++) {
            rec 		= destinos[i];
            consulta 	= 'INSERT INTO destinos (rowid, id, iglesia_id, nombre, descripcion) VALUES(?,?,?,?,?)';
            prome 		= ConexionServ.query(consulta, [rec.id, rec.id, rec.iglesia_id, rec.nombre, rec.descripcion]);
            prome.then(function(result){
                funciones._valor_insertado++;
            }, function(tx){
                console.log('error', tx);
            });
            promesas.push(prome);
        } 

        for (var i = 0; i < destinos_pagos.length; i++) {
            rec 		= destinos_pagos[i];
            consulta 	= 'INSERT INTO destinos_pagos (rowid, id, destino_id, libro_mes_id, pago, fecha, descripcion) VALUES(?,?,?,?,?,?,?)';
            prome 		= ConexionServ.query(consulta, [rec.id, rec.id, rec.destino_id, rec.libro_mes_id, rec.pago, rec.fecha, rec.descripcion]);
            prome.then(function(result){
                funciones._valor_insertado++;
            }, function(tx){
                console.log('error', tx);
            });
            promesas.push(prome);
        } 

        for (var i = 0; i < gastos_mes.length; i++) {
            rec 		= gastos_mes[i];
            consulta 	= 'INSERT INTO gastos_mes (rowid, id, libro_mes_id, auditoria_id, valor, descripcion) VALUES(?,?,?,?,?,?)';
            prome 		= ConexionServ.query(consulta, [rec.id, rec.id, rec.libro_mes_id, rec.auditoria_id, rec.valor, rec.descripcion]);
            prome.then(function(result){
                funciones._valor_insertado++;
            }, function(tx){
                console.log('error', tx);
            });
            promesas.push(prome);
        } 


        for (var i = 0; i < remesas.length; i++) {
            $remesa 		= remesas[i];
            $now            = window.fixDate(new Date(), true);
            
            concepto = null;
            if ($remesa.concepto) {
                concepto = $remesa.concepto;
            }
            consulta 	= 'INSERT INTO remesas(rowid, id, asociacion_id, num_diario, linea, tipo_diario, num_secuencia, periodo, fecha, referencia, cod_cuenta, nombre_cuenta, descripcion_transaccion, cantidad, ' + 
                    'iva, moneda, recurso, funcion, restr, org_id, empleados, concepto, created_at) ' + 
                'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);';
            prome 		= ConexionServ.query(consulta, [$remesa.id, $remesa.id, $remesa.asociacion_id, $remesa.num_diario, $remesa.linea, $remesa.tipo_diario, $remesa.num_secuencia, $remesa.periodo, $remesa.fecha, $remesa.referencia, $remesa.cod_cuenta, $remesa.nombre_cuenta, $remesa.descripcion_transaccion, $remesa.cantidad, 
                $remesa.iva, $remesa.moneda, $remesa.recurso, $remesa.funcion, $remesa.restr, $remesa.org_id, $remesa.empleados, concepto, $now]);
            prome.then(function(result){
                funciones._valor_insertado++;
            }, function(tx){
                console.log('error', tx);
            });
            promesas.push(prome);
        } 

        
        Promise.all(promesas).then(function(result){
            console.log('Todas los datos insertados', result);
            funciones._valor_insertado = funciones._valor_maximo;
            defered.resolve(result);
        })

        return defered.promise;    
    }
    
    
    
    
    return funciones;

});