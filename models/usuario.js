'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
	email: String,
	password: String,
	paypal: String,
    billetera: String,
	rol: {type: String, enum: ['admin', 'usuario'], default: 'usuario'}
});

module.exports = mongoose.model('Usuario', UsuarioSchema);