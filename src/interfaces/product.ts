export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  category: string;
  platformId: string;
  stock: number;
  status: string;
  internCode: string;
}
export interface ProductFormData {
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  category: string;
  platformId: string;
  stock: number;
  status: string;
  internCode: string;
}
