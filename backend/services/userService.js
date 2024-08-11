const User = require('../models/user'); // Asegúrate de que el path al modelo sea correcto
const {userError} = require('../helpers/customErrors'); //

class UserService {

    async registerUser({ username, email, password }) {
        // Verificar si el usuario ya existe
        let user = await User.findOne({ where: { email } });

        if (user) {
            console.log('User already exists');
            throw new userError('User already exists', 400);
            
        }

        // Crear un nuevo usuario
        console.log('User create');
        user = await User.create({
            username,
            email,
            password
        });

        return { username, email };
    }

    async getAllUsers() {
        
        let users = await User.findAll( { attributes: { exclude: ['password'] } } );

        return users;
    }



}

module.exports = new UserService();