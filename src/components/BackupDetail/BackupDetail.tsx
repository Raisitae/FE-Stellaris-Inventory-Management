import React from "react";
import { Button } from "@/components/ui/button";
import { useSalesQuery } from "@/lib/query/hooks/useSalesQuery";
import { useProductsQuery } from "@/lib/query/hooks/useProductQuery";

function arrayToCSV(data: unknown[], title: string): string {
  if (!data || data.length === 0) return "";
  const headers = Object.keys(data[0] as object);
  const csvRows = [
    [`# ${title}`],
    headers,
    ...data.map((row) =>
      headers
        .map((header) =>
          JSON.stringify((row as Record<string, unknown>)[header] ?? "")
        )
        .join(",")
    ),
    [],
  ];
  return csvRows
    .map((row) => (Array.isArray(row) ? row.join(",") : row))
    .join("\n");
}

function downloadCSV(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const BackupDetail: React.FC = () => {
  const {
    data: products,
    isLoading: loadingProducts,
    error: errorProducts,
  } = useProductsQuery();
  const {
    data: sales,
    isLoading: loadingSales,
    error: errorSales,
  } = useSalesQuery();

  const handleDownload = () => {
    let csvContent = "";
    if (Array.isArray(products) && products.length > 0) {
      csvContent += arrayToCSV(products, "Productos");
    }
    if (Array.isArray(sales) && sales.length > 0) {
      csvContent += arrayToCSV(sales, "Ventas");
    }
    if (csvContent) {
      downloadCSV("backup_inventario.csv", csvContent);
    }
  };

  if (loadingProducts || loadingSales) {
    return (
      <div className="container mx-auto py-10 text-center">
        Cargando datos para backup...
      </div>
    );
  }

  if (errorProducts || errorSales) {
    return (
      <div className="container mx-auto py-10 text-center text-red-500">
        Error cargando productos o ventas.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center gap-6">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">
            Backup de Inventario
          </h2>
          <p className="mb-6 text-gray-600">
            Descarga un respaldo en CSV de todos tus productos y ventas
            actuales. Puedes usar este archivo para restaurar tu inventario o
            analizar tus datos fuera de la plataforma.
          </p>
          <div className="flex justify-center">
            <Button onClick={handleDownload}>
              Descargar backup CSV de productos y ventas
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupDetail;
