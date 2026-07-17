import { type Request, type Response, NextFunction } from 'express';
import { config } from './config.js';

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
  res.status(500).json({
    error: err.message,
  });
  next();
};
