// ============================================================
//  middlewares/authAdmin.js
//  Simula autenticación por API Key en el header
//  Header esperado: x-api-key: surferia-admin-2024
// ============================================================

const API_KEY = 'surferia-admin-2024';

const authAdmin = (req, res, next) => {
  const key = req.headers['x-api-key'];

  if (!key) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Acceso denegado. Se requiere el header x-api-key.'
    });
  }

  if (key !== API_KEY) {
    return res.status(403).json({
      ok: false,
      mensaje: 'API Key inválida.'
    });
  }

  next();
};

module.exports = authAdmin;
