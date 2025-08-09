const express = require('express');
const router = express.Router();
const {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} = require('../controllers/productosController');

// GET /api/productos - Obtener todos los productos
router.get('/', obtenerProductos);

// GET /api/productos/:id - Obtener un producto por ID
router.get('/:id', obtenerProductoPorId);

// POST /api/productos - Crear un nuevo producto
router.post('/', crearProducto);

// PUT /api/productos/:id - Actualizar un producto
router.put('/:id', actualizarProducto);

// DELETE /api/productos/:id - Eliminar un producto
router.delete('/:id', eliminarProducto);

module.exports = router;