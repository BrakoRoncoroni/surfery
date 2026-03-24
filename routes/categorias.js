// ============================================================
//  routes/categorias.js
//  Monta en: /api/categorias
// ============================================================

const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/categoriasController');

// GET /api/categorias   → lista de categorías con conteo de productos
router.get('/', controller.getAll);

module.exports = router;
