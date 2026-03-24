// ============================================================
//  controllers/carritoController.js
// ============================================================

const db = require('../db');

// GET /api/carrito
const getCarrito = (req, res) => {
  const subtotal = db.carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const envio    = subtotal > 100000 ? 0 : 3500;

  res.status(200).json({
    ok: true,
    data: db.carrito,
    subtotal,
    envio,
    total: subtotal + envio
  });
};

// POST /api/carrito  — body: { productoId, cantidad }
const agregarItem = (req, res) => {
  const { productoId, cantidad = 1 } = req.body;

  if (!productoId) {
    return res.status(400).json({ ok: false, mensaje: '"productoId" es requerido.' });
  }

  const producto = db.productos.find(p => p.id === productoId);
  if (!producto) {
    return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado.' });
  }

  if (producto.stock < cantidad) {
    return res.status(409).json({ ok: false, mensaje: `Stock insuficiente. Disponible: ${producto.stock}.` });
  }

  const itemExistente = db.carrito.find(i => i.productoId === productoId);
  if (itemExistente) {
    itemExistente.cantidad += Number(cantidad);
  } else {
    db.carrito.push({
      productoId,
      nombre:    producto.nombre,
      precio:    producto.precio,
      categoria: producto.categoria,
      cantidad:  Number(cantidad)
    });
  }

  res.status(200).json({ ok: true, mensaje: 'Producto agregado al carrito.', data: db.carrito });
};

// DELETE /api/carrito/:productoId
const quitarItem = (req, res) => {
  const index = db.carrito.findIndex(i => i.productoId === req.params.productoId);

  if (index === -1) {
    return res.status(404).json({ ok: false, mensaje: 'El producto no está en el carrito.' });
  }

  db.carrito.splice(index, 1);
  res.status(200).json({ ok: true, mensaje: 'Producto eliminado del carrito.', data: db.carrito });
};

// DELETE /api/carrito
const vaciarCarrito = (req, res) => {
  db.carrito = [];
  res.status(200).json({ ok: true, mensaje: 'Carrito vaciado.' });
};

module.exports = { getCarrito, agregarItem, quitarItem, vaciarCarrito };
