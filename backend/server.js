require('dotenv').config();
require('./db'); 

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');     

const app =express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Importar y usar las rutas de productos
const productosRoutes = require('./routes/productos');
app.use('/api/productos', productosRoutes);


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(process.env.HOST_PORT, process.env.HOST_NAME, () => {
    console.log(`Listening on http://${process.env.HOST_NAME}:${process.env.HOST_PORT}`);
});