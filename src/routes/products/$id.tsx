import { createFileRoute, useLoaderData } from '@tanstack/react-router'

export const Route = createFileRoute('/products/$id')({
  loader: ({ params }) => {
    return { id: params.id }
  },
  component: Product,
})

function Product() {
  const { id } = useLoaderData({ from: '/products/$id' })
  return (
    <div className="p-2">
      <h3>Product {id}</h3>
    </div>
  )
}
