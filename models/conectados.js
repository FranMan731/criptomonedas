class Conectados {
	constructor() {
		this.personas = [];
	}

	agregarPersona(id, email) {
		let persona = {id, email};

		this.personas.push(persona);

		return this.personas;
	}

	getPersona(id) {
		let persona = this.personas.filter(persona => persona.id === id)[0];

		return persona;
	}

	getPersonas() {
		return this.personas;
	}

	getIdPorEmail(email) {
		let persona = this.personas.filter(persona => persona.email == email)[0];

		return persona;
	}
	
	borrarPersona(id) {
		//let personaBorrada = this.getPersona(id);

		this.personas = this.personas.filter(persona => persona.id != id);
	}
}

module.exports = {
	Conectados
};