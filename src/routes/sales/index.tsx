import { RootLayout } from "@/components/layouts/RootLayout";
import SalesList from "@/components/SalesList/SalesList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sales/")({
  component: Sales,
});

function Sales() {
  return (
    <RootLayout>
      <div className="container mx-auto py-8">
        <SalesList />
      </div>
    </RootLayout>
  );
}
