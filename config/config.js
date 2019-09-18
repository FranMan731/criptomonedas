//============================
//  PUERTO
//============================
process.env.PORT = process.env.PORT || 3000;

//============================
//  ENTORNO
//============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//============================
//  Base de Datos
//============================

let urlDB;

if(process.env.NODE_ENV === 'dev') {
	urlDB = 'mongodb://localhost:27017/appcriptomonedas';
} else {
	urlDB = 'mongodb://admin:admin123456@ds151970.mlab.com:51970/app-criptomonedas';
}

process.env.URLDB = urlDB;

//============================
//  Secret Token
//============================
process.env.SECRET_TOKEN = process.env.SECRET_TOKEN || "clave_secreta_de_app_criptomonedas_desarrollada_por_mendocode";