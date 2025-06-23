import { API_BASE_URL } from "@/lib/config";
import { useQuery } from "@tanstack/react-query";

export function useProductQuery(id: string) {
  const { isPending, error, data } = useQuery({
    queryKey: ["product", id],
    queryFn: () =>
      fetch(`${API_BASE_URL}/products/${id}`).then((res) => res.json()),
    retry: 1, // Retry once on failure
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  });

  return {
    isPending,
    error,
    data,
  };
}

export function useProductsQuery() {
  const { isPending, error, data } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetch(`${API_BASE_URL}/products`).then((res) => res.json()),
    retry: 1, // Retry once on failure
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  });

  return {
    isPending,
    error,
    data,
  };
}
