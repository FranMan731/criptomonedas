'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PublicacionSchema = Schema({
	id_usuario: { type: Schema.ObjectId, ref: 'Usuario'},
    tipo: String,
    cantidad: Number,
    valor: Number,
    fecha: Date,
    estado: {type: String, enum: ['En espera', 'En proceso', 'Exito', 'Cancelado'], default: 'En espera'}
});

module.exports = mongoose.model('Publicacion', PublicacionSchema);