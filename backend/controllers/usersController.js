const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getAllUsers = async (req, res) => {

    try {
        const users = await User.findAll();

        res.status(200).json(users);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
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

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }
        user = await User.create({
            username,
            email,
            password
        });
        res.status(201).json({ msg: 'Usuario registrado correctamente' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
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
            'mysecretkey', // Debe ser un secreto fuerte en producción
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