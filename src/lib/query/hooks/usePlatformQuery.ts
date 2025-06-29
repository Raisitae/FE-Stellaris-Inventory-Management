import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/config";

export function usePlatformQuery(id: string) {
  const { isPending, error, data } = useQuery({
    queryKey: ["platform", id],
    queryFn: () =>
      fetch(`${API_BASE_URL}/platform`).then((res) => {
        if (!res.ok) {
          throw new Error("Error fetching platform");
        }
        return res.json();
      }),
    retry: 1, // Retry once on failure
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  });

  return {
    isPending,
    error,
    data,
  };
}

export function usePlatformsQuery() {
  const { isPending, error, data } = useQuery({
    queryKey: ["platforms"],
    queryFn: () =>
      fetch(`${API_BASE_URL}/platform`).then((res) => {
        if (!res.ok) {
          throw new Error("Error fetching platforms");
        }
        return res.json();
      }),
  });

  return {
    isPending,
    error,
    data,
  };
}
