// ============================================================
//  middlewares/validateProducto.js
//  Valida el body antes de crear o actualizar un producto
// ============================================================

const CATEGORIAS_VALIDAS = [
  'Tabla de Surf',
  'Traje de Neoprene',
  'Accesorios',
  'Ropa'
];

const validateProducto = (req, res, next) => {
  const { nombre, categoria, precio, stock } = req.body;
  const errores = [];

  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    errores.push('El campo "nombre" es requerido y debe ser texto.');
  }

  if (!categoria || !CATEGORIAS_VALIDAS.includes(categoria)) {
    errores.push(`El campo "categoria" debe ser uno de: ${CATEGORIAS_VALIDAS.join(', ')}.`);
  }

  if (precio === undefined || isNaN(Number(precio)) || Number(precio) <= 0) {
    errores.push('El campo "precio" es requerido y debe ser un número mayor a 0.');
  }

  if (stock !== undefined && (isNaN(Number(stock)) || Number(stock) < 0)) {
    errores.push('El campo "stock" debe ser un número mayor o igual a 0.');
  }

  if (errores.length > 0) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Error de validación',
      errores
    });
  }

  next();
};

module.exports = validateProducto;
