// Almacenamiento en memoria con datos de ejemplo.
// Se reinicia cada vez que arranca el servidor (suficiente para la práctica).

function datosIniciales() {
  return {
    usuarios: [
      { id: 1, usuario: 'admin', clave: 'admin123', nombre: 'Administrador' },
      { id: 2, usuario: 'vendedor', clave: 'venta123', nombre: 'Vendedor de turno' }
    ],
    productos: [
      { id: 1, nombre: 'Arroz 1 kg', precio: 1.25, stock: 120 },
      { id: 2, nombre: 'Azúcar 1 kg', precio: 1.10, stock: 80 },
      { id: 3, nombre: 'Aceite 1 L', precio: 2.75, stock: 50 },
      { id: 4, nombre: 'Leche 1 L', precio: 1.05, stock: 60 },
      { id: 5, nombre: 'Café 200 g', precio: 3.40, stock: 30 }
    ],
    clientes: [
      { id: 1, nombre: 'Consumidor final', cedula: '9999999999', telefono: '' },
      { id: 2, nombre: 'María Pérez', cedula: '0912345678', telefono: '0991234567' },
      { id: 3, nombre: 'Carlos Ramírez', cedula: '0923456789', telefono: '0987654321' }
    ],
    descuentos: [
      { codigo: 'BIENVENIDA10', porcentaje: 10, activo: true },
      { codigo: 'NAVIDAD15', porcentaje: 15, activo: true }
    ],
    ventas: [],
    sesiones: new Map()
  };
}

let db = datosIniciales();

function obtenerDB() {
  return db;
}

// Útil para las pruebas automatizadas: deja la "base" como recién iniciada.
function reiniciarDB() {
  db = datosIniciales();
  return db;
}

function siguienteId(lista) {
  return lista.length ? Math.max(...lista.map((x) => x.id)) + 1 : 1;
}

module.exports = { obtenerDB, reiniciarDB, siguienteId };
