// Módulo OPCIONAL (candidato a variante Premium): reportes estadísticos
const { obtenerDB } = require('../datos');
const { enviarJSON } = require('../utils/http');
const { redondear } = require('../logica/ventas');

function generarResumen(ventas) {
  const totalVendido = redondear(ventas.reduce((s, v) => s + v.total, 0));
  const porProducto = {};
  ventas.forEach((v) =>
    v.detalle.forEach((d) => {
      porProducto[d.nombre] = (porProducto[d.nombre] || 0) + d.cantidad;
    })
  );
  const masVendidos = Object.entries(porProducto)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5);

  return {
    numeroVentas: ventas.length,
    totalVendido,
    ticketPromedio: ventas.length ? redondear(totalVendido / ventas.length) : 0,
    masVendidos
  };
}

const rutas = [
  {
    metodo: 'GET',
    ruta: '/api/reportes/resumen',
    async manejar(req, res) {
      enviarJSON(res, 200, generarResumen(obtenerDB().ventas));
    }
  }
];

module.exports = { rutas, generarResumen };
