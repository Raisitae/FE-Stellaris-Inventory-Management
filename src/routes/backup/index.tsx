import { RootLayout } from '@/components/layouts/RootLayout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/backup/')({
  component: Backup,
})

function Backup() {
  return (
    <RootLayout>
      <div>Hello "/backup/"!</div>
    </RootLayout>
  )
}