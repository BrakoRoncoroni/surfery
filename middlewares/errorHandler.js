// ============================================================
//  middlewares/errorHandler.js
//  Manejo centralizado de errores (siempre va al final en app.js)
// ============================================================

const errorHandler = (err, req, res, next) => {
  console.error('\x1b[31m[ERROR]\x1b[0m', err.stack || err.message);

  const status  = err.status || err.statusCode || 500;
  const mensaje = err.message || 'Error interno del servidor';

  res.status(status).json({
    ok: false,
    mensaje,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
