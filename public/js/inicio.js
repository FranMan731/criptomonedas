(function() {
	'use strict';
	var pathname = window.location.pathname;

	if(sessionStorage.getItem('token') === null) {
		$('#btnIngresar').css('display', '');
		$('#btnRegister').css('display', '');
		$("#sign").css('display', '');
		$('#btnUsuario').css('display', 'none');
	} else {
		$('#btnIngresar').css('display', 'none');
		$('#btnRegister').css('display', 'none');
		$("#sign").css('display', 'none');
		$('#btnUsuario').css('display', '');
		$('#btnUsuario').text(sessionStorage.getItem('email'));

		if(pathname === "/registrar.html") {
			swal({
				title: "Registrado",
				text: "Ya se ha registrado",
			}, function() {
				window.location = "https://app-criptomonedas.herokuapp.com/";
			});
		}
	}

  $("#txtEmailIngresar").keypress(function(event) {
    $('#errorLogin').css('display', 'none');
    $('#errorServidor').css('display', 'none');
  });

  $("#txtPasswordIngresar").keypress(function(event) {
    $('#errorLogin').css('display', 'none');
    $('#errorServidor').css('display', 'none');
  });

})();