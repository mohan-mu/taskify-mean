import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Taskify',
    description: 'Taskify API'
  },
  host: 'localhost:5200'
};

const outputFile = './swagger/swagger.json';
const routes = ['./taskify.routes.ts'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc);
