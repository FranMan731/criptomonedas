'use strict'

var mercadopago = require('mercadopago');
var moment = require('moment');
var path = require('path');
var Comprador = require('./comprador.js');

const { io } = require('../app.js');
var { conectados } = require('./notificaciones.js');

var _email = "";
var _id_publicacion;

mercadopago.configure({
   	client_id: '3471080951058911',
	client_secret: 'RYNUG5xdIByOLrXonQHD6hn1atTQ7zJT'
});

function crearPago(req, res) {
	var params = req.body;

	var expiration = moment().add(15, 'minutes').format("YYYY-MM-DDTHH:mm:ss.000-03:00").toString();

	_id_publicacion = params.id;
	var nombre = params.nombre + " - " + params.cantidad.toString();

	var preference = {
		"items": [
			{
				'title': nombre,
	            'quantity': 1,
	            'currency_id': "USD",
	            'unit_price': params.precio
			}
		],
    	"back_urls": {
    		success: "https://app-criptomonedas.herokuapp.com/api/v1/mercado_pago/success"
    	},
        "auto_return": "approved",
        "notification_url": "https://app-criptomonedas.herokuapp.com/api/v1/mercado_pago/notifications",
        "expires": true,
        "expiration_date_to": expiration,
    	"payment_methods": {
    		excluded_payment_methods: [
                {"id": "pagofacil"},
                {"id": "rapipago"},
                {"id": "bapropagos"},
                {"id": "redlink"},
                {"id": "cargavirtual"},
                {"id": "cobroexpress"}
            ]
    	}
    };

   	 mercadopago.preferences.create(preference)
	    .then(function (preference) {
	    	var result = JSON.stringify(preference);
	    	result = JSON.parse(result);

	    	_email = req.usuario.email;

	      	return res.status(200).send({status: true, result: result.response.init_point});
	    }).catch(function (error) {
	      	// If an error has occurred
	      	console.log(error);
	      	return res.status(404).send({status: false, message: error});
	    });
}

function notifications(req, res) {
    mercadopago.ipn.manage(req).then(function (data) {
		var resp = JSON.stringify(data);
		resp = JSON.parse(resp);

		if(resp.body.status === "cancelled") {
			cancelarCompra(res);
		}
	}).catch(function (error) {
	    console.log(error);
	});
}

function cancelarCompra(res) {
	return res.status(200).send({status: false, message: "La compra se ha cancelado."});
}

async function mercadopagoSuccess(req, res) {
	var persona = await conectados.getIdPorEmail(_email);

	Comprador.pagoSuccess(_id_publicacion);

	io.to(persona.id).emit('pago', "El pago fue success");

	return res.status(200).redirect('https://app-criptomonedas.herokuapp.com/');
}

module.exports = {
	crearPago,
	notifications,
	mercadopagoSuccess
}