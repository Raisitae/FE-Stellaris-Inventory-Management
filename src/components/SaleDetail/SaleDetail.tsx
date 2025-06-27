import { useSaleWithProducts } from "@/lib/query/hooks/useProductQuery";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";
//mport { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { TableSaleItems } from "./TableSaleItems";
import { useLocation } from "@tanstack/react-router";

const SaleDetail = () => {
  const location = useLocation();
  const trimmedPath = location.pathname.replace(/^\/sales\//, "");
  const id = trimmedPath.split("/")[0];
  //const navigate = useNavigate();

  const { t } = useTranslation("sales");

  const { sale, products, error, isLoading } = useSaleWithProducts(id);

  const isError = error;

  if (isError) return <div>Error loading sale details.</div>;
  if (isLoading) return <div>Loading sale...</div>;
  if (!sale) return <div>Sale not found.</div>; // 👈 CAMBIO CLAVE

  return (
    <ErrorBoundary fallback={<div>Oh no! Something went wrong</div>}>
      <Card className="bg-card text-card-foreground">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => (window.location.href = `/sales/`)}
                aria-label={t("back", "Go back")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-2xl font-bold">
                {t("saleDetail", "Sale Detail")}
              </CardTitle>
            </div>
          </div>
          <CardDescription className="mb-4">
            {t("saleId", "Sale ID")}: {sale._id} <br />
            {t("date", "Date")}:{" "}
            {sale.date ? new Date(sale.date).toDateString() : "-"} <br />
            {t("total", "Total")}: ${sale.total?.toFixed(2) ?? "-"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow mt-8">
            <thead>
              <tr>
                <th className="px-4 py-2">{t("productName", "Product")}</th>
                <th className="px-4 py-2">{t("quantity", "Quantity")}</th>
                <th className="px-4 py-2">{t("platform", "Platform")}</th>
                <th className="px-4 py-2">{t("totalPrice", "Total Price")}</th>
                <th className="px-4 py-2">{t("stock", "Stock")}</th>
                <th className="px-4 py-2">{t("state", "State")}</th>
              </tr>
            </thead>
            <tbody>
              <TableSaleItems products={products} />
            </tbody>
          </table>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

export default SaleDetail;
