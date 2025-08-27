import { parseAsString, useQueryStates } from 'nuqs'


export const useUrlState = () => {
    return useQueryStates({
        searchTerm: parseAsString.withDefault(''),
        sortBy: parseAsString.withDefault(''),
        centers: parseAsString.withDefault(''),
        facilityId: parseAsString.withDefault(''),
        voterId: parseAsString.withDefault(''),
        agents: parseAsString.withDefault(''),
        referees: parseAsString.withDefault(''),
    },
        {
            urlKeys: {
                searchTerm: 'q',
                sortBy: 's',
                centers: 'c',
                facilityId: 'f',
                voterId: 'sv',
                agents: 'ags',
                referees: 'ref'
            },
            throttleMs: 100, // Throttle rapid updates
            shallow: true,   // Prevent full page re-renders
        }
    )
}

