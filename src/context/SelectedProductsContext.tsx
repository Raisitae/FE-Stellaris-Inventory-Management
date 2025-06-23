import type { Product } from "@/interfaces/product";
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface SelectedProductsContextType {
  selectedProducts: Product[];
  setSelectedProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  clearProducts: () => void;
}

const SelectedProductsContext = createContext<
  SelectedProductsContextType | undefined
>(undefined);

export function SelectedProductsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const addProduct = (product: Product) => {
    setSelectedProducts((prev) =>
      prev.find((p) => p._id === product._id) ? prev : [...prev, product]
    );
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  const clearProducts = () => setSelectedProducts([]);

  return (
    <SelectedProductsContext.Provider
      value={{
        selectedProducts,
        setSelectedProducts,
        addProduct,
        removeProduct,
        clearProducts,
      }}>
      {children}
    </SelectedProductsContext.Provider>
  );
}

export function useSelectedProducts() {
  const ctx = useContext(SelectedProductsContext);
  if (!ctx)
    throw new Error(
      "useSelectedProducts debe usarse dentro de SelectedProductsProvider"
    );
  return ctx;
}
