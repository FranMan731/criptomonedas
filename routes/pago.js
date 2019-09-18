'use strict'

var express = require('express');
var MercadoPago = require('../controllers/mercado_pago.js');
var path    = require("path");

var api = express.Router();
var md_auth = require('../middlewares/auth.js');

api.post('/pago/mp', md_auth.ensureAuth, MercadoPago.crearPago);
api.post('/mercado_pago/notifications', MercadoPago.notifications);
api.get('/mercado_pago/success', MercadoPago.mercadopagoSuccess);

module.exports = api;