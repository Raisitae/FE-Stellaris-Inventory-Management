import { useLocation, useNavigate } from "@tanstack/react-router";
import { Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useProductQuery } from "@/lib/query/hooks/useProductQuery";
import { useDeleteProduct } from "@/lib/query/hooks/useProductMutation";

const ProductDetail = () => {
  const location = useLocation();
  const trimmedPath = location.pathname.replace(/^\/products\//, "");
  const id = trimmedPath.split("/")[0];

  const { data, isLoading, error } = useProductQuery(id);
  const navigate = useNavigate();
  const { t } = useTranslation("products");
  const { mutate, isSuccess } = useDeleteProduct();

  const handleDelete = (id: string) => () => {
    if (!id) return;
    if (
      window.confirm(
        t("confirmDelete", "Are you sure you want to delete this product?")
      )
    ) {
      mutate(id);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      window.location.href = `/products/`;
    }
  }, [isSuccess]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading product</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={<div>Oh no! Something went wrong</div>}>
        <Card className="bg-card text-card-foreground">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => (window.location.href = `/products/`)}
                  className="cursor-pointer"
                  aria-label={t("back", "Go back")}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="text-2xl font-bold">
                  {data?.name}
                </CardTitle>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigate({
                      to: "/products/edit/$id",
                      params: { id: data?._id || "" },
                    })
                  }
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
                  <Edit className="mr-2 h-4 w-4" />
                  {t("edit", "Edit")}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete(data?._id || "")}
                  className="cursor-pointer">
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("delete", "Delete")}
                </Button>
              </div>
            </div>

            <CardDescription className="mb-4">
              {data?.description ||
                t("noDescription", "No description available.")}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-muted-foreground">
                    {t("price", "Price")}
                  </h3>
                  <p className="text-2xl font-bold">
                    ${data?.price.toFixed(2)}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-muted-foreground">
                    {t("category", "Category")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {data?.category}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-muted-foreground">
                    {t("platformId", "Platform ID")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {data?.platformId}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-muted-foreground">
                    {t("stock", "Stock")}
                  </h3>
                  <p className="text-sm text-muted-foreground">{data?.stock}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-muted-foreground">
                    {t("status", "Status")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {data?.status}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-muted-foreground">
                    {t("internCode", "Internal Code")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {data?.internCode}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-muted-foreground">
                    {t("productId", "Product ID")}
                  </h3>
                  <p className="text-sm text-muted-foreground">{data?._id}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </ErrorBoundary>
    </Suspense>
  );
};

export default ProductDetail;
