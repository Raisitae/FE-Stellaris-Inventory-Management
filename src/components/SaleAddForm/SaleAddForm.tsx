import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { SaleItemFormData } from "@/interfaces/sale";
import { usePostSale } from "@/lib/query/hooks/useSalesMutation";
import { useSelectedProducts } from "@/context/SelectedProductsContext";
import SaleItemFormRow from "./SaleItemFormRow";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const emptyItem: SaleItemFormData = {
  productId: "",
  quantity: 1,
  unitPrice: 0,
};

export default function SaleAddForm() {
  const [items, setItems] = useState<SaleItemFormData[]>([{ ...emptyItem }]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createSale, isPending, isSuccess } = usePostSale();
  const [clientName, setClientName] = useState("");
  const { selectedProducts, removeProduct, clearProducts } =
    useSelectedProducts();
  const navigate = useNavigate();

  const { t } = useTranslation("sales");

  useEffect(() => {
    if (selectedProducts.length > 0) {
      setItems(
        selectedProducts.map((product) => ({
          productId: product._id,
          quantity: 1,
          unitPrice: product.price ?? 0,
        }))
      );
    } else {
      setItems([{ ...emptyItem }]);
    }
  }, [selectedProducts]);

  useEffect(() => {
    if (isSuccess) {
      navigate("/sales");
    }
  }, [isSuccess, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!clientName && clientName.length < 3) {
      newErrors.customerName = t("clientNameRequired");
    }
    items.forEach((item, idx) => {
      if (!item.productId) newErrors[`productId${idx}`] = t("productRequired");
      if (!item.quantity || item.quantity <= 0)
        newErrors[`quantity${idx}`] = t("invalidQty");
      if (item.unitPrice === undefined || item.unitPrice < 0)
        newErrors[`price${idx}`] = t("invalidPrice");
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const total = items.reduce(
      (acc, item) => acc + item.quantity * item.unitPrice,
      0
    );
    createSale(
      { total: total, clientName: clientName, products: items },
      {
        onSuccess: () => {
          setItems([{ ...emptyItem }]);
        },
      }
    );
  };

  const totalAmount = items.reduce(
    (acc, item) => acc + item.quantity * item.unitPrice,
    0
  );

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          <div>
            <Label htmlFor="clientName">{t("clientName")}</Label>
            <Input
              type="text"
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className={errors.customerName ? "border-red-500" : ""}
            />
            {errors.customerName && (
              <p className="text-sm text-red-500">{errors.customerName}</p>
            )}
          </div>
          <Card className="bg-gray-50 p-4 rounded-xl border">
            <CardContent className="p-0">
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                {t("selectedProducts")}
              </Label>
              {selectedProducts.length === 0 ? (
                <div className="text-gray-400 italic text-center py-4">
                  {t("noProductsSelected")}
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedProducts.map((product) => (
                    <SaleItemFormRow
                      key={product._id}
                      product={product}
                      error={errors}
                      items={items}
                      setItems={setItems}
                      removeProduct={removeProduct}
                      clearProducts={clearProducts}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          {selectedProducts.length > 0 && (
            <div className="flex justify-between items-center font-semibold text-sm text-gray-700">
              <span>{t("totalPrice")}</span>
              <span className="text-primary text-lg">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          )}
          {errors.general && (
            <p className="text-sm text-red-500">{errors.general}</p>
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? t("processingSale") : t("createSale")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
