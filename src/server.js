// Punto de entrada: levanta el servidor HTTP.
const http = require('node:http');
const { crearApp } = require('./app');

const HOST = process.env.HOST || '127.0.0.1';
const PUERTO = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(PUERTO) || PUERTO < 0 || PUERTO > 65535) {
  throw new Error('PORT debe ser un entero entre 0 y 65535');
}

// Por ahora se cargan todos los módulos (versión completa).
// La selección de módulos por variante (feature flags / configuración)
// se conecta aquí, pasando { modulos, nombreVariante } a crearApp().
const app = crearApp();

const servidor = http.createServer(app);

servidor.listen(PUERTO, HOST, () => {
  console.log(`VentaFacil disponible en http://${HOST}:${servidor.address().port}`);
});

module.exports = servidor;
