import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Taskify',
    description: 'Taskify API',
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'jwt',
        },
      },
    },
  },
  components: {
    schemas: {
        task: {
            title: 'string' ,
            description: 'string' ,
            dueDate: 'string',
            priority: 'string',
            status: 'string'
      },
      user: {
        name: 'string' ,
        email: 'string' ,
        password: 'string'
  }
    }
  },
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description:
        ' Enter the token with the`Bearer: ` prefix, e.g. "Bearer abcde12345"',
    },
  },
  servers: [
    {
      url: 'http://localhost:5200',
    },
  ],
};

const outputFile = './swagger/swagger.json';
const routes = [
  './src/routes/auth.routes.ts',
  './src/routes/taskify.routes.ts',
];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc);
