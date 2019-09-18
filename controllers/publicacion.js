'use strict';

var Publicacion = require('../models/publicacion.js');
var Usuario = require('../models/usuario.js');
var moment = require('moment');

//Función que creará la publicación
function crear(req, res) {
	var params = req.parametros;
	var publicacion = new Publicacion();

	var id_usuario = params.id_usuario;
	var updateUsuario = {
		paypal: params.paypal,
		billetera: params.billetera
	};


	Usuario.findByIdAndUpdate(id_usuario, updateUsuario, {new: true}, (err, usuarioUpdated) => {
		if(err) return res.status(500).send({status: false, message:  "Hubo un error en el servidor, reintente luego."});

		if(usuarioUpdated) {
			publicacion.id_usuario =id_usuario;
			publicacion.tipo = params.tipo;
			publicacion.cantidad = params.cantidad;
			publicacion.valor = params.valor;
			publicacion.fecha = params.fecha;

			publicacion.save((err, publicacionStored) => {
				if(err) return res.status(500).send({status: false, message:  "Hubo un error en el servidor, reintente luego."});

				if(publicacionStored) {
					return res.status(200).send({
						status: true,
						message: "Se ha creado satisfactoriamente."
					});
				} else {
					return res.status(200).send({
						status: false,
						message: "Ha fallado al crear la venta, reintente luego."
					});
				}
			});
		} else {
			return res.status(200).send({
				status: false,
				message: "Ha fallado al crear la venta, no se ha podido identificar el usuario."
			});
		}
	});
}

//Funcion que se encarga de obtener todas las ventas
function getPublicaciones(req, res) {
	Publicacion.find({estado: "En espera"})
		.populate({path: 'id_usuario', select: 'email billetera'})
		.exec((err, publicaciones) => {
			if(err) return res.status(500).send({status: false, message:  "Hubo un error en el servidor, reintente luego."});

			if(!publicaciones || publicaciones.length == 0) return res.status(200).send({status: false, message: "No hay publicaciones."});

			return res.status(200).send({
				publicaciones,
				status: true
			});
		});
}

//Funcion que devuelve una publicacion
function getPublicacion(req, res) {
	var idPublicacion = req.params.id;

	Publicacion.findById(idPublicacion)
		.populate({path: 'id_usuario', select: 'email billetera'})
		.exec((err, publicacion) => {
			if(err) return res.status(500).send({status: false, message:  "Hubo un error en el servidor, reintente luego."});

			if(!publicacion || publicacion.length == 0) return res.status(200).send({status: false, message: "No existe la publicación."});

			

			return res.status(200).send({
				publicacion,
				status: true
			});
		});
}

//Funcion que obtiene las publicaciones realizada por usuario
function getPublicacionesUsuario(req, res) {
	var idUsuario = req.usuario.sub;

	Publicacion.find({id_usuario: idUsuario, estado: {$ne: "En proceso"}}, (err, publicaciones) => {
		if(err) return res.status(500).send({status: false, message:  "Hubo un error en el servidor, reintente luego."});

		if(!publicaciones || publicaciones.length == 0) return res.status(200).send({status: false, message: "No hay publicaciones."});

		return res.status(200).send({
			publicaciones,
			status: true
		});
	});
}

//Funcion que obtiene las publicaciones que estan en proceso
function getPublicacionesEnProceso(req, res) {
	var idUsuario = req.usuario.sub;

	Publicacion.find({id_usuario: idUsuario, estado: "En proceso"}, (err, publicaciones) => {
		if(err) return res.status(500).send({status: false, message:  "Hubo un error en el servidor, reintente luego."});

		if(!publicaciones || publicaciones.length == 0) return res.status(200).send({status: false, message: "No hay publicaciones."});

		return res.status(200).send({
			publicaciones,
			status: true
		});
	});
}

//Funcion que elimina una publicacion
function removePublicacion(req, res) {
	var idPublicacion = req.params.id;
	var id_usuario = req.usuario.sub;

	Publicacion.findById(idPublicacion).exec((err, publicacion) => {
		if(err) return res.status(500).send({status: false, message: "Hubo un error en el servidor, reintente luego."});

		if(publicacion.id_usuario == id_usuario && publicacion.estado != "En proceso") {
			publicacion.remove(err => {
				if(err) return res.status(500).send({status: false, message: "Hubo un error en el servidor, reintente luego."});

				return res.status(200).send({status: true, message: "Se ha eliminado la publicación."});
			});
		} else if (publicacion.estado == "En proceso") {
			return res.status(200).send({status: false, message: "No puedes eliminar esta publicación de venta, ya que esta 'En proceso'."});
		} else {
			return res.status(200).send({status: false, message: "No tienes permiso para eliminar esta publicación de venta."});
		}
	})
}

module.exports = {
	crear,
	getPublicaciones,
	getPublicacion,
	getPublicacionesUsuario,
	getPublicacionesEnProceso,
	removePublicacion
}