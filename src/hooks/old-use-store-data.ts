// --- use-store-data.ts ---
import type { AppState, Voter } from '@/types';
import { create } from 'zustand';
import { loadStateFromDb, saveStateToDb, clearStateInDb } from '@/utils/db';
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
}

const AUTH_EXPIRY_DAYS = 3; // The auth state will expire in three days
const AUTH_TOKEN_KEY = 'convexa_auth_token';
const AUTH_EXPIRY_KEY = 'convexa_auth_expiry';

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
            // First, check for auth expiration
            get().checkAuthExpiration();

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
        // Clear local storage auth state
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_EXPIRY_KEY);
        // The clear operation is now asynchronous
        clearStateInDb().catch(error => console.error("Failed to clear IndexedDB state:", error));
    },

    // New actions for auth state management
    setAuthId: () => {
        // Only set if the authId is not already set and it's a new login
        if (!get().authId) {
            const newAuthId = crypto.randomUUID(); // Generate a unique UUID
            const expiryTime = Date.now() + AUTH_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
            try {
                // Save the new auth token and expiry to local storage
                localStorage.setItem(AUTH_TOKEN_KEY, newAuthId);
                localStorage.setItem(AUTH_EXPIRY_KEY, expiryTime.toString());
                set({ authId: newAuthId });
            } catch (error) {
                console.error("Failed to save auth state to local storage:", error);
            }
        }
    },

    checkAuthExpiration: () => {
        try {
            const storedAuthId = localStorage.getItem(AUTH_TOKEN_KEY);
            const storedExpiry = localStorage.getItem(AUTH_EXPIRY_KEY);

            if (storedAuthId && storedExpiry) {
                const expiryTime = parseInt(storedExpiry, 10);
                if (Date.now() < expiryTime) {
                    // Auth state is valid, set it in the store
                    set({ authId: storedAuthId });
                } else {
                    // Auth state has expired, reset it
                    get().resetAuth(); // Call the new resetAuth function
                }
            }
        } catch (error) {
            console.error("Failed to check auth expiration from local storage:", error);
            // In case of an error, it's safer to reset the auth state
            get().resetAuth();
        }
    },

    // New function to reset only the auth state
    resetAuth: () => {
        set({ authId: null });
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_EXPIRY_KEY);
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
