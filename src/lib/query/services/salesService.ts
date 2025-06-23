import type { Sale } from "@/interfaces/sale";
import { httpClient } from "../http/httpClient";

export const getSales = () => httpClient<[]>("/sales");

export const getSale = (id: string) => httpClient<Sale>(`/sales/${id}`);

export const postSale = (sale: Sale) => {
  return httpClient<Sale>("/sales", {
    method: "POST",
    body: JSON.stringify(sale),
  });
};

export const putSale = ({ id, data }: { id: string; data: Sale }) =>
  httpClient<Sale>(`/sales/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteSale = (id: string) => {
  return httpClient<void>(`/sales/${id}`, {
    method: "DELETE",
  });
};
