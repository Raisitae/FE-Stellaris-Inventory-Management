import { useQuery } from "@tanstack/react-query";
import { getSale, getSales } from "../services/SalesService";

/**
 * Custom React Query hook to fetch a sale by its ID.
 *
 * @param id - The unique identifier of the sale to fetch.
 * @returns The result of the `useQuery` hook for the specified sale.
 *
 * @remarks
 * - Retries the query once on failure.
 * - The fetched data is considered fresh for 5 minutes.
 * - Uses the query key `["sales", id]` for caching and refetching.
 */
export function useSaleQuery(id: string) {
  return useQuery({
    queryKey: ["sales", id],
    queryFn: () => getSale(id),
    retry: 1, // Retry once on failure
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  });
}

/**
 * Custom React Query hook to fetch sales data.
 *
 * @returns {UseQueryResult<Sale[], Error>} The result object from the `useQuery` hook, containing sales data, loading, and error states.
 *
 * @remarks
 * - Uses the query key `["sales"]` to cache and identify the query.
 * - Fetches sales data using the `getSales` function.
 * - Retries the query once upon failure.
 * - Marks the data as fresh for 5 minutes (`staleTime`).
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useSalesQuery();
 * ```
 */
export function useSalesQuery() {
  return useQuery({
    queryKey: ["sales"],
    queryFn: () => getSales(),
    retry: 1, // Retry once on failure
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  });
}
