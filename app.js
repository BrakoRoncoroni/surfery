// ============================================================
//  app.js — La Surferia | Punto de entrada del servidor
// ============================================================

const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');
const path       = require('path');

// --- Middlewares propios ---
const logger     = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const notFound   = require('./middlewares/notFound');

// --- Routers ---
const productosRouter   = require('./routes/productos');
const categoriasRouter  = require('./routes/categorias');
const carritoRouter     = require('./routes/carrito');

const app  = express();
const PORT = process.env.PORT || 3000;

// ---- Middlewares globales ----
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger);                              // log de cada request
app.use(express.static(path.join(__dirname, 'public'))); // archivos estáticos

// ---- Rutas de la API ----
app.use('/api/productos',   productosRouter);
app.use('/api/categorias',  categoriasRouter);
app.use('/api/carrito',     carritoRouter);

// ---- Ruta principal: sirve el frontend ----
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// ---- Middlewares de error (siempre al final) ----
app.use(notFound);
app.use(errorHandler);

// ---- Iniciar servidor ----
app.listen(PORT, () => {
  console.log(`\n🌊  La Surferia corriendo en http://localhost:${PORT}`);
  console.log(`📦  API disponible en http://localhost:${PORT}/api`);
  console.log(`🛠️   Panel admin en   http://localhost:${PORT}/\n`);
});

module.exports = app;
