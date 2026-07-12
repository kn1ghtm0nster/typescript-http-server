import { type Request, type Response, NextFunction } from 'express';

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
