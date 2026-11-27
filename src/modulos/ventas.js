// Módulo OBLIGATORIO: ventas
const { obtenerDB, siguienteId } = require('../datos');
const { enviarJSON, leerCuerpo } = require('../utils/http');
const { calcularVenta } = require('../logica/ventas');

const rutas = [
  {
    metodo: 'GET',
    ruta: '/api/ventas',
    async manejar(req, res) {
      enviarJSON(res, 200, obtenerDB().ventas);
    }
  },
  {
    metodo: 'POST',
    ruta: '/api/ventas',
    async manejar(req, res, contexto) {
      const { clienteId, items, codigoDescuento } = await leerCuerpo(req);
      const db = obtenerDB();
      const cliente = db.clientes.find((c) => c.id === Number(clienteId));
      if (!cliente) return enviarJSON(res, 400, { error: 'Cliente no existe' });

      // El descuento solo se aplica si el módulo "descuentos" está registrado.
      let porcentaje = 0;
      if (codigoDescuento && contexto.modulosActivos.includes('descuentos')) {
        const d = db.descuentos.find((x) => x.codigo === codigoDescuento && x.activo);
        if (!d) return enviarJSON(res, 400, { error: 'Código de descuento inválido' });
        porcentaje = d.porcentaje;
      }

      let calculo;
      try {
        calculo = calcularVenta(items, db.productos, porcentaje);
      } catch (e) {
        return enviarJSON(res, 400, { error: e.message });
      }

      // Descontar stock
      calculo.detalle.forEach((d) => {
        db.productos.find((p) => p.id === d.productoId).stock -= d.cantidad;
      });

      const venta = {
        id: siguienteId(db.ventas),
        fecha: new Date().toISOString(),
        cliente: { id: cliente.id, nombre: cliente.nombre },
        vendedor: contexto.usuario ? contexto.usuario.nombre : 'N/D',
        ...calculo
      };
      db.ventas.push(venta);
      enviarJSON(res, 201, venta);
    }
  }
];

module.exports = { rutas };
