import type { Product } from "@/interfaces/product";
import { API_BASE_URL } from "@/lib/config";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useSaleQuery } from "@/lib/query/hooks/useSalesQuery";
import type { SaleItem } from "@/interfaces/sale";

export function useProductQuery(id: string) {
  const { isPending, isLoading, isSuccess, error, data } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () =>
      fetch(`${API_BASE_URL}/products/${id}`).then((res) => {
        if (!res.ok) {
          throw new Error("Error fetching product");
        }
        return res.json();
      }),
    retry: 1, // Retry once on failure
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    refetchOnMount: true,
  });

  return {
    isPending,
    error,
    data,
    isLoading,
    isSuccess,
  };
}

export function useProductsQuery() {
  const { isPending, isLoading, error, data } = useQuery<Product>({
    queryKey: ["products"],
    queryFn: () =>
      fetch(`${API_BASE_URL}/products`).then((res) => {
        if (!res.ok) {
          throw new Error("Error fetching products");
        }
        return res.json();
      }),
    retry: 1, // Retry once on failure
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  });

  return {
    isPending,
    isLoading,
    error,
    data,
  };
}

//En el futuro esto podria ser manejado por una paginacion en el backend
// Por ahora, se usa para obtener productos por ids especificos
export function useProductsByIds(
  ids: string[],
  enabled: boolean
): {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  data: Product[];
} {
  const queries = useQueries<Product[]>({
    queries: ids.map((productId: string) => ({
      queryKey: ["product", productId],
      queryFn: () =>
        fetch(`${API_BASE_URL}/products/${productId}`).then((res) => {
          if (!res.ok) {
            throw new Error(`Error fetching product with id ${productId}`);
          }
          return res.json();
        }),
      enabled: enabled && ids.length > 0,
      retry: 1,
      staleTime: 1000 * 60 * 5,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);
  const error = queries.find((q) => q.error)?.error;
  const data = queries.map((q) => q.data as Product[]).flat();

  return {
    isLoading,
    isError,
    error,
    data,
  };
}

export function useSaleWithProducts(id: string) {
  const {
    data: sale,
    isLoading: isSaleLoading,
    error: saleError,
  } = useSaleQuery(id);

  const [productIds, setProductIds] = useState<string[]>([]);

  useEffect(() => {
    if (sale?.products && sale.products.length > 0) {
      setProductIds(sale.products.map((p: SaleItem) => p.productId));
    } else if (sale && (!sale.products || sale.products.length === 0)) {
      setProductIds([]);
    }
  }, [sale]);

  const shouldFetchProducts: boolean =
    !isSaleLoading && sale !== undefined && sale.products;

  const {
    data: products,
    isLoading: isProductsLoading,
    error: productsError,
  } = useProductsByIds(productIds, shouldFetchProducts);

  return {
    sale,
    products,
    isLoading: isSaleLoading || isProductsLoading,
    error: saleError || productsError,
  };
}
