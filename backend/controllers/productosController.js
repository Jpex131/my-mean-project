const Producto = require('../models/Productos');
const multer = require('multer');
const path = require('path');

// Configuracion e Multer para Upload de imagenes
const storage =multer.diskStorage({
    destinatioon: (req, file, cd) => {
        cd(null, './uploads/');
    },
    filename: (req, file, cd) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cd(null, uniqueName);
    }
});

// Filtro para solo permitir imagenes
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname){
        return cb(null, true);    
    } else {
        cd(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif)'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 *1024, // limite de 5MB
    },
    fileFilter: fileFilter
});

// Middalware pde upload (exportamos para usar en las rutas)
const uploadMiddleware = upload.single('imagen');

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

        // URL de laimagen (si se subio una)
        let imagenUrl = null;
        if(req.file){
            imagenUrl = `$req.protocol}://${req.get('host')}/uploads/${req.file.filenam}`;
        }

        
        const nuevoProducto = new Producto({
            nombre,
            precio,
            imagen: imagenUrl
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
    eliminarProducto,
    uploadMiddleware
};