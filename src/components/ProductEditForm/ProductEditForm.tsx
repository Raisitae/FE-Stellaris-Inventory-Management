import { useEffect, useState } from "react";
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
import { usePlatformsQuery } from "@/lib/query/hooks/usePlatformQuery";
import { useLocation, useNavigate } from "@tanstack/react-router";
import type { Platform } from "@/interfaces/platform";
import type { ProductFormData } from "@/interfaces/product";
import { useProductQuery } from "@/lib/query/hooks/useProductQuery";
import { usePatchProduct } from "@/lib/query/hooks/useProductMutation";

export default function ProductEditForm() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathSegments = location.pathname.split("/");
  const id = pathSegments[pathSegments.length - 1];
  const { t } = useTranslation("products");

  const categoryArray = getCategoryArray(t);
  const statusArray = getStatusArray(t);

  const { data: platformArray } = usePlatformsQuery();
  const { data: product, isLoading } = useProductQuery(id);

  const { mutate: updateProduct, isSuccess, isPending } = usePatchProduct();

  const [formData, setFormData] = useState<ProductFormData>({
    price: product?.price || 0,
    name: product?.name || "",
    description: product?.description || "",
    imageUrl: product?.imageUrl || "",
    category: product?.category || "",
    platformId: product?.platformId || "",
    stock: product?.stock || 0,
    status: product?.status || "",
    internCode: product?.internCode || "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductFormData, string | undefined>>
  >({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        description: product.description,
        imageUrl: product.imageUrl,
        category: product.category,
        platformId: product.platformId,
        stock: product.stock,
        status: product.status,
        internCode: product.internCode,
      });
    }
  }, [product]);

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

    if (!validateForm() || !id) {
      return;
    }

    updateProduct({
      id,
      newProduct: {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category.toLowerCase(),
      },
    });
  };

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

  useEffect(() => {
    if (isSuccess && id) {
      console.log(id);
      window.location.href = `/products/${id}`;
    }
  }, [isSuccess, id, navigate]);

  if (isLoading) return <div>{t("loading")}</div>;
  if (!product) return <div>{t("notFound")}</div>;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t("editProduct")}</CardTitle>
        <CardDescription>{t("editProductDescription")}</CardDescription>
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
              placeholder={product.name}
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
              value={formData.price}
              onChange={handleChange}
              placeholder={product.price?.toString()}
              className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("descriptionForm")}</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={product.description}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="stock">{t("stock")}</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              placeholder={product.stock?.toString()}
              className={errors.stock ? "border-red-500" : ""}
            />
            {errors.stock && (
              <p className="text-sm text-red-500">{errors.stock}</p>
            )}
          </div>

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
              placeholder={product.internCode}
              className={errors.internCode ? "border-red-500" : ""}
            />
            {errors.internCode && (
              <p className="text-sm text-red-500">{errors.internCode}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? t("updating") : t("update", "Update Product")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
