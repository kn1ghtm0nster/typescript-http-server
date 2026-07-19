import { envOrThrow } from './utils/env.helpers.js';
import { type DBConfig, migrationConfig } from './db/config.js';

// load environment variables from .env file
process.loadEnvFile('.env');

type APIConfig = {
  fileserverHits: number;
  dbConfig: DBConfig;
  platform: string;
};

export const config: APIConfig = {
  fileserverHits: 0,
  dbConfig: {
    url: envOrThrow('DB_URL'),
    migrationConfig: {
      migrationsFolder: migrationConfig.migrationsFolder,
    },
  },
  platform: envOrThrow('PLATFORM'),
};
