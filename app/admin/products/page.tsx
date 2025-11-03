
import AdminProductsPage from '@/components/admin/AdminProductsPage ';
import { Product } from '@/schema/schema';
import { IProduct } from '@/types';

const Page = async () => {
  const adminProducts = await Product.find({}).lean<IProduct[]>();

  // Ensure it's an array
  const adminProductsData = adminProducts ? JSON.parse(JSON.stringify(adminProducts)) : [];

  // Convert MongoDB object fields into serializable format
  const serializedProducts = adminProductsData.map((product: IProduct) => ({
    ...product,
    _id: product._id.toString(),
    createdAt: new Date(product.createdAt).toISOString(),
    updatedAt: new Date(product.updatedAt).toISOString(),
  }));

  return <AdminProductsPage products={serializedProducts} />;
};

export default Page;
