const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    
    if (!token) {
        return res.status(401).json({ msg: 'No hay token, autorización denegada' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Debe ser el mismo secreto usado al firmar el token
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token no es válido' });
    }
};
