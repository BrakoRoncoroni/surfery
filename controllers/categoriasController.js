// ============================================================
//  controllers/categoriasController.js
// ============================================================

const db = require('../db');

const CATEGORIAS = [
  { slug: 'tabla-de-surf',      nombre: 'Tabla de Surf',      emoji: '🏄' },
  { slug: 'traje-de-neoprene',  nombre: 'Traje de Neoprene',  emoji: '🤿' },
  { slug: 'accesorios',         nombre: 'Accesorios',          emoji: '🎒' },
  { slug: 'ropa',               nombre: 'Ropa',                emoji: '👕' }
];

// GET /api/categorias
const getAll = (req, res) => {
  // enriquece con conteo de productos por categoría
  const conConteo = CATEGORIAS.map(cat => ({
    ...cat,
    cantidad: db.productos.filter(p => p.categoria === cat.nombre).length
  }));

  res.status(200).json({ ok: true, data: conConteo });
};

module.exports = { getAll };
