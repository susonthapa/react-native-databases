import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'sqlite',
  driver: 'expo', // Specifies that we are using expo-sqlite driver
  // dbCredentials: { // Not typically needed for expo-sqlite as it uses a local file
  //   url: 'myapp.db',
  // },
} satisfies Config; 