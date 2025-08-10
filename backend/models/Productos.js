const mongoose = require('mongoose');
const {Schema} = mongoose;

const productoSchema = new Schema({
    nombre: {
        type: String,
        required: true,
    },
    precio: {
        type: Number,
        required: true,
    },
    imagen: {
        type: String,
        required: false,
        default: 'https://via.placeholder.com/150'
    }
});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;