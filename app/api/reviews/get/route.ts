import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Review } from '@/schema/schema';


// GET - Get all reviews with filtering, sorting and pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const rating = searchParams.get('rating') ? parseInt(searchParams.get('rating')!) : undefined;

    const skip = (page - 1) * limit;

    // Build filter object
    const filter: { productId?: string; rating?: number } = {};
    if (productId) filter.productId = productId;
    if (rating) filter.rating = rating;

    // Build sort object
   const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get reviews with pagination
    const reviews = await Review.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Review.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error: unknown) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching reviews',
      },
      { status: 500 }
    );
  }
}