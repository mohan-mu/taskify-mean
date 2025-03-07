import * as express from 'express';
import { Task } from '../schemas/tasks';

export const taskifyRouter = express.Router();
taskifyRouter.use(express.json(),);

taskifyRouter.get('/tasks', async (_req, res) => {
  try {
    const params = _req.query;
    Task.find(params).then(
      data => {
        res.status(200).json([...data]);
      },
      error => res.status(400).json({ error })
    );
  } catch (error) {
    res
      .status(500)
      .send(error instanceof Error ? error.message : 'Unknown error');
  }
});

taskifyRouter.get('/tasks/:id', async (req, res) => {
  try {
    const id = req?.params?.id;
    Task.findById(id).then(
      data => {
        res.status(200).json({ data });
      },
      error => res.status(400).json({ error })
    );
  } catch (error) {
    res.status(404).send(`Failed to find an task with: ID ${req?.params?.id}`);
  }
});

taskifyRouter.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    task.save().then(
      data => {
        res.status(200).json({ data });
      },
      error => res.status(400).json({ error })
    );
  } catch (error) {
    res
      .status(500)
      .send(error instanceof Error ? error.message : 'Unknown error');
  }
});

taskifyRouter.put('/tasks/:id', async (req, res) => {
  try {
    const id = req?.params?.id;
    const update = req.body;
    Task.findByIdAndUpdate(id, update).then(
      data => {
        res.status(200).json({});
      },
      error => res.status(400).json({ error })
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(message);
    res.status(500).send(message);
  }
});

taskifyRouter.delete('/tasks/:id', async (req, res) => {
  try {
    const id = req?.params?.id;
    Task.findByIdAndDelete(id).then(
      () => {
        res.status(200).json({});
      },
      error => res.status(400).json({ error })
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(message);
    res.status(500).send(message);
  }
});
