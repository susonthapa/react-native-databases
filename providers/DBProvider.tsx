import { database as watermelonDBInstance } from '@/src/database/watermelon'; // Using path alias
import { Database } from '@nozbe/watermelondb';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Create a context to hold the database instance
const DatabaseContext = createContext<Database | null>(null);

type DBProviderProps = {
  children: ReactNode;
};

// Export a hook to access the database
export function useDatabase() {
  const db = useContext(DatabaseContext);
  if (!db) {
    throw new Error('useDatabase must be used within a DBProvider');
  }
  return db;
}

export function DBProvider({ children }: DBProviderProps) {
  const [db, setDb] = useState<Database | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setDb(watermelonDBInstance);
    } catch (e: any) {
      console.error('Failed to set database instance:', e);
      setError(e);
    }
  }, []);

  if (error) {
    return null; // Or an error component
  }

  if (!db) {
    return null; // Or a loading spinner
  }

  return (
    <DatabaseContext.Provider value={db}>
      {children}
    </DatabaseContext.Provider>
  );
} 