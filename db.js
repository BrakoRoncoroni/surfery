// ============================================================
//  db.js — Base de datos en memoria (simula una DB real)
//  En producción, reemplazá esto por MongoDB, PostgreSQL, etc.
// ============================================================

const { v4: uuidv4 } = require('uuid');

const db = {
  productos: [
    {
      id: uuidv4(),
      nombre: 'Tabla Shortboard 6\'2"',
      categoria: 'Tabla de Surf',
      precio: 185000,
      stock: 5,
      descripcion: 'Tabla de alto rendimiento para olas rápidas. Ideal para surfistas intermedios y avanzados.',
      marca: 'Rusty',
      destacado: true,
      creadoEn: new Date().toISOString()
    },
    {
      id: uuidv4(),
      nombre: 'Traje 3/2mm Full Suit',
      categoria: 'Traje de Neoprene',
      precio: 92000,
      stock: 8,
      descripcion: 'Traje completo de neoprene de 3mm, ideal para aguas frías del Atlántico.',
      marca: 'Rip Curl',
      destacado: false,
      creadoEn: new Date().toISOString()
    },
    {
      id: uuidv4(),
      nombre: 'Leash 9" Premium',
      categoria: 'Accesorios',
      precio: 14500,
      stock: 20,
      descripcion: 'Leash de poliuretano resistente con swivel doble para mayor libertad.',
      marca: 'FCS',
      destacado: false,
      creadoEn: new Date().toISOString()
    },
    {
      id: uuidv4(),
      nombre: 'Remera UV Hawaiian',
      categoria: 'Ropa',
      precio: 28000,
      stock: 15,
      descripcion: 'Remera lycra con protección UV 50+. Estampado tropical exclusivo Hawaii collection.',
      marca: 'Quiksilver',
      destacado: true,
      creadoEn: new Date().toISOString()
    },
    {
      id: uuidv4(),
      nombre: 'Tabla Longboard 9\'0"',
      categoria: 'Tabla de Surf',
      precio: 220000,
      stock: 3,
      descripcion: 'Longboard clásico para olas suaves. Perfecto para aprender y disfrutar el noseriding.',
      marca: 'Walden',
      destacado: false,
      creadoEn: new Date().toISOString()
    },
    {
      id: uuidv4(),
      nombre: 'Parafina Cold Water',
      categoria: 'Accesorios',
      precio: 3800,
      stock: 50,
      descripcion: 'Parafina especial para agua fría, máxima adherencia en temperaturas de 8–16 °C.',
      marca: 'Sex Wax',
      destacado: false,
      creadoEn: new Date().toISOString()
    }
  ],
  carrito: []
};

module.exports = db;
