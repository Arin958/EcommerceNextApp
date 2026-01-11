import React from 'react'
import { IProduct } from '@/types';

const BreadCrumb = ({product}: {product: IProduct}) => {
  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
       <nav className="text-sm text-gray-500 mb-4">
              <span className="hover:text-black transition-colors">Home</span>
              <span className="mx-2">/</span>
              <span className="hover:text-black transition-colors">Products</span>
              <span className="mx-2">/</span>
              <span className="text-black font-medium">{product.name}</span>
            </nav>
    </div>
  )
}

export default BreadCrumb
