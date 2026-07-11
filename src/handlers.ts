import { type Request, type Response } from 'express';

export const handlerReadiness = (
  req: Request,
  res: Response
): Promise<void> => {
  res.set('Content-Type', 'text/plain; charset=utf-8').status(200).send('OK');
  return Promise.resolve();
};
