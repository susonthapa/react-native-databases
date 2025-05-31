import type { Database } from 'sql.js'; // Type-only imports are safe

/**
 * This function should not be called on native platforms.
 * It's a counterpart to getSqlJsDb in sqljs-loader.web.ts to ensure
 * consistent module resolution across platforms.
 */
export async function getSqlJsDb(): Promise<Database> {
  // The Platform.OS check in initializeDB should prevent this from ever being called on native.
  // If it is called, it signifies a logic error.
  throw new Error(
    "SQLite (sql.js) web-specific function 'getSqlJsDb' was inappropriately called on a native platform."
  );
} 