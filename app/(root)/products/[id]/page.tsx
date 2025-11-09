

import { Product } from '@/schema/schema';

import React from 'react';
import { IProduct } from '@/types';
import ProductDetail from '@/components/ProductDetails';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const product = await Product.findById(id).lean<IProduct>();
  const productData = product ? JSON.parse(JSON.stringify(product)) : null;
  if (!product) return <div>Product not found</div>;

  return <ProductDetail product={productData} />;
};



export default Page;
