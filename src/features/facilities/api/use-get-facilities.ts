import { api } from "convex/_generated/api"
import { useQuery } from "convex/react"

export const useGetFacilities = () => {
    const data = useQuery(api.facilities.list);
    const isLoading = data === undefined;

    return { data, isLoading }
}