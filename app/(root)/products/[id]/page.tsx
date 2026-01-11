

import { Product } from '@/schema/schema';

import React from 'react';
import { IProduct } from '@/types';
import ProductDetail from '@/components/ProductDetails';
import connectDB from '@/lib/mongodb';
import ProductList from '@/components/ProductList';
import BreadCrumb from '@/components/BreadCrumb';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  await connectDB();
  const { id } = await params;

  const product = await Product.findById(id).lean<IProduct>();
  const productData = product ? JSON.parse(JSON.stringify(product)) : null;

  const similarProduct = await Product.find({
  category: product?.category,
  _id: { $ne: product?._id }
})
  .limit(4) // optional but recommended
  .lean<IProduct[]>();
  const similarProductData = similarProduct ? JSON.parse(JSON.stringify(similarProduct)) : null
  console.log(similarProduct,"similarProduct")

  
  if (!product) return <div>Product not found</div>;

  return <>
  <BreadCrumb product={productData} />
  <ProductDetail product={productData} />;
  <ProductList product={similarProductData} title="Similar Products" />
  </>
};



export default Page;
