// Frontend de VentaFácil: muestra solo las pestañas de los módulos activos.
let token = sessionStorage.getItem('token');
let info = null;
let itemsVenta = [];

const $ = (sel) => document.querySelector(sel);
const dinero = (n) => `$${Number(n).toFixed(2)}`;

async function api(ruta, opciones = {}) {
  const res = await fetch(ruta, {
    ...opciones,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(opciones.headers || {}) }
  });
  const datos = res.headers.get('content-type')?.includes('json') ? await res.json() : await res.text();
  if (res.status === 401 && ruta !== '/api/login') {
    sessionStorage.clear();
    location.reload();
  }
  if (!res.ok) throw new Error(datos.error || 'Error');
  return datos;
}

const PESTANAS = [
  { id: 'productos', titulo: 'Productos' },
  { id: 'clientes', titulo: 'Clientes' },
  { id: 'ventas', titulo: 'Ventas' },
  { id: 'reportes', titulo: 'Reportes' },
  { id: 'descuentos', titulo: 'Descuentos' }
];

function abrirPestana(id) {
  document.querySelectorAll('.tab').forEach((t) => (t.hidden = t.id !== `tab-${id}`));
  document.querySelectorAll('nav button').forEach((b) => b.classList.toggle('activo', b.dataset.tab === id));
  cargar[id]?.();
}

const cargar = {
  async productos() {
    const lista = await api('/api/productos');
    $('#tabla-productos').innerHTML = lista.map((p) => `<tr><td>${p.id}</td><td>${p.nombre}</td><td>${dinero(p.precio)}</td><td>${p.stock}</td></tr>`).join('');
  },
  async clientes() {
    const lista = await api('/api/clientes');
    $('#tabla-clientes').innerHTML = lista.map((c) => `<tr><td>${c.id}</td><td>${c.nombre}</td><td>${c.cedula}</td><td>${c.telefono}</td></tr>`).join('');
  },
  async ventas() {
    const [clientes, productos, ventas] = await Promise.all([api('/api/clientes'), api('/api/productos'), api('/api/ventas')]);
    $('#sel-cliente').innerHTML = clientes.map((c) => `<option value="${c.id}">${c.nombre}</option>`).join('');
    $('#sel-producto').innerHTML = productos.map((p) => `<option value="${p.id}">${p.nombre} (${dinero(p.precio)}, stock ${p.stock})</option>`).join('');
    $('#tabla-ventas').innerHTML = ventas.map((v) => `<tr><td>${v.id}</td><td>${new Date(v.fecha).toLocaleString()}</td><td>${v.cliente.nombre}</td><td>${dinero(v.subtotal)}</td><td>${dinero(v.descuento)}</td><td>${dinero(v.iva)}</td><td><b>${dinero(v.total)}</b></td></tr>`).join('');
    pintarItems();
  },
  async reportes() {
    const r = await api('/api/reportes/resumen');
    $('#resumen').innerHTML = `
      <div><span>Ventas</span><strong>${r.numeroVentas}</strong></div>
      <div><span>Total vendido</span><strong>${dinero(r.totalVendido)}</strong></div>
      <div><span>Ticket promedio</span><strong>${dinero(r.ticketPromedio)}</strong></div>`;
    $('#mas-vendidos').innerHTML = r.masVendidos.map((m) => `<li>${m.nombre} — ${m.cantidad} u.</li>`).join('') || '<li>Sin ventas aún</li>';
  },
  async descuentos() {
    const lista = await api('/api/descuentos');
    $('#tabla-descuentos').innerHTML = lista.map((d) => `<tr><td>${d.codigo}</td><td>${d.porcentaje}%</td><td>${d.activo ? 'Sí' : 'No'}</td></tr>`).join('');
  }
};

function pintarItems() {
  const opciones = [...$('#sel-producto').options];
  $('#lista-items').innerHTML = itemsVenta
    .map((i, idx) => `<li>${opciones.find((o) => o.value == i.productoId)?.text.split(' (')[0]} × ${i.cantidad} <a href="#" data-quitar="${idx}">quitar</a></li>`)
    .join('');
}

async function iniciarApp() {
  info = await (await fetch('/api/info')).json();
  const activos = info.modulosActivos;
  $('#etiqueta-variante').textContent = info.variante;
  $('#etiqueta-version').textContent = `v${info.version}`;
  $('#nombre-usuario').textContent = sessionStorage.getItem('nombre') || '';

  $('#menu').innerHTML = PESTANAS.filter((p) => activos.includes(p.id))
    .map((p) => `<button data-tab="${p.id}">${p.titulo}</button>`).join('');
  $('#fila-descuento').hidden = !activos.includes('descuentos');
  $('#zona-exportar').hidden = !activos.includes('exportacion');

  $('#vista-login').hidden = true;
  $('#vista-app').hidden = false;
  abrirPestana('productos');
}

// ---- Eventos ----
$('#form-login').addEventListener('submit', async (e) => {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(e.target));
  try {
    const r = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error);
    token = j.token;
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('nombre', j.nombre);
    iniciarApp();
  } catch (err) {
    $('#error-login').textContent = err.message;
  }
});

$('#btn-salir').addEventListener('click', async () => {
  try { await api('/api/logout', { method: 'POST' }); } catch {}
  sessionStorage.clear();
  location.reload();
});

$('#menu').addEventListener('click', (e) => e.target.dataset.tab && abrirPestana(e.target.dataset.tab));

function formularioSimple(selector, ruta, recargar) {
  $(selector).addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await api(ruta, { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(e.target))) });
      e.target.reset();
      recargar();
    } catch (err) { alert(err.message); }
  });
}
formularioSimple('#form-producto', '/api/productos', cargar.productos);
formularioSimple('#form-cliente', '/api/clientes', cargar.clientes);
formularioSimple('#form-descuento', '/api/descuentos', cargar.descuentos);

$('#btn-agregar-item').addEventListener('click', () => {
  itemsVenta.push({ productoId: Number($('#sel-producto').value), cantidad: Number($('#cant-producto').value) });
  pintarItems();
});
$('#lista-items').addEventListener('click', (e) => {
  if (e.target.dataset.quitar !== undefined) { e.preventDefault(); itemsVenta.splice(e.target.dataset.quitar, 1); pintarItems(); }
});

$('#form-venta').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  try {
    const v = await api('/api/ventas', {
      method: 'POST',
      body: JSON.stringify({ clienteId: Number(f.get('clienteId')), items: itemsVenta, codigoDescuento: f.get('codigoDescuento') || undefined })
    });
    $('#msg-venta').textContent = `Venta #${v.id} registrada. Total: ${dinero(v.total)}`;
    itemsVenta = [];
    cargar.ventas();
  } catch (err) { $('#msg-venta').textContent = `Error: ${err.message}`; }
});

$('#btn-exportar').addEventListener('click', async (e) => {
  e.preventDefault();
  const csv = await api('/api/exportar/ventas.csv');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  Object.assign(document.createElement('a'), { href: url, download: 'ventas.csv' }).click();
});

if (token) iniciarApp().catch(() => { sessionStorage.clear(); });
