'use client'

import React from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'

interface ProductImageProps {
  thumbnail: string
  name: string
  isFeatured: boolean
  isPublished: boolean
  averageRating: number
}

export const ProductImage: React.FC<ProductImageProps> = ({
  thumbnail,
  name,
  isFeatured,
  isPublished,
  averageRating,
}) => {
  return (
    <div className="relative">
      <Image
        src={thumbnail}
        alt={name}
        className="w-full h-48 object-cover"
        width={600}
        height={600}
      />
      <div className="absolute top-3 left-3 flex gap-2">
        {isFeatured && (
          <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        )}
        <Badge variant={isPublished ? "default" : "secondary"}>
          {isPublished ? 'Published' : 'Draft'}
        </Badge>
      </div>
      <div className="absolute top-3 right-3">
        <Badge variant="secondary" className="bg-black/50 text-white hover:bg-black/60">
          <Star className="w-3 h-3 mr-1 fill-current" />
          {averageRating}
        </Badge>
      </div>
    </div>
  )
}