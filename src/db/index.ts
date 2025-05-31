import { drizzle } from 'drizzle-orm/expo-sqlite';
import { drizzle as drizzleSqlJs } from 'drizzle-orm/sql-js';
import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import * as schema from './schema';
import { getSqlJsDb } from './sqljs-loader'; // Metro will resolve to .web.ts or .native.ts

// Type for the Drizzle instance with schema
export type DrizzleDB = ReturnType<typeof drizzle<typeof schema>> | ReturnType<typeof drizzleSqlJs<typeof schema>>;

// Initialize db with a type assertion to satisfy TypeScript before actual initialization.
export let db: DrizzleDB = {} as DrizzleDB;

export async function initializeDB() {
  if (Platform.OS === 'web') {
    try {
      const sqlJsDbInstance = await getSqlJsDb(); // This will call the .web.ts version
      db = drizzleSqlJs(sqlJsDbInstance, { schema });
    } catch (error) {
      console.error("Failed to initialize sql.js database for web:", error);
      // Optionally, set db to a specific error state or a no-op implementation
      // For now, it will remain as the initial empty object if an error occurs.
    }
  } else {
    // Native platform (iOS, Android)
    const expoDb = await SQLite.openDatabaseAsync('myapp.db', {enableChangeListener: true});
    db = drizzle(expoDb, { schema });
  }
}
