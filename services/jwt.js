'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

var secret = process.env.SECRET_TOKEN;

exports.createToken = function(usuario) {
	var payload = {
		sub: usuario._id,
		email: usuario.email,
		rol: usuario.rol,
		iat: moment().unix,
		exp: moment().add(30, 'days').unix
	};

	return jwt.encode(payload, secret);
};