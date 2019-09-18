'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompradorSchema = Schema({
	id_comprador: { type: Schema.ObjectId, ref: 'Usuario'},
    id_publicacion: { type: Schema.ObjectId, ref: 'Publicacion'},
    fecha: Date
});

module.exports = mongoose.model('Comprador', CompradorSchema);