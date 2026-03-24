// ============================================================
//  public/js/app.js
//  Lógica del frontend: navegación, render, carrito, admin
// ============================================================

const catEmoji = {
  'Tabla de Surf':     '🏄',
  'Traje de Neoprene': '🤿',
  'Accesorios':        '🎒',
  'Ropa':              '👕'
};

let currentFilter = '';

// ============================================================
//  NAVEGACIÓN
// ============================================================

function navigate(page, filterCat = null) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  const navEl = document.getElementById('nav-' + page);
  if (navEl) navEl.classList.add('active');

  if (page === 'tienda') {
    if (filterCat !== null) currentFilter = filterCat;
    renderTienda();
  }
  if (page === 'admin') {
    renderAdminTable();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
//  TIENDA — render de productos
// ============================================================

async function renderTienda() {
  const grid = document.getElementById('products-grid');
  grid.innerHTML = '<p style="color:rgba(255,255,255,.3);grid-column:1/-1;text-align:center;padding:3rem">Cargando...</p>';

  updateCatPills();

  const params = currentFilter ? { categoria: currentFilter } : {};
  const resp   = await fetchProductos(params);

  if (!resp.ok || !resp.data.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🌊</div>
        <h3>Sin productos aquí</h3>
        <p>Agregá productos desde el panel de administración.</p>
      </div>`;
    return;
  }

  grid.innerHTML = resp.data.map(p => `
    <div class="product-card">
      <div class="product-img">
        ${p.destacado ? '<span class="product-badge">Destacado</span>' : ''}
        <span style="position:relative;z-index:1;font-size:3rem">${catEmoji[p.categoria] || '📦'}</span>
      </div>
      <div class="product-body">
        <div class="product-cat">${p.categoria}</div>
        <div class="product-name">${p.nombre}</div>
        <div class="product-desc">${p.descripcion || ''}</div>
        <div class="product-footer">
          <div>
            <div class="product-price">$${p.precio.toLocaleString('es-AR')}</div>
            <div class="product-stock">Stock: ${p.stock}</div>
          </div>
          <button class="add-btn" onclick="onAgregarCarrito('${p.id}')">+ Carrito</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterProducts(cat) {
  currentFilter = cat;
  updateCatPills();
  renderTienda();
}

function updateCatPills() {
  document.querySelectorAll('#page-tienda .cat-pill').forEach(p => p.classList.remove('active'));
  if (!currentFilter) {
    const all = document.querySelector('#page-tienda .cat-pill.all');
    if (all) all.classList.add('active');
  } else {
    document.querySelectorAll('#page-tienda .cat-pill:not(.all)').forEach(p => {
      if (p.dataset.cat === currentFilter) p.classList.add('active');
    });
  }
}

// ============================================================
//  CARRITO
// ============================================================

async function onAgregarCarrito(productoId) {
  const resp = await agregarAlCarrito(productoId, 1);
  if (resp.ok) {
    showToast('Producto agregado al carrito 🤙', 'success');
    renderCartCount(resp.data);
  } else {
    showToast(resp.mensaje || 'No se pudo agregar', 'error');
  }
}

function renderCartCount(items) {
  const total = items.reduce((s, i) => s + i.cantidad, 0);
  document.getElementById('cart-count').textContent = total;
}

async function toggleCart() {
  const overlay = document.getElementById('cart-overlay');
  overlay.classList.toggle('open');
  if (overlay.classList.contains('open')) await renderCart();
}

function closeCartOutside(e) {
  if (e.target === document.getElementById('cart-overlay')) toggleCart();
}

async function renderCart() {
  const resp = await fetchCarrito();
  const container = document.getElementById('cart-items');
  const summary   = document.getElementById('cart-summary');

  if (!resp.data || !resp.data.length) {
    container.innerHTML = `<div style="text-align:center;padding:3rem;color:rgba(255,255,255,.3)"><div style="font-size:2.5rem;margin-bottom:.75rem">🌊</div><p>Tu carrito está vacío</p></div>`;
    summary.innerHTML = '';
    return;
  }

  container.innerHTML = resp.data.map(i => `
    <div class="cart-item">
      <div class="cart-item-icon">${catEmoji[i.categoria] || '📦'}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${i.nombre}</div>
        <div class="cart-item-price">$${(i.precio * i.cantidad).toLocaleString('es-AR')}</div>
      </div>
      <div class="cart-qty">
        <button class="qty-btn" onclick="onQuitarItem('${i.productoId}')">−</button>
        <span class="qty-num">${i.cantidad}</span>
        <button class="qty-btn" onclick="onAgregarCarrito('${i.productoId}');renderCart()">+</button>
      </div>
    </div>
  `).join('');

  summary.innerHTML = `
    <div class="cart-total">
      <div class="cart-total-row"><span>Subtotal</span><span>$${resp.subtotal.toLocaleString('es-AR')}</span></div>
      <div class="cart-total-row"><span>Envío</span><span>${resp.envio === 0 ? '🎉 GRATIS' : '$' + resp.envio.toLocaleString('es-AR')}</span></div>
      <div class="cart-total-row grand"><span>TOTAL</span><span>$${resp.total.toLocaleString('es-AR')}</span></div>
      <button class="checkout-btn" onclick="onCheckout()">Finalizar compra →</button>
    </div>`;

  renderCartCount(resp.data);
}

async function onQuitarItem(productoId) {
  await quitarDelCarrito(productoId);
  await renderCart();
}

async function onCheckout() {
  await vaciarCarrito();
  document.getElementById('cart-count').textContent = '0';
  await renderCart();
  toggleCart();
  showToast('¡Compra realizada! Aloha 🤙', 'success');
}

// ============================================================
//  ADMIN — tabla + formulario
// ============================================================

async function renderAdminTable() {
  const resp = await fetchProductos();
  const container = document.getElementById('admin-table-container');
  if (!container) return;

  if (!resp.data || !resp.data.length) {
    container.innerHTML = '<p style="font-size:.8rem;color:rgba(255,255,255,.3);text-align:center;padding:1.5rem">No hay productos cargados.</p>';
    return;
  }

  container.innerHTML = `
    <table class="product-table">
      <thead>
        <tr><th>ID</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr>
      </thead>
      <tbody>
        ${resp.data.map(p => `
          <tr>
            <td style="font-family:'Space Mono',monospace;font-size:.65rem;color:rgba(255,255,255,.3)">${p.id.split('-')[0]}…</td>
            <td>${p.nombre}</td>
            <td>${catEmoji[p.categoria] || ''} ${p.categoria}</td>
            <td style="font-family:'Space Mono',monospace;color:var(--sand)">$${p.precio.toLocaleString('es-AR')}</td>
            <td>${p.stock}</td>
            <td><button class="btn-del" onclick="onEliminarProducto('${p.id}')">Eliminar</button></td>
          </tr>`).join('')}
      </tbody>
    </table>`;
}

async function onEliminarProducto(id) {
  const resp = await eliminarProducto(id);
  if (resp.ok) {
    showToast(resp.mensaje, 'info');
    addLog(`[DELETE] /api/productos/${id} → 200 ${resp.mensaje}`, 'ok');
    renderAdminTable();
  } else {
    showToast(resp.mensaje || 'Error al eliminar', 'error');
    addLog(`[DELETE] /api/productos/${id} → error`, 'err');
  }
}

async function onSubmitProducto() {
  const body = {
    nombre:     document.getElementById('f-nombre').value.trim(),
    categoria:  document.getElementById('f-categoria').value,
    precio:     document.getElementById('f-precio').value,
    stock:      document.getElementById('f-stock').value,
    descripcion:document.getElementById('f-desc').value.trim(),
    marca:      document.getElementById('f-marca').value.trim(),
    destacado:  document.getElementById('f-destacado').value
  };

  addLog(`[POST] /api/productos → body: ${JSON.stringify(body).substring(0, 80)}…`, 'req');

  const resp = await crearProducto(body);

  if (resp.ok) {
    showToast(`Producto "${resp.data.nombre}" creado ✓`, 'success');
    addLog(`[POST] 201 Created — id: ${resp.data.id}`, 'ok');
    clearForm();
    renderAdminTable();
  } else {
    const msg = resp.errores ? resp.errores.join(' | ') : (resp.mensaje || 'Error desconocido');
    showToast(msg, 'error');
    addLog(`[POST] 400/500 Error — ${msg}`, 'err');
  }
}

function clearForm() {
  ['f-nombre','f-precio','f-stock','f-desc','f-marca'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('f-categoria').value = '';
  document.getElementById('f-destacado').value = 'false';
}

// ============================================================
//  UTILS
// ============================================================

function showToast(msg, type = 'info') {
  const container = document.getElementById('toasts');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✅', error: '❌', info: '💬' };
  toast.innerHTML = `<span>${icons[type] || '📌'}</span><span class="toast-msg">${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity .4s';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

function addLog(msg, type = '') {
  const log = document.getElementById('mw-log');
  if (!log) return;
  const line = document.createElement('div');
  line.className = `log-line ${type}`;
  line.textContent = `[${new Date().toLocaleTimeString('es-AR')}] ${msg}`;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  navigate('home');
});
