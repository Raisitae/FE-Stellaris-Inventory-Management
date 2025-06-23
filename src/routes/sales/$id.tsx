import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sales/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/sales/$id"!</div>;
}
