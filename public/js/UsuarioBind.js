$(function() {
	var funcionUsuarios = {};

	(function(app) {
		app.prototype = new Usuario();

		app.init = function() {
			app.bindings();
		};

		app.bindings = function() {
			$("#btnRegistrar").on('click', function(e) {
				e.preventDefault();
				
				var form = $("#formRegister");

				if (form[0].checkValidity() === false) {
			      	event.stopPropagation();

			      	if($("#txtPassword").val() !== $("#txtPasswordRep").val()) {
			      		$("#txtPasswordRep").addClass('is-invalid');
			      		$("#txtPasswordRep").css({'border-color': "#dc3545"});
			      		$("#repPassword").html("Las contraseñas deben ser iguales.");
			      	}

			      	$("#txtPasswordRep").keypress(function(event) {
				    	$("#txtPasswordRep").removeClass('is-invalid');
				      	$("#txtPasswordRep").css({'border-color': "rgba(0,0,0,.3)"});
				      	$("#repPassword").html("");
				    });

				    form.addClass('was-validated');
			    } else {
			    	app.prototype.register();
			    }
			});

			$("#btnLogin").on('click', function(e) {
				e.preventDefault();
				
				var email = $("#txtEmailIngresar").val();
				var password = $("#txtPasswordIngresar").val();

				app.prototype.ingresar(email, password);
			});

			$("#btnCerrarSesion").on('click', function(e) {
				e.preventDefault();
				app.prototype.cerrarSesion();
			});
		};

		app.init();
	})(funcionUsuarios);
});