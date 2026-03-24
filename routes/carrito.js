// ============================================================
//  routes/carrito.js
//  Monta en: /api/carrito
// ============================================================

const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/carritoController');

// GET    /api/carrito                    → ver carrito actual
// POST   /api/carrito                    → agregar item { productoId, cantidad }
// DELETE /api/carrito/:productoId        → quitar un item
// DELETE /api/carrito                    → vaciar todo el carrito

router.get('/',                 controller.getCarrito);
router.post('/',                controller.agregarItem);
router.delete('/:productoId',   controller.quitarItem);
router.delete('/',              controller.vaciarCarrito);

module.exports = router;
