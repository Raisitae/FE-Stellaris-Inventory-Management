import { useProductsQuery } from "@/lib/query/hooks/useProductQuery";
import { columns } from "../DataTableProducts/columns";
import { DataTable } from "../DataTableProducts/DataTable";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function ProductList2() {
  const { data } = useProductsQuery();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={<div>Error loading products</div>}>
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={Array.isArray(data) ? data : []} />
        </div>
      </ErrorBoundary>
    </Suspense>
  );
}
