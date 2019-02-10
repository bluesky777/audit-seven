angular.module("auditoriaApp")


.controller("GastosAuditoriaModalCtrl", function($uibModalInstance, $scope, auditoria, ConexionServ, toastr, $filter) {
    
    $scope.auditoria                = auditoria;
    
    
    
    $scope.getConcordancias = function(val) {
        consulta 	= 'SELECT DISTINCT g.descripcion FROM gastos_mes g WHERE g.descripcion like "%' + val + '%"';
        return ConexionServ.query(consulta).then(function(response){
            return response.map(function(item){
                return item.descripcion;
            });
        });
    };
      

   	$scope.eliminarGasto = function(gasto){
        if($scope.auditoria.cerrada){
			toastr.warning('Debes abrir la auditoría para hacer cambios en ella.');
			return
		}
	  	var res = confirm("¿Seguro que desea eliminar -" + gasto.descripcion + "("+gasto.valor+")-?");

		if (res == true) {

		 	consulta ="DELETE FROM gastos_mes WHERE rowid=? ";

			ConexionServ.query(consulta,[gasto.rowid]).then(function(result){

				console.log('Gasto mes eliminido', result);
				$scope.auditoria.gastos_detalle = $filter('filter') ($scope.auditoria.gastos_detalle, {rowid: '!' + gasto.rowid})
                toastr.success('Gasto eliminado.');
                $scope.focusOnValorNew  = true;
                $scope.actualizarGastosSoportadoLibro();
                
			} , function(tx){
				console.log('Libro mes no se pudo Eliminar' , tx)
			});
		}
	}
	 

    $scope.agregarGasto = function(auditoria){
        if($scope.auditoria.cerrada){
			toastr.warning('Debes abrir la auditoría para hacer cambios en ella.');
			return
		}
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
        if($scope.auditoria.cerrada){
			toastr.warning('Debes abrir la auditoría para hacer cambios en ella.');
			return
		}
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
        if (!$scope.auditoria.gastos_detalle) {
            return 0;
        }
        suma = 0;
        
        for (let i = 0; i < $scope.auditoria.gastos_detalle.length; i++) {
            suma = suma + parseInt($scope.auditoria.gastos_detalle[i].valor);
        }
        return suma;
    }
    
    $scope.actualizarGastosSoportadoLibro = function(){
        if($scope.auditoria.cerrada){
			toastr.warning('Debes abrir la auditoría para hacer cambios en ella.');
			return
		}
        suma = $scope.sumatoriaGastos();
        
        consulta 	= 'UPDATE auditorias SET gastos_mes_por_regis=? WHERE rowid=?';

		ConexionServ.query(consulta, [suma, $scope.auditoria.rowid]).then(function(){
            $scope.auditoria.gastos_mes_por_regis = suma;
		}, function(){
			toastr.error('NO se actualizó libro.');
		});
    }

	
    $scope.ok = function () {
        $uibModalInstance.close($scope.auditoria);
    };
	
});
