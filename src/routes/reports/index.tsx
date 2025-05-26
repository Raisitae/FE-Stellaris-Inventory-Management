import { RootLayout } from '@/components/layouts/RootLayout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/reports/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <RootLayout>
      <div>Hello "/reports/"!</div>
    </RootLayout>
  )
}