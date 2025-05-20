import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';
import * as schema from './schema';


// Type for the Drizzle instance with schema
export type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>;

// @ts-ignore
export let db: DrizzleDB = {};

export async function initializeDB() {
  const expoDb = await SQLite.openDatabaseAsync('myapp.db');
  db = drizzle(expoDb, { schema });
}
