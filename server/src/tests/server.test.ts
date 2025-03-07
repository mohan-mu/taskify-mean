const { test, expect } = require('@jest/globals');
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import * as swaggerJson from '../swagger/swagger.json';
import { connectToDatabase } from '../database';
import { taskifyRouter } from '../taskify.routes';
import { serve, setup } from 'swagger-ui-express';

jest.mock('../database');
jest.mock('swagger-ui-express');

describe('Server Tests', () => {
	let app: express.Application;

	beforeAll(async () => {
		process.env.ATLAS_URI = 'mongodb://localhost:27017';
		process.env.SERVER_ROUTE = '/taskify';
		process.env.DB = 'taskify';
		process.env.COLLECTION = 'tasks';
		process.env.PORT = '5200';

		(connectToDatabase as jest.Mock).mockResolvedValueOnce(true);

		app = express();
		app.use(cors());
		app.use(process.env.SERVER_ROUTE, taskifyRouter);
		app.use('/docs', serve, setup(swaggerJson));
	});

	test('should connect to the database', async () => {
		expect(connectToDatabase).toHaveBeenCalledWith(process.env.ATLAS_URI, {
			db: process.env.DB,
			collection: process.env.COLLECTION,
		});
	});

	test('should respond with 200 on the taskify route', async () => {
		const response = await request(app).get('/taskify');
		expect(response.status).toBe(200);
	});

	test('should serve swagger documentation', async () => {
		const response = await request(app).get('/docs');
		expect(response.status).toBe(200);
	});

	test('should log error and exit if ATLAS_URI is not defined', () => {
		const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
		const processExitSpy = jest.spyOn(process, 'exit').mockImplementation((code?: string | number | undefined) => {
			throw new Error(`process.exit: ${code}`);
		});

		delete process.env.ATLAS_URI;

		expect(() => require('../server')).toThrow('process.exit: 1');
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'No ATLAS_URI environment variable has been defined in config.env'
		);

		consoleErrorSpy.mockRestore();
		processExitSpy.mockRestore();
	});
});
