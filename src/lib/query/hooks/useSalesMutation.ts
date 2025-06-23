import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putSale, deleteSale } from "../services/SalesService";
import type { Sale } from "@/interfaces/sale";
import { API_BASE_URL } from "@/lib/config";

export function usePostSale() {
  const queryClient = useQueryClient();
  const { isPending, error, data } = useMutation({
    mutationKey: ["sales"],
    mutationFn: () => fetch(`${API_BASE_URL}/sales`).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });

  return { isPending, error, data };
}

export function usePutSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, sale }: { id: string; sale: Sale }) => putSale(id, sale),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
}

export function useDeleteSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
}
