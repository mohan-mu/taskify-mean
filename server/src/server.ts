import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import * as swaggerJson from './swagger/swagger.json';
import { connectToDatabase } from './database';
import { taskifyRouter } from './taskify.routes';
import {serve,setup} from 'swagger-ui-express';

// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();

const {
    ATLAS_URI,
    SERVER_ROUTE = '/taskify',
    DB = 'taskify',
    COLLECTION = 'tasks',
    PORT=5200,
} = process.env;

if (!ATLAS_URI) {
    console.error(
        'No ATLAS_URI environment variable has been defined in config.env'
    );
    process.exit(1);
}

connectToDatabase(ATLAS_URI, { db: DB, collection: COLLECTION })
    .then(() => {
        const app = express();
        app.use(cors());
        app.use(SERVER_ROUTE, taskifyRouter);
        app.use('/docs', serve, setup(swaggerJson))

        // start the Express server
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}...`);
        });
    })
    .catch((error) => console.error(error));

