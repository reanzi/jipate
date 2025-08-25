// --- use-store-data.ts ---
import type { AppState, Voter } from '@/types';
import { create } from 'zustand';
import { loadStateFromDb, saveStateToDb, clearStateInDb, saveAuthToDb, loadAuthFromDb, clearAuthInDb, updateVoterInDb } from '@/utils/db';
import { useEffect } from 'react';

// The interface for our store now includes a new action for async loading
interface AppStore {
    appState: AppState | null;
    isDataLoaded: boolean;
    isInitializing: boolean; // Add a new state for initialization
    setAppState: (state: AppState) => void;
    setVoters: (voters: Voter[]) => void;
    resetStore: () => void;
    loadInitialData: () => Promise<void>; // Add the async load function

    // Auth-related state and actions
    authId: string | null;
    setAuthId: () => void; // Modified to no longer accept an authId string
    checkAuthExpiration: () => void;
    resetAuth: () => void; // New action to reset only the auth state

    // New action to update a single voter
    updateVoter: (voterId: string, updates: Partial<Voter>) => Promise<void>;
}

const AUTH_EXPIRY_DAYS = 3; // The auth state will expire in three days

export const useStoreData = create<AppStore>((set, get) => ({
    appState: null,
    isDataLoaded: false,
    isInitializing: true, // Start in an initializing state
    authId: null,

    /**
     * An asynchronous function to load data from IndexedDB.
     * This should only be called once when the app mounts.
     */
    loadInitialData: async () => {
        try {
            // First, load auth data from IndexedDB
            const authData = await loadAuthFromDb();
            if (authData) {
                // Check if the auth token has expired
                if (Date.now() < authData.expiry) {
                    set({ authId: authData.id });
                } else {
                    // Auth state has expired, reset it
                    await get().resetAuth();
                }
            } else {
                set({ authId: null });
            }

            // Now load the main app state from IndexedDB
            const state = await loadStateFromDb();
            if (state) {
                set({ appState: state, isDataLoaded: true, isInitializing: false });
            } else {
                // If no state is found, we're done initializing
                set({ isInitializing: false });
            }
        } catch (error) {
            console.error("Failed to load initial data from IndexedDB:", error);
            set({ isInitializing: false });
        }
    },

    setAppState: (state) => {
        set({ appState: state, isDataLoaded: true });
        // The save operation is now asynchronous
        saveStateToDb(state).catch(error => console.error("Failed to save state to IndexedDB:", error));
    },

    setVoters: (voters) =>
        set((store) => {
            if (store.appState) {
                const newState = { ...store.appState, data: voters };
                // The save operation is now asynchronous
                saveStateToDb(newState).catch(error => console.error("Failed to save state to IndexedDB:", error));
                return {
                    appState: newState,
                };
            }
            return store;
        }),

    resetStore: () => {
        set({ appState: null, isDataLoaded: false, authId: null });
        // Clear all data including auth state
        clearAuthInDb().catch(error => console.error("Failed to clear IndexedDB auth state:", error));
        clearStateInDb().catch(error => console.error("Failed to clear IndexedDB state:", error));
    },

    // New actions for auth state management
    setAuthId: async () => {
        // Only set if the authId is not already set and it's a new login
        if (!get().authId) {
            const newAuthId = crypto.randomUUID(); // Generate a unique UUID
            const expiryTime = Date.now() + AUTH_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
            try {
                // Save the new auth token and expiry to IndexedDB
                await saveAuthToDb(newAuthId, expiryTime);
                set({ authId: newAuthId });
            } catch (error) {
                console.error("Failed to save auth state to IndexedDB:", error);
            }
        }
    },

    checkAuthExpiration: async () => {
        try {
            const authData = await loadAuthFromDb();
            if (authData) {
                if (Date.now() < authData.expiry) {
                    set({ authId: authData.id });
                } else {
                    get().resetAuth();
                }
            } else {
                set({ authId: null });
            }
        } catch (error) {
            console.error("Failed to check auth expiration from IndexedDB:", error);
            get().resetAuth();
        }
    },

    // New function to reset only the auth state
    resetAuth: async () => {
        set({ authId: null });
        await clearAuthInDb();
    },

    // New action to update a single voter record and persist to IndexedDB
    updateVoter: async (voterId: string, updates: Partial<Voter>) => {
        // Find and update the voter in the local Zustand store immediately
        set(state => {
            if (!state.appState) return state;
            const updatedData = state.appState.data.map(voter => {
                if (voter.cardNumber === voterId) {
                    return { ...voter, ...updates };
                }
                return voter;
            });
            return {
                ...state,
                appState: {
                    ...state.appState,
                    data: updatedData,
                },
            };
        });

        // Now, perform the IndexedDB write in the background
        try {
            await updateVoterInDb(voterId, updates);
        } catch (error) {
            console.error("Failed to update voter in IndexedDB:", error);
            // Optional: You could add logic here to revert the local state or show a toast message
        }
    },
}));

/**
 * A custom hook to handle the initial data loading when the component mounts.
 * This ensures the async IndexedDB operation completes before the app starts rendering with data.
 */
export const useInitializeData = () => {
    const { loadInitialData, isInitializing } = useStoreData();

    useEffect(() => {
        // Only run this effect once on mount
        loadInitialData();
    }, [loadInitialData]);

    return { isInitializing };
};
