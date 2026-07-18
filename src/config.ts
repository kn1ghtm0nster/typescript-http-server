import { envOrThrow } from './utils/env.helpers.js';

// load environment variables from .env file
process.loadEnvFile('.env');

type APIConfig = {
  fileserverHits: number;
  dbUrl: string;
};

export const config: APIConfig = {
  fileserverHits: 0,
  dbUrl: envOrThrow(process.env.DB_URL || 'DB_URL'),
};
