// Módulo OBLIGATORIO: inicio de sesión
const crypto = require('node:crypto');
const { obtenerDB } = require('../datos');
const { enviarJSON, leerCuerpo } = require('../utils/http');

function usuarioDesdeToken(req) {
  const cabecera = req.headers['authorization'] || '';
  const token = cabecera.startsWith('Bearer ') ? cabecera.slice(7) : null;
  if (!token) return null;
  return obtenerDB().sesiones.get(token) || null;
}

const rutas = [
  {
    metodo: 'POST',
    ruta: '/api/login',
    publica: true,
    async manejar(req, res) {
      const { usuario, clave } = await leerCuerpo(req);
      const encontrado = obtenerDB().usuarios.find(
        (u) => u.usuario === usuario && u.clave === clave
      );
      if (!encontrado) return enviarJSON(res, 401, { error: 'Usuario o clave incorrectos' });
      const token = crypto.randomBytes(24).toString('hex');
      obtenerDB().sesiones.set(token, { id: encontrado.id, nombre: encontrado.nombre });
      enviarJSON(res, 200, { token, nombre: encontrado.nombre });
    }
  },
  {
    metodo: 'POST',
    ruta: '/api/logout',
    async manejar(req, res) {
      const token = (req.headers['authorization'] || '').slice(7);
      obtenerDB().sesiones.delete(token);
      enviarJSON(res, 200, { mensaje: 'Sesión cerrada' });
    }
  }
];

module.exports = { rutas, usuarioDesdeToken };
