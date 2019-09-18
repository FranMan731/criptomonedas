const { io } = require('../app.js');
const { Conectados } = require('../models/conectados.js');

const conectados = new Conectados();

io.on('connection', onConnection);

function onConnection(client) {
	client.on('new user', (data, callback) => {
		if(data) {
			conectados.agregarPersona(client.id, data);
		}
	});

	client.on('disconnect', () => {
		conectados.borrarPersona(client.id);
	});
}

module.exports = {
	conectados
};