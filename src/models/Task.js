// src/models/Task.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String },
    fechaHora: { type: Date, required: true },
    fechaCreacion: { type: Date, default: Date.now },
    cumplida: { type: Boolean, default: false },
    vencida: { type: Boolean, default: false },
    tags: [{ type: String }], // Categorías o etiquetas
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Task', TaskSchema);
