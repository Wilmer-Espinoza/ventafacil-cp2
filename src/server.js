// Punto de entrada: levanta el servidor HTTP.
const http = require('node:http');
const { crearApp } = require('./app');

const PUERTO = Number(process.env.PORT) || 3000;

// Por ahora se cargan todos los módulos (versión completa).
// La selección de módulos por variante (feature flags / configuración)
// se conecta aquí, pasando { modulos, nombreVariante } a crearApp().
const app = crearApp();

const servidor = http.createServer(app);

servidor.listen(PUERTO, () => {
  console.log(`VentaFácil escuchando en http://localhost:${PUERTO}`);
});

module.exports = servidor;
