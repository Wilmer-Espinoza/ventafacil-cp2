// Módulo OPCIONAL (candidato a variante Premium): exportación de reportes a CSV
const { obtenerDB } = require('../datos');
const { enviarTexto } = require('../utils/http');

function ventasACSV(ventas) {
  const encabezado = 'id,fecha,cliente,vendedor,subtotal,descuento,iva,total';
  const filas = ventas.map((v) =>
    [v.id, v.fecha, `"${v.cliente.nombre}"`, `"${v.vendedor}"`, v.subtotal, v.descuento, v.iva, v.total].join(',')
  );
  return [encabezado, ...filas].join('\n');
}

const rutas = [
  {
    metodo: 'GET',
    ruta: '/api/exportar/ventas.csv',
    async manejar(req, res) {
      enviarTexto(res, 200, ventasACSV(obtenerDB().ventas), 'text/csv; charset=utf-8', {
        'Content-Disposition': 'attachment; filename="ventas.csv"'
      });
    }
  }
];

module.exports = { rutas, ventasACSV };
