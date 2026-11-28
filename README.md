# VentaFácil — Sistema de ventas

Aplicación web sencilla de ventas usada en el **Componente Práctico 2** de
*Gestión de la Configuración de Software* (UNEMI, Ingeniería de Software, 8.º nivel).

Sobre una sola base de código se generan dos variantes del producto (Básica y Premium),
y el proyecto se versiona, prueba, construye y despliega automáticamente.

## Funcionalidades

| Módulo | Tipo | Descripción |
|---|---|---|
| `auth` | Obligatorio | Inicio y cierre de sesión |
| `productos` | Obligatorio | Listar y registrar productos con precio y stock |
| `clientes` | Obligatorio | Listar y registrar clientes (cédula de 10 dígitos) |
| `ventas` | Obligatorio | Registrar ventas, descontar stock, calcular IVA 15 % |
| `reportes` | Opcional | Resumen estadístico (total vendido, ticket promedio, más vendidos) |
| `descuentos` | Opcional | Códigos de descuento aplicables a las ventas |
| `exportacion` | Opcional | Exportar ventas a CSV |

## Requisitos

- Node.js 20 o superior (no necesita dependencias externas)

## Ejecución local

```bash
npm install      # no descarga nada, pero deja listo el proyecto
npm start        # http://localhost:3000
```

Usuario de prueba: **admin / admin123** (o vendedor / venta123).

## Scripts

| Comando | Qué hace |
|---|---|
| `npm start` | Levanta el servidor en el puerto `PORT` (por defecto 3000) |
| `npm run dev` | Igual que start, pero se reinicia al guardar cambios |
| `npm test` | Ejecuta las pruebas automatizadas (`node:test`) de la carpeta `test/` |
| `npm run build` | Empaqueta la aplicación en la carpeta `dist/` |

## Estructura

```
ventafacil/
├── public/            # Interfaz web (HTML, CSS, JS)
├── src/
│   ├── app.js         # Núcleo: arma la app con la lista de módulos activos
│   ├── server.js      # Punto de entrada (servidor HTTP)
│   ├── datos.js       # Datos en memoria con información de ejemplo
│   ├── logica/        # Lógica de negocio pura (cálculo de ventas)
│   ├── modulos/       # Un archivo por funcionalidad
│   └── utils/         # Utilidades HTTP
├── scripts/build.js   # Empaquetado a dist/
├── test/              # Pruebas automatizadas
└── docs/              # Documentación del equipo
```

## Endpoints principales

| Método | Ruta | Módulo |
|---|---|---|
| GET | `/api/salud` | sistema |
| GET | `/api/info` | sistema (versión, variante, módulos activos) |
| POST | `/api/login` | auth |
| GET/POST | `/api/productos` | productos |
| GET/POST | `/api/clientes` | clientes |
| GET/POST | `/api/ventas` | ventas |
| GET | `/api/reportes/resumen` | reportes |
| GET/POST | `/api/descuentos` | descuentos |
| GET | `/api/exportar/ventas.csv` | exportacion |

## Alojamiento local y variables de entorno para CD

Responsable: Hasqui Ortega Gabriel Leonardo.

El servidor utiliza `HOST` para seleccionar la interfaz de red y `PORT` para
seleccionar el puerto. Por defecto escucha en `127.0.0.1:3000`, en el equipo local.
`.env.example` documenta los valores de referencia; `npm start` no carga ese archivo
automaticamente. Las variables se establecen en la terminal antes del arranque.

En CMD de Windows:

```cmd
set HOST=127.0.0.1
set PORT=3000
set NODE_ENV=production
npm start
```

Comprobacion de la interfaz: `http://127.0.0.1:3000/`.
Comprobacion de salud: `http://127.0.0.1:3000/api/salud`.
Para detener el servidor desde esa terminal, presionar `Ctrl+C`.

Esta configuracion prepara el alojamiento local. El flujo de despliegue automatico
condicionado a pruebas se implementa en el siguiente paso.

## Equipo

- Santillán Cabrera Karla Nohelia
- Espinoza Olvera Wilmer Josué
- Guadalupe Cobos Josué Fernando
- Hasqui Ortega Gabriel Leonardo
- Moyota Martínez Leo Joel
