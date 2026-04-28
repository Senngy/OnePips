import { useQuery } from "@tanstack/react-query";
import { getEventState, EventStateDto } from "@/lib/services/events.service";
// We use useQuery because it will return for us an object with the following properties:
// data: The data returned by the query
// isLoading: Whether the query is loading
// isError: Whether the query is in error
// error: The error returned by the query
// refetch: A function to refetch the query
// isFetching: Whether the query is fetching
// isStale: Whether the query is stale
// isSuccess: Whether the query is successful
// status: The status of the query


export function useEventState() {
    return useQuery({
        queryKey: ["event-state"], // TODO: Add a way to invalidate this query
        queryFn: getEventState,
        staleTime: 1000 * 60, // 1 min cache for event state refresh
    });
}