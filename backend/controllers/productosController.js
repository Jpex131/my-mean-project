const Producto = require('../models/Productos');

// Obtener todos los productos
const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener productos', error: error.message });
    }
};

// Obtener un producto por ID
const obtenerProductoPorId = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        
        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        
        res.json(producto);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el producto', error: error.message });
    }
};

// Crear un nuevo producto
const crearProducto = async (req, res) => {
    try {
        const { nombre, precio } = req.body;        
        const nuevoProducto = new Producto({
            nombre,
            precio
        });
        const productoGuardado = await nuevoProducto.save();
        res.status(201).json(productoGuardado);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear producto', error: error.message });
    }
};

// Actualizar un producto
const actualizarProducto = async (req, res) => {
    try {
        const { nombre, precio } = req.body;        
        const producto = await Producto.findByIdAndUpdate(
            req.params.id,
            { nombre, precio },
            { new: true, runValidators: true }
        );        
        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }        
        res.json(producto);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar producto', error: error.message });
    }
};

// Eliminar un producto
const eliminarProducto = async (req, res) => {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);        
        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }        
        res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar producto', error: error.message });
    }
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};