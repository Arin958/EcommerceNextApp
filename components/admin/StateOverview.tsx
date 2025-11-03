'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Package, ShoppingCart, Star } from 'lucide-react'

interface StatsOverviewProps {
  stats: {
    totalProducts: number
    totalStock: number
    totalSold: number
    featuredCount: number
  }
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold mt-1">{stats.totalProducts}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Stock</p>
              <p className="text-2xl font-bold mt-1">{stats.totalStock}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Sold</p>
              <p className="text-2xl font-bold mt-1">{stats.totalSold}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Featured</p>
              <p className="text-2xl font-bold mt-1">{stats.featuredCount}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}