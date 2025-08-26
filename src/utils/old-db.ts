import { openDB, type IDBPDatabase } from 'idb';
import type { AppState, Voter } from '@/types';

// Define the database name and version
const DB_NAME = 'jipateDb';
const DB_VERSION = 7; // Increment the version to trigger the upgrade logic

// Define the object store name
const STORE_NAME = 'app-store';

/**
 * Initializes and opens the IndexedDB database.
 * If the database version changes, it creates or upgrades the object store.
 * @returns A promise that resolves to the database instance.
 */
async function getDb(): Promise<IDBPDatabase> {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion, newVersion,) {
            console.log(`Database upgrade from version ${oldVersion} to ${newVersion}`);

            // A switch statement is the best way to handle versioned upgrades.
            // Each case falls through to the next, ensuring all necessary
            // upgrade steps are run sequentially.
            switch (oldVersion) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                    // If the object store does not exist, create it.
                    // This check prevents the "ConstraintError".
                    if (!db.objectStoreNames.contains(STORE_NAME)) {
                        db.createObjectStore(STORE_NAME);
                    }
                // No break statement here, so code will fall through to the next case.
            }
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

// === New Auth- and Voter-related functions ===

/**
 * Saves the authentication ID and expiry to IndexedDB.
 * @param authId The authentication ID to save.
 * @param expiry The expiry timestamp in milliseconds.
 */
export async function saveAuthToDb(authId: string, expiry: number): Promise<void> {
    const db = await getDb();
    // Use the same store, but a different key for authentication data
    await db.put(STORE_NAME, { authId, expiry }, 'auth');
}

/**
 * Loads the authentication data from IndexedDB.
 * @returns A promise that resolves to the saved auth data or null if not found.
 */
export async function loadAuthFromDb(): Promise<{ authId: string, expiry: number } | null> {
    const db = await getDb();
    return (await db.get(STORE_NAME, 'auth')) || null;
}

/**
 * Clears the authentication data from IndexedDB.
 */
export async function clearAuthInDb(): Promise<void> {
    const db = await getDb();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete('auth');
    await transaction.done; // Ensure the transaction completes
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
    await transaction.done; // Ensure the transaction completes
}
