// Módulo OPCIONAL (candidato a variante Premium): gestión de descuentos
const { obtenerDB } = require('../datos');
const { enviarJSON, leerCuerpo } = require('../utils/http');

const rutas = [
  {
    metodo: 'GET',
    ruta: '/api/descuentos',
    async manejar(req, res) {
      enviarJSON(res, 200, obtenerDB().descuentos);
    }
  },
  {
    metodo: 'POST',
    ruta: '/api/descuentos',
    async manejar(req, res) {
      const { codigo, porcentaje } = await leerCuerpo(req);
      const p = Number(porcentaje);
      if (!codigo || !(p > 0 && p <= 100)) {
        return enviarJSON(res, 400, { error: 'Código obligatorio y porcentaje entre 1 y 100' });
      }
      const db = obtenerDB();
      if (db.descuentos.some((d) => d.codigo === codigo)) {
        return enviarJSON(res, 409, { error: 'El código ya existe' });
      }
      const nuevo = { codigo: String(codigo).toUpperCase(), porcentaje: p, activo: true };
      db.descuentos.push(nuevo);
      enviarJSON(res, 201, nuevo);
    }
  }
];

module.exports = { rutas };
