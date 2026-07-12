import express, { type Express, type Request, type Response } from 'express';

import { handlerReadiness } from './handlers.js';
import { middlewareLogResponses } from './middleware.js';

const app: Express = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use('/app', express.static('./src/app'));

app.get('/healthz', handlerReadiness);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
