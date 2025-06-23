import { httpClient } from "../http/httpClient";
import type { Product } from "@/interfaces/product";

export const getProducts = () => httpClient<Product[]>("/products");
export const getProduct = (id: string) =>
  httpClient<Product>(`/products/${id}`);

export const postProduct = (product: Product) =>
  httpClient<Product>("/products", {
    method: "POST",
    body: JSON.stringify(product),
  });

export const putProduct = (id: string, product: Product) =>
  httpClient<Product>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });

export const deleteProduct = (id: string) =>
  httpClient<void>(`/products/${id}`, {
    method: "DELETE",
  });
