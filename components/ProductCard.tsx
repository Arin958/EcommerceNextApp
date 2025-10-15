"use client"

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, Eye, Zap, Shield, Truck } from "lucide-react";
import { IProduct } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface Props {
  product: IProduct;
}

const ProductCard: React.FC<Props> = ({ product }) => {

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);


  if (!product) return null;

  const imageUrl = product.images?.[currentImageIndex] || product.thumbnail || "/fallback.jpg";
const hasDiscount = product.discountPrice !== undefined && product.discountPrice < product.price;
const discountPercentage = hasDiscount
  ? Math.round(((product.price - (product.discountPrice ?? 0)) / product.price) * 100)
  : 0;


  const isLowStock = product.stock < 20;

  return (
    <TooltipProvider>
      <Card className="group relative overflow-hidden border border-gray-200/50 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
        {/* Header Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">

          {hasDiscount && (
            <Badge className="bg-black hover:bg-red-600 text-white border-0 shadow-lg text-sm font-bold">
              -{discountPercentage}%
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-300 ${isWishlisted ? "text-red-500" : "text-gray-600"
            }`}
          onClick={() => setIsWishlisted(!isWishlisted)}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
        </Button>

        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <Link href={`/products/${product._id}`}>
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110 cursor-pointer"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              priority={product.isFeatured}
            />
          </Link>

          {/* Image Thumbnails for variants */}
          {product.images && product.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {product.images.slice(0, 3).map((image, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? "bg-white scale-125" : "bg-white/60"
                    }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImageIndex(index);
                  }}
                />
              ))}
            </div>
          )}

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Link href={`/products/${product._id}`}>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Eye className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Quick View</p>
                </TooltipContent>
              </Tooltip>
            </Link>
          </div>

          {/* Stock Indicator */}
          {isLowStock && product.stock > 0 && (
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
              <Badge variant="destructive" className="text-xs animate-pulse">
                ⚠️ Only {product.stock} left!
              </Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <CardContent className="p-4 space-y-3">
          {/* Brand */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs font-medium text-gray-600">
              {product.brand}
            </Badge>
            {product.isFeatured && (
              <Zap className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            )}
          </div>

          {/* Product Name */}
          <Link href={`/products/${product._id}`}>
            <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight hover:text-blue-600 transition-colors text-sm min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3 w-3 ${star <= Math.floor(product.averageRating || 0)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                      }`}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-gray-700">
                {product.averageRating?.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-gray-500">({product.totalReviews})</span>
          </div>

          {/* Price Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-900">
                ${product.discountPrice || product.price}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.price}
                </span>
              )}
            </div>

            {/* Sold Count */}
            {product.sold > 0 && (
              <span className="text-xs text-gray-500">{product.sold}+ sold</span>
            )}
          </div>

          {/* Features */}
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Truck className="h-3 w-3" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>2-Year Warranty</span>
            </div>
          </div>

          {/* Variants Preview */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Colors:</span>
              <div className="flex gap-1">
                {product.variants.slice(0, 3).map((variant) => (
                  <Tooltip key={variant._id}>
                    <TooltipTrigger asChild>
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300 cursor-pointer"
                        style={{
                          backgroundColor: variant.color?.toLowerCase() === 'black' ? '#000' :
                            variant.color?.toLowerCase() === 'white' ? '#fff' : '#ccc'
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{variant.color} - {variant.size}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
                {product.variants.length > 3 && (
                  <span className="text-xs text-gray-500">+{product.variants.length - 3}</span>
                )}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
<Link href={`/products/${product._id}`}>
<Button className="w-full cursor-pointer">View Details</Button>
</Link>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default ProductCard;