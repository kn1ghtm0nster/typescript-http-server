import express, { type Express, type Request, type Response } from 'express';

import { handlerReadiness, hitsHandler, handlerResetHits } from './handlers.js';
import { middlewareLogResponses, middlewareMetricsInc } from './middleware.js';

const app: Express = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use('/app', middlewareMetricsInc, express.static('./src/app'));

app.get('/api/healthz', handlerReadiness);
app.get('/api/metrics', hitsHandler);
app.get('/api/reset', handlerResetHits);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
