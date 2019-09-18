'use strict'

var express = require('express');
var app = express();

//Cargar rutas
var usuario_routes = require('./usuario.js');
var publicacion_routes = require('./publicacion.js');
var comprador_routes = require('./comprador.js');
var pago_routes = require('./pago.js');
//rutas
app.use('/api/v1', usuario_routes);
app.use('/api/v1', publicacion_routes);
app.use('/api/v1', comprador_routes);
app.use('/api/v1', pago_routes);

module.exports = app;