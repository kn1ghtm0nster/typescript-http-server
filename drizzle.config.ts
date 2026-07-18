import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgres://diego_quintanilla:@localhost:5432/chirpy?sslmode=disable',
  },
});
