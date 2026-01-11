"use client";

import { Badge } from '@/components/ui/badge';
import { Star, Check, Package, Shield, Truck, RefreshCw } from 'lucide-react';
import { IProduct } from '@/types';
import { useState } from 'react';
import Image from 'next/image';
import AddToCartButton from './AddToCart';
import ReviewSection from './CommentSection';

const ProductDetail: React.FC<{ product: IProduct, reviewSection?: boolean }> = ({ product, reviewSection = true }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    product?.images?.[0] ?? null
  );
  const [selectedColor, setSelectedColor] = useState(product.variants?.[0]?.color || '');
  const [selectedSize, setSelectedSize] = useState(product.variants?.[0]?.size || '');

  // Filter variants by selected color
  const availableVariants = product.variants?.filter(v => v.color === selectedColor) || [];
  const currentVariant = availableVariants.find(v => v.size === selectedSize);

  // Calculate discount percentage
  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <>
      <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Product Header */}
          <div className="mb-8">
           
            
            <div className="flex items-center justify-between">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">
                {product.name}
              </h1>
              {product.discountPrice && (
                <div className="bg-black text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                  SAVE {discountPercentage}%
                </div>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images Section */}
            <div>
              {/* Main Image */}
              <div className="relative border-4 border-black rounded-xl overflow-hidden mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group">
                {product.discountPrice && (
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-black text-white px-3 py-1 rounded-full font-bold text-sm">
                      SALE
                    </div>
                  </div>
                )}
                <Image
                  src={selectedImage!}
                  alt={product.name!}
                  width={800}
                  height={800}
                  className="object-cover w-full h-full aspect-square group-hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-4">
                {product?.images?.map((img, index) => (
                  <button
                    key={img}
                    onClick={() => setSelectedImage(img)}
                    className={`relative border-2 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 ${selectedImage === img 
                      ? 'border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                      : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} - Image ${index + 1}`}
                      width={120}
                      height={120}
                      className="object-cover w-full h-24"
                    />
                    {selectedImage === img && (
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-white border-2 border-black p-4 rounded-lg text-center hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-black" />
                  <p className="text-xs font-bold">FREE SHIPPING</p>
                </div>
                <div className="bg-white border-2 border-black p-4 rounded-lg text-center hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
                  <Package className="w-6 h-6 mx-auto mb-2 text-black" />
                  <p className="text-xs font-bold">EASY RETURNS</p>
                </div>
                <div className="bg-white border-2 border-black p-4 rounded-lg text-center hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-black" />
                  <p className="text-xs font-bold">1-YEAR WARRANTY</p>
                </div>
                <div className="bg-white border-2 border-black p-4 rounded-lg text-center hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
                  <RefreshCw className="w-6 h-6 mx-auto mb-2 text-black" />
                  <p className="text-xs font-bold">30-DAY EXCHANGE</p>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Rating & Reviews */}
              <div className="flex items-center justify-between pb-6 border-b-2 border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-6 w-6 ${i < Math.round(product.averageRating) 
                          ? 'fill-black text-black' 
                          : 'fill-gray-300 text-gray-300'
                        } transition-all duration-200`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-bold text-gray-700">
                    {product.averageRating.toFixed(1)}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    <span className="font-bold">{product.totalReviews}</span> verified reviews
                  </div>
                  <div className="text-xs text-gray-500">
                    • Based on customer feedback
                  </div>
                </div>
              </div>

              {/* Price Section */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  {product.discountPrice ? (
                    <>
                      <span className="text-5xl font-black">${product.discountPrice}</span>
                      <span className="text-2xl line-through text-gray-400 font-medium">
                        ${product.price}
                      </span>
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Save ${(product.price - product.discountPrice).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-5xl font-black">${product.price}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  All prices include VAT • Free shipping on orders over $50
                </p>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-xl font-black tracking-wide">PRODUCT DETAILS</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              {/* Variants Section */}
              <div className="space-y-8">
                {/* Color Selection */}
                {product.variants && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">SELECT COLOR</h3>
                      <span className="text-sm text-gray-600">
                        {selectedColor || 'Select color'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {Array.from(new Set(product.variants.map(v => v.color))).map(color => (
                        <button
                          key={color}
                          onClick={() => {
                            setSelectedColor(color || '');
                            setSelectedSize(
                              product.variants?.find(v => v.color === color)?.size || selectedSize
                            );
                          }}
                          className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 border-2 ${
                            selectedColor === color 
                              ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                              : 'bg-white text-gray-800 border-gray-300 hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                          }`}
                        >
                          {color}
                          {selectedColor === color && (
                            <Check className="w-4 h-4 inline ml-2" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                {availableVariants.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">SELECT SIZE</h3>
                      <span className="text-sm text-gray-600">
                        {selectedSize || 'Select size'}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                      {availableVariants.map(v => (
                        <button
                          key={v.size}
                          onClick={() => setSelectedSize(v.size || '')}
                          className={`py-3 rounded-lg font-bold transition-all duration-300 border-2 ${
                            selectedSize === v.size 
                              ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                              : `bg-white text-gray-800 border-gray-300 hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                                  !v.stock ? 'opacity-50 cursor-not-allowed' : ''
                                }`
                          }`}
                          disabled={!v.stock}
                        >
                          {v.size}
                          {selectedSize === v.size && (
                            <Check className="w-4 h-4 block mx-auto mt-1" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Stock & Add to Cart */}
              <div className="space-y-6 pt-6 border-t-2 border-gray-200">
                {/* Stock Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${currentVariant?.stock && currentVariant.stock > 0 
                      ? 'bg-green-500 animate-pulse' 
                      : 'bg-red-500'
                    }`} />
                    <span className={`font-bold text-lg ${currentVariant?.stock && currentVariant.stock > 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                    }`}>
                      {currentVariant?.stock ? `${currentVariant.stock} units available` : 'Out of stock'}
                    </span>
                  </div>
                  {currentVariant?.stock && currentVariant.stock < 10 && currentVariant.stock > 0 && (
                    <span className="text-sm text-red-600 font-bold">• LOW STOCK</span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <AddToCartButton 
                  product={product} 
                  selectedSize={selectedSize!} 
                  selectedColor={selectedColor!} 
                />
              </div>

              {/* Tags & Collections */}
              <div className="space-y-6 pt-6 border-t-2 border-gray-200">
                {/* Tags */}
                {product.tags && (
                  <div>
                    <h4 className="font-bold text-gray-700 mb-3">PRODUCT TAGS</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map(tag => (
                        <Badge 
                          key={tag}
                          variant="outline"
                          className="border-2 border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all duration-300 px-4 py-2 font-medium"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Collections */}
                {product.collections && (
                  <div>
                    <h4 className="font-bold text-gray-700 mb-3">COLLECTIONS</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.collections.map(col => (
                        <Badge 
                          key={col}
                          className="bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-all duration-300 px-4 py-2 font-bold"
                        >
                          {col}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Product Specs */}
              <div className="bg-white border-2 border-black rounded-xl p-6 space-y-4">
                <h4 className="text-lg font-black">QUICK SPECS</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">SKU</p>
                    <p className="font-bold">PROD-{product._id?.slice(-8).toUpperCase()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="font-bold">1.2 kg</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Dimensions</p>
                    <p className="font-bold">30 × 20 × 15 cm</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Material</p>
                    <p className="font-bold">Premium Quality</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {reviewSection && (
        <ReviewSection
          productId={product._id as string}
        />
      )}

    
    </>
  );
};

export default ProductDetail;