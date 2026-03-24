// ============================================================
//  routes/productos.js
//  Monta en: /api/productos
// ============================================================

const express           = require('express');
const router            = express.Router();
const controller        = require('../controllers/productosController');
const validateProducto  = require('../middlewares/validateProducto');
const authAdmin         = require('../middlewares/authAdmin');

// GET  /api/productos           → listar todos (con filtros opcionales)
// GET  /api/productos/:id       → obtener uno por ID
// POST /api/productos           → crear (requiere auth + validación)
// PUT  /api/productos/:id       → actualizar (requiere auth + validación)
// DELETE /api/productos/:id     → eliminar (requiere auth)

router.get('/',     controller.getAll);
router.get('/:id',  controller.getById);

router.post('/',    authAdmin, validateProducto, controller.create);
router.put('/:id',  authAdmin, validateProducto, controller.update);
router.delete('/:id', authAdmin, controller.remove);

module.exports = router;
