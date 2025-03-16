import * as express from 'express';
import { Task } from '../schemas/tasks';
import { AuthenticatedRequest } from './auth.routes';
import mongoose from 'mongoose';
import { processDateString } from '../utils/utils';

export const taskifyRouter = express.Router();
taskifyRouter.use(express.json());
taskifyRouter.get('/tasks', async (_req: AuthenticatedRequest, res) => {
  // #swagger.tags = ['Task']
  //#swagger.path = '/taskify/tasks'
  // #swagger.security = [{Bearer: []}]
  try {
    const params = _req.query;
    if (params?.dueDate) {
      params.dueDate = processDateString(params.dueDate);
    }
    Task.find({
      ...params,
      createdBy: new mongoose.Types.ObjectId(_req.user?._id),
    }).exec().then(
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
  // #swagger.tags = ['Task']
  //#swagger.path = '/tasks/{id}'
  // #swagger.security = [{Bearer: []}]
  try {
    const id = req?.params?.id;
    Task.findById(id).exec().then(
      data => {
        res.status(200).json({ data });
      },
      error => res.status(400).json({ error })
    );
  } catch (error) {
    res.status(404).send(`Failed to find an task with: ID ${req?.params?.id}`);
  }
});

taskifyRouter.post('/tasks', async (req: AuthenticatedRequest, res) => {
  // #swagger.tags = ['Task']
  //#swagger.path = '/tasks'
  // #swagger.security = [{Bearer: []}]
  /*
   #swagger.requestBody: {
    "description": "Optional description in *Markdown*",
    "required": true,
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/task"
        }
      }
    }
  }
  */
  try {
    const task = new Task({ ...req.body, createdBy: req.user?._id });
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
  // #swagger.tags = ['Task']
  //#swagger.path = 'tasks/{id}'
    // #swagger.security = [{Bearer: []}]
    /*
   #swagger.requestBody: {
    "description": "Optional description in *Markdown*",
    "required": true,
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/task"
        }
      }
    }
  }
  */
  try {
    const id = req?.params?.id;
    const update = req.body;
    Task.findByIdAndUpdate(id, update).exec().then(
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
  //# swagger.auto=false
  // #swagger.tags = ['Task']
  //#swagger.path = '/tasks/{id}'
  // #swagger.security = [{Bearer: []}]
  try {
    const id = req?.params?.id;
    Task.findByIdAndDelete(id).exec().then(
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
