'use strict';

var request = require('request');

exports.validateCaptcha = function(req, res, next) {
	var captcha = req.body.captcha;
	
	if(!captcha || captcha === undefined || captcha === '' || captcha === null) {
		return res.status(403).send({"status": false, message: "Por favor, selecciona el captcha."});
	}

	var secret = "6Lf97l0UAAAAAL9RB4TIjUmm7VICct1Vbko1zPzo";

	var verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secret}&response=${captcha}`;

	request(verifyUrl, (err, response, body) => {
		body = JSON.parse(body);

		if(body.success !== undefined && !body.success) {
			return res.status(200).send({
				status: false,
				message: "Falló la verificación del captcha"
			});
		}

		next();
	});
}

