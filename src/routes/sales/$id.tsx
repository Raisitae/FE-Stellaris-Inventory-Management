import SaleDetail from "@/components/SaleDetail/SaleDetail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sales/$id")({
  component: Sale,
});

function Sale() {
  return (
    <div className="container mx-auto py-8">
      <SaleDetail />
    </div>
  );
}

export default Sale;
