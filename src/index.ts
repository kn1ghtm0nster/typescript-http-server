import express, { type Express, type Request, type Response } from 'express';

import {
  handlerReadiness,
  hitsHandler,
  handlerResetHits,
  handlerValidateChirp,
} from './handlers.js';
import { middlewareLogResponses, middlewareMetricsInc } from './middleware.js';

const app: Express = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use('/app', middlewareMetricsInc, express.static('./src/app'));

app.get('/api/healthz', handlerReadiness);
app.get('/admin/metrics', hitsHandler);
app.post('/admin/reset', handlerResetHits);
app.post('/api/validate_chirp', handlerValidateChirp);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
