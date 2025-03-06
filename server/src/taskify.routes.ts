import * as express from 'express';
import { Task } from './tasks';

export const taskifyRouter = express.Router();
taskifyRouter.use(express.json());

taskifyRouter.get('/', async (_req, res) => {
  try {
    Task.find({}).then(
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

taskifyRouter.get('/:id', async (req, res) => {
  try {
    const id = req?.params?.id;
    // const query = { _id: new ObjectId(id) };
    Task.findById(id).then(
      data => {
        res.status(200).json({ data });
      },
      error => res.status(400).json({ error })
    );
  } catch (error) {
    res.status(404).send(`Failed to find an employee: ID ${req?.params?.id}`);
  }
});

taskifyRouter.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    task
      .save()
      .then(() => console.log('Task saved'))
      .catch(err => console.error('Error:', err));
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .send(error instanceof Error ? error.message : 'Unknown error');
  }
});

taskifyRouter.put('/:id', async (req, res) => {
  try {
    
    const id = req?.params?.id;
    const update = req.body;
    Task.findByIdAndUpdate(id,update).then(
      data => {
        res.status(200).json({ data });
      },
      error => res.status(400).json({ error })
    );
    /* 
    #swagger.tags = ['someTag']

    #swagger.security = [{
        "apiKeyAuth": []
    }] 
    /* #swagger.responses[200] = {
            description: "Some description...",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/Task"
                    }
                }           
            }
        }   
    #swagger.responses[200] = {
     "schema": { 
        schema: { $ref: '#/components/schemas/Task' }
    }  

    #swagger.responses[501] = {
        ifStatusPresent: true,
        schema: { $ref: '#/definitions/someSchema' }
    } 
    */
    // const result = await collections?.tasks?.updateOne(query, {
    //   $set: employee,
    // });

    // if (result && result.matchedCount) {
    //   res.status(200).send(`Updated an employee: ID ${id}.`);
    // } else if (!result?.matchedCount) {
    //   res.status(404).send(`Failed to find an employee: ID ${id}`);
    // } else {
    //   res.status(304).send(`Failed to update an employee: ID ${id}`);
    // }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(message);
    res.status(400).send(message);
  }
});

taskifyRouter.delete('/:id', async (req, res) => {
  try {
    const id = req?.params?.id;
    
    Task.findByIdAndDelete(id).then(
      data => {
        res.status(200).json({ data });
      },
      error => res.status(400).json({ error })
    );
    // const result = await collections?.tasks?.deleteOne(query);

    // if (result && result.deletedCount) {
    //   res.status(202).send(`Removed an employee: ID ${id}`);
    // } else if (!result) {
    //   res.status(400).send(`Failed to remove an employee: ID ${id}`);
    // } else if (!result.deletedCount) {
    //   res.status(404).send(`Failed to find an employee: ID ${id}`);
    // }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(message);
    res.status(400).send(message);
  }
});
