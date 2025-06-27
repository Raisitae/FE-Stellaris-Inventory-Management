import { createFileRoute } from "@tanstack/react-router";
import { RootLayout } from "@/components/layouts/RootLayout";
import SaleAddForm from "@/components/SaleAddForm/SaleAddForm";

export const Route = createFileRoute("/sales/add/")({
  component: AddSale,
});

function AddSale() {
  return (
    <RootLayout>
      <div className="container mx-auto py-8">
        <SaleAddForm />
      </div>
    </RootLayout>
  );
}
