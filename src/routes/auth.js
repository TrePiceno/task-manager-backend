// src/routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login, getUser } = require('../controllers/authController');
const { check } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta para registro de usuario
router.post('/register', [
    check('username', 'El nombre de usuario es obligatorio').not().isEmpty(),
    check('email', 'Por favor incluye un email válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
], register);

// Ruta para login
router.post('/login', [
    check('email', 'Por favor incluye un email válido').isEmail(),
    check('password', 'La contraseña es obligatoria').exists(),
], login);

// Nuevo endpoint para obtener el usuario autenticado
router.get('/me', authMiddleware, getUser);

module.exports = router;
