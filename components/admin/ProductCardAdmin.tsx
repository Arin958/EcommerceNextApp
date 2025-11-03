'use client'

import { IProduct } from '@/types'
import React from 'react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import {

  Package,
  Calendar,
} from 'lucide-react'

import { ProductImage } from './ProductsImage'
import { ProductActions } from './ProductActions'
import { ProductStats } from './ProductState'
import { ProductTags } from './ProductTags'


interface ProductCardProps {
  product: IProduct
  onEdit?: (product: IProduct) => void
  onDelete?: (product: IProduct) => void
  onView?: (product: IProduct) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onView,
}) => {

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <CardHeader className="p-0">
        <ProductImage 
          thumbnail={product.thumbnail!}
          name={product.name!}
          isFeatured={product.isFeatured}
          isPublished={product.isPublished}
          averageRating={product.averageRating}
        />
      </CardHeader>

      <CardContent className="p-4">
        {/* Header with actions */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 mr-2">
            <CardTitle className="text-lg leading-tight line-clamp-2 mb-1">
              {product.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          </div>

          <ProductActions
            product={product}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
        </div>

        {/* Price and Brand */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">
              ${product.discountPrice || product.price}
            </span>
            {product.discountPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.price}
              </span>
            )}
          </div>
          <Badge variant="outline">
            {product.brand}
          </Badge>
        </div>

        {/* Stats */}
   <ProductStats
  stock={product.stock ?? product.variants?.[0]?.stock ?? 0}
  sold={product.sold ?? 0}
  totalReviews={product.totalReviews}
/>

        {/* Tags */}
        <ProductTags tags={product.tags} />

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-muted-foreground border-t pt-3">
          <div className="flex items-center gap-1">
            <Package className="w-3 h-3" />
            <span>{product.sku}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(product.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}