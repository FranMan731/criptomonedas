function Compra() {
	var _token = sessionStorage.getItem('token');
	//Funcion que se encargar de hacer la llamada a la base de datos para obtener las ventas.
	this.getVentas = function() {
		var settings = {
		  	"async": true,
		  	"crossDomain": true,
		  	"url": "https://app-criptomonedas.herokuapp.com/api/v1/publicacion",
		  	"method": "GET"
		}

		$.ajax(settings).done(function (response) {
			if(response.status) {
				mostrarVentas(response);
			} else {
				swal({
	                title: "Error",
	                text: response.message,
	                type: "error"
	            });
			}
		  	
		}).fail(function(response) {
			swal({
                title: "Error",
                text: response.message,
                type: "error"
            });
		});
	}

	//Funcion que se encarga de mostrar las ventas.
	function mostrarVentas(response) {
		var html = "";
		var data = [];
		var fecha = "";

		$.each(response['publicaciones'], function(key, publicacion) {
			fecha = calcularTiempo(publicacion.fecha);

			data[key] = {
				"id": publicacion._id,
				"cantidad": publicacion.cantidad,
				"tipo": publicacion.tipo,
				"valor": publicacion.valor,
				"usuario": publicacion.id_usuario.email,
				"fecha": fecha,
			};
		});

		$("#tblCompras").DataTable({
        	"data": data,
        	rowId: 'id',
        	destroy: true,
        	select: 'single',
			responsive: true,
			"language": {
	            "sProcessing"   : "Procesando...",
	            "lengthMenu"    : "Mostrar _MENU_",
	            "zeroRecords"   : "No existe ningún registro.",
	            "info"          : "Página _PAGE_ de _PAGES_",
	            "infoEmpty"     : "No hay registros.",
	            "infoFiltered"  : "(Filtrado de _MAX_ datos)",
	            "sSearch"       :         "Buscar:",
	            "oPaginate"     : {
	                "sFirst"        :    "Primero",
	                "sLast"         :     "Último",
	                "sNext"         :     "Siguiente",
	           	    "sPrevious"     : "Anterior"
	            },
	            select: {
		            rows: {
		                0: "No se ha seleccionado nada.",
		                1: "Se seleccionó uno."
		            }
		        }
         	},
            columns: [    
	            { "data": "tipo"},
	            { "data": "cantidad"},    
	            { "data": function(key) {
	            			return key.valor + ' <b>USD</b>';
	            }},    
	            { "data": "usuario"},
	            { "data": "fecha"}
        	]
		});
	}

	//Calcular tiempo de creado
	function calcularTiempo(dato) {
		var minutos = 1000 * 60;
		var dia = 60 * 24;

		var d = new Date();
		var hoy = d.getTime();

		var fecha = Date.parse(dato);

		var result = hoy - fecha;

		var diferencia = Math.round(result / minutos);

		var respuesta = "";

		if (diferencia < 60) {
			respuesta = "Hace " + diferencia + " min";

		} else if(diferencia >= 60 && diferencia < dia) {
			diferencia = Math.round(diferencia / 60);
			if(diferencia > 1) {
				respuesta = "Hace " + diferencia + " horas";
			} else {
				respuesta = "Hace " + diferencia + " hora";
			}
		} else if(diferencia >= dia) {
			diferencia = Math.round(diferencia / dia);
			if(diferencia > 1) {
				respuesta = "Hace " + diferencia + " días";
			} else {
				respuesta = "Hace " + diferencia + " día";
			}
		} else {
			respuesta = "No definido";
		}

		return respuesta;
	}

	//Paypal Button
	function buttonPaypal(datos) {
		var total = datos.valor;

		paypal.Button.render({
	      	env: 'production', // Or 'sandbox',

	    	commit: true, // Show a 'Pay Now' button

	    	style: {
	        	color: 'gold',
	        	size: 'small'
	      	},

	      	client: {
	      		sandbox: 'AaqDw6kaXjhKLSI2MWqbzu_Oaedee3MbKa7ENj_Evem5WvInRAYI6aCs0atBU2APeb0D-tjApsxhWIWS',
	      		production: 'ARG3DOVVdUmB3G_DzfqL1VXjXZKnyrqpD0iLpWueMIZ2xMDyhgq-hPyUDbykva5X_LhSoBzncyxiPvVW'
	      	},

	      	payment: function(data, actions) {
	    		return actions.payment.create({
                	payment: {
                    	transactions: [
                        	{
                            	amount: { total: total, currency: 'USD' }
                        	}
                    	]
                	}
            	});
	      	},

	      	onAuthorize: function(data, actions) {
		        return actions.payment.execute().then(function(payment) {
		        	
	            });
	     	},

	      	onCancel: function(data, actions) {
	        /*
	         * Buyer cancelled the payment
	         */
	      	},

	      	onError: function(err) {
	        /*
	         * An error occurred during the transaction
	         */
	    	}
	    }, '#paypal-button');
	}
}