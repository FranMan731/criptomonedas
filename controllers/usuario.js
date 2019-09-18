'use strict'

var Usuario = require('../models/usuario.js');
var bcrypt = require('bcrypt-nodejs');

var jwt = require('../services/jwt');

//Funcion Registrar
function registrar(req, res) {
	var params = req.body;
	var usuario = new Usuario();

	if(params.email && params.password) {
		usuario.email = params.email;

		Usuario.find({ $or: [
								{email: usuario.email.toLowerCase()}
			]}).exec((err, usuarios) => {
				if(err) res.status(500).send({status: false});

					if(usuarios && usuarios.length >= 1) {
						return res.status(200).send({status: false, message: "El email ingresado ya se encuentra registrado."})
					} else {
						//Cifro la password y envio los datos
						bcrypt.hash(params.password, null, null, (err, hash) => {
							usuario.password = hash;

							usuario.save((err, usuarioStored) => {
								if(err) return res.status(500).send({status: false});

								if(usuarioStored) {
									usuarioStored.password = undefined;

									return res.status(200).send({
										token: jwt.createToken(usuarioStored),
										email: usuarioStored.email,
										status: true
									});
								} else {
									return res.status(404).send({status: false});
								}
							});
						});
					}
			});

	} else {
		res.status(200).send({
			message: "Envíe todos los campos necesarios"
		});
	}
}

//Funcion de ingresar usuario
function ingresar(req, res) {
	var params = req.body;

	var email = params.email;
	var password = params.password;

	Usuario.findOne({email: email}, (err, usuario) => {
		if(err) res.status(500).send({status: false});

		if(usuario) {
			bcrypt.compare(password, usuario.password, (err, check) => {
				if(check) {
					usuario.password = undefined;
					
					return res.status(200).send({
						token: jwt.createToken(usuario),
						email: usuario.email,
						status: true
					});

					
				} else {
					res.status(500).send({status: false, message: "Datos incorrectos."});
				}
			});
		} else {
			res.status(200).send({status: false, message: "Datos incorrectos."});
		}
	});
}

module.exports = {
	registrar,
	ingresar
}