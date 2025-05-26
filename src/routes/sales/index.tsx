import { RootLayout } from '@/components/layouts/RootLayout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sales/')({
  component: Sales,
})

function Sales() {
  return (
    <RootLayout>
      <div>Hello "/sales/"!</div>
    </RootLayout>
  )
}
