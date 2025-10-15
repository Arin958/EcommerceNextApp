"use client"

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { IProduct } from '@/types';
import { useState } from 'react';
import Image from 'next/image';
import AddToCartButton from './AddToCart';

const ProductDetail: React.FC<{ product: IProduct }> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedColor, setSelectedColor] = useState(product.variants?.[0]?.color || '');
  const [selectedSize, setSelectedSize] = useState(product.variants?.[0]?.size || '');


  // Filter variants by selected color
  const availableVariants = product.variants?.filter(v => v.color === selectedColor) || [];
  const currentVariant = availableVariants.find(v => v.size === selectedSize);

  return (
    <div className="container mx-auto p-4 grid md:grid-cols-2 gap-8">
      {/* Images */}
      <div>
        <div className="border rounded-lg overflow-hidden mb-4">
          <Image
            src={selectedImage}
            alt={product.name}
            width={600}
            height={600}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex space-x-2">
          {product.images.map(img => (
            <Image
              key={img}
              src={img}
              alt={product.name}
              width={100}
              height={100}
              className={`object-cover w-20 h-20 rounded-lg cursor-pointer border ${selectedImage === img ? 'border-blue-500' : 'border-gray-200'
                }`}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>

        <div className="flex items-center space-x-2">
          <span className="flex items-center space-x-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < Math.round(product.averageRating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
              />
            ))}
          </span>
          <span className="text-gray-500">{product.totalReviews} reviews</span>
        </div>

        <div className="flex items-center space-x-4">
          {product.discountPrice ? (
            <>
              <span className="text-2xl font-bold text-red-600">${product.discountPrice}</span>
              <span className="line-through text-gray-400">${product.price}</span>
            </>
          ) : (
            <span className="text-2xl font-bold">${product.price}</span>
          )}
        </div>

        <p className="text-gray-700">{product.description}</p>

        {/* Color Selection */}
        {product.variants && (
          <div>
            <h3 className="font-semibold mb-2">Color:</h3>
            <div className="flex space-x-2">
              {Array.from(new Set(product.variants.map(v => v.color))).map(color => (
                <Badge
                  key={color}
                  variant={selectedColor === color ? 'default' : 'outline'}
                  onClick={() => {
                    setSelectedColor(color || '');
                    setSelectedSize(
                      product.variants?.find(v => v.color === color)?.size || selectedSize
                    );
                  }}
                  className="cursor-pointer"
                >
                  {color}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Size Selection */}
        {availableVariants.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Size:</h3>
            <div className="flex space-x-2">
              {availableVariants.map(v => (
                <Badge
                  key={v.size}
                  variant={selectedSize === v.size ? 'default' : 'outline'}
                  onClick={() => setSelectedSize(v.size || '')}
                  className="cursor-pointer"
                >
                  {v.size}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Stock Info */}
        <div>
          <span
            className={`font-semibold ${currentVariant && currentVariant.stock && currentVariant.stock > 0
                ? 'text-green-600'
                : 'text-red-600'
              }`}
          >
            {currentVariant?.stock ? `${currentVariant.stock} in stock` : 'Out of stock'}
          </span>
        </div>


        <AddToCartButton product={product} selectedSize={selectedSize!} selectedColor={selectedColor!} />

        {/* Tags */}
        {product.tags && (
          <div className="flex space-x-2 mt-4">
            {product.tags.map(tag => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Collections */}
        {product.collections && (
          <div className="flex space-x-2 mt-2">
            {product.collections.map(col => (
              <Badge key={col}>{col}</Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;