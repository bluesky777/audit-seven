// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

require('dotenv').config();
const path          = require('path');
const express       = require('express');
const app           = express();
var cors            = require('cors');
var http            = require('http').Server(app);
var io              = require('socket.io')(http);
var bodyParser      = require('body-parser');


process.env.JWT_SECRET = 'FB2ywB21v60UosPDYcO7HiVQkQZcFhbQ';

if (!process.env.NODE_PORT) {
	process.env.NODE_PORT = 8787;
}


var reload = ()=>{
	getCurrentWindow().reload()
}
const {getCurrentWindow, globalShortcut} = require('electron').remote;
globalShortcut.register('F5', reload);
globalShortcut.register('CommandOrControl+R', reload);

window.addEventListener('beforeunload', ()=>{
	globalShortcut.unregister('F5', reload);
	globalShortcut.unregister('CommandOrControl+R', reload);
})
  

app.use(cors());
app.use(bodyParser.json()); // Para recibir json desde Angular
app.use("/images", express.static(path.join(__dirname, 'app/img')));
app.use('/api', require('./backend/routes'));




app.get('/', function(req, res){
	res.writeHead(301,
		{ Location: 'app/dist_front/' }
	);
	res.end();
});
	

http.listen(process.env.NODE_PORT, function(){
	console.log('listening on *:'+process.env.NODE_PORT);
});





var User            = require(path.join(__dirname, 'app/conexion/Models/User'));







// Para las fechas
window.fixDate = function(fec, con_hora){
	dia   = fec.getDate();
	mes   = (fec.getMonth() + 1 );
	year  = fec.getFullYear();
  
	if (dia < 10) {
	  dia = '0' + dia;
	}
  
	if (mes < 10) {
	  mes = '0' + mes;
	}
  
	fecha   = '' + year + '-' + mes  + '-' + dia;
	
	if (con_hora){
		hora 	= fec.getHours();
		if (hora<10) { hora = '0' + hora; };
		min 	= fec.getMinutes();
		if (min<10) { min = '0' + min; };
		sec 	= fec.getSeconds();
		if (sec<10) { sec = '0' + sec; };
		fecha 	= fecha + ' ' + hora + ':' + min + ':' + sec
	}
	
	return fecha;
}

window.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
