import { useQuery } from "@tanstack/react-query";
import { getProduct, getProducts } from "../services/productService";

/**
 * Custom React Query hook to fetch a product by its ID.
 *
 * @param id - The unique identifier of the product to fetch.
 * @returns The result of the `useQuery` hook for the specified product.
 *
 * @remarks
 * - Retries the query once on failure.
 * - The fetched data is considered fresh for 5 minutes.
 * - Uses the query key `["product", id]` for caching and refetching.
 */
export function useProductMutations(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    retry: 1, // Retry once on failure
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  });
}

/**
 * Custom React Query hook to fetch all products.
 *
 * @returns {UseQueryResult<Product[], Error>} The result object from the `useQuery` hook,
 * containing product data, loading, and error states.
 *
 * @remarks
 * - Uses the query key `["products"]` to cache and identify the query.
 * - Fetches product data using the `getProducts` function.
 * - Retries the query once upon failure.
 * - Marks the data as fresh for 5 minutes (`staleTime`).
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useProductsQuery();
 * ```
 */
export function useProductsQuery() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
    retry: 1, // Retry once on failure
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  });
}
