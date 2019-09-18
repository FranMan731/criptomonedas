'use strict'

var express = require('express');
var UsuarioController = require('../controllers/usuario');

var api = express.Router();
var md_auth = require('../middlewares/auth.js');
var md_captcha = require('../middlewares/captcha.js');

api.post('/registrar', md_captcha.validateCaptcha, UsuarioController.registrar);
api.post('/ingresar', UsuarioController.ingresar);

module.exports = api;