/**
 * Web-specific storage implementation
 */
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';

export const STORAGE_SQLITE = wrappedValidateAjvStorage({
  storage: getRxStorageMemory()
});

// used in tests
export const STORAGE_MEMORY = wrappedValidateAjvStorage({
  storage: getRxStorageMemory()
}); 