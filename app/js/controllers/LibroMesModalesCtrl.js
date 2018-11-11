angular.module("auditoriaApp")

.controller("LibroSemanalModalCtrl", function($uibModalInstance, $scope, libro_mes, ConexionServ, toastr, $filter) {
    $scope.libro = libro_mes;


    $scope.ok = function () {
        $uibModalInstance.close($scope.libro);
    };


    $scope.cambiaValor = function(libro, columna, colum_mes) {

        consulta 	= 'UPDATE lib_semanales SET ' + columna + '=? WHERE rowid=?';
        colum 		= columna.charAt(0).toUpperCase() + columna.slice(1);
        
        ConexionServ.query(consulta, [libro[columna], libro.rowid]).then(function(){

            consulta 	= 'UPDATE lib_mensuales SET ' + colum_mes + '=? WHERE rowid=?';
            $scope.total 		= 0;

            if (colum_mes == 'diezmos') {
                $scope.total 		= libro.diezmo_1 + libro.diezmo_2 + libro.diezmo_3 + libro.diezmo_4 + libro.diezmo_5;
            }
            if (colum_mes == 'ofrendas') {
                $scope.total 		= libro.ofrenda_1 + libro.ofrenda_2 + libro.ofrenda_3 + libro.ofrenda_4 + libro.ofrenda_5;
            }
            if (colum_mes == 'especiales') {
                $scope.total 		= libro.especial_1 + libro.especial_2 + libro.especial_3 + libro.especial_4 + libro.especial_5;
            }
            
            
            ConexionServ.query(consulta, [$scope.total, libro.rowid]).then(function(){
                $scope.libro[colum_mes] = $scope.total;
                toastr.success(colum + ' guardado');
            }, function(){
                toastr.error(colum + ' NO guardado');
            });

        }, function(){
            toastr.error(colum + ' NO guardado');
        });

    }
    

    $scope.cambiaDiaconos = function(libro, columna) {

        consulta 	= 'UPDATE lib_semanales SET ' + columna + '=? WHERE rowid=?';
        
        ConexionServ.query(consulta, [libro[columna], libro.rowid]).then(function(){
            toastr.success('Valor guardado');
        }, function(){
            toastr.error('Valor NO guardado');
        });

    }


    return ;
})







.controller("GastosMesCtrl", function($uibModalInstance, $scope, libro_mes, ConexionServ, toastr, $filter) {
    
    $scope.libro                = libro_mes;
    

	$scope.traerDatos = function(){

		consulta 	= 'SELECT g.*, g.rowid FROM gastos_mes g WHERE g.libro_mes_id=?';
		
		ConexionServ.query(consulta, [libro_mes.rowid]).then(function(result) {
            $scope.gastos           = result;
            $scope.focusOnValorNew  = true;
		}, function(tx) {
			console.log("Error no es posbile traer los gastos", tx);
		});

	}

	
    $scope.traerDatos();
    
    
    $scope.getConcordancias = function(val) {
        consulta 	= 'SELECT DISTINCT g.descripcion FROM gastos_mes g WHERE g.descripcion like "%' + val + '%"';
        return ConexionServ.query(consulta).then(function(response){
            return response.map(function(item){
                return item.descripcion;
            });
        });
    };
      

   	$scope.eliminarGasto = function(gasto){
	  	
	  	var res = confirm("¿Seguro que desea eliminar -" + gasto.descripcion + "("+gasto.valor+")-?");

		if (res == true) {

		 	consulta ="DELETE FROM gastos_mes WHERE rowid=? ";

			ConexionServ.query(consulta,[gasto.rowid]).then(function(result){

				console.log('Gasto mes eliminido', result);
				$scope.gastos = $filter('filter') ($scope.gastos, {rowid: '!' + gasto.rowid})
                toastr.success('Gasto eliminado.');
                $scope.focusOnValorNew  = true;
                $scope.actualizarGastosSoportadoLibro();
                
			} , function(tx){
				console.log('Libro mes no se pudo Eliminar' , tx)
			});
		}
	}
	 

    $scope.agregarGasto = function(lib_mens){
	  	
        consulta ="INSERT INTO gastos_mes(libro_mes_id, valor, descripcion) VALUES(?,?,?) ";
        
        if ($scope.descrip_gasto_new == undefined || $scope.descrip_gasto_new == null) {
            $scope.descrip_gasto_new = '';
        }

        ConexionServ.query(consulta,[lib_mens.rowid, $scope.valor_gasto_new, $scope.descrip_gasto_new]).then(function(result){
            
            $scope.gastos.push({ 
                rowid: result.insertId,
                id: null, 
                valor: $scope.valor_gasto_new, 
                descripcion: $scope.descrip_gasto_new
            });
            
            $scope.valor_gasto_new      = '';
            $scope.descrip_gasto_new    = '';
            $scope.focusOnValorNew      = true;
            $scope.actualizarGastosSoportadoLibro();
            
        } , function(tx){
            console.log('Libro mes no se pudo Eliminar' , tx)
        });
    }
    
    
	$scope.cambiaValor = function(gasto, columna) {
        console.log(gasto, columna);
		consulta 	= 'UPDATE gastos_mes SET ' + columna + '=? WHERE rowid=?';
        colum 		= columna.charAt(0).toUpperCase() + columna.slice(1);
        
        if ($scope.descrip_gasto_new == undefined || $scope.descrip_gasto_new == null) {
            $scope.descrip_gasto_new = '';
        }
		
		ConexionServ.query(consulta, [gasto[columna], gasto.rowid]).then(function(){
            $scope.actualizarGastosSoportadoLibro();
			toastr.success(colum + ' guardado');
		}, function(){
			toastr.error(colum + ' NO guardado');
		});

	}

    

    $scope.sumatoriaGastos = function(){
        if (!$scope.gastos) {
            return 0;
        }
        suma = 0;
        
        for (let i = 0; i < $scope.gastos.length; i++) {
            suma = suma + parseInt($scope.gastos[i].valor);
        }
        return suma;
    }
    
    $scope.actualizarGastosSoportadoLibro = function(){
        suma = $scope.sumatoriaGastos();
        
        consulta 	= 'UPDATE lib_mensuales SET gastos_soportados=? WHERE rowid=?';
        
		ConexionServ.query(consulta, [suma, $scope.libro.rowid]).then(function(){
            $scope.libro.gastos_soportados = suma;
		}, function(){
			toastr.error('NO se actualizó libro.');
		});
    }

	
    $scope.ok = function () {
        $uibModalInstance.close($scope.libro);
    };
	
});
