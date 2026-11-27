// Prueba de humo: comprueba que la aplicación arranca y responde.
// (Las pruebas completas del CI se agregan en esta misma carpeta test/.)
const { test } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const { crearApp } = require('../src/app');

test('el endpoint /api/salud responde ok', async () => {
  const servidor = http.createServer(crearApp()).listen(0);
  const { port } = servidor.address();
  try {
    const res = await fetch(`http://localhost:${port}/api/salud`);
    const cuerpo = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(cuerpo.estado, 'ok');
  } finally {
    servidor.close();
  }
});
