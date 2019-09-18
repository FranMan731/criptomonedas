function Usuario() {
	var _url = "";

	//Función que se encarga de registrar el usuario.
	this.register = function() {
		//Obtengo los datos del formulario del registro
		var captcha = document.querySelector('#g-recaptcha-response').value;
		var email = document.querySelector('#txtEmail').value;
		var password = document.querySelector('#txtPassword').value;
		
		//Se guarda en una variable Datos, para luego enviarse al servidor.
		var datos = {
			"email": email,
			"password": password,
			"captcha": captcha
		};

		//Configuración del AJAX para hacer la llamada al API del servidor
		var settings = {
		  	"async": true,
		  	"crossDomain": true,
		  	"url": "https://app-criptomonedas.herokuapp.com/api/v1/registrar/",
			"method": "POST",
		  	"headers": {
		    	"Content-Type": "application/json"
		  	},
		  	"processData": false,
		  	"data": JSON.stringify(datos)
		}

		//Hago la llamada al API
		$.ajax(settings).done(function (response) {
			//Si todo es correcto, llamo a la funcion usuarioRegistrado y le envio la respuesta del servidor
		  	if(response.status) {
		  		swal({
		  			title: "¡Éxito!",
		  			text: "Se ha registrado satisfactoriamente",
		  			type: "success"
		  		}, function() {
		  			datosUsuario(response);
		  		})
		  	} else {
		  		swal({
					title: "Error",
					text: "Debes cliquear en el captcha",
					type: "error",
				});
		  	}
		}).fail(function() {
			swal({
				title: "Error",
				text: "Debes cliquear en el captcha.",
				type: "error",
			});
		});
		
	};

	this.ingresar = function(email, password) {
		var datos = {
			"email": email,
			"password": password
		};

		console.log(datos);

		var settings = {
			"async": true,
			"crossDomain": true,
			"url": "https://app-criptomonedas.herokuapp.com/api/v1/ingresar",
			"method": "POST",
			"headers": {
				"Content-Type": "application/json"
			},
			"processData": false,
		  	"data": JSON.stringify(datos)
		}

		$.ajax(settings).done(function (response) {
			console.log(response);

			if(response.status) {
				$("#mdlIngresar").hide();
				limpiarModal();

				swal({
					title: "Éxito",
					text: "Has ingresado correctamente",
					type: "success",
				}, function() {
					datosUsuario(response);
				});
			} else {
				$("#errorLogin").css('display', '');
			}
		}).fail(function() {
			$("#errorLogin").css('display', '');
		});
	}

	this.cerrarSesion = function() {
		sessionStorage.clear();
		location.reload();
	}

	//Función que se encarga de guardar en una sessionStorage el token y el email del usuario.
	function datosUsuario(response) {
		var pathname = window.location.pathname;
		var email = response.email;
		var token = response.token;

		//Guardo los datos en una sessionStorage.
		sessionStorage.setItem('token', token);
		sessionStorage.setItem('email', email);

		//Actualizo la pagina.
		if(pathname == "/comprar.html") {
			location.reload();
		} else {
			window.location = "https://app-criptomonedas.herokuapp.com/";
		}
	}

	//Funcion que se encarga una vez que se haya logrado el ingreso, se limpie el modal
	function limpiarModal() {
		$("#txtEmailIngresar").text('');
		$("#txtPasswordIngresar").text('');
	}
};