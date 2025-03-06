import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Taskify',
    description: 'Taskify API',
  },
};

const outputFile = './swagger/swagger.json';
const routes = ['./taskify.routes.ts'];

swaggerAutogen()(outputFile, routes, doc);
