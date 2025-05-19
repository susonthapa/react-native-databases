import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

const expoDb = openDatabaseSync('myapp.db'); // Or your preferred DB name

// Type for the Drizzle instance with schema
export type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>;

export const db: DrizzleDB = drizzle(expoDb, { schema });

// You might also want to export the raw expoDb if needed for migrations or direct access
export { expoDb as rawExpoDb };
