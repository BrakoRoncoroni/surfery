// ============================================================
//  middlewares/notFound.js
//  Responde con 404 si ninguna ruta coincide
// ============================================================

const notFound = (req, res, next) => {
  res.status(404).json({
    ok: false,
    mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
};

module.exports = notFound;
