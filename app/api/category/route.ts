import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Product } from '@/schema/schema'

export async function GET() {
  try {
    await connectDB()
    
    // Get distinct categories from published products
    const categories = await Product.distinct('category', { 
      isPublished: true 
    }).sort()

    // Filter out any null/undefined categories and sort alphabetically
    const filteredCategories = categories
      .filter(category => category && category.trim() !== '')
      .sort()

    return NextResponse.json({ 
      categories: filteredCategories
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { message: 'Error fetching categories' },
      { status: 500 }
    )
  }
}