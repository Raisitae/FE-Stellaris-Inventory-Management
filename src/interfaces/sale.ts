export interface Sale {
  id?: string;
  date: Date;
  total: number;
  products: SaleItem[];
}
export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
}
