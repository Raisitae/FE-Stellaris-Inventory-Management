import { columns } from "../DataTableSales/columns";
import { DataTable } from "../DataTableSales/DataTable";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useSalesQuery } from "@/lib/query/hooks/useSalesQuery";

export default function SalesList() {
  const { data } = useSalesQuery();
  console.log("Sales Data:", data);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={<div>Error loading sales</div>}>
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={data || []} />
        </div>
      </ErrorBoundary>
    </Suspense>
  );
}
