'use strict';

require('./config/config.js');
var mongoose = require('mongoose');
var app = require('./app');

//Conexión a base de datos
mongoose.Promise = global.Promise;
mongoose.connect(process.env.URLDB)
	.then(() => {
		console.log("La conexión se ha realizado con éxito.");

		//Crea el servidor
		app.listen(process.env.PORT, () => {
			console.log("Servidor corriendo en https://app-criptomonedas.herokuapp.com/");
		});
	})
	.catch(err => console.log(err));