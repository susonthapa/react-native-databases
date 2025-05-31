import type { Database } from 'sql.js';
import initSqlJs from 'sql.js';

/**
 * Initializes and returns an sql.js database instance.
 * This function is intended to be used only on the web platform.
 */
export async function getSqlJsDb(): Promise<Database> {
  const SQL = await initSqlJs({
    locateFile: file => `/sql-wasm.wasm` // Points to the wasm file in the public directory
  });
  return new SQL.Database();
} 