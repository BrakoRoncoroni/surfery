// ============================================================
//  public/js/api.js
//  Capa de acceso a la API del servidor (fetch)
//  Todos los calls al backend pasan por acá.
// ============================================================

const API_BASE = '/api';
const API_KEY  = 'surferia-admin-2024';   // sólo para rutas protegidas

const headers = (admin = false) => ({
  'Content-Type': 'application/json',
  ...(admin && { 'x-api-key': API_KEY })
});

// ---- Productos ----

async function fetchProductos(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/productos${qs ? '?' + qs : ''}`);
  return res.json();
}

async function fetchProductoById(id) {
  const res = await fetch(`${API_BASE}/productos/${id}`);
  return res.json();
}

async function crearProducto(body) {
  const res = await fetch(`${API_BASE}/productos`, {
    method:  'POST',
    headers: headers(true),
    body:    JSON.stringify(body)
  });
  return res.json();
}

async function actualizarProducto(id, body) {
  const res = await fetch(`${API_BASE}/productos/${id}`, {
    method:  'PUT',
    headers: headers(true),
    body:    JSON.stringify(body)
  });
  return res.json();
}

async function eliminarProducto(id) {
  const res = await fetch(`${API_BASE}/productos/${id}`, {
    method:  'DELETE',
    headers: headers(true)
  });
  return res.json();
}

// ---- Categorías ----

async function fetchCategorias() {
  const res = await fetch(`${API_BASE}/categorias`);
  return res.json();
}

// ---- Carrito ----

async function fetchCarrito() {
  const res = await fetch(`${API_BASE}/carrito`);
  return res.json();
}

async function agregarAlCarrito(productoId, cantidad = 1) {
  const res = await fetch(`${API_BASE}/carrito`, {
    method:  'POST',
    headers: headers(),
    body:    JSON.stringify({ productoId, cantidad })
  });
  return res.json();
}

async function quitarDelCarrito(productoId) {
  const res = await fetch(`${API_BASE}/carrito/${productoId}`, { method: 'DELETE' });
  return res.json();
}

async function vaciarCarrito() {
  const res = await fetch(`${API_BASE}/carrito`, { method: 'DELETE' });
  return res.json();
}
