'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'

interface ProductTagsProps {
  tags?: string[]
}

export const ProductTags: React.FC<ProductTagsProps> = ({ tags = [] }) => {
  if (!tags.length) return null

  return (
    <div className="flex flex-wrap gap-1 mb-3">
      {tags.slice(0, 3).map((tag) => (
        <Badge key={tag} variant="secondary" className="text-xs">
          {tag}
        </Badge>
      ))}
      {tags.length > 3 && (
        <Badge variant="outline" className="text-xs">
          +{tags.length - 3}
        </Badge>
      )}
    </div>
  )
}