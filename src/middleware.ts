import { type Request, type Response, NextFunction } from 'express';

import { config } from './config.js';
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from './errors.js';

export const middlewareLogResponses = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.on('finish', () => {
    const statusCode = res.statusCode;

    if (statusCode >= 400) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
    }
  });
  next();
};

export function middlewareMetricsInc(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  config.fileserverHits += 1;
  next();
}

export const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log(err);
  if (err instanceof BadRequestError) {
    res.status(400).json({
      error: err.message,
    });
  } else if (err instanceof UnauthorizedError) {
    res.status(401).json({
      error: err.message,
    });
  } else if (err instanceof ForbiddenError) {
    res.status(403).json({
      error: err.message,
    });
  } else if (err instanceof NotFoundError) {
    res.status(404).json({
      error: err.message,
    });
  } else {
    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
  next();
};
