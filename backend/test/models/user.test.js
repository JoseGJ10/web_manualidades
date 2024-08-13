// test/models/user.test.js
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = new Sequelize('sqlite::memory:'); // Base de datos en memoria

// Importar y definir los modelos
const defineUser = require('../../models/user');
const defineRole = require('../../models/role');
const defineUserRole = require('../../models/userrole');

// Inicializar los modelos
const User = defineUser(sequelize, DataTypes);
const Role = defineRole(sequelize, DataTypes);
const UserRole = defineUserRole(sequelize, DataTypes);

// Configurar asociaciones
User.associate({ Role });
Role.associate({ User });

describe('User Model', () => {

    beforeAll(async () => {
        // Sincronizar todos los modelos antes de las pruebas
        await sequelize.sync();
    });

    afterAll(async () => {
        await sequelize.close(); // Cerrar la conexión después de todas las pruebas
    });

    it('should create a user with a hashed password', async () => {
        const userData = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'plainpassword',
        };

        const user = await User.create(userData);

        // Verificar que la contraseña no es igual al texto plano
        expect(user.password).not.toBe(userData.password);

        // Verificar que la contraseña ha sido hasheada
        const isMatch = await bcrypt.compare(userData.password, user.password);
        expect(isMatch).toBe(true);
    });

    it('should not allow null values for required fields', async () => {
        try {
            await User.create({});
        } catch (error) {
            expect(error.name).toBe('SequelizeValidationError');
        }
    });

    it('should enforce unique username and email', async () => {
        const userData = {
            username: 'uniqueuser',
            email: 'unique@example.com',
            password: 'password123',
        };

        await User.create(userData);

        // Intentar crear otro usuario con el mismo username y email
        try {
            await User.create(userData);
        } catch (error) {
            expect(error.name).toBe('SequelizeUniqueConstraintError');
        }
    });

    it('should set active to false by default', async () => {
        const user = await User.create({
            username: 'inactiveuser',
            email: 'inactive@example.com',
            password: 'password123',
        });

        expect(user.active).toBe(false);
    });

    it('should correctly associate with Role model', async () => {
        const role = await Role.create({ name: 'Admin' });
        const user = await User.create({
            username: 'roleuser',
            email: 'roleuser@example.com',
            password: 'password123',
        });

        await user.addRole(role);

        const roles = await user.getRoles();
        expect(roles.length).toBe(1);
        expect(roles[0].name).toBe('Admin');
    });
});
