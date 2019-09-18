'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VentaSchema = Schema({
	id_comprador: { type: Schema.ObjectId, ref: 'Usuario'},
    id_vendedor: { type: Schema.ObjectId, ref: 'Usuario'},
    fecha: { type: Date, default: Date.now },
    estado: {type: String, enum: ['En proceso', 'Éxito', 'Cancelado'], default: 'En proceso'}
});

module.exports = mongoose.model('Venta', VentaSchema);