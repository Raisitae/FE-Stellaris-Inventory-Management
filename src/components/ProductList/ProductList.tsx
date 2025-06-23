import { useNavigate } from "@tanstack/react-router";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { useProductsQuery } from "@/lib/query/hooks/useProductQuery";

interface Product {
  id: string;
  name: string;
  price: number;
}

const ProductList = () => {
  const { data } = useProductsQuery();
  const navigate = useNavigate();
  const { t } = useTranslation("products");

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={<div>Oh no! Something went wrong</div>}>
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <div>
              <CardTitle className="text-2xl font-bold">
                {t("title", "Products")}
              </CardTitle>
              <CardDescription className="mt-1">
                {t("description", "View and manage your product inventory")}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-[50%] font-medium text-muted-foreground">
                      {t("name", "Name")}
                    </TableHead>
                    <TableHead className="text-right font-medium text-muted-foreground">
                      {t("price", "Price")}
                    </TableHead>
                    <TableHead className="text-right font-medium text-muted-foreground">
                      {t("actions", "Actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.map((product: Product) => (
                    <TableRow key={product.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-right">
                        ${product.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate({
                              to: "/products/$id",
                              params: { id: product.id },
                            })
                          }
                          className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
                          {t("viewDetails", "View Details")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Button
              onClick={() => navigate({ to: "/products/add" })}
              className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              {t("addProduct", "Add Product")}
            </Button>
          </CardContent>
        </Card>
      </ErrorBoundary>
    </Suspense>
  );
};

export default ProductList;
