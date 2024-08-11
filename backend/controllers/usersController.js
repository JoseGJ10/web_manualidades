const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendSuccess } = require('../helpers/responses');
const { validateError,userError,connectionError,serverError } = require('../helpers/customErrors');
const userService = require('../services/userService');

exports.getAllUsers = async (req, res,next) => {

    try {
        const users = await userService.getAllUsers();

        sendSuccess(res,users,'Get All users ok',200);

    } catch (err) {

        next(new serverError('Failed to get users',500));

    }

};

exports.updateUser = (req, res) => {
    //TODO: update user data
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        await User.destroy(id);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }


    connection.query('DELETE FROM users WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.status(204).send();
    });
};

exports.register = async (req, res, next) => {

    const { password, username, email } = req.body;

    if (!username) return next(new userError('Not a valid username', 400));
    if (!email) return next(new userError('Not a valid email', 400));
    if (!password) return next(new userError('Not a valid password', 400));

    try {
        // Llamada al servicio para registrar al usuario
        const user = await userService.registerUser({ username, email, password });

        // Responder con éxito
        sendSuccess(res, user, 'User registration successful', 201);
    } catch (err) {
        if (err instanceof userError) {
            return next(err); // Pasar el error de usuario al middleware de error
        }
        
        // Manejo de errores del servidor
        next(new serverError('Internal error trying to register user', 500));
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }
        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Debe ser un secreto fuerte en producción
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
};