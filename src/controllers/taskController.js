// src/controllers/taskController.js
const Task = require('../models/Task');
const { validationResult } = require('express-validator');
const { crearEvento } = require('../utils/googleCalendar');

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener tareas' });
    }
};

exports.createTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { nombre, descripcion, fechaHora, tags } = req.body;
    try {
        const newTask = new Task({
            nombre,
            descripcion,
            fechaHora,
            tags,
            userId: req.user.id
        });
        await newTask.save();

        // Integración con Google Calendar: crear evento
        try {
            const evento = {
                summary: nombre,
                description: descripcion,
                start: { dateTime: new Date(fechaHora).toISOString() },
                end: { dateTime: new Date(new Date(fechaHora).getTime() + 60 * 60 * 1000).toISOString() } // duración de 1 hora
            };
            const calendarEvent = await crearEvento(evento);
            console.log('Evento de Google Calendar creado:', calendarEvent);
        } catch (calendarError) {
            console.error('Error al crear evento en Google Calendar:', calendarError);
            // Puedes optar por continuar sin fallar la creación de la tarea
        }

        res.status(201).json(newTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear tarea' });
    }
};

exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        let task = await Task.findOne({ _id: id, userId: req.user.id });
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        task = await Task.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar tarea' });
    }
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findOne({ _id: id, userId: req.user.id });
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        await Task.findByIdAndDelete(id);
        res.status(200).json({ message: 'Tarea eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar tarea' });
    }
};

// Función para obtener una tarea específica del usuario autenticado
exports.getTask = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findOne({ _id: id, userId: req.user.id });
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        res.status(200).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};