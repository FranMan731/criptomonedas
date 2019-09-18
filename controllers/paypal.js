var request = require('request');
var rp = require('request-promise');

//Funcion que genera el Token
async function generarToken() {
	var options = { 
		method: 'POST',
  		url: 'https://api.sandbox.paypal.com/v1/oauth2/token',
 		headers: {
     		Authorization: 'Basic QWFxRHc2a2FYamhLTFNJMk1XcWJ6dV9PYWVkZWUzTWJLYTdFTmpfRXZlbTVXdkluUkFZSTZhQ3MwYXRCVTJBUGViMEQtdGpBcHN4aFdJV1M6RUxfUGcwdndTS2dObFFpLVVlNzNLTkJ3YlBHYTNvbTFJT1V2dlByZGs2dXZrVTVKQ3d5VU9kcXAwQzFfYVdHMmtyYURORlFXTGZnU2NsWm0='
     	},
  		form: { 
  			grant_type: 'client_credentials' 
  		} 
  	};

  	var respuesta = await rp(options)
  		.then((resp) => {
  			var result = JSON.parse(resp);

  			return {
				status: true,
				result
			}
  		})
  		.catch((err) => {
  			console.log(err);
  			return {
  				status:false,
  				err
  			}
  		});

  	return respuesta;
}

async function createPayment(req, res) {
	var respuesta = await generarToken();

	if(respuesta.status) {
		var token = respuesta.result.access_token;
		var params = req.body;

		var subtotal = Number.parseFloat(params.total);
		var tax = (subtotal * 0.2) / 100;

		var total = tax + subtotal;

		var venta = {
			intent: 'sale',
     		redirect_urls: { 
     			return_url: 'https://example.com',
        		cancel_url: 'https://example.com' 
        	},
     		payer: { 
     			payment_method: 'paypal' 
     		},
     		transactions: [{ 
     			amount: { 
     				total: total,
             		currency: 'USD',
             		details: { 
             			subtotal: subtotal,
                		tax: tax
                	}
                },
          		item_list: { 
          			items: [
	          			{ 
	          				quantity: '1',
	                  		name: params.tipo,
	                 		price: subtotal,
	                  		currency: 'USD',
	                  		description: 'La compra de ' + params.cantidad + ' ' + params.tipo + '.',
	                 		tax: tax 
	                 	}
                  	] 
                },
          		description: 'La compra de ' + params.cantidad + ' ' + params.tipo + '.',
          		custom: 'Criptomonedas Web' 
          	}]
		};

		var options = {
			method: 'POST',
			url: 'https://api.sandbox.paypal.com/v1/payments/payment',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer '+ token
			},
			body: venta,
			json: true
		};

		request(options, function (error, response, body) {
		  	if (error) throw new Error(error);

		  	if(body.state === "created") {
		  		return res.status(200).send({body});
		  	} else {
		  		return res.status(200).send({status: false, error});
		  	}
		  	
		});
	} else {
		return res.status(200).send({
			status: false,
			message: "Hubo un error al obtener token de venta."
		});
	}
	
}

async function executePayment(req, res) {
	var respuesta = await generarToken();
	var token = respuesta.result.access_token;

	var paymentID = req.body.paymentID;
	var payerID = req.body.payerID;

	var options = {
		method: "POST",
		url: "https://api.sandbox.paypal.com/v1/payments/payment/"+paymentID+"/execute/",
		headers: {
			"Content-Type":"application/json",
			"Authorization": "Bearer "+token
		},
		body: {"payer_id": payerID}
	};

	request(options, function (error, response, body) {
		if (error) throw new Error(error);

		if(body.state === "approved") {
		  	return res.status(200).send({body});
		} else {
		  	return res.status(200).send({status: false, error});
		}
	});
}

module.exports = {
	createPayment,
	executePayment
}