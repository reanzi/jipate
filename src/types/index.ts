// src/types/index.ts

/**
 * Defines the structure for a Voter object.
 */
export interface Voter {
    name: string;
    cardNumber: string;
    station: string;
    imageUrl: string;
    isAgent: boolean;
    isReferee: boolean;
    designation?: string; // can be station or voter's name
}

/**
 * Defines the application's overall state.
 * 'TEST' mode allows for generated data, while 'DRIVE' mode requires a facility name and real data.
 */
export interface AppState {
    mode: 'TEST' | 'DRIVE';
    facility?: string;
    data: Voter[]
}
