import { addRxPlugin, createRxDatabase, RxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { SubTaskCollection, SubTaskCollectionMethods, SubTaskDocMethods, SubTaskDocument, subTaskSchema } from './SubTaskSchema';
import { TodoCollection, TodoCollectionMethods, TodoDocMethods, TodoDocument, todoSchema } from './TodoSchema';

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

// Define our database collections
export type MyDatabaseCollections = {
  todos: TodoCollection;
  subtasks: SubTaskCollection;
};

// Define the database type
export type MyDatabase = RxDatabase<MyDatabaseCollections>;

// Database singleton to prevent multiple instances
let dbPromise: Promise<MyDatabase> | null = null;

/**
 * Creates a new database or returns the existing one
 */
export async function createDatabase(): Promise<MyDatabase> {
  if (dbPromise) return dbPromise;

  if (isDevelopment) {
    addRxPlugin(RxDBDevModePlugin);
  }

  // Implementation of document methods
  const todoDocMethods: TodoDocMethods = {
    markAsCompleted: async function(this: TodoDocument) {
      await this.patch({ completed: true });
    },
    toggleComplete: async function(this: TodoDocument) {
      await this.patch({ completed: !this.completed });
    }
  };

  // Implementation of document methods for SubTasks
  const subTaskDocMethods: SubTaskDocMethods = {
    toggleComplete: async function(this: SubTaskDocument) {
      await this.patch({ completed: !this.completed });
    }
  };

  // Implementation of collection methods
  const todoCollectionMethods: TodoCollectionMethods = {
    countCompleted: async function(this: TodoCollection) {
      return (await this.find({ selector: { completed: true } }).exec()).length;
    },
    countActive: async function(this: TodoCollection) {
      return (await this.find({ selector: { completed: false } }).exec()).length;
    }
  };

  // Implementation of collection methods for SubTasks
  const subTaskCollectionMethods: SubTaskCollectionMethods = {
    countByTask: async function(this: SubTaskCollection, taskId: string) {
      return (await this.find({ selector: { taskId } }).exec()).length;
    }
  };

  // Create the database
  dbPromise = createRxDatabase<MyDatabaseCollections>({
    name: 'todosdb',
    storage: STORAGE_SQLITE,
    multiInstance: false, // Set to false for React Native
    ignoreDuplicate: true,
  }).then(async (db) => {
    // Add collections
    await db.addCollections({
      todos: {
        schema: todoSchema,
        methods: todoDocMethods,
        statics: todoCollectionMethods
      },
      subtasks: {
        schema: subTaskSchema,
        methods: subTaskDocMethods,
        statics: subTaskCollectionMethods
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
