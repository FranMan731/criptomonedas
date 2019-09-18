'use strict'

var socketIO = require('socket.io');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();

var server = http.createServer(app);

module.exports.io = socketIO(server);
require('./controllers/notificaciones.js');

var routes = require('./routes/index.js');

//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//cors
app.use(cors());

//rutas
app.use(express.static(__dirname + '/public'));
app.use(routes);

//Exportar
module.exports = server;