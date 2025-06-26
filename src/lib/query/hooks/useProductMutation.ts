import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProductFormData } from "@/interfaces/product";
import { API_BASE_URL } from "@/lib/config";

export function usePostProduct() {
  const queryClient = useQueryClient();
  const { mutate, isPending, error, data, isSuccess } = useMutation({
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

  return { mutate, isPending, error, data, isSuccess };
}

export function usePathProduct() {
  const queryClient = useQueryClient();

  const { mutate, isPending, error, data, isSuccess } = useMutation({
    mutationFn: ({
      id,
      newProduct,
    }: {
      id: string;
      newProduct: ProductFormData;
    }) =>
      fetch(`${API_BASE_URL}/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      }).then((res) => res.json()),
    mutationKey: ["products"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return { mutate, isPending, error, data, isSuccess };
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  const { isPending, mutate, error, data, isSuccess } = useMutation({
    mutationFn: (idClient: string) =>
      fetch(`${API_BASE_URL}/products/${idClient}`, {
        method: "DELETE",
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Error deleting product");
        }
        return res.json();
      }),
    mutationKey: ["products"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return { isPending, mutate, error, data, isSuccess };
}
