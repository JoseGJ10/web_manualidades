const UserService = require('../../services/userService'); 
const User = require('../../models/user'); // Mockearemos este modelo
const { userError } = require('../../helpers/customErrors'); 

jest.mock('../../models/user'); // Automáticamente mockea todas las funciones de User

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

    describe('getAllUsers', () => {
        it('should retrieve all users excluding passwords', async () => {
            // Datos mock para simular la respuesta de User.findAll
            const mockUsers = [
                { id: 1, username: 'user1', email: 'user1@example.com' },
                { id: 2, username: 'user2', email: 'user2@example.com' }
            ];
    
            // Configura el mock para que devuelva los datos mock
            User.findAll.mockResolvedValue(mockUsers);
    
            // Llama al método que deseas probar
            const users = await UserService.getAllUsers();
    
            // Verifica que User.findAll se haya llamado con los parámetros correctos
            expect(User.findAll).toHaveBeenCalledWith({
                attributes: { exclude: ['password'] }
            });
    
            // Verifica que el resultado sea el esperado
            expect(users).toEqual(mockUsers);
        });
    
        it('should handle errors properly', async () => {
            // Configura el mock para que lance un error
            const error = new Error('Database error');
            User.findAll.mockRejectedValue(error);
    
            // Intenta capturar el error que debe ser lanzado por el método
            await expect(UserService.getAllUsers()).rejects.toThrow('Database error');
    
            // Verifica que User.findAll se haya llamado con los parámetros correctos
            expect(User.findAll).toHaveBeenCalledWith({
                attributes: { exclude: ['password'] }
            });
        });
    });
});
