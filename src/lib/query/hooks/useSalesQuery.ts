import { API_BASE_URL } from "@/lib/config";
import { useQuery } from "@tanstack/react-query";

export function useSaleQuery(id: string) {
  const { data, error, isPending, isSuccess } = useQuery({
    queryKey: ["sales", id],
    queryFn: () =>
      fetch(`${API_BASE_URL}/sales/${id}`).then((res) => {
        if (!res.ok) {
          throw new Error("Error fetching sale");
        }
        return res.json();
      }),
    retry: 1, // Retry once on failure
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  });
  return { data, error, isPending, isSuccess };
}

export function useSalesQuery() {
  const { data, error, isPending, isSuccess } = useQuery({
    queryKey: ["sales"],
    queryFn: () =>
      fetch(`${API_BASE_URL}/sales`).then((res) => {
        if (!res.ok) {
          throw new Error("Error fetching sales");
        }
        return res.json();
      }),
    retry: 1, // Retry once on failure
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  });

  return { data, error, isPending, isSuccess };
}
