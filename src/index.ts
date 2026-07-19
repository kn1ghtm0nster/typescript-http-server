import express, { type Express, type Request, type Response } from 'express';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';

import {
  handlerReadiness,
  hitsHandler,
  handlerResetHits,
  handlerValidateChirp,
  handlerCreateUser,
} from './handlers.js';
import {
  middlewareLogResponses,
  middlewareMetricsInc,
  errorHandlerMiddleware,
} from './middleware.js';
import { config } from './config.js';

const app: Express = express();
const PORT = 8080;

const migrationClient = postgres(config.dbConfig.url, { max: 1 });
await migrate(drizzle(migrationClient), config.dbConfig.migrationConfig);

app.use(middlewareLogResponses);
app.use(express.json());
app.use('/app', middlewareMetricsInc, express.static('./src/app'));

app.get('/api/healthz', handlerReadiness);
app.get('/admin/metrics', hitsHandler);
app.post('/admin/reset', handlerResetHits);
app.post('/api/validate_chirp', handlerValidateChirp);
app.post('/api/users', handlerCreateUser);

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
