import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { createDatabase, TodosDatabase } from '../models/database';

// Create a context to hold the database instance
const DatabaseContext = createContext<TodosDatabase | null>(null);

type RxDBProviderProps = {
  children: ReactNode;
};

// Export a hook to access the database
export function useDatabase() {
  const db = useContext(DatabaseContext);
  if (!db) {
    throw new Error('useDatabase must be used within a RxDBProvider');
  }
  return db;
}

export function RxDBProvider({ children }: RxDBProviderProps) {
  const [db, setDb] = useState<TodosDatabase | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize the database
  useEffect(() => {
    let isMounted = true;
    let database: TodosDatabase | null = null;
    
    const initDb = async () => {
      try {
        database = await createDatabase();
        if (isMounted) {
          setDb(database);
        }
      } catch (error) {
        console.error('Failed to initialize database:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    initDb();
    
    // Cleanup the database when the provider is unmounted
    return () => {
      isMounted = false;
      // Note: In RxDB 16+, we might not need explicit cleanup
      // as the database will be automatically cleaned up when no longer referenced
      // If needed, proper cleanup would be implemented here
    };
  }, []);
  
  // Show loading state until database is initialized
  if (loading || !db) {
    return null; // Or a loading spinner
  }
  
  // Provide the database through context
  return (
    <DatabaseContext.Provider value={db}>
      {children}
    </DatabaseContext.Provider>
  );
} 