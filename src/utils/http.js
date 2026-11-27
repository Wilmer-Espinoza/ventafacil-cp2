// Utilidades HTTP reutilizables (sin dependencias externas)

function enviarJSON(res, status, data) {
  const cuerpo = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(cuerpo)
  });
  res.end(cuerpo);
}

function enviarTexto(res, status, texto, tipo = 'text/plain; charset=utf-8', extras = {}) {
  res.writeHead(status, { 'Content-Type': tipo, ...extras });
  res.end(texto);
}

function leerCuerpo(req) {
  return new Promise((resolve, reject) => {
    let datos = '';
    req.on('data', (chunk) => {
      datos += chunk;
      if (datos.length > 1e6) {
        reject(new Error('Cuerpo demasiado grande'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!datos) return resolve({});
      try {
        resolve(JSON.parse(datos));
      } catch {
        reject(new Error('JSON inválido'));
      }
    });
    req.on('error', reject);
  });
}

module.exports = { enviarJSON, enviarTexto, leerCuerpo };
