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

export const handlerValidateChirp = (
  req: Request,
  res: Response
): Promise<void> => {
  type parameters = {
    body: string;
  };
  const invalidWords = ['kerfuffle', 'sharbert', 'fornax'];

  try {
    let reqBody: parameters = req.body;

    if (reqBody.body.length > 140) {
      res.status(400).send({
        error: 'Chirp is too long',
      });
    } else {
      const chirpArray = reqBody.body.split(' ');
      for (let i = 0; i < chirpArray.length; i++) {
        let currWord = chirpArray[i];
        if (invalidWords.includes(currWord.toLowerCase())) {
          chirpArray[i] = '****';
        }
        reqBody.body = chirpArray.join(' ');
      }
      res.status(200).send({
        cleanedBody: reqBody.body,
      });
    }
  } catch (error) {
    res.status(400).send({
      error: 'Something went wrong',
    });
  }

  return Promise.resolve();
};
