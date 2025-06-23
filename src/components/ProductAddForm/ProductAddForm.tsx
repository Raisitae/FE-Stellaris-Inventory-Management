import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCategoryArray } from "@/data/categories";
import { getStatusArray } from "@/data/status";
import { usePostProduct } from "@/lib/query/hooks/useProductMutation";
import { usePlatformsQuery } from "@/lib/query/hooks/usePlatformQuery";
import type { Platform } from "@/interfaces/platform";
import type { ProductFormData } from "@/interfaces/product";

export default function ProductAddForm() {
  const { t } = useTranslation("products");

  const categoryArray = getCategoryArray(t);
  const statusArray = getStatusArray(t);
  const {
    mutate: createProduct,
    isPending,
    isSuccess,
    data,
  } = usePostProduct();
  const { data: platformArray } = usePlatformsQuery();

  console.log("Platform Array:", platformArray);
  const [formData, setFormData] = useState<ProductFormData>({
    price: 0,
    description: "",
    imageUrl: "",
    category: "",
    platformId: "",
    stock: 0,
    status: "",
    internCode: "",
    name: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductFormData, string | undefined>>
  >({});

  const validateForm = (): boolean => {
    const newErrors: Partial<
      Record<keyof ProductFormData, string | undefined>
    > = {};
    const requiredFields: Array<keyof ProductFormData> = [
      "name",
      "price",
      "description",
      "category",
      "platformId",
      "status",
      "internCode",
    ];

    requiredFields.forEach((field) => {
      if (
        !formData[field] ||
        (typeof formData[field] === "string" && !formData[field]!.trim())
      ) {
        newErrors[field] = t(`${field}Required`);
      }
    });

    if (
      formData.price &&
      (!formData.price ||
        isNaN(Number(formData.price)) ||
        Number(formData.price) <= 0)
    ) {
      newErrors.price = t("invalidPrice");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    createProduct({
      name: formData.name,
      price: Number(formData.price),
      description: formData.description,
      imageUrl: formData.imageUrl || "",
      category: formData.category.toLowerCase(),
      platformId: formData.platformId,
      stock: Number(formData.stock),
      status: formData.status,
      internCode: formData.internCode,
    });

    console.log(`/products/${data._id}`);
    if (isSuccess) window.location.href = `/products/${data._id}`;
  };

  // Update handleChange to support select elements
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof ProductFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t("addProduct")}</CardTitle>
        <CardDescription>{t("addProductDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("name")}</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t("namePlaceholder")}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">{t("price")}</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              placeholder={t("pricePlaceholder")}
              className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">{t("stock")}</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              step="0.01"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              placeholder={t("stockPlaceholder")}
              className={errors.stock ? "border-red-500" : ""}
            />
            {errors.stock && (
              <p className="text-sm text-red-500">{errors.stock}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t("descriptionForm")}</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={t("descriptionPlaceholder")}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Category Select */}
          <div className="space-y-2">
            <Label htmlFor="category">{t("category")}</Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full border rounded px-2 py-1 ${
                errors.category ? "border-red-500" : ""
              }`}
              required>
              <option value="" disabled hidden>
                {t("categoryPlaceholder")}
              </option>
              {categoryArray.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Platform Select */}
          <div className="space-y-2">
            <Label htmlFor="platform">{t("platform")}</Label>
            <select
              id="platformId"
              name="platformId"
              value={formData.platformId}
              onChange={handleChange}
              className={`w-full border rounded px-2 py-1 ${
                errors.platformId ? "border-red-500" : ""
              }`}
              required>
              <option value="" disabled hidden>
                {t("platformPlaceholder")}
              </option>
              {platformArray &&
                platformArray.map((plat: Platform) => (
                  <option key={plat._id} value={plat._id}>
                    {plat._id} - {plat.name}
                  </option>
                ))}
            </select>
            {errors.platformId && (
              <p className="text-sm text-red-500">{errors.platformId}</p>
            )}
          </div>

          {/* Status Select */}
          <div className="space-y-2">
            <Label htmlFor="status">{t("status")}</Label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full border rounded px-2 py-1 ${
                errors.status ? "border-red-500" : ""
              }`}
              required>
              <option value="" disabled hidden>
                {t("statusPlaceholder")}
              </option>
              {statusArray.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="internCode">{t("internCode")}</Label>
            <Input
              id="internCode"
              name="internCode"
              value={formData.internCode}
              onChange={handleChange}
              placeholder={t("internCodePlaceholder")}
              className={errors.internCode ? "border-red-500" : ""}
            />
            {errors.internCode && (
              <p className="text-sm text-red-500">{errors.internCode}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? t("adding") : t("add")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
