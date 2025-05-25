import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/products/add/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/products/add/"!</div>
}
