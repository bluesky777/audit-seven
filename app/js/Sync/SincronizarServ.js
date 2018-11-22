angular.module('auditoriaApp')

.factory('SincronizarServ', function($q, $http, ConexionServ) {


                
result = {
          
    uniones: function(uniones){
        var defered = $q.defer();
        
        consulta = 'DELETE FROM uniones WHERE id is NULL or eliminado is NOT NULL ';
        ConexionServ.query(consulta).then(function(result){

            consulta = 'UPDATE uniones SET modificado=NULL, eliminado=NULL';
            ConexionServ.query(consulta).then(function(result){
                
                for (var i = 0; i < uniones.length; i++) {

                    consulta = 'INSERT INTO uniones (rowid, id, nombre, alias, codigo, presidente, pais) VALUES(?, ?, ?, ?, ?, ?, ?)'
                    ConexionServ.query(consulta, [uniones[i].id, uniones[i].id, uniones[i].nombre, uniones[i].alias, uniones[i].codigo, uniones[i].presidente, uniones[i].pais]).then(function(result){
                        console.log('se cargo uniones', result);
                    }, function(tx){
                        console.log('error', tx);
                    });
                }
            
            }, function(tx){
                console.log('Error eliminando uniones', tx);
            });
        
        }, function(tx){
            console.log('Error eliminando uniones', tx);
        });

        return defered.promise;    
    },
    
    
    asociaciones: function(asociaciones){
        var defered = $q.defer();

        consulta = 'DELETE FROM asociaciones WHERE id is NULL or eliminado is NOT NULL ';
        ConexionServ.query(consulta).then(function(result){

            consulta = 'UPDATE asociaciones SET modificado=NULL, eliminado=NULL';
            ConexionServ.query(consulta).then(function(result){

                for (var i = 0; i < asociaciones.length; i++) {

                    consulta = 'INSERT INTO asociaciones (rowid, id, nombre, alias, codigo, zona, union_id, tesorero_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?)'
                    ConexionServ.query(consulta, [asociaciones[i].id, asociaciones[i].id, asociaciones[i].nombre, asociaciones[i].alias, asociaciones[i].codigo, asociaciones[i].zona, asociaciones[i].union_id, asociaciones[i].tesorero_id]).then(function(result){
                        console.log('se cargo asociaciones', result);
                    }, function(tx){
                        console.log('error', tx);
                    });
                }
            
            }, function(tx){
                console.log('Error eliminando asociaciones', tx);
            });
        
        }, function(tx){
            console.log('Error eliminando asociaciones', tx);
        });


        return defered.promise;
    },
    

    distritos: function(distritos){
        var defered = $q.defer();
        

        consulta = 'DELETE FROM distritos WHERE id is NULL or eliminado is NOT NULL ';
        ConexionServ.query(consulta).then(function(result){

            consulta = 'UPDATE distritos SET modificado=NULL, eliminado=NULL';
            ConexionServ.query(consulta).then(function(result){
                
                for (var i = 0; i < distritos.length; i++) {

                    consulta = 'INSERT INTO distritos (rowid, id, nombre, alias, codigo, zona, asociacion_id, pastor_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?)'
                    ConexionServ.query(consulta, [distritos[i].id, distritos[i].id, distritos[i].nombre, distritos[i].alias, distritos[i].codigo, distritos[i].zona, distritos[i].asociacion_id, distritos[i].pastor_id]).then(function(result){
                        console.log('se cargo distritos', result);
                    
                    }, function(tx){
                        console.log('error', tx);
                    });
                }
            
            }, function(tx){
                console.log('Error eliminando distritos', tx);
            });
        
        }, function(tx){
            console.log('Error eliminando distritos', tx);
        });

        return defered.promise;
    },
        
        
    iglesias: function(iglesias){
        var defered = $q.defer();

        consulta = 'DELETE FROM iglesias WHERE id is NULL or eliminado is NOT NULL ';
        ConexionServ.query(consulta).then(function(result){

            consulta = 'UPDATE iglesias SET modificado=NULL, eliminado=NULL';
            ConexionServ.query(consulta).then(function(result){
                
                for (var i = 0; i < iglesias.length; i++) {

                    consulta = 'INSERT INTO iglesias (rowid, id, nombre, alias, codigo, distrito_id, tipo, zona, fecha_propiedad, fecha_fin) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
                    ConexionServ.query(consulta, [iglesias[i].id, iglesias[i].id, iglesias[i].nombre, iglesias[i].alias, iglesias[i].codigo, iglesias[i].distrito_id, iglesias[i].tipo, iglesias[i].zona, iglesias[i].fecha_propiedad, iglesias[i].fecha_fin]).then(function(result){
                        console.log('se cargo iglesias', result);
                    
                    }, function(tx){
                        console.log('error', tx);
                    });
                }
            
            }, function(tx){
                console.log('Error eliminando iglesias', tx);
            });
        
        }, function(tx){
            console.log('Error eliminando iglesias', tx);
        });

        return defered.promise;    
    },

    
    usuarios: function(usuarios){
        var defered = $q.defer();

        consulta = 'DELETE FROM usuarios WHERE id is NULL or eliminado is NOT NULL ';
        ConexionServ.query(consulta).then(function(result){

            consulta = 'UPDATE usuarios SET modificado=NULL, eliminado=NULL';
            ConexionServ.query(consulta).then(function(result){
                
                for (var i = 0; i < usuarios.length; i++) {

                    consulta = 'INSERT INTO usuarios (rowid, id, nombres, apellidos, email, tipo, sexo, username, password) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)'
                    ConexionServ.query(consulta, [usuarios[i].id, usuarios[i].id, usuarios[i].nombres, usuarios[i].apellidos, usuarios[i].email, usuarios[i].tipo, usuarios[i].sexo, usuarios[i].username, usuarios[i].password]).then(function(result){
                        console.log('se cargo usuarios', result);
                    
                    }, function(tx){
                        console.log('error', tx);
                    });
                }
            
            }, function(tx){
                console.log('Error eliminando usuarios', tx);
            });
        
        }, function(tx){
            console.log('Error eliminando usuarios', tx);
        });

        return defered.promise;
    },

    
    auditorias: function(auditorias){
        var defered = $q.defer();
        

        consulta = 'DELETE FROM auditorias WHERE id is NULL or eliminado is NOT NULL ';
        ConexionServ.query(consulta).then(function(result){

            consulta = 'UPDATE auditorias SET modificado=NULL, eliminado=NULL';
            ConexionServ.query(consulta).then(function(result){
                
                for (var i = 0; i < auditorias.length; i++) {

                    consulta = 'INSERT INTO auditorias (rowid, id, fecha, hora, saldo_ant, iglesia_id) VALUES(?, ?, ?, ?, ?, ?)'
                    ConexionServ.query(consulta, [auditorias[i].id, auditorias[i].id, auditorias[i].fecha, auditorias[i].hora, auditorias[i].saldo_ant, auditorias[i].iglesia_id]).then(function(result){
                        console.log('se cargo auditorias', result);
                    
                    }, function(tx){
                        console.log('error', tx);
                    });
                }
            
            }, function(tx){
                console.log('Error eliminando auditorias', tx);
            });
        
        }, function(tx){
            console.log('Error eliminando auditorias', tx);
        });

        return defered.promise;
    },

    
    lib_mensuales: function(lib_mensuales){
        var defered = $q.defer();

        consulta = 'DELETE FROM lib_mensuales WHERE id is NULL or eliminado is NOT NULL ';
        ConexionServ.query(consulta).then(function(result){

            consulta = 'UPDATE lib_mensuales SET modificado=NULL, eliminado=NULL';
            ConexionServ.query(consulta).then(function(result){
                
                for (var i = 0; i < lib_mensuales.length; i++) {

                    consulta = 'INSERT INTO lib_mensuales (rowid, id, year, mes, orden, auditoria_id) VALUES(?, ?, ?, ?, ?, ?)'
                    ConexionServ.query(consulta, [lib_mensuales[i].id, lib_mensuales[i].id, lib_mensuales[i].year, lib_mensuales[i].mes, lib_mensuales[i].orden, lib_mensuales[i].auditoria_id]).then(function(result){
                        console.log('se cargo lib_mensuales', result);
                    
                    }, function(tx){
                        console.log('error', tx);
                    });
                }
            
            }, function(tx){
                console.log('Error eliminando lib_mensuales', tx);
            });
        
        }, function(tx){
            console.log('Error eliminando lib_mensuales', tx);
        });

        return defered.promise;
    
    },
    
    lib_semanales: function(lib_mensuales){
        var defered = $q.defer();

        consulta = 'DELETE FROM lib_semanales WHERE id is NULL or eliminado is NOT NULL ';
        ConexionServ.query(consulta).then(function(result){

            consulta = 'UPDATE lib_semanales SET modificado=NULL, eliminado=NULL';
            ConexionServ.query(consulta).then(function(result){
                
                for (var i = 0; i < lib_semanales.length; i++) {
                    el = lib_semanales[i];
                    consulta = 'INSERT INTO lib_semanales (rowid, id, libro_mes_id, diezmo_1, ofrenda_1, especial_1, diezmo_2, ofrenda_2, especial_2, diezmo_3, ofrenda_3, especial_3, diezmo_4, ofrenda_4, especial_4, diezmo_5, ofrenda_5, especial_5, diaconos_1, diaconos_2, diaconos_3, diaconos_4, diaconos_5, total_diezmos, total_ofrendas, total_especiales, por_total) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
                    ConexionServ.query(consulta, [el.id, el.id, el.libro_mes_id, el.diezmo_1, el.ofrenda_1, el.especial_1, el.diezmo_2, el.ofrenda_2, el.especial_2, el.diezmo_3, el.ofrenda_3, el.especial_3, el.diezmo_4, el.ofrenda_4, el.especial_4, el.diezmo_5, el.ofrenda_5, el.especial_5, el.diaconos_1, el.diaconos_2, el.diaconos_3, el.diaconos_4, el.diaconos_5, el.total_diezmos, el.total_ofrendas, el.total_especiales, el.por_total]).then(function(result){
                        console.log('se cargo lib_semanales', result);
                    }, function(tx){
                        console.log('error', tx);
                    });
                }
            
            }, function(tx){
                console.log('Error eliminando lib_mensuales', tx);
            });
        
        }, function(tx){
            console.log('Error eliminando lib_mensuales', tx);
        });

        return defered.promise;
    
    },


    preguntas: function(preguntas){
        var defered = $q.defer();

        consulta = 'DELETE FROM preguntas WHERE id is NULL or eliminado is NOT NULL ';
        ConexionServ.query(consulta).then(function(result){

            consulta = 'UPDATE preguntas SET modificado=NULL, eliminado=NULL';
            ConexionServ.query(consulta).then(function(result){

                for (var i = 0; i < preguntas.length; i++) {

                    consulta = 'INSERT INTO preguntas (rowid, id, definition, tipo, option1, option2, option3, option4, auditoria_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)'
                    ConexionServ.query(consulta, [preguntas[i].id, preguntas[i].id,  preguntas[i].definition, preguntas[i].tipo, preguntas[i].option1, preguntas[i].option2, preguntas[i].option3, preguntas[i].option4, preguntas[i].auditoria ]).then(function(result){
                        console.log('se cargo preguntas', result);
                    
                    }, function(tx){
                        console.log('error', tx);
                    });
                }
            
            }, function(tx){
                console.log('Error eliminando preguntas', tx);
            });
        
        }, function(tx){
            console.log('Error eliminando preguntas', tx);
        });

        return defered.promise;
    },

    
    respuestas: function(respuestas){
        var defered = $q.defer();
        

        consulta = 'DELETE FROM respuestas WHERE id is NULL or eliminado is NOT NULL ';
        ConexionServ.query(consulta).then(function(result){

            consulta = 'UPDATE respuestas SET modificado=NULL, eliminado=NULL';
            ConexionServ.query(consulta).then(function(result){

                for (var i = 0; i < respuestas.length; i++) {

                    consulta = 'INSERT INTO respuestas (rowid, id, pregunta_id, auditoria_id, respuestas) VALUES(?, ?, ?, ?, ?)'
                    ConexionServ.query(consulta, [respuestas[i].id, respuestas[i].id,  respuestas[i].pregunta_id, respuestas[i].auditoria_id, respuestas[i].respuestas  ]).then(function(result){
                        console.log('se cargo respuestas', result);
                    
                    }, function(tx){
                        console.log('error', tx);
                    });
                }
            
            }, function(tx){
                console.log('Error eliminando respuestas', tx);
            });
        
        }, function(tx){
            console.log('Error eliminando respuestas', tx);
        });

        

        return defered.promise;
    },


    recomendaciones: function(recomendas){
        var defered = $q.defer();
        

        consulta = 'DELETE FROM recomendaciones WHERE id is NULL or eliminado is NOT NULL ';
        ConexionServ.query(consulta).then(function(result){

            consulta = 'UPDATE recomendaciones SET modificado=0, eliminado=0';
            ConexionServ.query(consulta).then(function(result){
                console.log(recomendas);
                for (var i = 0; i < recomendas.length; i++) {

                    consulta = 'INSERT INTO recomendaciones (rowid, id, recomendacion, justificacion, superada, fecha) VALUES(?, ?, ?, ?, ?, ?)'
                    ConexionServ.query(consulta, [recomendas[i].id, recomendas[i].id,  recomendas[i].recomendacion, recomendas[i].justificacion, recomendas[i].superada, recomendas[i].fecha  ]).then(function(result){
                        console.log('se cargo recomendaciones', result);
                    
                    }, function(tx){
                        console.log('error', tx);
                    });
                }
            
            }, function(tx){
                console.log('Error eliminando recomendaciones', tx);
            });
        
        }, function(tx){
            console.log('Error eliminando recomendaciones', tx);
        });

        return defered.promise;    
    }

}
    
    
return result;

});