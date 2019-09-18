'use strict'

var moment = require('moment');
var secret = process.env.SECRET_TOKEN;

exports.convertion = function(req, res, next) {
	var params = req.body;

	if(params.tipo && params.cantidad && params.valor && params.billetera && params.paypal) {
		params.tipo = String(params.tipo);
		params.cantidad = Number.parseFloat(params.cantidad);
		params.valor = Number.parseFloat(params.valor);
		params.billetera = String(params.billetera);
		params.paypal = String(params.paypal);
	} else {
		return res.status(200).send({
			status: false,
			message: "Debes enviar todos los campos"
		});
	}

	req.parametros = {
		id_usuario: req.usuario.sub,
		tipo: params.tipo,
		cantidad: params.cantidad,
		valor: params.valor,
		billetera: params.billetera,
		paypal: params.paypal,
		fecha: moment().format()
	};

	next();
}