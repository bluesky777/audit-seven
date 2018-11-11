angular.module("auditoriaApp")


.controller("EfectivoAuditoriaModalCtrl", function($uibModalInstance, $scope, auditoria, ConexionServ, toastr, $filter) {
    
    $scope.auditoria                = auditoria;
    
    
	$scope.traerDatos = function(){

		consulta 	= 'SELECT d.*, d.rowid FROM dinero_efectivo d WHERE d.auditoria_id=?';
		
		ConexionServ.query(consulta, [$scope.auditoria.rowid]).then(function(result) {
            if (result.length == 0) {
                promesas = [];
                billetes = [50,100,200,500,1000,2000,5000,10000,20000,50000,100000];
                
                for (let i = 0; i < billetes.length; i++) {
                    const bill = billetes[i];
                    consulta 	= 'INSERT INTO dinero_efectivo(valor, descripcion, auditoria_id) VALUES (?,?,?)';
		
                    prome = ConexionServ.query(consulta, [0, bill, auditoria.rowid])
                    prome.then(function(result) {
                        
                    }, function(tx) {
                        console.log("Error no se pudo crear dinero.", tx);
                    });
                    
                    promesas.push(prome);
                }
                
                Promise.all(promesas).then(function(r){
                    $scope.traerDatos();
                });
            }else{
                $scope.auditoria.dinero_detalle = result;
                $scope.actualizarGastosSoportadoLibro();
            }
            
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
      

   	$scope.eliminarTodo = function(){
	  	
	  	var res = confirm("¿Seguro que desea eliminar dinero?");

		if (res == true) {

		 	consulta ="DELETE FROM dinero_efectivo WHERE auditoria_id=? ";

			ConexionServ.query(consulta,[$scope.auditoria.rowid]).then(function(result){

				console.log('Dineros de auditoría eliminido', result);
				$scope.auditoria.dinero_detalle = [];
                toastr.success('Dineros eliminados.');
                $scope.focusOnValorNew  = true;
                $scope.actualizarGastosSoportadoLibro();
                
			} , function(tx){
				console.log('Libro mes no se pudo Eliminar' , tx)
			});
		}
	}
	 

    $scope.agregarGasto = function(auditoria){
	  	
        consulta ="INSERT INTO gastos_mes(auditoria_id, valor, descripcion) VALUES(?,?,?) ";
        
        if ($scope.descrip_gasto_new == undefined || $scope.descrip_gasto_new == null) {
            $scope.descrip_gasto_new = '';
        }

        ConexionServ.query(consulta,[auditoria.rowid, $scope.valor_gasto_new, $scope.descrip_gasto_new]).then(function(result){
            
            $scope.auditoria.gastos_detalle.push({ 
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
		consulta 	= 'UPDATE dinero_efectivo SET ' + columna + '=? WHERE rowid=?';
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

    

    $scope.sumatoria = function(){
        if (!$scope.auditoria.dinero_detalle) {
            return 0;
        }
        suma = 0;
        
        for (let i = 0; i < $scope.auditoria.dinero_detalle.length; i++) {
            sum_billetes = parseInt($scope.auditoria.dinero_detalle[i].valor) * parseInt($scope.auditoria.dinero_detalle[i].descripcion);
            suma = suma + sum_billetes;
            $scope.auditoria.dinero_detalle[i].sum_billetes     = $filter('currency')(sum_billetes, '$', 0);
            $scope.auditoria.dinero_detalle[i].descripcion_str  = $filter('currency')($scope.auditoria.dinero_detalle[i].descripcion, '$', 0);
        }
        $scope.total = $filter('currency')(suma, '$', 0);
        return suma;
    }
    
    $scope.actualizarGastosSoportadoLibro = function(){
        suma = $scope.sumatoria();
        
        consulta 	= 'UPDATE auditorias SET dinero_efectivo=? WHERE rowid=?';

		ConexionServ.query(consulta, [suma, $scope.auditoria.rowid]).then(function(){
            $scope.auditoria.dinero_efectivo = suma;
		}, function(){
			toastr.error('NO se actualizó libro.');
		});
    }

	
    $scope.ok = function () {
        $uibModalInstance.close($scope.auditoria);
    };
	
});
