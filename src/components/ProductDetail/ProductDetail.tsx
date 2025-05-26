import { useNavigate } from "@tanstack/react-router";
import { useGetProductById } from "../../queries/getProductById";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

const ProductDetail = () => {
  const { data, isLoading, error } = useGetProductById();
  const navigate = useNavigate();
  const { t } = useTranslation("products");

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
                  onClick={() => navigate({ to: '/products' })}
                  className="cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle className="text-2xl font-bold">{data?.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {t("productDetails", "Product Details")}
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate({ to: '/products/$id', params: { id: data?.id } })}
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {t("edit", "Edit")}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    // TODO: Implement delete functionality
                    console.log('Delete product:', data?.id);
                  }}
                  className="cursor-pointer"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("delete", "Delete")}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <h3 className="text-lg font-medium text-muted-foreground">{t("price", "Price")}</h3>
                <p className="text-2xl font-bold">${data?.price.toFixed(2)}</p>
              </div>
              <div className="grid gap-2">
                <h3 className="text-lg font-medium text-muted-foreground">{t("id", "Product ID")}</h3>
                <p className="text-sm text-muted-foreground">{data?.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </ErrorBoundary>
    </Suspense>
  );
};

export default ProductDetail; 