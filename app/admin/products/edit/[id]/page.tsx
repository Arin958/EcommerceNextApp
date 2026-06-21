
import { Product } from '@/schema/schema'



import { EditProductForm } from '@/components/admin/EditProductForm'

interface EditProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  const product = await Product.findById(id).lean();

  console.log(product, "product");

  if (!product) {
    return <div>Product not found</div>;
  }

  const serializedProduct = JSON.parse(JSON.stringify(product));

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
  );
}