import { createFileRoute } from '@tanstack/react-router'
import ProductAddForm from '@/components/ProductAddForm/ProductAddForm'
import { RootLayout } from '@/components/layouts/RootLayout'

export const Route = createFileRoute('/products/add/')({
  component: AddProduct,
})

function AddProduct() {
  return (
    <RootLayout>
      <div className="container mx-auto py-8">
        <ProductAddForm />
      </div>
    </RootLayout>
  )
}
