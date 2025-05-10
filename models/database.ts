import { addRxPlugin, createRxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { todoSchema } from './TodoSchema';

import * as Crypto from 'expo-crypto';
import { RxDBAttachmentsPlugin } from 'rxdb/plugins/attachments';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration-schema';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { STORAGE_SQLITE } from './storage';

addRxPlugin(RxDBMigrationPlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBAttachmentsPlugin);
// Ensure crypto object exists before trying to set subtle
if (typeof global.crypto === 'undefined') {
  // @ts-ignore 
  global.crypto = {};
}
if (typeof global.crypto.subtle === 'undefined') {
  // @ts-ignore
  global.crypto.subtle = {
      digest: Crypto.digest,
  };
}
const isDevelopment = process.env.NODE_ENV !== 'production' || process.env.DEBUG_PROD === 'true';

// Database singleton to prevent multiple instances
let dbPromise: Promise<any> | null = null;

/**
 * Creates a new database or returns the existing one
 */
export async function createDatabase() {
  if (dbPromise) return dbPromise;

  if (isDevelopment) {
    addRxPlugin(RxDBDevModePlugin);
}

  // Create the database
  dbPromise = createRxDatabase({
    name: 'todosdb',
    storage: STORAGE_SQLITE,
    multiInstance: false, // Set to false for React Native
    ignoreDuplicate: true,
  }).then(async (db) => {
    // Add collections
    await db.addCollections({
      todos: {
        schema: todoSchema
      }
    });
    
    return db;
  }).catch(error => {
    console.error('Database creation error:', error);
    dbPromise = null;
    throw error;
  });

  return dbPromise;
}

// Export types for better TypeScript support
export type TodosDatabase = Awaited<ReturnType<typeof createDatabase>>;
export type TodosCollection = TodosDatabase['todos'];
export type TodoDocument = TodosCollection['findOne']; 