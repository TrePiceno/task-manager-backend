// src/utils/cronJobs.js
const cron = require('node-cron');
const Task = require('../models/Task');

async function actualizarTareasVencidas() {
    const now = new Date();
    try {
        await Task.updateMany(
            { fechaHora: { $lt: now }, cumplida: false },
            { $set: { vencida: true } }
        );
        console.log('Tareas vencidas actualizadas.');
    } catch (error) {
        console.error('Error actualizando tareas vencidas:', error);
    }
}

// Programa el cron job para que se ejecute cada 5 minutos
cron.schedule('*/5 * * * *', () => {
    actualizarTareasVencidas();
});

module.exports = { actualizarTareasVencidas };
