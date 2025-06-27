import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SaleFormData } from "@/interfaces/sale";
import { API_BASE_URL } from "@/lib/config";

export function usePostSale() {
  const queryClient = useQueryClient();
  const { mutate, isPending, error, data, isSuccess } = useMutation({
    mutationKey: ["sales"],
    mutationFn: (newSale: SaleFormData) =>
      fetch(`${API_BASE_URL}/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSale),
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });

  return { mutate, isPending, error, data, isSuccess };
}

export function usePutSale() {
  const queryClient = useQueryClient();

  const { isPending, error, data, isSuccess } = useMutation({
    mutationFn: ({ id, newSale }: { id: string; newSale: SaleFormData }) =>
      fetch(`${API_BASE_URL}/sales/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSale),
      }).then((res) => res.json()),
    mutationKey: ["products"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });

  return { isPending, error, data, isSuccess };
}

export function useDeleteSale() {
  const queryClient = useQueryClient();

  const { isPending, error, data, isSuccess } = useMutation({
    mutationFn: (id: string) =>
      fetch(`${API_BASE_URL}/sales/${id}`, {
        method: "DELETE",
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Error deleting sale");
        }
        return res.json();
      }),
    mutationKey: ["sales"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });

  return { isPending, error, data, isSuccess };
}
