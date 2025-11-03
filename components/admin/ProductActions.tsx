'use client'

import React from 'react'
import { IProduct } from '@/types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react'

interface ProductActionsProps {
  product: IProduct
  onEdit?: (product: IProduct) => void
  onDelete?: (product: IProduct) => void
  onView?: (product: IProduct) => void
}

export const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onView?.(product)}>
          <Eye className="w-4 h-4 mr-2" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit?.(product)}>
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-red-600"
          onClick={() => onDelete?.(product)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}