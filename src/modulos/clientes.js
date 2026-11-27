// Módulo OBLIGATORIO: clientes
const { obtenerDB, siguienteId } = require('../datos');
const { enviarJSON, leerCuerpo } = require('../utils/http');

const rutas = [
  {
    metodo: 'GET',
    ruta: '/api/clientes',
    async manejar(req, res) {
      enviarJSON(res, 200, obtenerDB().clientes);
    }
  },
  {
    metodo: 'POST',
    ruta: '/api/clientes',
    async manejar(req, res) {
      const { nombre, cedula, telefono } = await leerCuerpo(req);
      if (!nombre || !/^\d{10}$/.test(String(cedula || ''))) {
        return enviarJSON(res, 400, { error: 'Nombre obligatorio y cédula de 10 dígitos' });
      }
      const db = obtenerDB();
      const cliente = {
        id: siguienteId(db.clientes),
        nombre: String(nombre).trim(),
        cedula: String(cedula),
        telefono: telefono ? String(telefono) : ''
      };
      db.clientes.push(cliente);
      enviarJSON(res, 201, cliente);
    }
  }
];

module.exports = { rutas };
