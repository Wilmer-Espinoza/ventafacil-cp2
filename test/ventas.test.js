// Pruebas automatizadas de la lógica de ventas (src/logica/ventas.js)
// Responsable: Guadalupe Cobos Josué Fernando
const { test } = require('node:test');
const assert = require('node:assert');
const { calcularVenta } = require('../src/logica/ventas');

// Productos de ejemplo independientes de la "base" en memoria
const productos = () => [
  { id: 1, nombre: 'Arroz 1 kg', precio: 1.25, stock: 120 },
  { id: 3, nombre: 'Aceite 1 L', precio: 2.75, stock: 50 },
  { id: 5, nombre: 'Café 200 g', precio: 3.40, stock: 2 }
];

test('calcula el subtotal de una venta con varios productos', () => {
  const venta = calcularVenta(
    [{ productoId: 1, cantidad: 4 }, { productoId: 3, cantidad: 2 }],
    productos()
  );
  assert.strictEqual(venta.detalle.length, 2);
  assert.strictEqual(venta.subtotal, 10.5); // 4 x 1.25 + 2 x 2.75
});

test('calcula el IVA del 15 % y el total de la venta', () => {
  const venta = calcularVenta([{ productoId: 1, cantidad: 8 }], productos()); // subtotal 10.00
  assert.strictEqual(venta.iva, 1.5);
  assert.strictEqual(venta.total, 11.5);
});

test('aplica el código de descuento del 10 % antes del IVA', () => {
  const venta = calcularVenta([{ productoId: 1, cantidad: 16 }], productos(), 10); // subtotal 20.00
  assert.strictEqual(venta.descuento, 2);
  assert.strictEqual(venta.iva, 2.7);
  assert.strictEqual(venta.total, 20.7);
});

test('rechaza una venta con stock insuficiente', () => {
  assert.throws(
    () => calcularVenta([{ productoId: 5, cantidad: 3 }], productos()),
    /Stock insuficiente/
  );
});

test('rechaza productos inexistentes y cantidades inválidas', () => {
  assert.throws(() => calcularVenta([{ productoId: 99, cantidad: 1 }], productos()), /no existe/);
  assert.throws(() => calcularVenta([{ productoId: 1, cantidad: 0 }], productos()), /Cantidad inválida/);
});

test('rechaza ventas vacías y descuentos fuera del rango 0-100', () => {
  assert.throws(() => calcularVenta([], productos()), /al menos un producto/);
  assert.throws(() => calcularVenta([{ productoId: 1, cantidad: 1 }], productos(), 150), /entre 0 y 100/);
});
