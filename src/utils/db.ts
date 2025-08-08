import { openDB } from 'idb';
import type { AppState } from '@/types';

// Define the database name and version
const DB_NAME = 'jipateDb';
const DB_VERSION = 2;

// Define the object store name
const STORE_NAME = 'app-store';

/**
 * Initializes and opens the IndexedDB database.
 * If the database version changes, it creates or upgrades the object store.
 * @returns A promise that resolves to the database instance.
 */
async function getDb() {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            db.createObjectStore(STORE_NAME);
        },
    });
}

/**
 * Saves the application state to the IndexedDB object store.
 * @param state The AppState object to save.
 */
export async function saveStateToDb(state: AppState): Promise<void> {
    const db = await getDb();
    await db.put(STORE_NAME, state, 'app-state');
}

/**
 * Loads the application state from the IndexedDB object store.
 * @returns A promise that resolves to the saved AppState or null if not found.
 */
export async function loadStateFromDb(): Promise<AppState | null> {
    const db = await getDb();
    return (await db.get(STORE_NAME, 'app-state')) || null;
}

/**
 * Clears all data from the IndexedDB object store.
 */
export async function clearStateInDb(): Promise<void> {
    const db = await getDb();
    await db.clear(STORE_NAME);
}
