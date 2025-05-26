import { RootLayout } from "@/components/layouts/RootLayout";
import ProductList from "@/components/ProductList/ProductList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/products/")({
  component: Products,
});

function Products() {
  return (
    <RootLayout>
      <div className="container mx-auto py-8">
        <ProductList />
      </div>
    </RootLayout>
  );
}
