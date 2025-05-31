import { DrizzleDB, db as drizzleDBInstance } from '@/src/db/'; // Import the DrizzleDB type and instance, and rawExpoDb
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';
// @ts-ignore
import migrations from '../drizzle/migrations/migrations.js'; // Adjust path if your drizzle output is different

// Conditional imports for migrators
let usePlatformMigrations: any;
if (Platform.OS === 'web') {
  // For sql.js, we might need a custom hook or a different approach
  // as 'drizzle-orm/sql-js/migrator' might not exist or work the same way.
  // We'll apply migrations manually for web.
} else {
  usePlatformMigrations = require('drizzle-orm/expo-sqlite/migrator').useMigrations;
}

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
  const [migrationsSuccess, setMigrationsSuccess] = useState<boolean | null>(null);
  const [migrationsError, setMigrationsError] = useState<Error | null>(null);

  useEffect(() => {
    async function applyWebMigrations() {
      // @ts-ignore
      if (!drizzleDBInstance || !drizzleDBInstance.session || !('batch' in drizzleDBInstance.session)) {
        console.log("Web DB instance not ready or not a sql-js instance for migrations.");
        // Set error only if it hasn't been attempted yet, or after a few tries
        // For simplicity, we assume if it's not ready now, it's an issue.
        if (migrationsSuccess === null) { // Avoid setting error if already succeeded or failed
            setMigrationsError(new Error("Web DB instance not ready for migrations."));
        }
        return;
      }
      try {
        const sqlStatements: string[] = [];
        // @ts-ignore
        for (const migrationKey in migrations.migrations) {
          // @ts-ignore
          if (migrations.migrations.hasOwnProperty(migrationKey)) {
            // @ts-ignore
            sqlStatements.push(migrations.migrations[migrationKey]);
          }
        }
        // @ts-ignore
        await drizzleDBInstance.session.batch(sqlStatements.map(sql => ({ sql, args: [] })));
        console.log("Web migrations applied successfully!");
        setMigrationsSuccess(true);
        setMigrationsError(null); // Clear any previous error
      } catch (e) {
        console.error("Web migration error:", e);
        setMigrationsError(e as Error);
        setMigrationsSuccess(false);
      }
    }

    if (Platform.OS === 'web') {
      // Check if db is initialized. db is an empty object until initializeDB populates it.
      // Accessing a property like .session is a proxy for checking if it's the sql-js Drizzle instance.
      // @ts-ignore
      if (drizzleDBInstance && drizzleDBInstance.session) { 
        applyWebMigrations();
      } else if (Object.keys(drizzleDBInstance).length === 0 && migrationsSuccess === null && !migrationsError) {
        // DB is not yet initialized, wait for the instance to be updated.
        // This effect will re-run when drizzleDBInstance changes.
        console.log("Web DB instance not yet available, waiting for initialization...");
      } else if (migrationsSuccess === null && !migrationsError) {
        // It's not empty, but not the expected sql-js instance, or some other issue.
        // This case might indicate a problem in initializeDB for web.
        console.error("Web DB instance is present but not in expected state for migrations.");
        setMigrationsError(new Error("Web DB instance not in expected state."));
      }
    }
  // @ts-ignore
  }, [drizzleDBInstance, migrationsSuccess, migrationsError]); // Re-run if drizzleDBInstance changes or to clear errors


  // Native migrations handling
  let nativeMigrationsStatus: { success?: boolean; error?: Error | null } = {};
  if (Platform.OS !== 'web' && usePlatformMigrations) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    nativeMigrationsStatus = usePlatformMigrations(drizzleDBInstance, migrations);
  }

  useEffect(() => {
    if (Platform.OS !== 'web') {
      if (nativeMigrationsStatus.success) {
        console.log("Native migrations applied successfully!");
        setMigrationsSuccess(true);
        setMigrationsError(null); // Clear any previous error
      } else if (nativeMigrationsStatus.error) {
        console.error("Native migration error:", nativeMigrationsStatus.error);
        setMigrationsError(nativeMigrationsStatus.error);
        setMigrationsSuccess(false);
      }
    }
  // @ts-ignore  
  }, [nativeMigrationsStatus.success, nativeMigrationsStatus.error]);


  if (migrationsSuccess === null && Platform.OS === 'web') { // For web, wait for async migration
    // Only show loading if no error has occurred yet
    if (!migrationsError) {
        return (
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
           <Text>Applying web database migrations...</Text>
         </View>
       );
    }
  }
  
  // @ts-ignore
  if (Platform.OS !== 'web' && (nativeMigrationsStatus.success === undefined && !nativeMigrationsStatus.error) ) {
     // Show a loading indicator or splash screen while migrations are in progress for native
     // and no error has occurred
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Applying native database migrations...</Text>
      </View>
    );
  }

  if (!drizzleDBInstance || Object.keys(drizzleDBInstance).length === 0) {
    // @ts-ignore
    if (Platform.OS === 'web' && drizzleDBInstance && drizzleDBInstance.session) {
      // This case should not be hit if web db is initialized, but as a safeguard.
    } else if (Platform.OS !== 'web' && drizzleDBInstance && Object.keys(drizzleDBInstance).length > 0) {
      // This case should not be hit if native db is initialized.
    } else {
        console.error("Drizzle DB instance is not available!");
        return (
           <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Database not initialized.</Text>
          </View>
        );
    }
  }

  return (
    <DatabaseContext.Provider value={drizzleDBInstance}>
      {children}
    </DatabaseContext.Provider>
  );
} 