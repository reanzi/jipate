import { openDB } from 'idb';
import type { AppState, Voter } from '@/types';

// Define the database name and version
const DB_NAME = 'jipateDb';
const DB_VERSION = 4;

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

// === New Auth-related IndexedDB functions ===

const AUTH_DB_NAME = 'convexa-auth-db';
const AUTH_STORE_NAME = 'auth';

/**
 * Helper function to open and return the IndexedDB database for auth.
 */
const openAuthDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(AUTH_DB_NAME, 1);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(AUTH_STORE_NAME)) {
                db.createObjectStore(AUTH_STORE_NAME);
            }
        };

        request.onsuccess = (event) => {
            resolve((event.target as IDBOpenDBRequest).result);
        };

        request.onerror = (event) => {
            reject((event.target as IDBOpenDBRequest).error);
        };
    });
};

/**
 * Saves auth data to IndexedDB.
 */
export async function saveAuthToDb(authId: string, expiryTime: number) {
    const db = await openAuthDB();
    const transaction = db.transaction([AUTH_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(AUTH_STORE_NAME);

    // Using a fixed key 'auth' for the single entry
    store.put({ id: authId, expiry: expiryTime }, 'auth');
}

/**
 * Loads auth data from IndexedDB.
 */
export async function loadAuthFromDb(): Promise<{ id: string, expiry: number } | null> {
    const db = await openAuthDB();
    const transaction = db.transaction([AUTH_STORE_NAME], 'readonly');
    const store = transaction.objectStore(AUTH_STORE_NAME);

    return new Promise((resolve, reject) => {
        const request = store.get('auth');
        request.onsuccess = (event) => {
            resolve((event.target as IDBRequest).result || null);
        };
        request.onerror = (event) => {
            reject((event.target as IDBRequest).error);
        };
    });
}

/**
 * Clears auth data from IndexedDB.
 */
export async function clearAuthInDb() {
    const db = await openAuthDB();
    const transaction = db.transaction([AUTH_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(AUTH_STORE_NAME);

    store.delete('auth');
}

/**
 * Updates a single voter record in the IndexedDB database.
 * This is performed by loading the entire app state, finding the voter,
 * updating the properties, and then saving the entire state back.
 * @param voterId The unique cardNumber of the voter to update.
 * @param updates The partial Voter object with properties to update.
 */
export async function updateVoterInDb(voterId: string, updates: Partial<Voter>): Promise<void> {
    const db = await getDb();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Get the current app state
    const appState = await store.get('app-state') as AppState;
    if (appState && appState.data) {
        // Find the voter by cardNumber
        const voterIndex = appState.data.findIndex(v => v.cardNumber === voterId);
        if (voterIndex !== -1) {
            // Create a new updated voter object
            const updatedVoter = { ...appState.data[voterIndex], ...updates };
            // Create a new voters array with the updated voter
            const updatedVoters = [
                ...appState.data.slice(0, voterIndex),
                updatedVoter,
                ...appState.data.slice(voterIndex + 1)
            ];
            // Update the app state and save it back
            const newAppState = { ...appState, data: updatedVoters };
            await store.put(newAppState, 'app-state');
        }
    }
}
