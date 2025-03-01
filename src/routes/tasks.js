// src/routes/tasks.js
const express = require('express');
const router = express.Router();
const { getTasks, createTask, getTask, updateTask, deleteTask } = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');
const { check } = require('express-validator');

// Middleware de autenticación para todas las rutas de tareas
router.use(authMiddleware);

// Obtener todas las tareas del usuario autenticado
router.get('/', getTasks);

// Obtener una tarea específica
router.get('/:id', getTask);

// Crear una nueva tarea
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('fechaHora', 'La fecha y hora son obligatorias y deben ser válidas').isISO8601(),
], createTask);

// Actualizar una tarea
router.put('/:id', updateTask);

// Eliminar una tarea
router.delete('/:id', deleteTask);

module.exports = router;
