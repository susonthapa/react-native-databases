/**
 * Native-specific storage implementation (iOS, Android)
 */
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import { getRxStorageSQLiteTrial, getSQLiteBasicsExpoSQLiteAsync } from 'rxdb/plugins/storage-sqlite';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';

const expoDB = require('expo-sqlite');

export const STORAGE_SQLITE = wrappedValidateAjvStorage({
  storage: getRxStorageSQLiteTrial({
    sqliteBasics: getSQLiteBasicsExpoSQLiteAsync(expoDB.openDatabaseAsync)
  })
});

// used in tests
export const STORAGE_MEMORY = wrappedValidateAjvStorage({
  storage: getRxStorageMemory()
}); 