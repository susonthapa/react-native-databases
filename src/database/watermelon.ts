import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'; // Corrected adapter import
import { mySchema, SubTask, Todo } from '../models/watermelon';

// First, create the adapter
// This needs to be configured per platform, but for Expo, the plugin handles it.
const adapter = new SQLiteAdapter({
  schema: mySchema,
  // Pass a JSI Bridgeless flag if you're using the new architecture on native or Hermes directly.
  // This is now recommended for all new projects and will make your database much faster.
  jsi: true, // true since newArchEnabled is true in app.json
  // dbName: 'WatermelonDemo', // Optional: specify database name
  // migrations: migrations, // Optional: if you have migrations
  onSetUpError: error => {
    // Database failed to load -- offer the user to reload the app or log out
    console.error("Failed to load database:", error)
  }
})

// Then, make a Watermelon database from it!
export const database = new Database({
  adapter,
  modelClasses: [
    Todo,
    SubTask,
  ],
}) 