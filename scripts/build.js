// Construcción/empaquetado: copia lo necesario para producción a la carpeta dist/.
const fs = require('node:fs');
const path = require('node:path');

const raiz = path.join(__dirname, '..');
const dist = path.join(raiz, 'dist');

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const elemento of ['src', 'public', 'package.json', 'README.md']) {
  const origen = path.join(raiz, elemento);
  if (fs.existsSync(origen)) {
    fs.cpSync(origen, path.join(dist, elemento), { recursive: true });
  }
}

const pkg = require(path.join(raiz, 'package.json'));
fs.writeFileSync(
  path.join(dist, 'build-info.json'),
  JSON.stringify({ nombre: pkg.name, version: pkg.version, fecha: new Date().toISOString() }, null, 2)
);

console.log(`Build listo en dist/ (versión ${pkg.version})`);
