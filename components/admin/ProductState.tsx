'use client'

import React from 'react'

interface ProductStatsProps {
  stock: number
  sold: number
  totalReviews: number
}

export const ProductStats: React.FC<ProductStatsProps> = ({
  stock,
  sold,
  totalReviews,
}) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-3">
      <div className="text-center">
        <div className="font-semibold text-sm">{stock}</div>
        <div className="text-xs text-muted-foreground">Stock</div>
      </div>
      <div className="text-center">
        <div className="font-semibold text-sm">{sold}</div>
        <div className="text-xs text-muted-foreground">Sold</div>
      </div>
      <div className="text-center">
        <div className="font-semibold text-sm">{totalReviews}</div>
        <div className="text-xs text-muted-foreground">Reviews</div>
      </div>
    </div>
  )
}