// ============================================================
//  controllers/productosController.js
//  Lógica de negocio para el recurso "productos"
// ============================================================

const { v4: uuidv4 } = require('uuid');
const db = require('../db');

// GET /api/productos
// Query params opcionales: ?categoria=Ropa  &destacado=true
const getAll = (req, res) => {
  let productos = [...db.productos];

  if (req.query.categoria) {
    productos = productos.filter(p => p.categoria === req.query.categoria);
  }

  if (req.query.destacado === 'true') {
    productos = productos.filter(p => p.destacado === true);
  }

  if (req.query.buscar) {
    const term = req.query.buscar.toLowerCase();
    productos = productos.filter(p =>
      p.nombre.toLowerCase().includes(term) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(term))
    );
  }

  res.status(200).json({
    ok: true,
    total: productos.length,
    data: productos
  });
};

// GET /api/productos/:id
const getById = (req, res) => {
  const producto = db.productos.find(p => p.id === req.params.id);

  if (!producto) {
    return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado.' });
  }

  res.status(200).json({ ok: true, data: producto });
};

// POST /api/productos  (body enviado por el cliente)
const create = (req, res) => {
  const { nombre, categoria, precio, stock, descripcion, marca, destacado } = req.body;

  const nuevoProducto = {
    id:          uuidv4(),
    nombre:      nombre.trim(),
    categoria,
    precio:      Number(precio),
    stock:       Number(stock) || 0,
    descripcion: descripcion ? descripcion.trim() : '',
    marca:       marca        ? marca.trim()       : '',
    destacado:   destacado === true || destacado === 'true',
    creadoEn:    new Date().toISOString()
  };

  db.productos.push(nuevoProducto);

  res.status(201).json({
    ok: true,
    mensaje: 'Producto creado exitosamente.',
    data: nuevoProducto
  });
};

// PUT /api/productos/:id
const update = (req, res) => {
  const index = db.productos.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado.' });
  }

  const actualizado = {
    ...db.productos[index],
    ...req.body,
    id:          db.productos[index].id,   // el id nunca cambia
    precio:      req.body.precio  ? Number(req.body.precio)  : db.productos[index].precio,
    stock:       req.body.stock   !== undefined ? Number(req.body.stock) : db.productos[index].stock,
    destacado:   req.body.destacado !== undefined
                   ? (req.body.destacado === true || req.body.destacado === 'true')
                   : db.productos[index].destacado,
    actualizadoEn: new Date().toISOString()
  };

  db.productos[index] = actualizado;

  res.status(200).json({
    ok: true,
    mensaje: 'Producto actualizado.',
    data: actualizado
  });
};

// DELETE /api/productos/:id
const remove = (req, res) => {
  const index = db.productos.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado.' });
  }

  const eliminado = db.productos.splice(index, 1)[0];

  res.status(200).json({
    ok: true,
    mensaje: `Producto "${eliminado.nombre}" eliminado correctamente.`,
    data: eliminado
  });
};

module.exports = { getAll, getById, create, update, remove };
