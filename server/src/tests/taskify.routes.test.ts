import express from 'express';
import * as request from 'supertest';
import { taskifyRouter } from '../taskify.routes';
import { Task } from '../tasks';

jest.mock('../tasks');

const app = express();
app.use(express.json());
app.use('/api', taskifyRouter);

describe('Taskify Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all tasks', async () => {
    const mockTasks = [{ title: 'Task 1' }, { title: 'Task 2' }];
    (Task.find as jest.Mock).mockResolvedValue(mockTasks);

    const response = await request(app).get('/api/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTasks);
  });

  it('should get a task by id', async () => {
    const mockTask = { title: 'Task 1' };
    (Task.findById as jest.Mock).mockResolvedValue(mockTask);

    const response = await request(app).get('/api/tasks/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: mockTask });
  });

  it('should create a new task', async () => {
    const mockTask = { title: 'New Task' };
    (Task.prototype.save as jest.Mock).mockResolvedValue(mockTask);

    const response = await request(app).post('/api/tasks').send(mockTask);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: mockTask });
  });

  it('should update a task by id', async () => {
    const mockTask = { title: 'Updated Task' };
    (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockTask);

    const response = await request(app).put('/api/tasks/1').send(mockTask);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({});
  });

  it('should delete a task by id', async () => {
    (Task.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    const response = await request(app).delete('/api/tasks/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({});
  });
});
