import { createFileRoute } from "@tanstack/react-router";
import ProductDetail from "@/components/ProductDetail/ProductDetail";

export const Route = createFileRoute("/products/$id")({
  component: Product,
});

function Product() {
  return (
    <div className="container mx-auto py-8">
      <ProductDetail />
    </div>
  );
}
