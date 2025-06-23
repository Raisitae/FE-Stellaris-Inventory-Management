// lib/query/hooks/useProductMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putProduct, deleteProduct } from "../services/productService";
import type { Product, ProductFormData } from "@/interfaces/product";
import { API_BASE_URL } from "@/lib/config";

export function usePostProduct() {
  const queryClient = useQueryClient();
  const { mutate, isPending, error, data } = useMutation({
    mutationFn: (newProduct: ProductFormData) =>
      fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      }).then((res) => res.json()),
    mutationKey: ["products"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return { mutate, isPending, error, data };
}

export function usePutProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, product }: { id: string; product: Product }) =>
      putProduct(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
