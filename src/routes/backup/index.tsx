import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/backup/')({
  component: Backup,
})

function Backup() {
  return <div>Hello "/backup/"!</div>
}
