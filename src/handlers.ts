import { type Request, type Response, type NextFunction } from 'express';

import { config } from './config.js';
import { BadRequestError, ForbiddenError } from './errors.js';
import { createUser, resetUsersTable } from './db/queries/users.js';
import { createChirp } from './db/queries/chirps.js';

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

export const handlerResetHits = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (config.platform !== 'dev') {
    throw new ForbiddenError('Resetting is only allowed in dev mode');
  }
  config.fileserverHits = 0;
  await resetUsersTable();
  res.send();
  return Promise.resolve();
};

export const handlerValidateChirp = (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  type parameters = {
    body: string;
  };
  const invalidWords = ['kerfuffle', 'sharbert', 'fornax'];

  let reqBody: parameters = req.body;
  try {
    if (reqBody.body.length > 140) {
      throw new BadRequestError('Chirp is too long. Max length is 140');
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
    next(error);
  }

  return Promise.resolve();
};

export const handlerCreateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new BadRequestError('Email is required');
    }
    const newUser = await createUser({ email });
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const handlerCreateChirp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const invalidWords = ['kerfuffle', 'sharbert', 'fornax'];
    const { body, userId } = req.body;
    if (!body || !userId) {
      throw new BadRequestError('Body and userId are required');
    } else if (body.length > 140) {
      throw new BadRequestError('Chirp is too long. Max length is 140');
    } else {
      const chirpArray = body.split(' ');
      for (let i = 0; i < chirpArray.length; i++) {
        let currWord = chirpArray[i];
        if (invalidWords.includes(currWord.toLowerCase())) {
          chirpArray[i] = '****';
        }
      }
      const cleanedBody = chirpArray.join(' ');
      const newChirp = await createChirp({ body: cleanedBody, userId });
      res.status(201).json(newChirp);
    }
  } catch (error) {
    next(error);
  }
};
