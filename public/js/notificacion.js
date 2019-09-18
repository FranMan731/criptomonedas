var socket = io();

var email = sessionStorage.getItem('email');

socket.on('connect', function() {
	if(email) {
		socket.emit('new user', email);
	}
});

socket.on('pago', function(data) {
	console.log("Mensaje nuevo: " + data);
});