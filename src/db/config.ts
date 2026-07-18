import type { MigrationConfig } from 'drizzle-orm/migrator';

export const migrationConfig: MigrationConfig = {
  migrationsFolder: './src/db/drizzle',
};

export type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};
