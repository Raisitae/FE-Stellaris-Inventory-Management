export interface Sale {
  _id: string;
  date: Date;
  total: number;
  products: SaleItem[];
  [key: string]: unknown;
}

export interface SaleItem {
  _id: string;
  saleId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface SaleFormData {
  total: number;
  clientName: string;
  products: SaleItemFormData[];
}

export interface SaleItemFormData {
  productId: string;
  quantity: number;
  unitPrice: number;
}
