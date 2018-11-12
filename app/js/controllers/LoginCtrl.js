angular.module('auditoriaApp')


.controller('LoginCtrl', function($scope, $state, toastr, ConexionServ, AuthServ){
    
    $scope.user = {username: ''}
    
    
    
    $scope.entrar = function(user){
		
		if (!user.username || user.username.length < 2) {
			toastr.warning('Nombre de usuario incorrecto');
		}
        
        AuthServ.loguear(user).then(function(data){
			console.log(data);
			//toastr.clear()
			if(data.to_sync){
				$state.go('panel.sincronizacion');
				toastr.info('Debes descargar los datos si no lo has hecho.', 'Descargar');
			}else{
				$state.go('panel');
			}
        }, function(){
            toastr.error('Datos incorrectos');
        })
    
        
    }
    
    
    
    ConexionServ.createTables();
	
    $scope.insertar_dato_inicial = function() {
		
    	consulta = "SELECT * from usuarios ";
   		ConexionServ.query(consulta, []).then(function(result) {
			if (result.length == 0) {
				
				consulta = "INSERT INTO usuarios(nombres, apellidos, username, password, tipo, distrito_id, iglesia_id, sexo) VALUES(?,?,?,?,?,?,?,?) ";
				ConexionServ.query(consulta, ['Joseth D', 'Guerrero', 'joseth',  '123', 'Admin', 28, 56, 'M']).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});
				
			}
			
        }, function(tx) {
          console.log("", tx);
		});
		
	};
	
	//$scope.insertar_dato_inicial();
	
	
    $scope.insertar_datos_iniciales = function() {
		
    	consulta = "SELECT * from usuarios ";
   		ConexionServ.query(consulta, []).then(function(result) {
			if (result.length == 0) {
				
				consulta = "INSERT INTO usuarios(nombres, apellidos, username, password, tipo, sexo) VALUES(?,?,?,?,?,?) ";
				ConexionServ.query(consulta, ['Joseth D', 'Guerrero', 'joseth',  '123', 'Admin', 'M']).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});
				
			
				/*
				
				// Distritos
				
				consulta = "INSERT INTO distritos(nombre, alias, codigo, pastor_id) VALUES(?,?,?,?) ";
				//1
				ConexionServ.query(consulta, ['Arauca Central', 'DSARAUC01', 'DSARAUC01',   1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				//2
				ConexionServ.query(consulta, ['Arauca Betania', 'DSARABE01', 'DSARABE01',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				//3
				ConexionServ.query(consulta, ['Arauquita', 'DSARAUQ01', 'DSARAUQ01',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				//4
				ConexionServ.query(consulta, ['Arauquita Maranatha', 'DSARAUQ02', 'DSARAUQ02',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				//5
				ConexionServ.query(consulta, ['Bethel', 'DSBETHE01', 'DSBETHE01',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				//6
				ConexionServ.query(consulta, ['Cúcuta Central', 'DSCUCUC01', 'DSCUCUC01',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				//7

				ConexionServ.query(consulta, ['Canaán', 'DSCANAA01', 'DSCANAA01',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				//8

				ConexionServ.query(consulta, ['Fortul', 'DSFORTU01', 'DSFORTU01',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});
				//9
				ConexionServ.query(consulta, ['Juan Atalaya', 'DSJUANA01', 'DSJUANA01',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				//10

				ConexionServ.query(consulta, ['Libertad', 'DSLIBER01', 'DSLIBER01',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				//11

				ConexionServ.query(consulta, ['Nuevo Caranal', 'DSCARAN01', 'DSCARAN01',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				//12

				ConexionServ.query(consulta, ['Ocaña', 'DSOCAÑA01', 'DSOCAÑA01',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				//13

				ConexionServ.query(consulta, ['Palestina', 'DSPALES01', 'DSPALES01',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				//14

				ConexionServ.query(consulta, ['Pamplona', 'DSPAMPL01', 'DSPAMPL01',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				//15

				ConexionServ.query(consulta, ['Patios', 'DSPATIO01', 'DSPATIO01',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				//16

				ConexionServ.query(consulta, ['Pueblo Nuevo', 'DSPUEBL01', 'DSPUEBL01',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				//17

				ConexionServ.query(consulta, ['Redención', 'DSREDEN01', 'DSREDEN01',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				//18

				ConexionServ.query(consulta, ['Renacer', 'DSRENAC01', 'DSRENAC01',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});
				//19

				ConexionServ.query(consulta, ['Cubará', 'DSREDCU01', 'DSREDCU01',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				//20


				ConexionServ.query(consulta, ['Saravena Central', 'DSSARAV01', 'DSSARAV01',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				//21

				ConexionServ.query(consulta, ['Tame Central', 'DSTAMEA01', 'DSTAMEA01',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				//22

				ConexionServ.query(consulta, ['Tame Oriental', 'DSTAMET01', 'DSTAMET01',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				//23


				ConexionServ.query(consulta, ['Tibú', 'DSTIBUN01', 'DSTIBUN01',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				//24


				ConexionServ.query(consulta, ['Cúcuta Sión', 'DSSIONA01', 'DSSIONA01',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				//25

				ConexionServ.query(consulta, ['Vichada', 'DSVICHA01', 'DSVICHA01',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				//26

				ConexionServ.query(consulta, ['Getsemani', 'DSVILGE01', 'DSVILGE01',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				//27

				ConexionServ.query(consulta, ['Villa del Rosario', 'DSVILLA01', 'DSVILLA01',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				//28

				ConexionServ.query(consulta, ['Tame Enmanuel', 'DSTAMEE01', 'DSTAMEE01',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


		

				
				// Iglesias
				
				consulta = "INSERT INTO iglesias(nombre, alias, codigo, distrito_id) VALUES(?,?,?,?) ";
				ConexionServ.query(consulta, ['Alfa y Omega -  Pueblo Nuevo', 'CALFAY01', 'CALFAY01',  16]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Alfa y Omega -  Redencion', 'CALFAY02', 'CALFAY02',  17]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Alfa y Omega - Tame Central', 'CALFAY03', 'CALFAY03',  21]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Alfa y Omega - Tame Central', 'CALFAY03', 'CALFAY03',  9]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Alfa y Omega - D. Atalaya', 'CALFAY04', 'CALFAY04',  3]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Alfa y Omega - Arauquita Central', 'CALFAY05', 'CALFAY05',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});



				ConexionServ.query(consulta, ['Arauca -  Arauca Central', 'CARAUC01', 'CARAUC01',  3]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Arauquita -  Arauquita', 'CARAUQ01', 'CARAUQ01',  3]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Bendición- Reiner -  Arauquita -  Arauquita', 'CBENDI01', 'CBENDI01',  3]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Berea -  Vichada', 'CBEREA01', 'CBEREA01',  25]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});
				


				ConexionServ.query(consulta, ['Betania Malvinas -  Nuevo Caranal', 'CBETAN01', 'CBETAN01',  11]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Betania -  Arauca Betania', 'CBETAN02', 'CBETAN02',  2]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Betania -  Cubará', 'CBETAN03', 'CBETAN03',  19]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Betenia -  Juan Atalaya', 'CBETAN04', 'CBETAN04',  9]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Betania - D. Fortul', 'CBETAN05', 'CBETAN05',  8]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});
				

				ConexionServ.query(consulta, ['Betania - Palestina', 'CBETAN06', 'CBETAN06',  13]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Bethel -  Bethel', 'CBETHE01', 'CBETHE01',  5]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});



				ConexionServ.query(consulta, ['Bethel -  Cucuta Sión', 'CBETHE02', 'CBETHE02',  24]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Bethel - Abrego D. Ocaña', 'CBETHE03', 'CBETHE03',  12]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Brasilia -  Arauquita Maranatha', 'CBRASI01', 'CBRASI01',  4]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Buenos Aires -  Pueblo Nuevo', 'CBUENO01', 'CBUENO01',  16]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['El Buen Pastor -  Pueblo Nuevo', 'CBUENP01', 'CBUENP01',  16]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});



				ConexionServ.query(consulta, ['Cabssel -  D. Tibú', 'CCABSS01', 'CCABSS01',  23]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Caled -  Juan Atalaya', 'CCALED01', 'CCALED01',  9]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Caleb - Caranal', 'CCALEB01', 'CCALEB01',  11]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Canaan -  Saravena Bethel', 'CCANAA01', 'CCANAA01',  5]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Canaan -  Cubará', 'CCANAA02', 'CCANAA02',  19]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Canaan -  D. Patios', 'CCANAA03', 'CCANAA03',  15]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});



				ConexionServ.query(consulta, ['Canaan -  D. Canaan', 'CCANAA04', 'CCANAA04',  7]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Canaan - D. Tame Central', 'CCANAA05', 'CCANAA05',  21]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Canaan - D. Ocaña', 'CCANAA06', 'CCANAA06',  12]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Caño Cristal -  Fortul', 'CCAÑOC01', 'CCAÑOC01',  8]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Central de Cúcuta -  Cucuta Central', 'CCENTR01', 'CCENTR01',  6]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Casa de Oración - D. Renacer', 'CCASAO01', 'CCASAO01',  18]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Costa Hermosa -  Arauca Betania', 'CCOSTA01', 'CCOSTA01',  2]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Cravonorte -  Arauca Betania', 'CCRAVO01', 'CCRAVO01',  2]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Cristo la Esperanza -  Getsemani', 'CCRIST01', 'CCRIST01',  26]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Cristo Redentor - Patios', 'CCRIRE01', 'CCRIRE01',  15]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Ebenezer -  Tame Central', 'CEBENE01', 'CEBENE01',  21]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Ebenezer-Oasis -  Arauquita Maranatha', 'CEBENE02', 'CEBENE02',  4]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Ebenezer -  Palestina', 'CEBENE03', 'CEBENE03',  13]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Ebenezer -  Redencion', 'CEBENE04', 'CEBENE04',  17]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});
				

				ConexionServ.query(consulta, ['Ebenezer Chitaga - D Pamplona', 'CEBENE05', 'CEBENE05',  14]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Eden -  Arauquita Maranatha', 'CEDENI01', 'CEDENI01',  4]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Eden -  Saravena Central', 'CEDENI02', 'CEDENI02',  20]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Eden -  Villa Del Rosario', 'CEDENI03', 'CEDENI03',  27]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Eden -  Ocaña', 'CEDENI04', 'CEDENI04',  12]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Eden Brisas - Tame Central', 'CEDENT01', 'CEDENT01',  21]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Efeso -  Tame Oriental', 'CEFESO01', 'CEFESO01',  22]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Emaus -  Pamplona', 'CEMAUS01', 'CEMAUS01',  14]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Emaus -  Patios', 'CEMAUS02', 'CEMAUS02',  15]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Emaus -  D. Cubará', 'CEMAUS03', 'CEMAUS03',  19]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Emaus - D. Bethel', 'CEMAUS04', 'CEMAUS04',  5]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Embajadores - Cúcuta Central', 'CEMBAJ01', 'CEMBAJ01',  6]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Enacore - Tame central', 'CENACO01', 'CENACO01',  21]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Enmanuel -  Tame Enmanuel', 'CENMAN01', 'CENMAN01',  28]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Enmanuel-Pesquera -  Arauquita', 'CENMAN02', 'CENMAN02',  3]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Enmanuel -  Redencion', 'CENMAN03', 'CENMAN03',  17]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Enmanuel -  Juan Atalaya', 'CENMAN04', 'CENMAN04',  9]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Enmanuel - Arauquita  Maranatha', 'CENMAN06', 'CENMAN06',  4]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Enmanuel - Pueblo Nuevo', 'CENMAN07', 'CENMAN07',  16]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Esmirna - Tame Oriental', 'CESMIR01', 'CESMIR01',  22]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Estrella del Amanecer -  Cucuta Central', 'CESTRE01', 'CESTRE01',  6]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Estrella de Jacob - Arauca Central', 'CESTRE02', 'CESTRE02',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});



				ConexionServ.query(consulta, ['Filadelfia -  Cubará', 'CFILAD02', 'CFILAD02',  19]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Filadelfia -  D. Patios', 'CFILAD03', 'CFILAD03',  15]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});



				ConexionServ.query(consulta, ['Filadelfia -  Juan Atalaya', 'CFILAD04', 'CFILAD04',  9]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Filadefia -  Ocaña', 'CFILAD05', 'CFILAD05',  12]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Filadelfia - Redención', 'CFILAD06', 'CFILAD06',  17]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Fortul -  Fortul', 'CFORTU01', 'CFORTU01',  8]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Fuerte Pregon -  Villa Del Rosario', 'CFUERT01', 'CFUERT01',  27]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Galaad -  Patios', 'CGALAA01', 'CGALAA01',  15]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Galilea -  Pamplona', 'CGALIL01', 'CGALIL01',  14]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Genezareth -  Bethel', 'CGENEZ01', 'CGENEZ01',  5]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Genezareth -  Villa Del Rosario', 'CGENEZ02', 'CGENEZ02',  27]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Gerisim - Villa del Rosario', 'CGERIS01', 'CGERIS01',  27]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Gerizin - Palestina', 'CGERIZ01', 'CGERIZ01',  13]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Getsemany -  Nuevo Caranal', 'CGETSE01', 'CGETSE01',  11]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Getsemany -  Bethel', 'CGETSE02', 'CGETSE02',  5]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Getsemany -  Cubará', 'CGETSE03', 'CGETSE03',  19]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Getsemani -  Getsemani', 'CGETSE04', 'CGETSE04',  26]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Getsemany -  Juan Atalaya', 'CGETSE05', 'CGETSE05',  9]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Getsemani - Ocaña', 'CGETSE06', 'CGETSE06',  12]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Genezaret - Atalaya', 'CGENEZ03', 'CGENEZ03',  9]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Glondrinas -  Palestina', 'CGLOND01', 'CGLOND01',  13]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Gran Faro Toledo - Pamplona', 'CGRAFA01', 'CGRAFA01',  14]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Hashen-Peralonso -  Arauquita Maranatha', 'CHASHE01', 'CHASHE01',  4]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Heraldo -  Bethel', 'CHERAL0', 'CHERAL0',  5]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Hebron - Tame Central', 'CHEBRO01', 'CHEBRO01',  21]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Hebron - Bethel', 'CHEBRO02', 'CHEBRO02',  5]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Horeb, La Hermosa -  Oriental', 'CHOREB01', 'CHOREB01',  22]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Horeb- San Luis -  Arauquita Maranatha', 'CHOREB02', 'CHOREB02',  4]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Horeb -  Saravena Bethel', 'CHOREB03', 'CHOREB03',  5]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Horeb -  Patios', 'CHOREB04', 'CHOREB04',  15]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Gr. Horeb - D. Libertad', 'CHOREB05', 'CHOREB05',  10]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Grupo Horeb - Cubará', 'CHOREB06', 'CHOREB06',  19]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Horeb - Palestina', 'CHOREB08', 'CHOREB08',  13]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Jehova Jireth - Vichada', 'CJEHOV01', 'CJEHOV01',  25]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Jerico -  D. Renacer', 'CJERIC01', 'CJERIC01',  18]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Jerusalen -  Tame Central', 'CJERUS01', 'CJERUS01',  21]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Jerusalen -  Palestina', 'CJERUS02', 'CJERUS02',  13]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Jerusalen -  Cucuta Sión', 'CJERUS03', 'CJERUS03',  24]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Jerusalen - Pueblo Nuevo', 'CJERUS06', 'CJERUS06',  16]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Jerusalen -  Patios', 'CJERUS04', 'CJERUS04',  15]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Jerusalen Holanda - Tame Central', 'CJERHO01', 'CJERHO01',  21]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Jezreel - Libertad', 'CJEZRE01', 'CJEZRE01',  10]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Jerusalen - Cubará', 'CJERUS07', 'CJERUS07',  19]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Jireh - Arauquita', 'CJIREH01', 'CJIREH01',  3]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['La Esperanza - Getsemani', 'CJESUS05', 'CJESUS05',  26]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Jehova Nisi - D. Pueblo Nuevo', 'CJOHOV01', 'CJOHOV01',  16]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Jordan -  Pueblo Nuevo', 'CJORDA01', 'CJORDA01',  16]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['La Roca -  Libertad', 'CLAROC01', 'CLAROC01',  10]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Legado -  Cucuta Sión', 'CLEGAD01', 'CLEGAD01',  24]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['La Hermosa - Fortul', 'CLAHER01', 'CLAHER01',  8]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['La Hermosa - Cúcuta Sión', 'CLAHER02', 'CLAHER02',  24]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Mahanain -  Arauquita Maranatha', 'CMAHAN01', 'CMAHAN01',  4]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Mahanain -  Cubará', 'CMAHAN02', 'CMAHAN02',  19]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Mahanain -  Pamplona', 'CMAHAN03', 'CMAHAN03',  14]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Manantial - D. Cubará', 'CMANAN02', 'CMANAN02',  19]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Maranatha -  Arauquita Maranatha', 'CMARAN01', 'CMARAN01',  4]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Maranatha -  Palestina', 'CMARAN02', 'CMARAN02',  13]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Maranatha -  Juan Atalaya', 'CMARAN03', 'CMARAN03',  9]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Maranatha -  Vichada', 'CMARAN04', 'CMARAN04',  25]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Maranatha -  Ocaña', 'CMARAN05', 'CMARAN05',  12]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Orion - Tame Oriental', 'CMARAN06', 'CMARAN06',  22]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Maranatha - Arauca Betenia', 'CMARAN07', 'CMARAN07',  2]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Mies -  Nuevo Caranal', 'CMIESI01', 'CMIESI01',  11]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Monte de los Olivos -  Palestina', 'CMONTE01', 'CMONTE01',  13]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Monte Carmelo -  Cubará', 'CMONTE02', 'CMONTE02',  19]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Monte Alto -  D. Tibú', 'CMONTE03', 'CMONTE03',  23]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Moriach - Pueblo Nuevo', 'CMORIA01', 'CMORIA01',  16]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Nueva Jerusalen  -  Pamplona', 'CNUEVA01', 'CNUEVA01',  14]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Nueva Jerusalen -  Getsemani ', 'CNUEVA02', 'CNUEVA02',  26]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Nueva Jerusalen - Atalaya ', 'CNUEJE01', 'CNUEJE01',  9]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Nueva Esperanza -  Libertad ', 'CNUEVA03', 'CNUEVA03',  10]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Nueva Galilea - Cúcuta Sión ', 'CNVAGA01', 'CNVAGA01',  24]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Nueva Esperanza - Ocaña ', 'CNUEVA04', 'CNUEVA04',  12]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Nuevo Eden -  Nuevo Caranal ', 'CNUEVO01', 'CNUEVO01',  11]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Ocaña -  Ocaña ', 'COCAÑA01', 'COCAÑA01',  12]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Olivares -  Pueblo Nuevo ', 'COLIVA01', 'COLIVA01',  16]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Orión -  Fortul ', 'CORION01', 'CORION01',  8]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Orion -  Cúbará ', 'CORION02', 'CORION02',  19]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Ovejas -  Libertad ', 'COVEJA01', 'COVEJA01',  10]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Paraiso Pachelly -  D. Tibú ', 'CPACHE01', 'CPACHE01',  23]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Palestina -  Palestina ', 'CPALES01', 'CPALES01',  13]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Palestina -  Libertad ', 'CPALES02', 'CPALES02',  10]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Paraiso -  Arauca Betania', 'CPARAI01', 'CPARAI01',  2]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Paraiso -  Palestina', 'CPARAI02', 'CPARAI02',  13]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Paraiso Bochalema -  Patios', 'CPARAI03', 'CPARAI03',  15]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Paraiso -  Getsemani', 'CPARAI04', 'CPARAI04',  26]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Paraiso - D. Bethel', 'CPARAI05', 'CPARAI05',  5]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Peniel -  Bethel', 'CPENIE01', 'CPENIE01',  5]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Peniel -  Cúbará', 'CPENIE02', 'CPENIE02',  19]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Peniel -  Libertad', 'CPENIE03', 'CPENIE03',  10]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Peniel Simon - Pamplona', 'CPENIEL04', 'CPENIEL04',  14]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Peniel - Arauquita central', 'CPENIE05', 'CPENIE05',  3]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Peniel - Tame Oriental', 'CPENIE06', 'CPENIE06',  22]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Puerto Rico - Redencion', 'CPTORI01', 'CPTORI01',  17]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

					ConexionServ.query(consulta, ['Puerto Rondon -  Tame Central', 'CPUERT01', 'CPUERT01',  21]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				
				ConexionServ.query(consulta, ['Ragonvalia - Villa del Rosario', 'CRAGON01', 'CRAGON01',  27]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Redención -  Redencion', 'CREDEN01', 'CREDEN01',  17]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Redención -  Ocaña', 'CREDEN02', 'CREDEN02',  12]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Redención - Cúcuta Sión', 'CREDEN03', 'CREDEN03',  24]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Refugio -  D. Atalaya', 'CREFUG01', 'CREFUG01',  9]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Remanente -  Nuevo Caranal', 'CREMAN01', 'CREMAN01',  11]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Filial Remanente - D. Arauquita', 'CREMAN02', 'CREMAN02',  3]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Renacer-Maporita -  Arauquita', 'CRENAC01', 'CRENAC01',  3]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Renacer -  Redención', 'CRENAC02', 'CRENAC02',  17]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Renacer -  D. Renacer', 'CRENAC03', 'CRENAC03',  18]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Renacer -  Vichada', 'CRENAC04', 'CRENAC04',  25]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Renacer -  Ocaña', 'CRENAC05', 'CRENAC05',  12]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Renacer - Nuevo Caranal', 'CRENAC07', 'CRENAC07',  11]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Renacer - Tame Oriental', 'CRENAC06', 'CRENAC06',  22]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Renacer - D. Arauca Central', 'CRENAC08', 'CRENAC08',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Renacer - D. Libertad', 'CRENAC09', 'CRENAC09',  10]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Renacer - Saravena Central', 'CRENAC10', 'CRENAC10',  20]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Renacer - Arauquita Maranatha', 'CRENAC011', 'CRENAC011',  4]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Salen -  Tame Oriental', 'CSALEN01', 'CSALEN01',  22]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Sama -  Nuevo Caranal', 'CSAMAI01', 'CSAMAI01',  11]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Siloe -  Pamplona', 'CSAMAR01', 'CSAMAR01',  14]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Samaritana -  Ocaña', 'CSAMAR02', 'CSAMAR02',  12]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Horeb - San francisco  - D. Nuevo Caranal', 'CHOREB07', 'CHOREB07',  11]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Saravena Central -  Saravena Central', 'CSARAV01', 'CSARAV01',  20]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Salvación -  Ocaña', 'CSALVA01', 'CSALVA01',  12]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Sardis - D. Sión', 'CZARDI01', 'CZARDI01',  24]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Sarón -  Arauca Central', 'CSARON01', 'CSARON01',  1]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Saron -  Palestina', 'CSARON02', 'CSARON02',  13]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Saron -  Bethel', 'CSARON03', 'CSARON03',  5]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Sarón - Pamplona', 'CSARON04', 'CSARON04',  14]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Shaday - Bethel', 'CSHADA01', 'CSHADA01',  5]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Shalon, Panama -  Pueblo Nuevo', 'CSHALO01', 'CSHALO01',  16]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Senderos - Villa del Rosario', 'CSENDE01', 'CSENDE01',  27]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Shalon -  Bethel', 'CSHALO02', 'CSHALO02',  5]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});



				ConexionServ.query(consulta, ['Valle de Sarón - D. Cucuta Central', 'CSHALO03', 'CSHALO03',  6]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Siloe -  Tame Central', 'CSILOE01', 'CSILOE01',  21]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Siloe -  Arauquita Maranatha', 'CSILOE02', 'CSILOE02',  4]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Siloe -  Bethel', 'CSILOE03', 'CSILOE03',  5]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Siloe - Ocaña', 'CSILOE04', 'CSILOE04',  12]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Sinai -  Cubará', 'CSINAI01', 'CSINAI01',  19]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Sinai -  Patios', 'CSINAI02', 'CSINAI02',  15]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Sinai - D. Pueblo Nuevo', 'CSINAI03', 'CSINAI03',  16]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Sinai - Vichada', 'CSINAI04', 'CSINAI04',  25]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Grupo Sion - Cubará', 'CSIONG01', 'CSIONG01',  19]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Sion -  Bethel', 'CSIONI01', 'CSIONI01',  5]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Sion -  Cucuta Sión', 'CSIONI02', 'CSIONI02',  24]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Sión -  Ocaña', 'CSIONI03', 'CSIONI03',  12]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Smirna -  Cucuta Central', 'CSMIRN01', 'CSMIRN01',  6]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Soledad -  D. Tibú', 'CSOLED01', 'CSOLED01',  23]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Sucot  -  Fortul', 'CSUCOT01', 'CSUCOT01',  8]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['El Caucho - D. Arauquita', 'CCAUCH01', 'CCAUCH01',  3]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Amanecer - Nuevo Caranal', 'CAMANE01', 'CAMANE01',  11]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['Grupo Tabiro - D. Cúcuta Central', 'CTABIR01', 'CTABIR01',  6]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Grupo Torcoroma 3 - D. Libertad', 'CTORCO03', 'CTORCO03',  10]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Tres Angeles -  Villa Del Rosario', 'CTRESA01', 'CTRESA01',  27]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['El Vergel -  Pueblo Nuevo', 'CVERGE01', 'CVERGE01',  16]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Villa de Emaus -  Tame Central', 'CVILLA01', 'CVILLA01',  21]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});
				
				ConexionServ.query(consulta, ['Voz de Salvación -  Palestina', 'CVOZDE01', 'CVOZDE01',  13]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['Zulia  -  D. Atalaya', 'CZULIA01', 'CZULIA01',  9]).then(function(result) {
		
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

		
				
				
				


				
				// AUDITORIAS
				consulta = "INSERT INTO auditorias(fecha, hora, iglesia_id) VALUES(?,?,?) ";
				ConexionServ.query(consulta, ['2015-01-01', '10:10:00am', 1]).then(function(result) {
					console.log('Audi prueba insertada');
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				// Uniones
				consulta = "INSERT INTO uniones(nombre, alias, codigo) VALUES(?,?,?) ";
				ConexionServ.query(consulta, ['UNION COLOMBIANA DEL NORTE', 'AGC111', 'AGC111']).then(function(result) {
					console.log('uniones prueba insertada');
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				// Asociaciones
				
				consulta = "INSERT INTO asociaciones(nombre, alias, codigo, union_id) VALUES(?,?,?,?) ";
				ConexionServ.query(consulta, ['ASOCIACIÓN DEL ORIENTE', 'AGC811', 'AGC811' , 1]).then(function(result) {
					console.log('Audi prueba insertada');
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['ASOCIACIÓN DEL NORESTE', 'AGCN11', 'AGCN11' , 1]).then(function(result) {
					console.log('Audi prueba insertada');
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});



				ConexionServ.query(consulta, ['ASOCIACIÓN DEL CENTRO ORIENTE', 'AGCT11', 'AGCT11' , 1]).then(function(result) {
					console.log('Audi prueba insertada');
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});


				ConexionServ.query(consulta, ['ASOCIACIÓN DEL CARIBE', 'AGCC11', 'AGCC11' , 1]).then(function(result) {
					console.log('Audi prueba insertada');
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['ASOCIACIÓN DEL ATLANTICO', 'AGC211', 'AGC211' , 1]).then(function(result) {
					console.log('Audi prueba insertada');
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['ASOCIACIÓN ISLAS', 'AGC611', 'AGC611' , 1]).then(function(result) {
					console.log('Audi prueba insertada');
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['ASOCIACIÓN CENTRO OCCIDENTAL', 'AGCW11', 'AGCW11' , 1]).then(function(result) {
					console.log('Audi prueba insertada');
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

				ConexionServ.query(consulta, ['ASOCIACIÓN SUR OCCIDENTAL', 'AGCS11', 'AGCS11' , 1]).then(function(result) {
					console.log('Asociación de prueba insertada');
				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

					*/
				
				
			}
			
        }, function(tx) {
          console.log("", tx);
		});
		
	};
	
	
    
})