// app/admin/products/edit/[id]/page.tsx
import { Product } from '@/schema/schema'


import { notFound } from 'next/navigation'
import { EditProductForm } from '@/components/admin/EditProductForm'

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {


  const product = await Product.findById(params.id).lean()
  const serializedProduct = product ? JSON.parse(JSON.stringify(product)) : null

  if (!product) {
    notFound()
  }

  // Convert to plain object and handle _id

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground mt-2">
          Update product information and settings
        </p>
      </div>
      
      <EditProductForm product={serializedProduct} />
    </div>
  )
}