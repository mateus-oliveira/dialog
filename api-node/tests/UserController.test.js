const UserController = require('../controllers/UserController');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const status = require('../constants/httpStatus');


jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../models/User');


describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('register', () => {
    it('should register a new user and return the user without password', async () => {
      const userData = { name: 'John Doe', email: 'john@example.com', password: 'password' };
      req.body = userData;
      const hashedPassword = 'hashedPassword';
      const createdUser = { id: 1, ...userData, password: hashedPassword };

      bcrypt.hash.mockResolvedValue(hashedPassword);
      User.create.mockResolvedValue(createdUser);

      await UserController.register(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(User.create).toHaveBeenCalledWith({ name: userData.name, email: userData.email, password: hashedPassword });
      expect(res.status).toHaveBeenCalledWith(status.HTTP_201_CREATED);
      expect(res.json).toHaveBeenCalledWith({ id: 1, name: userData.name, email: userData.email, password: undefined });
    });

    it('should return an error if registration fails', async () => {
      const errorMessage = 'Error creating user';
      req.body = { name: 'John Doe', email: 'john@example.com', password: 'password' };

      bcrypt.hash.mockResolvedValue('hashedPassword');
      User.create.mockRejectedValue(new Error(errorMessage));

      await UserController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(status.HTTP_400_BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });


  describe('login', () => {
    it('should login a user and return a token', async () => {
      const password = 'hashedPassword';
      const userData = { id: 1, email: 'john@example.com', password };
      req.body = { email: userData.email, password: 'password' };
      
      User.findOne.mockResolvedValue(userData);
      bcrypt.compare.mockResolvedValue(true);
      const token = 'jwtToken';
      jwt.sign.mockReturnValue(token);

      await UserController.login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: userData.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, password);
      expect(jwt.sign).toHaveBeenCalledWith({ userId: userData.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      expect(res.status).toHaveBeenCalledWith(status.HTTP_200_OK);
      expect(res.json).toHaveBeenCalledWith({ token, user: userData });
    });

    it('should return an error for invalid credentials', async () => {
      req.body = { email: 'john@example.com', password: 'wrongPassword' };
      User.findOne.mockResolvedValue({ email: 'john@example.com', password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValue(false);

      await UserController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(status.HTTP_401_UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should return an error if user is not found', async () => {
      req.body = { email: 'john@example.com', password: 'password' };
      User.findOne.mockResolvedValue(null);

      await UserController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(status.HTTP_401_UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should return an error if login fails', async () => {
      const errorMessage = 'Error logging in';
      req.body = { email: 'john@example.com', password: 'password' };

      User.findOne.mockRejectedValue(new Error(errorMessage));

      await UserController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(status.HTTP_500_INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });


  describe('getUser', () => {
    it('should return user data if found', async () => {
      const userData = { id: 1, name: 'John Doe', email: 'john@example.com' };
      req.params.id = 1;
      User.findByPk.mockResolvedValue(userData);

      await UserController.getUser(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(req.params.id);
      expect(res.status).toHaveBeenCalledWith(status.HTTP_200_OK);
      expect(res.json).toHaveBeenCalledWith(userData);
    });

    it('should return an error if user is not found', async () => {
      req.params.id = 1;
      User.findByPk.mockResolvedValue(null);

      await UserController.getUser(req, res);

      expect(res.status).toHaveBeenCalledWith(status.HTTP_404_NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return an error if fetching user fails', async () => {
      const errorMessage = 'Error fetching user';
      req.params.id = 1;

      User.findByPk.mockRejectedValue(new Error(errorMessage));

      await UserController.getUser(req, res);

      expect(res.status).toHaveBeenCalledWith(status.HTTP_400_BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});
