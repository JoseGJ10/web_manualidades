const UserService = require('../services/userService'); 
const User = require('../models/user'); // Mockearemos este modelo
const { userError } = require('../helpers/customErrors'); 

jest.mock('../models/user'); // Automáticamente mockea todas las funciones de User

describe('UserService', () => {

    describe('registerUser', () => {

        it('should throw an error if user already exists', async () => {
            User.findOne.mockResolvedValue({
                username: 'testuser',
                email: 'test@example.com',
                password: 'hashedpassword'
            });
        
            // Inicializamos la variable error
            let error;
            try {
                await UserService.registerUser({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123'
                });
            } catch (e) {
                error = e;
            }
        
            // Verifica que se lanzó el error esperado
            expect(error).toBeInstanceOf(userError);
            expect(error.message).toBe('User already exists');
            expect(error.statusCode).toBe(400);
        
            // Asegúrate de que User.create no haya sido llamado
            expect(User.create).not.toHaveBeenCalled();
        });

        it('should register a new user successfully', async () => {
            // Mockear la respuesta de User.findOne para simular que el usuario no existe
            User.findOne.mockResolvedValue(null);

            // Mockear la creación del usuario
            User.create.mockResolvedValue({
                username: 'testuser',
                email: 'test@example.com',
                password: 'hashedpassword'
            });

            const result = await UserService.registerUser({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });

            expect(result).toEqual({
                username: 'testuser',
                email: 'test@example.com'
            });

            expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
            expect(User.create).toHaveBeenCalledWith({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });
        });
    });
});
