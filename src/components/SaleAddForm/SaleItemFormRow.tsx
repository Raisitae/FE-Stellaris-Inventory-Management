import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { Product } from "@/interfaces/product";
import { Trash2 } from "lucide-react";

interface SaleItemFormRowProps {
  product: Product;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
  setItems: React.Dispatch<
    React.SetStateAction<
      { productId: string; quantity: number; unitPrice: number }[]
    >
  >;
  error?: {
    quantity?: string;
    unitPrice?: string;
  };
  removeProduct: (productId: string) => void;
  clearProducts: () => void;
}

export default function SaleItemFormRow({
  product,
  items,
  setItems,
  removeProduct,
  error,
}: SaleItemFormRowProps) {
  const item = items.find((i) => i.productId === product._id);
  const quantity = item?.quantity || 1;

  const updateQuantity = (value: number) => {
    value = Math.max(1, Math.min(product.stock, value));

    setItems((prevItems) => {
      const exists = prevItems.find((item) => item.productId === product._id);
      if (exists) {
        return prevItems.map((item) =>
          item.productId === product._id ? { ...item, quantity: value } : item
        );
      }
      return [
        ...prevItems,
        {
          productId: product._id,
          quantity: value,
          unitPrice: product.price || 0,
        },
      ];
    });
  };

  return (
    <div className="border rounded-2xl p-4 mb-6 bg-white shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
          IMG
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-500">
                {product.description || "Sin descripción"}
              </p>
              <p className="text-xs text-gray-400">Stock: {product.stock}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:bg-red-100"
              onClick={() => {
                removeProduct(product._id);
              }}>
              <Trash2 size={18} />
            </Button>
          </div>

          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Cantidad:</Label>

              <button
                type="button"
                className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-lg"
                onClick={() => updateQuantity(quantity - 1)}
                disabled={quantity <= 1}>
                −
              </button>

              <Input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => {
                  let val = Number(e.target.value);
                  if (isNaN(val)) val = 1;
                  updateQuantity(val);
                }}
                className={`w-16 text-center ${error?.quantity ? "border-red-500" : ""}`}
              />

              <button
                type="button"
                className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-lg"
                onClick={() => updateQuantity(quantity + 1)}
                disabled={quantity >= product.stock}>
                +
              </button>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">
                Unitario: ${product.price?.toFixed(2) || "0.00"}
              </p>
              <p className="text-xl font-bold text-primary">
                ${(quantity * (product.price || 0)).toFixed(2)}
              </p>
            </div>
          </div>

          {(error?.quantity || error?.unitPrice) && (
            <div className="mt-1 text-xs text-red-500">
              {error.quantity && <p>{error.quantity}</p>}
              {error.unitPrice && <p>{error.unitPrice}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
