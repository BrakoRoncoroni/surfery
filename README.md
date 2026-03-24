# 🌊 La Surferia — E-commerce de Surf

E-commerce temático de surf construido con **Node.js + Express**, arquitectura REST,
middlewares propios y frontend servido desde el mismo servidor.

---

## 📁 Estructura del proyecto

```
la-surferia/
│
├── app.js                          ← Punto de entrada: middlewares globales + routers
├── db.js                           ← Base de datos en memoria (array de productos)
├── package.json
│
├── routes/
│   ├── productos.js                ← GET / POST / PUT / DELETE /api/productos
│   ├── categorias.js               ← GET /api/categorias
│   └── carrito.js                  ← GET / POST / DELETE /api/carrito
│
├── controllers/
│   ├── productosController.js      ← Lógica de negocio de productos
│   ├── categoriasController.js     ← Lógica de categorías
│   └── carritoController.js        ← Lógica del carrito
│
├── middlewares/
│   ├── logger.js                   ← Loggea cada request (método, path, status, ms)
│   ├── validateProducto.js         ← Valida el body antes de crear/editar
│   ├── authAdmin.js                ← Verifica el header x-api-key
│   ├── notFound.js                 ← Responde 404 si ninguna ruta coincide
│   └── errorHandler.js             ← Manejo centralizado de errores
│
├── views/
│   └── index.html                  ← Frontend principal (servido por Express)
│
└── public/
    ├── css/
    │   └── styles.css              ← Estilos (temática ocean/Hawaii)
    └── js/
        ├── api.js                  ← Capa fetch → llama a los endpoints del servidor
        └── app.js                  ← Lógica del frontend: render, carrito, admin
```

---

## 🚀 Instalación y arranque

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor (producción)
npm start

# 3. O con hot-reload para desarrollo
npm run dev
```

Abrí el navegador en **http://localhost:3000**

---

## 🛠️ Cómo usar el Panel de Administración

El panel admin está en la pestaña **Admin** del sitio (`http://localhost:3000` → Admin).

### ✅ Agregar un producto (POST /api/productos)

1. Completá el formulario con los datos del producto:
   - **Nombre** *(requerido)*: ej. `Tabla Fish 6'4"`
   - **Categoría** *(requerido)*: elegí una de las 4 opciones del menú
   - **Precio** *(requerido)*: en ARS, ej. `95000`
   - **Stock**: cantidad disponible, ej. `7`
   - **Descripción**: texto libre sobre el producto
   - **Marca**: ej. `Lost`, `O'Neill`, `Dakine`
   - **¿Destacado?**: si elegís "Sí", aparece con badge en la tienda
2. Hacé click en **"Enviar → POST /api/productos"**
3. Si todo está bien: aparece un toast verde y el producto se suma a la tabla
4. Si falta un campo requerido: el middleware `validateProducto` rechaza con error 400

> 🔐 Las rutas de escritura (POST, PUT, DELETE) requieren el header  
> `x-api-key: surferia-admin-2024`  
> El frontend lo envía automáticamente. Si usás Postman/Insomnia, agregalo a mano.

---

### 📋 Ver todos los productos (GET /api/productos)

- Hacé click en **"↻ Refrescar"** en el panel "Lista de productos"
- La tabla muestra ID, nombre, categoría, precio, stock y un botón de eliminar
- También podés ver los productos en la **Tienda** (pestaña Tienda)

---

### 🗑️ Eliminar un producto (DELETE /api/productos/:id)

**Opción A — desde la tabla:**
1. En el panel "Lista de productos", hacé click en **Eliminar** en la fila del producto

**Opción B — por ID:**
1. Copiá el ID del producto desde la tabla
2. Pegalo en el campo del panel "Eliminar por ID"
3. Hacé click en **Eliminar**

---

### 🗂️ Consultar categorías (GET /api/categorias)

- En el panel "Categorías disponibles", hacé click en **"↻ Consultar"**
- Muestra las 4 categorías con el conteo de productos actual

---

### 📟 Request Log (Middleware Log)

En la parte inferior del panel admin hay un **log en tiempo real** que muestra:
- Cada request enviado desde el frontend
- El resultado (201 Created, 200 OK, 400 Error, etc.)
- Qué middlewares se activaron (authAdmin, validateProducto, etc.)

---

## 🌐 Endpoints de la API

### Productos

| Método   | Endpoint                 | Auth | Descripción                        |
|----------|--------------------------|------|------------------------------------|
| `GET`    | `/api/productos`         | No   | Lista todos los productos          |
| `GET`    | `/api/productos?categoria=Ropa` | No | Filtra por categoría         |
| `GET`    | `/api/productos?destacado=true` | No | Solo destacados             |
| `GET`    | `/api/productos?buscar=tabla`   | No | Búsqueda por texto          |
| `GET`    | `/api/productos/:id`     | No   | Obtiene un producto por ID         |
| `POST`   | `/api/productos`         | ✅   | Crea un producto (body JSON)       |
| `PUT`    | `/api/productos/:id`     | ✅   | Actualiza un producto              |
| `DELETE` | `/api/productos/:id`     | ✅   | Elimina un producto                |

### Categorías

| Método | Endpoint           | Descripción                             |
|--------|--------------------|-----------------------------------------|
| `GET`  | `/api/categorias`  | Lista categorías con conteo de productos|

### Carrito

| Método   | Endpoint                      | Descripción                    |
|----------|-------------------------------|--------------------------------|
| `GET`    | `/api/carrito`                | Ver carrito actual             |
| `POST`   | `/api/carrito`                | Agregar item `{ productoId, cantidad }` |
| `DELETE` | `/api/carrito/:productoId`    | Quitar un item del carrito     |
| `DELETE` | `/api/carrito`                | Vaciar todo el carrito         |

---

## 📬 Ejemplo con curl / Postman

```bash
# Agregar un producto
curl -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -H "x-api-key: surferia-admin-2024" \
  -d '{
    "nombre": "Tabla Gun 7'\''6\"",
    "categoria": "Tabla de Surf",
    "precio": 310000,
    "stock": 2,
    "descripcion": "Para olas grandes. Ideal Punta de Lobos o Pipeline.",
    "marca": "Channel Islands",
    "destacado": true
  }'

# Listar productos filtrados
curl http://localhost:3000/api/productos?categoria=Accesorios

# Agregar al carrito
curl -X POST http://localhost:3000/api/carrito \
  -H "Content-Type: application/json" \
  -d '{ "productoId": "<id-del-producto>", "cantidad": 2 }'
```

---

## 🏄 Categorías disponibles

| Categoría          | Emoji |
|--------------------|-------|
| Tabla de Surf      | 🏄    |
| Traje de Neoprene  | 🤿    |
| Accesorios         | 🎒    |
| Ropa               | 👕    |

---

*Hecho con olas, arena y Node.js. Aloha 🤙*
