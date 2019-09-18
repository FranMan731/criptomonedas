'use strict'

var express = require('express');
var CompradorController = require('../controllers/comprador.js');

var api = express.Router();
var md_auth = require('../middlewares/auth.js');

api.post('/comprador/crear', md_auth.ensureAuth, CompradorController.crear);
api.get('/comprador/compras/en-proceso', md_auth.ensureAuth, CompradorController.getComprasEnProceso);
api.delete('/comprador/cancelar', md_auth.ensureAuth, CompradorController.cancelar);

module.exports = api;