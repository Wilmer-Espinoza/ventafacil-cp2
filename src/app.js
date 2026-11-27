// Núcleo de la aplicación: arma el manejador HTTP a partir de una lista de módulos.
// La lista de módulos activos se recibe como parámetro, así una misma base de
// código puede generar distintas variantes sin duplicar el proyecto.

const fs = require('node:fs');
const path = require('node:path');
const { enviarJSON, enviarTexto } = require('./utils/http');
const { usuarioDesdeToken } = require('./modulos/auth');
const pkg = require('../package.json');

// Catálogo de módulos disponibles en la base de código común
const CATALOGO = {
  auth: require('./modulos/auth'),
  productos: require('./modulos/productos'),
  clientes: require('./modulos/clientes'),
  ventas: require('./modulos/ventas'),
  reportes: require('./modulos/reportes'),
  descuentos: require('./modulos/descuentos'),
  exportacion: require('./modulos/exportacion')
};

const OBLIGATORIOS = ['auth', 'productos', 'clientes', 'ventas'];
const OPCIONALES = ['reportes', 'descuentos', 'exportacion'];

const CARPETA_PUBLICA = path.join(__dirname, '..', 'public');
const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function servirEstatico(req, res) {
  const url = req.url.split('?')[0];
  const relativo = url === '/' ? 'index.html' : url.replace(/^\/+/, '');
  const archivo = path.normalize(path.join(CARPETA_PUBLICA, relativo));
  if (!archivo.startsWith(CARPETA_PUBLICA)) return enviarTexto(res, 403, 'Prohibido');
  fs.readFile(archivo, (err, contenido) => {
    if (err) return enviarTexto(res, 404, 'No encontrado');
    enviarTexto(res, 200, contenido, TIPOS[path.extname(archivo)] || 'application/octet-stream');
  });
}

/**
 * Crea el manejador de peticiones.
 * @param {{ modulos?: string[], nombreVariante?: string }} opciones
 */
function crearApp(opciones = {}) {
  const modulosActivos = opciones.modulos || [...OBLIGATORIOS, ...OPCIONALES];
  const nombreVariante = opciones.nombreVariante || 'completa';

  const rutas = modulosActivos.flatMap((nombre) => {
    const modulo = CATALOGO[nombre];
    if (!modulo) throw new Error(`Módulo desconocido: ${nombre}`);
    return modulo.rutas;
  });

  return async function manejador(req, res) {
    const url = req.url.split('?')[0];

    try {
      // Endpoints de sistema (siempre presentes)
      if (req.method === 'GET' && url === '/api/salud') {
        return enviarJSON(res, 200, { estado: 'ok', version: pkg.version });
      }
      if (req.method === 'GET' && url === '/api/info') {
        return enviarJSON(res, 200, {
          sistema: 'VentaFácil',
          version: pkg.version,
          variante: nombreVariante,
          modulosActivos
        });
      }

      const ruta = rutas.find((r) => r.metodo === req.method && r.ruta === url);
      if (ruta) {
        const usuario = usuarioDesdeToken(req);
        if (!ruta.publica && !usuario) {
          return enviarJSON(res, 401, { error: 'Debe iniciar sesión' });
        }
        return await ruta.manejar(req, res, { usuario, modulosActivos });
      }

      if (url.startsWith('/api/')) {
        return enviarJSON(res, 404, { error: 'Ruta no disponible en esta variante' });
      }
      return servirEstatico(req, res);
    } catch (e) {
      return enviarJSON(res, 400, { error: e.message });
    }
  };
}

module.exports = { crearApp, CATALOGO, OBLIGATORIOS, OPCIONALES };
