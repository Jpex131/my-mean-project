require('dotenv').config();
require('./db'); 

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');     
const path = require('path');

const app =express();

// Middleware
app.use(helmet());
app.use(cors()); // Para permitir requests desde el frontend
app.use(express.json()); // Para parsear JSON en el body

//Servir archivos estaticos (images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importar y usar las rutas de productos
const productosRoutes = require('./routes/productos');
app.use('/api/productos', productosRoutes);

//Ruta de prueba
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(process.env.HOST_PORT, process.env.HOST_NAME, () => {
    console.log(`Listening on http://${process.env.HOST_NAME}:${process.env.HOST_PORT}`);
});