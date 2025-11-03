'use client'

import { IProduct } from '@/types'
import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Card,
  CardContent
} from '@/components/ui/card'

import {
  Plus,
  Search,

} from 'lucide-react'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { StatsOverview } from './StateOverview'
import { SearchAndFilters } from './SearchAndFilters'
import { ProductCard } from './ProductCardAdmin'
import { Button } from '../ui/button'

interface AdminProductsPageProps {
  products: IProduct[];
}

const AdminProductsPage = ({ products }: AdminProductsPageProps) => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Get unique categories from products
  const categories = useMemo(() => {
  const uniqueCategories = Array.from(
    new Set(products.map(product => product.category).filter((c): c is string => Boolean(c)))
  );
  return uniqueCategories;
}, [products]);

  // Filter products based on search and filters
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
const matchesSearch =
  searchTerm === '' ||
  product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  product.sku?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory

      const matchesStatus = selectedStatus === 'all' ||
        (selectedStatus === 'published' && product.isPublished) ||
        (selectedStatus === 'draft' && !product.isPublished) ||
        (selectedStatus === 'featured' && product.isFeatured)

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [products, searchTerm, selectedCategory, selectedStatus])

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedStatus('all')
  }

  // Check if any filters are active
  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'all' || selectedStatus !== 'all'

  // Calculate stats for filtered products
  const stats = useMemo(() => {
   const totalStock = filteredProducts.reduce((sum, product) => sum + (product.stock ?? 0), 0);
const totalSold = filteredProducts.reduce((sum, product) => sum + (product.sold ?? 0), 0);
    const featuredCount = filteredProducts.filter(product => product.isFeatured).length

    return {
      totalProducts: filteredProducts.length,
      totalStock,
      totalSold,
      featuredCount
    }
  }, [filteredProducts])

  // Handle product actions
  const handleEdit = (product: IProduct) => {
    router.push(`/admin/products/edit/${product._id}`)
  }

  const handleDelete = async (product: IProduct) => {
    console.log(product)
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return

    try {
      const response = await fetch(`/api/products/delete/${product._id}`, {
        method: 'DELETE',
      })
      console.log(response,"response")

      const data = await response.json()
      console.log(data, "data")

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete product')
      }

      toast.success('Product deleted successfully')
      router.refresh()
    } catch (error: unknown) {
      console.log(error)
      let message = 'Something went wrong'
      if (typeof error === 'string') message = error
      else if (error instanceof Error) message = error.message
      
      toast.error(message)
    }
  }

  const handleView = (product: IProduct) => {
    router.push(`/products/${product._id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground mt-2">
          Manage your product inventory and listings
          {hasActiveFilters && (
            <span className="text-sm text-blue-600 ml-2">
              ({filteredProducts.length} of {products.length} products)
            </span>
          )}
        </p>
      </div>

      {/* Stats Overview */}
      <StatsOverview stats={stats} />

      {/* Search and Filters */}
      <SearchAndFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        categories={categories}
        hasActiveFilters={hasActiveFilters}
        clearFilters={clearFilters}
      />

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product._id.toString()}
            product={product}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        ))}
      </div>

      {/* No results state */}
      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="w-24 h-24 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">
              {hasActiveFilters
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Get started by creating your first product listing."
              }
            </p>
            {hasActiveFilters ? (
              <Button onClick={clearFilters} variant="outline">
                Clear all filters
              </Button>
            ) : (
              <Button asChild>
                <Link href="/admin/products/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AdminProductsPage