'use strict'

var express = require('express');
var PublicacionController = require('../controllers/publicacion');

var api = express.Router();
var md_auth = require('../middlewares/auth.js');
var md_convertion = require('../middlewares/convertion.js');

api.post('/publicar', [md_auth.ensureAuth, md_convertion.convertion] , PublicacionController.crear);
api.get('/publicacion', PublicacionController.getPublicaciones);
api.get('/publicacion/:id', PublicacionController.getPublicacion);
api.get('/usuario/publicacion', md_auth.ensureAuth, PublicacionController.getPublicacionesUsuario);
api.get('/usuario/publicacion/en-proceso', md_auth.ensureAuth, PublicacionController.getPublicacionesEnProceso);
api.delete('/publicacion/:id', md_auth.ensureAuth, PublicacionController.removePublicacion);

module.exports = api;