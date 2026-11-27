// Módulo OBLIGATORIO: productos
const { obtenerDB, siguienteId } = require('../datos');
const { enviarJSON, leerCuerpo } = require('../utils/http');

const rutas = [
  {
    metodo: 'GET',
    ruta: '/api/productos',
    async manejar(req, res) {
      enviarJSON(res, 200, obtenerDB().productos);
    }
  },
  {
    metodo: 'POST',
    ruta: '/api/productos',
    async manejar(req, res) {
      const { nombre, precio, stock } = await leerCuerpo(req);
      if (!nombre || Number(precio) <= 0 || Number(stock) < 0) {
        return enviarJSON(res, 400, { error: 'Datos de producto inválidos' });
      }
      const db = obtenerDB();
      const producto = {
        id: siguienteId(db.productos),
        nombre: String(nombre).trim(),
        precio: Number(precio),
        stock: Number(stock)
      };
      db.productos.push(producto);
      enviarJSON(res, 201, producto);
    }
  }
];

module.exports = { rutas };
