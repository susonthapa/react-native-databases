import { DrizzleDB, db as drizzleDBInstance } from '@/src/db/'; // Import the DrizzleDB type and instance, and rawExpoDb
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import migrations from '../drizzle/migrations/migrations.js'; // Adjust path if your drizzle output is different

// Create a context to hold the database instance
const DatabaseContext = createContext<DrizzleDB | null>(null);

type DBProviderProps = {
  children: ReactNode;
};

// Export a hook to access the database
export function useDatabase() {
  const ctx = useContext(DatabaseContext);
  if (!ctx) {
    throw new Error('useDatabase must be used within a DBProvider');
  }
  return ctx;
}

export function DBProvider({ children }: DBProviderProps) {
  // Drizzle setup with expo-sqlite openDatabaseSync is synchronous
  // No complex async initialization needed here for the DB instance itself.
  // The drizzleDBInstance is already initialized when imported.

  const { success, error } = useMigrations(drizzleDBInstance, migrations);
  const [migrationsChecked, setMigrationsChecked] = useState(false);

  useEffect(() => {
    if (success) {
      console.log("Migrations applied successfully!");
      setMigrationsChecked(true);
    } else if (error) {
      console.error("Migration error:", error);
      // Handle migration error, e.g., show an error message
      setMigrationsChecked(true); // Still allow app to proceed or show error UI
    }
    // Add error to dependency array if you want to react to its changes,
    // but typically, you only care about initial success/failure.
  }, [success, error]);


  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Migration Error: {error.message}</Text>
        <Text>Please check console for details.</Text>
      </View>
    );
  }

  if (!success || !migrationsChecked) {
    // Show a loading indicator or splash screen while migrations are in progress
    // or if there was an error that prevents the app from starting.
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Applying database migrations...</Text>
      </View>
    );
  }

  if (!drizzleDBInstance) {
    // This should ideally not happen if db/index.ts is correct
    console.error("Drizzle DB instance is not available!");
    return null; // Or render an error state
  }

  return (
    <DatabaseContext.Provider value={drizzleDBInstance}>
      {children}
    </DatabaseContext.Provider>
  );
} 