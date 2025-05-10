/**
 * The storage is defined in a separate file
 * so that it can be swapped out in the CI to test
 * different storages.
 */
import * as SQLite from 'expo-sqlite';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import { getRxStorageSQLiteTrial, getSQLiteBasicsExpoSQLiteAsync } from 'rxdb/plugins/storage-sqlite';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';

export const STORAGE_SQLITE = wrappedValidateAjvStorage({
    storage: getRxStorageSQLiteTrial({
        sqliteBasics: getSQLiteBasicsExpoSQLiteAsync(SQLite.openDatabaseAsync)
    })
});

// used in tests
export const STORAGE_MEMORY = wrappedValidateAjvStorage({
    storage: getRxStorageMemory()
});