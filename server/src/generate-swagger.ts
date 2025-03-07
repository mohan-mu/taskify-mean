import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Taskify',
    description: 'Taskify API',
    components: {
      schemas: {
        title: 'Task',
        required: ['title'],
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          dueDate: { type: 'string', format: 'date-time' },
          priority: { type: 'string', enum: [Array] },
          status: { type: 'string', enum: [Array] },
          createdBy: { type: 'schemaobjectid' },
          _id: { type: 'string' },
        },
      },
    },
  },
};

const outputFile = './swagger/swagger.json';
const routes = ['./src/routes/auth.routes.ts', './src/routes/taskify.routes.ts'];

swaggerAutogen()(outputFile, routes, doc);
