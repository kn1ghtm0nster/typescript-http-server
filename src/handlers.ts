import { type Request, type Response } from 'express';
import { config } from './config.js';

export const handlerReadiness = (
  req: Request,
  res: Response
): Promise<void> => {
  res.set('Content-Type', 'text/plain; charset=utf-8').status(200).send('OK');
  return Promise.resolve();
};

export const hitsHandler = (req: Request, res: Response): Promise<void> => {
  res.set('Content-Type', 'text/html; charset=utf-8').send(
    `
    <html>
      <body>
        <h1>Welcome, Chirpy Admin</h1>
        <p>Chirpy has been visited ${config.fileserverHits} times!</p>
      </body>
    </html>
  `
  );
  return Promise.resolve();
};

export const handlerResetHits = (
  req: Request,
  res: Response
): Promise<void> => {
  config.fileserverHits = 0;
  res.send();
  return Promise.resolve();
};
