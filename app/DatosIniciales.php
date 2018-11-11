<?php namespace App\Http\Controllers\AuditSystem;

use Request;
use Hash;

use DB;
use Carbon\Carbon;

class DatosIniciales {

	public function insertarUnionAudit()
	{
		
		$uniones 		= DB::select('SELECT * from au_uniones;');
		
		if (count($uniones) == 0) {
			$now = Carbon::now('America/Bogota');
			
			$consulta = "INSERT INTO au_uniones
					(id, nombres, alias, codigo, created_at, updated_at)
				VALUES
					(1, 'UNION COLOMBIANA DEL NORTE', 'AGC111', 'AGC111', '".$now."', '".$now."')
					;";
					
			DB::insert($consulta);
			
			$consulta = "INSERT INTO au_auditorias
					(fecha, hora, iglesia_id, created_at, updated_at)
				VALUES
					('2018-10-01', '10:10:00am', 1, '".$now."', '".$now."')
					;";
					
			DB::insert($consulta);
		}
		return 'Insertando';
	}


	public function insertarAsociaciones()
	{
		
		$taxis 		= DB::select('SELECT * from au_asociaciones;');
		
		if (count($taxis) == 0) {
			$now = Carbon::now('America/Bogota');
			
			$consulta = "INSERT INTO au_asociaciones
					(nombre, alias, codigo, union_id, created_at, updated_at)
				VALUES
					('ASOCIACIÓN DEL ORIENTE', 'AGC811', 'AGC811', 1, '".$now."', '".$now."'),
					('ASOCIACIÓN DEL NORESTE', 'AGCN11', 'AGCN11', 1, '".$now."', '".$now."')
					;";
					
			DB::insert($consulta);
		}
		return 'Insertando';
	}
	

	public function insertarDistritos()
	{
		
		$elems 		= DB::select('SELECT * from au_distritos;');
		
		if (count($elems) == 0) {
			$now = Carbon::now('America/Bogota');
			
			$consulta = "INSERT INTO au_distritos
					(id, nombre, alias, codigo, pastor_id, created_at, updated_at)
				VALUES
					(1, 'Arauca Central', 'DSARAUC01', 'DSARAUC01', 1, '".$now."', '".$now."'),
					(2, 'Arauca Betania', 'DSARABE01', 'DSARABE01',  1, '".$now."', '".$now."')
					;";
					
			DB::insert($consulta);
		}
		return 'Insertando';
	}


	public function insertarUsuarios()
	{
		
		$users 		= DB::select('SELECT * from tx_users;');
		
		if (count($users) == 0) {
			$now = Carbon::now('America/Bogota');
			
			$consulta = "INSERT INTO au_users
					(nombres, apellidos, username, password, tipo, sexo, created_at, updated_at)
				VALUES
					('Joseth D', 'Guerrero', 'joseth',  '123', 'Admin', 'M', '".$now."', '".$now."'),
					('Gustavo', 'Pérez', 'gustavo',  '123', 'Auditor', 'M', '".$now."', '".$now."'),
					('Daniel', 'Grandas', 'daniel',  '123', 'Pastor', 'M', '".$now."', '".$now."'),
					('Edilson', 'Marquez', 'edilson',  '123', 'Tesorero', 'M', '".$now."', '".$now."')
					;";
					
			DB::insert($consulta);
		}
		return 'Insertando';
	}



	public function insertarIglesias()
	{
		
		$users 		= DB::select('SELECT * from au_iglesias;');
		
		if (count($users) == 0) {
			$now = Carbon::now('America/Bogota');
			
			$consulta = "INSERT INTO au_users
					(nombre, alias, codigo, distrito_id, created_at, updated_at)
				VALUES
					('Alfa y Omega -  Pueblo Nuevo', 'CALFAY01', 'CALFAY01', 16, '".$now."', '".$now."'),
					('Alfa y Omega -  Redencion', 'CALFAY02', 'CALFAY02',  17, '".$now."', '".$now."'),
					('Alfa y Omega - Tame Central', 'CALFAY03', 'CALFAY03',  21, '".$now."', '".$now."'),
					('Alfa y Omega - Tame Central', 'CALFAY03', 'CALFAY03',  9, '".$now."', '".$now."')
					;";
					
			DB::insert($consulta);
		}
		return 'Insertando';
	}


}