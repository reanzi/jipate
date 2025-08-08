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
}

export const useStoreData = create<AppStore>((set) => ({
    appState: null,
    isDataLoaded: false,
    isInitializing: true, // Start in an initializing state

    /**
     * An asynchronous function to load data from IndexedDB.
     * This should only be called once when the app mounts.
     */
    loadInitialData: async () => {
        try {
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
        set({ appState: null, isDataLoaded: false });
        // The clear operation is now asynchronous
        clearStateInDb().catch(error => console.error("Failed to clear IndexedDB state:", error));
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
