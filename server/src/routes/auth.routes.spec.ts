import request from 'supertest';
import express from 'express';
import { authRouter } from './auth.routes';
import { User } from '../schemas/user';

jest.mock('../schemas/user');

const app = express();
app.use('/auth', authRouter);

describe('Auth Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/signup', () => {
    it('should create a new user and return success message', async () => {
      const mockUser = { save: jest.fn().mockResolvedValueOnce(null) };
      (User as unknown as jest.Mock).mockImplementation(() => mockUser);

      const response = await request(app)
        .post('/auth/signup')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User created successfully.');
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should return 400 if user creation fails', async () => {
      const mockUser = { save: jest.fn().mockRejectedValueOnce(new Error('Validation error')) };
      (User as unknown as jest.Mock).mockImplementation(() => mockUser);

      const response = await request(app)
        .post('/auth/signup')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 500 for unexpected errors', async () => {
      (User as unknown as jest.Mock).mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      const response = await request(app)
        .post('/auth/signup')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Unexpected error');
    });
  });

  describe('POST /auth/signin', () => {
    it('should authenticate user and return token', async () => {
      const mockUser = {
        generateAuthToken: jest.fn().mockResolvedValueOnce('mockToken'),
      };
      (User.findByCredentials as jest.Mock).mockResolvedValueOnce(mockUser);

      const response = await request(app)
        .post('/auth/signin')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.token).toBe('mockToken');
      expect(User.findByCredentials).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('should return 401 if authentication fails', async () => {
      (User.findByCredentials as jest.Mock).mockResolvedValueOnce(null);

      const response = await request(app)
        .post('/auth/signin')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Authentication failed. Invalid user or password.');
    });

    it('should return 500 for unexpected errors', async () => {
      (User.findByCredentials as jest.Mock).mockRejectedValueOnce(new Error('Unexpected error'));

      const response = await request(app)
        .post('/auth/signin')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Unexpected error');
    });
  });

  describe('GET /auth/logout', () => {
   
    it('should return 400 if user is not authenticated', async () => {
      const response = await request(app).get('/auth/logout').send();

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User not authenticated.');
    });

  });

  describe('GET /auth/logoutAll', () => {

    it('should return 400 if user is not authenticated', async () => {
      const response = await request(app).get('/auth/logoutAll').send();

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User not authenticated.');
    });

  });
});
