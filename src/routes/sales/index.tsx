import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sales/')({
  component: Sales,
})

function Sales() {
  return <div>Hello "/sales/"!</div>
}
