export interface Sale {
  id: string;
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

export interface SaleFormData {
  date: Date;
  total: number;
  products: SaleItemFormData[];
}

export interface SaleItemFormData {
  productId: string;
  quantity: number;
  unitPrice: number;
}
