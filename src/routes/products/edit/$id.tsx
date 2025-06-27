import { createFileRoute } from "@tanstack/react-router";
import { RootLayout } from "@/components/layouts/RootLayout";
import ProductEditForm from "@/components/ProductEditForm/ProductEditForm";

export const Route = createFileRoute("/products/edit/$id")({
  component: ProductEdit,
});

function ProductEdit() {
  return (
    <RootLayout>
      <div className="container mx-auto py-8">
        <ProductEditForm />
      </div>
    </RootLayout>
  );
}
