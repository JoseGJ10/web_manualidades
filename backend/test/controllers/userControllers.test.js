const userService = require('../../services/userService');
const { getAllUsers, register } = require('../../controllers/usersController');
const { validateError,userError,connectionError,serverError } = require('../../helpers/customErrors');

jest.mock('../../services/userService');
//jest.mock('../../helpers/customErrors');


describe('userController', () => {
    
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
    });


    it('GETALLUSERS: should return all users successfully', async () => {

        // Arrange: Mocking userService to return some data
        const mockUsers = [{ id: 1, name: 'User One' }, { id: 2, name: 'User Two' }];
        userService.getAllUsers.mockResolvedValue(mockUsers);

        // Act: Making a request to the route
        await getAllUsers(req,res,next);

        // Assert: Checking the response
        expect(userService.getAllUsers).toHaveBeenCalledWith();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            "data":  [{ id: 1, name: 'User One' }, { id: 2, name: 'User Two' }],
            "message": "Get All users ok",
            "status": "success"
        });
    });

    it('GETALLUSERS: should return a 500 error if there is an issue', async () => {
        // Arrange: Mocking userService to throw an error
        userService.getAllUsers.mockRejectedValue(new Error('Failed to get users'));

        // Act: Making a request to the route
        await getAllUsers(req,res,next);

        // Assert: Checking the response
        expect(userService.getAllUsers).toHaveBeenCalledWith();
        expect(next.mock.calls[0][0].message).toBe('Failed to get users');
        expect(next.mock.calls[0][0].statusCode).toBe(500);
    });

    it('REGISTER: should return an error if username is missing', async () => {
        req.body = { email: 'test@example.com', password: 'password123' };

        await register(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(userError));
        expect(next.mock.calls[0][0].message).toBe('Not a valid username');
        expect(next.mock.calls[0][0].statusCode).toBe(400);
    });

    it('REGISTER: should return an error if email is missing', async () => {
        req.body = { username: 'testuser', password: 'password123' };

        await register(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(userError));
        expect(next.mock.calls[0][0].message).toBe('Not a valid email');
        expect(next.mock.calls[0][0].statusCode).toBe(400);
    });

    it('REGISTER: should return an error if password is missing', async () => {
        req.body = { username: 'testuser', email: 'test@example.com' };

        await register(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(userError));
        expect(next.mock.calls[0][0].message).toBe('Not a valid password');
        expect(next.mock.calls[0][0].statusCode).toBe(400);
    });

    it('REGISTER: should call userService.registerUser with correct parameters', async () => {
        req.body = { username: 'testuser', email: 'test@example.com', password: 'password123' };
        userService.registerUser.mockResolvedValue({ id: 1, username: 'testuser' });

        await register(req, res, next);

        expect(userService.registerUser).toHaveBeenCalledWith({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            message: 'User registration successful',
            data: { id: 1, username: 'testuser' }
        });
    });

    it('REGISTER: should handle userError correctly', async () => {
        req.body = { username: 'testuser', email: 'test@example.com', password: 'password123' };
        const error = new userError('Username already exists', 400);
        userService.registerUser.mockRejectedValue(error);

        await register(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });

    it('REGISTER: should handle serverError correctly', async () => {
        req.body = { username: 'testuser', email: 'test@example.com', password: 'password123' };
        const error = new Error('Something went wrong');
        userService.registerUser.mockRejectedValue(error);

        await register(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(serverError));
        expect(next.mock.calls[0][0].message).toBe('Internal error trying to register user');
        expect(next.mock.calls[0][0].statusCode).toBe(500);
    });

});
