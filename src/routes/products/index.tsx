import { RootLayout } from "@/components/layouts/RootLayout";
import ProductList from "@/components/ProductList/ProductList";
import ProductList2 from "@/components/ProductList/ProductList2";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/products/")({
  component: Products,
});

function Products() {
  return (
    <RootLayout>
      <div className="container mx-auto py-8">
        <p>ProductList</p>
        <ProductList2 />
      </div>
    </RootLayout>
  );
}
