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
    }
});

const Producto = mongoose.mondel('Producto', productoSchema);

module.exports = Producto;