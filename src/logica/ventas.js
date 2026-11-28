// Lógica de negocio pura (sin HTTP): fácil de probar con pruebas unitarias.

const IVA = 0.15; // IVA vigente en Ecuador

function redondear(valor) {
  return Math.round(valor * 100) / 100;
}

/**
 * Calcula el detalle y los totales de una venta.
 * @param {Array<{productoId:number, cantidad:number}>} items
 * @param {Array<{id:number, nombre:string, precio:number, stock:number}>} productos
 * @param {number} porcentajeDescuento 0 a 100
 */
function calcularVenta(items, productos, porcentajeDescuento = 0) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('La venta debe tener al menos un producto');
  }
  if (porcentajeDescuento < 0 || porcentajeDescuento > 100) {
    throw new Error('El descuento debe estar entre 0 y 100');
  }

  const detalle = items.map((item) => {
    const producto = productos.find((p) => p.id === Number(item.productoId));
    if (!producto) throw new Error(`Producto ${item.productoId} no existe`);
    const cantidad = Number(item.cantidad);
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      throw new Error(`Cantidad inválida para ${producto.nombre}`);
    }
    if (cantidad > producto.stock) {
      throw new Error(`Stock insuficiente para ${producto.nombre}`);
    }
    return {
      productoId: producto.id,
      nombre: producto.nombre,
      cantidad,
      precioUnitario: producto.precio,
      total: redondear(producto.precio * cantidad)
    };
  });

  const subtotal = redondear(detalle.reduce((s, d) => s + d.total, 0));
  const descuento = redondear(subtotal * (porcentajeDescuento / 100));
  const baseImponible = redondear(subtotal - descuento);
  const iva = redondear(baseImponible * IVA);
  const total = redondear(baseImponible + iva);

  return { detalle, subtotal, descuento, iva, total };
}

module.exports = { calcularVenta, redondear, IVA };
