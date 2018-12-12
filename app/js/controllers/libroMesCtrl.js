angular.module("auditoriaApp")

.controller("libroMesCtrl", function($scope, ConexionServ, $filter, $uibModal, toastr, AuthServ, $timeout, 	$location, $anchorScroll, tipos_recomendacion, hotkeys) {

	$scope.$parent.sidebar_active 	= false;
	$scope.entidades 				= true;
	$scope.widget_maximized 		= false;
	$scope.widget_maximized_totales = false;
	
    $scope.distrito_new 		= {};
	$scope.modentidades 		= false;
	$scope.verCrearDistrito 	= false;
	$scope.usuarios 			= [];
	$scope.verCrearLibroMensual = false;
	$scope.vercomends 			= false;
	$scope.auditorias 			= [];
	$scope.ocultando_primeras 	= false;

	$scope.meses = [
		{num: 0, mes: 'Enero'},
		{num: 1, mes: 'Febrero'},
		{num: 3, mes: 'Marzo'},
		{num: 4, mes: 'Abril'},
		{num: 5, mes: 'Mayo'},
		{num: 6, mes: 'Junio'},
		{num: 7, mes: 'Julio'},
		{num: 8, mes: 'Agosto'},
		{num: 9, mes: 'Septiembre'},
		{num: 10, mes: 'Octubre'},
		{num: 11, mes: 'Noviembre'},
		{num: 12, mes: 'Diciembre'}
	];

	$scope.years = [
		{year: 2017},
		{year: 2018},
		{year: 2019},
		{year: 2020},
		{year: 2021},
		{year: 2022},
		{year: 2023},
		{year: 2024},
		{year: 2025},
		{year: 2026},
		{year: 2027},
		{year: 2028},
		{year: 2029},
		{year: 2030}
	];
	
	$scope.gridOptions = {
		enableSorting: true,
		enableFiltering: true,
		columnDefs: [
			{ field: 'nombre' },
			{ field: 'alias' },
			{ field: 'celular' },
			{ field: 'tesorero_nombres' }
		],
		onRegisterApi: function( gridApi ) {
			$scope.grid1Api = gridApi;
		}
	};
	
	if (localStorage.ocultando_primeras) {
		if (localStorage.ocultando_primeras == 'true') {
			$scope.ocultando_primeras 	= true;
		}else{
			$scope.ocultando_primeras 	= false;
		}
	}
	
	
	


    $scope.ver_recomendaciones = function(valor) {
		if (valor) {
			$scope.vercomends = true;
		}else{
			if ($scope.vercomends == true) {
				$scope.vercomends = false;
			}else{
				$scope.vercomends = true;
			}
		}
    	


		$timeout(function() {
			$location.hash("caja-recomendaciones");
			$anchorScroll();
		}, 100);
	};
	
	$scope.ver_recomendaciones_true = function(){
		$scope.ver_recomendaciones(true);
	}

	$scope.abrirLibroSemanal = function(libro_mes) {

	    var modalInstance = $uibModal.open({
	        templateUrl: 'templates/libros/libroSemanalModal.html',
	        resolve: {
		        libro_mes: function () {
		        	return libro_mes;
		        }
		    },
	        controller: 'LibroSemanalModalCtrl' // En LibroMesModales.js 
	    });

	    modalInstance.result.then(function (result) {

			for (let i = 0; i < $scope.lib_meses.length; i++) {
				const element = $scope.lib_meses[i];
				
				if (result.rowid == element.rowid) {
					$scope.lib_meses.slice(i, 1, element);
				}
			}
			$scope.actualizar_sumatorias();
	    }, function(r2){
	    	$scope.traerDatos();
	    });


	}



	$scope.abrirGastos = function(libro_mes) {

	    var modalInstance = $uibModal.open({
	        templateUrl: 'templates/libros/gastosMesModal.html',
	        resolve: {
		        libro_mes: function () {
		        	return libro_mes;
		        }
		    },
	        controller: 'GastosMesCtrl' // En LibroMesModales.js 
	    });

	    modalInstance.result.then(function (result) {
			for (let i = 0; i < $scope.lib_meses.length; i++) {
				const element = $scope.lib_meses[i];
				
				if (result.rowid == element.rowid) {
					$scope.lib_meses.slice(i, 1, element);
				}
			}
	    }, function(r2){
	    	$scope.traerDatos();
	    });


	}


	
	$scope.abrirDineroEfectivo = function(libro_mes) {

	    var modalInstance = $uibModal.open({
	        templateUrl: 'templates/libros/EfectivoModal.html',
	        resolve: {
		        auditoria: function () {
		        	return $scope.auditoria;
		        }
		    },
	        controller: 'EfectivoAuditoriaModalCtrl' 
	    });

	    modalInstance.result.then(function (result) {
			/*for (let i = 0; i < $scope.auditoria.gastos_detalle.length; i++) {
				const element = $scope.auditoria.gastos_detalle[i];
				
				if (result.rowid == element.rowid) {
					$scope.auditoria.gastos_detalle.slice(i, 1, element);
				}
			}*/
	    }, function(r2){
	    	$scope.traerDatos();
	    });


	}



	$scope.abrirGastosAuditoria = function(auditoria) {

	    var modalInstance = $uibModal.open({
	        templateUrl: 'templates/libros/gastosAuditoriaModal.html',
	        resolve: {
		        auditoria: function () {
		        	return $scope.auditoria;
		        }
		    },
	        controller: 'GastosAuditoriaModalCtrl' // En LibroMesModales.js 
	    });

	    modalInstance.result.then(function (result) {

	    }, function(r2){
	    	$scope.traerDatos();
	    });


	}



	$scope.abrirRemesas = function(libro_mes) {

	    var modalInstance = $uibModal.open({
			templateUrl: 'templates/libros/remesasModal.html',
			size: 'lg',
	        resolve: {
		        auditoria: function () {
		        	return $scope.auditoria;
				},
				libro_mes: function () {
		        	return libro_mes;
		        }
		    },
	        controller: 'RemesasModalCtrl' // En LibroMesModales.js 
	    });

	    modalInstance.result.then(function (result) {

	    }, function(r2){
	    	$scope.traerDatos();
	    });


	}

	
	$scope.abrirRecomendacionesModal = function(campo) {

	    var modalInstance = $uibModal.open({
			templateUrl: 'templates/libros/recomendacionesCampoModal.html',
			size: 'lg',
	        resolve: {
		        auditoria: function () {
		        	return $scope.auditoria;
				},
				campo: function () {
		        	return campo;
		        }
		    },
	        controller: 'RecomendacionesCampoModalCtrl' // En LibroMesModales.js 
	    });

	    modalInstance.result.then(function (result) {
			if (result.crear_recomend) {
				$scope.ver_recomendaciones(true);
				
				$timeout(function(){
					$scope.$broadcast('craer_recomendacion_campo', result.campo);
				}, 100);
				
			}
	    }, function(r2){
	    	$scope.traerDatos();
	    });


	}



	$scope.cambiaValor = function(libro, columna) {
		fecha_update = window.fixDate(new Date(), true);
		
		consulta 	= 'UPDATE lib_mensuales SET ' + columna + '=?, modificado=? WHERE rowid=?';
		colum 		= columna.charAt(0).toUpperCase() + columna.slice(1);
		
		ConexionServ.query(consulta, [libro[columna], fecha_update, libro.rowid]).then(function(){
			toastr.success(colum + ' guardado');
			$scope.actualizar_sumatorias();
		}, function(){
			toastr.error(colum + ' NO guardado');
		});

	}

	
	$scope.ocultarPrimeras = function(){
		$scope.ocultando_primeras = !$scope.ocultando_primeras;
		localStorage.ocultando_primeras = $scope.ocultando_primeras;
	}


	$scope.crear_libronuevo = function(libro_new) {
		
		if (!$scope.USER.auditoria_id) {
			toastr.warning('No tiene auditoría seleccionada.');
			return;
		}
		
		$scope.creando_libro = true;
		
  		if (libro_new.mes.length > 1) {
			  toastr.warning('Solo puedes seleccionar un mes.');
			  $scope.creando_libro = false;
  			return;
  		}
  		if (libro_new.year == undefined) {
			  toastr.warning('Seleccione el año.');
			  $scope.creando_libro = false;
  			return;
  		}
  		if (libro_new.year.length > 1) {
			toastr.warning('Solo puedes seleccionar un año.');
			$scope.creando_libro = false;
  			return;
  		}

  	

  		year_temp 	= libro_new.year[0];
		mes_temp 	= libro_new.mes[0];
		periodo 	= year_temp + '/';
		
		for (let i = 0; i < $scope.meses.length; i++) {
			if ($scope.meses[i].mes == libro_new.mes[0]) {
				num_mes = $scope.meses[i].num + 1;
				if (num_mes<10) {
					num_mes = '00'+num_mes;
				}else{
					num_mes = '0'+num_mes;
				}
				
				periodo = periodo + num_mes;
			};
			
		}


		consulta 	= 'INSERT INTO lib_mensuales(year, mes, periodo, auditoria_id, diezmos, ofrendas, especiales, remesa_enviada) VALUES(?,?,?,?,?,?,?,?)';
		
		datos = [year_temp, mes_temp, periodo, $scope.USER.auditoria_id,0,0,0,0];

		ConexionServ.query(consulta, datos).then(function(result) {

			consulta 	= 'INSERT INTO lib_semanales(libro_mes_id) VALUES(?)';
			ConexionServ.query(consulta, [result.insertId]).then(function(result) {
				$scope.traerDatos();
			});
			
			// Movemos al siguiente mes
			if (mes_temp=='Enero') {libro_new.mes[0] = 'Febrero'}else if(mes_temp=='Febrero'){libro_new.mes[0] = 'Marzo'}else if(mes_temp=='Marzo'){libro_new.mes[0] = 'Abril'}else if(mes_temp=='Abril'){libro_new.mes[0] = 'Mayo'}else if(mes_temp=='Mayo'){libro_new.mes[0] = 'Junio'}else if(mes_temp=='Junio'){libro_new.mes[0] = 'Julio'}
			  else if(mes_temp=='Julio'){libro_new.mes[0] = 'Agosto'}else if(mes_temp=='Agosto'){libro_new.mes[0] = 'Septiembre'}else if(mes_temp=='Septiembre'){libro_new.mes[0] = 'Octubre'}else if(mes_temp=='Octubre'){libro_new.mes[0] = 'Noviembre'}else if(mes_temp=='Noviembre'){libro_new.mes[0] = 'Diciembre'}
			  else if(mes_temp=='Diciembre'){
					libro_new.year[0] 	= '' + (parseInt(libro_new.year[0]) + 1);
					console.log(libro_new.year[0]);
				  	libro_new.mes[0] 	= 'Enero';
				};
			
			$scope.creando_libro = false;

		}, function(tx) {
			console.log("Error no es posbile crear mes", tx);
			$scope.creando_libro = false;
		});
	};
    $scope.cancelar_crear_distrito = function() {
		$scope.distrito_new 	= {};
		$scope.verCrearDistrito = false;
	};
	
	
	
	
	// ************************************************
	// TRAEMOS TODOS LOS DATOS
	$scope.traerDatos = function(){
		AuthServ.update_user_storage($scope.USER).then((actualizado)=>{
			$scope.USER 		= actualizado;
			$scope.lib_meses 	= [];
			
			// Traigo las auditorías de la iglesia que tengo seleccionada
			consulta 	= 'SELECT *, rowid FROM auditorias WHERE iglesia_id=? ORDER BY fecha, hora, rowid desc';
			ConexionServ.query(consulta, [$scope.USER.iglesia_id]).then(function(rAudi) {
				$scope.auditorias = rAudi;
			}, function(tx) {
				console.log("Error no se pudo traer auditorias", tx);
			});
			
			
			consulta 	= 'SELECT d.*, d.rowid, u.nombres as pastor_nombres, u.apellidos as pastor_apellidos, u.email as pastor_email, u.celular as pastor_celular, ' + 
					'u2.nombres as tesorero_nombres, u2.apellidos as tesorero_apellidos, u2.email as tesorero_email, u2.celular as tesorero_celular ' + 
				'FROM distritos d ' +
				'LEFT JOIN usuarios u ON u.rowid=d.pastor_id and u.eliminado is null  ' +
				'LEFT JOIN usuarios u2 ON u2.rowid=d.tesorero_id and u2.eliminado is null  ' +
				'WHERE d.rowid=?';

			ConexionServ.query(consulta, [actualizado.distrito_id]).then(function(rAudi) {
				$scope.distrito = rAudi[0];
			}, function(tx) {
				console.log("Error no se pudo traer auditorias", tx);
			});
			
			

			consulta 	= 'SELECT m.*, m.rowid, s.*, s.rowid as lib_semanal_id FROM lib_mensuales m ' + 
						'INNER JOIN lib_semanales s ON m.rowid=s.libro_mes_id and m.eliminado is null and m.auditoria_id =? ';
			ConexionServ.query(consulta, [$scope.USER.auditoria_id]).then(function(result) {
				$scope.lib_meses = result;
				
				angular.forEach($scope.lib_meses, function(lib_mes, indice){
					$scope.gastosLibMes(lib_mes);
				})
				
				
				
				consulta 	= 'SELECT a.*, a.rowid FROM auditorias a WHERE rowid=?';
				ConexionServ.query(consulta, [$scope.USER.auditoria_id]).then(function(result) {
					if (result.length == 0) {
						toastr.warning('No hay auditoría seleccionada.');
						return
					}
					$scope.auditoria = result[0];

			
					
					consulta 	= 'SELECT *, rowid FROM gastos_mes WHERE auditoria_id=?';
					ConexionServ.query(consulta, [$scope.USER.auditoria_id]).then(function(rGastos) {
						$scope.auditoria.gastos_detalle = rGastos;
					}, function(tx) {
						console.log("Error no se pudo traer datos", tx);
					});
					
					consulta 	= 'SELECT *, rowid FROM dinero_efectivo WHERE auditoria_id=?';
					ConexionServ.query(consulta, [$scope.USER.auditoria_id]).then(function(rEfectivo) {
						$scope.auditoria.dinero_detalle = rEfectivo;
					}, function(tx) {
						console.log("Error no se pudo traer datos", tx);
					});
					
					$scope.contarRecomendaciones();
					
					
					$scope.actualizar_sumatorias();

				}, function(tx) {
					console.log("Error no se pudo traer datos", tx);
				});


			}, function(tx) {
				console.log("Error no se pudo traer datos", tx);
			});
			
			 
			

		})
		



	}
	
	$scope.traerDatos();
	
	
	
	// Parece que no sirve y lo llamé directamente 
	$scope.$on('contar_recomendaciones', $scope.contarRecomendaciones);
	
	$scope.contarRecomendaciones = function () {

		consulta 	= 'SELECT *, rowid FROM recomendaciones WHERE auditoria_id=?';
		ConexionServ.query(consulta, [$scope.USER.auditoria_id]).then(function(rRecomend) {
			$scope.auditoria.recomendaciones = rRecomend;
			
			
			for (let j = 0; j < tipos_recomendacion.tipos.length; j++) {
				const tipo = tipos_recomendacion.tipos[j];
				$scope.auditoria['reco_cont_'+tipo.tipo] = [];
			}
			
			for (let i = 0; i < $scope.auditoria.recomendaciones.length; i++) {
				const element = $scope.auditoria.recomendaciones[i];
				
				if (element.superada == 0) {
					element.superada = "no"
				}else{
					element.superada = "si"
				}
				if (element.fecha) {
					element.fecha = new Date(element.fecha);
				}
			
				for (let j = 0; j < tipos_recomendacion.tipos.length; j++) {
					const tipo = tipos_recomendacion.tipos[j];
					
					if (tipo.tipo == element.tipo) {
						$scope.auditoria['reco_cont_'+tipo.tipo].push(element);
					}
					
				}
			}
			
		}, function(tx) {
			console.log("Error no se pudo traer datos", tx);
		});
		
	}


	$scope.gastosLibMes = function (lib_mes) {
		consulta 	= 'SELECT g.*, g.rowid FROM gastos_mes g WHERE g.libro_mes_id=?';
		
		ConexionServ.query(consulta, [lib_mes.rowid]).then(function(result) {
			lib_mes.gastos_detalle = result;
		}, function(tx) {
			console.log("Error trayendo gastos de mes, ", lib_mes, tx);
		});
		
		consulta 	= 'SELECT sum(cantidad) as suma FROM remesas r WHERE r.periodo=? and r.org_id=? group by id';
		
		ConexionServ.query(consulta, [lib_mes.periodo, $scope.USER.iglesia_alias]).then(function(result) {
			if (result.length>0) {
				lib_mes.remesa_enviada = Math.abs(result[0].suma);
			}else{
				lib_mes.remesa_enviada = 0;
			}
			
		}, function(tx) {
			console.log("Error trayendo remesas reales, ", lib_mes, tx);
		});
		
		consulta 	= 'SELECT * FROM remesas r WHERE r.periodo=? and r.org_id=?';
		
		ConexionServ.query(consulta, [lib_mes.periodo, $scope.USER.iglesia_alias]).then(function(result) {
			lib_mes.remesas = result;
		}, function(tx) {
			console.log("Error trayendo remesas reales, ", lib_mes, tx);
		});
	}


	



   	$scope.EliminarLibroMensul = function(lib_mens){
	  	
	  	var res = confirm("¿Seguro que desea eliminar?");

		if (res == true) {
			
			fecha_update = window.fixDate(new Date(), true);
			
		 	consulta ="UPDATE lib_mensuales SET eliminado=? WHERE rowid=? ";

			ConexionServ.query(consulta,[fecha_update, lib_mens.rowid]).then(function(result){

				$scope.lib_meses = $filter('filter') ($scope.lib_meses, {rowid: '!' + lib_mens.rowid})
				toastr.success('Mes eliminado.');

			} , function(tx){
				console.log('Libro mes no se pudo Eliminar' , tx)
			});
		}
	}
	 

	$scope.cambiaAuditoria = function(columna) {
		fecha_update = window.fixDate(new Date(), true);
		
		consulta 	= 'UPDATE auditorias SET ' + columna + '=?, modificado=? WHERE rowid=?';
		colum 		= columna.charAt(0).toUpperCase() + columna.slice(1);
		
		ConexionServ.query(consulta, [$scope.auditoria[columna], fecha_update, $scope.auditoria.rowid]).then(function(){
			toastr.success('Saldo guardado');
			$scope.actualizar_sumatorias();
		}, function(){
			toastr.error('Saldo NO guardado');
		});

	}

	$scope.seleccionarAuditorias = function(auditoria) {

		ConexionServ.query('UPDATE usuarios SET auditoria_id=? WHERE rowid=? ', [ auditoria.rowid, $scope.USER.rowid ]).then(function(result) {
			$scope.USER.auditoria_id 		= auditoria.rowid;

			AuthServ.update_user_storage($scope.USER).then(function(usuario){
				$scope.traerDatos();
			});
		});
	}
	
	
	$scope.actualizar_sumatorias = function(){
		aud 				= $scope.auditoria;
		
		sum_diezmos 		= 0;
		sum_ofrendas 		= 0;
		sum_especiales 		= 0;
		sum_diaconos 		= 0;
		sum_diferencia 		= 0;
		sum_gastos 			= 0;
		sum_gastos_sop 		= 0;
		sum_remesa_env 		= 0;
		
		for (let i = 0; i < $scope.lib_meses.length; i++) {
			lib_mes 			= $scope.lib_meses[i];
			
			sum_diezmos 		+= lib_mes.diezmos;
			sum_ofrendas 		+= lib_mes.ofrendas;
			sum_especiales 		+= lib_mes.especiales;
			sum_diaconos 		+= lib_mes.diaconos_1 + lib_mes.diaconos_2 + lib_mes.diaconos_3 + lib_mes.diaconos_4 + lib_mes.diaconos_5;
			sum_gastos 			+= lib_mes.gastos;
			sum_gastos_sop 		+= lib_mes.gastos_soportados;
			sum_remesa_env 		+= lib_mes.remesa_enviada;
		}

		$scope.sum_diezmos 			= $filter('currency')(sum_diezmos, '$', 0);
		$scope.sum_ofrendas 		= $filter('currency')(sum_ofrendas, '$', 0);
		$scope.sum_especiales 		= $filter('currency')(sum_especiales, '$', 0);
		
		sum_totales 				= sum_diezmos + sum_ofrendas + sum_especiales;
		$scope.sum_totales 			= $filter('currency')(sum_totales, '$', 0);
		
		sum_diferencia 				= sum_totales - sum_diaconos;
		$scope.sum_diferencia 		= $filter('currency')(sum_diferencia, '$', 0);
		
		$scope.sum_diaconos 		= $filter('currency')(sum_diaconos, '$', 0);
		
		$scope.sum_20_ofrendas 		= $filter('currency')( sum_ofrendas * 0.2, '$', 0);
		$scope.sum_20_ofrendas 		= $filter('currency')( sum_ofrendas * 0.2, '$', 0);
		sum_ofre_esp 				= (sum_ofrendas * 0.6) + sum_especiales;
		$scope.sum_60_ofrendas 		= $filter('currency')( sum_ofre_esp, '$', 0);
		$scope.sum_gastos 			= $filter('currency')( sum_gastos, '$', 0);
		$scope.sum_gastos_sop 		= $filter('currency')( sum_gastos_sop, '$', 0);
		$scope.sum_dif_gastos 		= $filter('currency')( (sum_gastos - sum_gastos_sop), '$', 0);
		$scope.sum_remesa_num 		= sum_diezmos + sum_ofrendas*0.4;
		$scope.sum_remesa 			= $filter('currency')( $scope.sum_remesa_num, '$', 0);
		$scope.sum_remesa_env 		= $filter('currency')( sum_remesa_env, '$', 0);
		$scope.sum_dif_remesa 		= $filter('currency')( (sum_remesa_env-$scope.sum_remesa_num), '$', 0);
		$scope.sum_disponi_perio	= $filter('currency')( (sum_ofre_esp + aud.saldo_ant), '$', 0);
		
		sum_total_fondos 			= sum_ofre_esp + aud.saldo_ant - sum_gastos;
		$scope.sum_total_fondos 	= $filter('currency')(sum_total_fondos, '$', 0);
		sum_locales_igl 			= sum_total_fondos + aud.ingre_por_registrar;
		$scope.sum_locales_igl 		= $filter('currency')(sum_locales_igl, '$', 0);
		
		total_fondos 				= sum_locales_igl + aud.ingre_sabados + aud.cta_por_pagar + aud.ajuste_por_enviar; 
		$scope.total_fondos 		= $filter('currency')(total_fondos, '$', 0);
		
		total_respaldado 			= aud.saldo_banco + aud.consig_fondos_confia + aud.gastos_mes_por_regis + aud.dinero_efectivo + aud.cta_por_cobrar; 
		$scope.total_respaldado 	= $filter('currency')(total_respaldado, '$', 0);
		
		total_dif 					= total_respaldado - total_fondos;
		$scope.total_dif 			= $filter('currency')(total_dif, '$', 0);
		
	}
	
	
	// Accesos rápidos de teclado
	hotkeys.bindTo($scope)
	.add({
		combo: 'f2',
		description: 'Abrir recomendaciones',
		callback: $scope.ver_recomendaciones_true
	})
	.add({
		combo: 'esc',
		description: 'Salir de recomendaciones',
		callback: function(event, hotkey){
			$scope.vercomends = false;
		}

	})

	
	
	
});
