// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = async function (req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token, autorización denegada' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token no válido' });
    }
};
