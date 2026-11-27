# Guía para el equipo

La app base ya funciona en local. Esto es lo que le toca a cada uno sobre esta base.

## Wilmer — Repositorio y CI
- Ramas: `main`, `develop` y `feature/<nombre>` (ej. `feature/pruebas`, `feature/variantes`).
- Flujo de CI en `.github/workflows/ci.yml` con: `actions/checkout`, `actions/setup-node` (Node 20),
  `npm install`, `npm test` y `npm run build`.
- Releases: `v1.0.0` (versión base) y `v1.1.0` (con variantes). Recordar subir `version` en `package.json`.

## Josué — Pruebas y artefacto
- Agregar las pruebas en `test/` (el comando ya es `npm test`).
- Buen objetivo para pruebas unitarias: `src/logica/ventas.js` → `calcularVenta()`
  (subtotal, IVA 15 %, descuento, stock insuficiente, cantidad inválida).
- Para pruebas de API usar `crearApp()` como en `test/salud.test.js`, y `reiniciarDB()` de `src/datos.js`
  para empezar cada prueba con datos limpios.
- Fallo intencional sugerido: cambiar el IVA a 0.12 en una rama, ver el error en Actions y corregirlo.
- Artefacto: `actions/upload-artifact` con la carpeta `dist/`.

## Gabriel — CD y variantes
- Render: *Build command* `npm install`, *Start command* `npm start`. La app usa `process.env.PORT`.
- Variantes: `crearApp({ modulos, nombreVariante })` en `src/app.js` ya recibe la lista de módulos.
  En `src/server.js` hay que leer la configuración (archivo o variable de entorno, ej. `VARIANTE=basica|premium`)
  y pasar la lista correspondiente. La interfaz oculta sola las pestañas de módulos no activos (lee `/api/info`).
- Obligatorios: `auth, productos, clientes, ventas`. Opcionales: `reportes, descuentos, exportacion`.

## Leo — Validación de configuraciones
- Validar que toda variante incluya los obligatorios y que no tenga módulos desconocidos
  (las constantes `OBLIGATORIOS`, `OPCIONALES` y `CATALOGO` se exportan desde `src/app.js`).
- Demostrar que no hay proyecto duplicado: un solo `src/`, dos configuraciones.
