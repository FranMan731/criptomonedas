'use strict';

var Comprador = require('../models/comprador.js');
var Publicacion = require('../models/publicacion.js');
var Usuario = require('../models/usuario.js');
var moment = require('moment');

//Guarda un comprador
function crear(req, res) {
	var params = req.body;
	var comprador = new Comprador();
	var id_comprador = req.usuario.sub;

	if(params.id_publicacion && params.paypal && params.billetera) {
		comprador.id_comprador = id_comprador;
		comprador.id_publicacion = params.id_publicacion;
		comprador.fecha = moment().format();

		var update = {
			paypal: params.paypal,
			billetera: params.billetera
		};

		Usuario.findOneAndUpdate(id_comprador, update, {new:true}, (err, usuarioUpdated) => {
			if(err) return res.status(500).send({status: false});

			if(!usuarioUpdated) return res.status(404).send({status: false});

			Publicacion.findById(params.id_publicacion).exec((err, publicacion) => {
				if(err) return res.status(500).send({status: false});

				if(!publicacion) return res.status(404).send({status: false});

				if(publicacion.estado === "En espera") {
					publicacion.estado = "En proceso";

					publicacion.save((err, publicacionUpdated) => {
						if(err) return res.status(500).send({status: false});

						comprador.save((err, compradorSaved) => {
							if(err) return res.status(500).send({status: false});

							if(compradorSaved) {
								return res.status(200).send({status: true});
							} else {
								return res.status(404).send({status: false})
							}
						});
					})
					
				} else {
					return res.status(200).send({status: false, message: "Otro usuario ya la ha comprado."});
				}
			});
		});
	} else {
		return res.status(200).send({
			status: false,
			message: "Hubo un error al obtener los datos."
		});
	}
}

//Funcion que obtiene las compras que estan en proceso
function getComprasEnProceso(req, res) {
	var idComprador = req.usuario.sub;

	Comprador.find({id_comprador: idComprador})
		.populate({
			path: 'id_publicacion', 
			match: { estado: 'En proceso' },
			select: 'tipo cantidad valor fecha estado'})
		.exec((err, publicaciones) => {
			if(err) return res.status(500).send({status: false});

			if(!publicaciones || publicaciones.length == 0) return res.status(200).send({status: false, message: "No existe la publicación."});
		
			return res.status(200).send({
				publicaciones,
				status: true
			});
		});
}

//Funcion que cambia estado de publicacion y cancela la compra por error de usuario o cancela.
function cancelar(req, res) {
	var id_publicacion = req.body.id_publicacion;

	Publicacion.findById(id_publicacion).exec((err, publicacion) => {
		if(err) return res.status(500).send({status: false, message: "Error en el servidor"});

		if(!publicacion) return res.status(404).send({status: false, message: "No existe la publicación"});

		if(publicacion.estado === "En proceso") {
			publicacion.estado = 'Cancelado';

			publicacion.save((err, publicacionUpdated) => {
				if(err) return res.status(500).send({status: false});

				if(!publicacionUpdated) return res.status(404).send({status: false});

				Comprador.findOne({id_publicacion: id_publicacion}).remove(err => {
					if(err) return res.status(500).send({status: false});

					return res.status(200).send({
						status: true,
						message: "Se ha cancelado la compra con éxito."
					});
				});
			})
		} else {
			return res.status(200).send({
				status: false,
				message: "No puedes cancelar esta compra."
			});
		}
	});
}

//Funcion que cambia de Estado a Éxito
function pagoSuccess(id_publicacion) {
	Publicacion.findById(id_publicacion).exec((err, publicacion) => {
		if(err) return {status: false, message: "Error en el servidor"};

		if(!publicacion) return {status: false, message: "No existe la publicación"};

		publicacion.estado = 'Exito';

		publicacion.save((err, publicacionUpdated) => {
			if(err) return {status: false};

			if(!publicacionUpdated) return {status: false};

			return {
				status: true,
				message: "Se ha realizado la compra con éxito."
			};
		});
	});
}

module.exports = {
	crear,
	getComprasEnProceso,
	cancelar,
	pagoSuccess
}