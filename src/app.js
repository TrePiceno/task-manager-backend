// src/app.js
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const connectToDatabase = require('./config/db');

// Importación de rutas
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

// Inicialización de la app Express
const app = express();

// Middlewares de seguridad y manejo de solicitudes
app.use(helmet());
app.use(cors());
// app.use(cors({
//     origin: ['http://localhost:3000', 'https://tu-frontend.com']
// })); // Configuración al trabajar con el frontend
app.use(express.json()); // Para parsear JSON

// Conexión a MongoDB Atlas
connectToDatabase()
    .then(() => console.log('Conectado a MongoDB'))
    .catch(error => console.error('Error conectando a MongoDB', error));

// Importa el módulo de cron jobs para que se inicie el scheduler
require('./utils/cronJobs');

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Ruta raíz
app.get('/', (req, res) => {
    res.send('API del Task Manager');
});

// Arranque del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app; // Exporta la app para usos adicionales o pruebas