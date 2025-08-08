import { parseAsString, useQueryStates } from 'nuqs'


export const useUrlState = () => {
    return useQueryStates({
        searchTerm: parseAsString.withDefault(''),
        sortBy: parseAsString.withDefault(''),
        centers: parseAsString.withDefault(''),
    },
        {
            urlKeys: {
                searchTerm: 'q',
                sortBy: 's',
                centers: 'c'
            },
            throttleMs: 100, // Throttle rapid updates
            shallow: true,   // Prevent full page re-renders
        }
    )
}

