// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';


import { uploadMultipleToCloudinary, uploadToCloudinary } from '@/lib/cloudinary';
import slugify from 'slugify';
import connectDB from '@/lib/mongodb';
import { Product, User } from '@/schema/schema';
import { auth } from '@clerk/nextjs/server';


export const maxBodySize = '10mb';


export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const {userId} = await auth();

    if(!userId) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

        const user = await User.findOne({ clerkId: userId }); // adjust if you use _id or email
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Access denied: Admins only" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    
    // Extract text fields
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const sku = formData.get('sku') as string;
    const brand = formData.get('brand') as string;
    const category = formData.get('category') as string;
    const price = parseFloat(formData.get('price') as string);
    const discountPrice = formData.get('discountPrice') 
      ? parseFloat(formData.get('discountPrice') as string) 
      : undefined;
    const stock = formData.get('stock') 
      ? parseInt(formData.get('stock') as string) 
      : 0;
    
    // Extract array fields
    const tags = formData.get('tags') 
      ? (formData.get('tags') as string).split(',').map(tag => tag.trim())
      : [];
    const collections = formData.get('collections')
      ? (formData.get('collections') as string).split(',').map(collection => collection.trim())
      : [];

    // Extract boolean fields
    const isFeatured = formData.get('isFeatured') === 'true';
    const isPublished = formData.get('isPublished') !== 'false'; // default to true

    // Extract variants
    const variantsJson = formData.get('variants') as string;
    const variants = variantsJson ? JSON.parse(variantsJson) : [];

    // Extract meta fields
    const metaTitle = formData.get('metaTitle') as string;
    const metaDescription = formData.get('metaDescription') as string;

    // Handle image uploads
    const imageFiles = formData.getAll('images') as File[];
    const thumbnailFile = formData.get('thumbnail') as File;

    // Validate required fields
    if (!name || !description || !sku || !category || !price) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields: name, description, sku, category, price' 
        },
        { status: 400 }
      );
    }

    if (!imageFiles.length || !thumbnailFile) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Images and thumbnail are required' 
        },
        { status: 400 }
      );
    }

    // Validate price and discount
    if (discountPrice && discountPrice >= price) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Discount price must be less than regular price' 
        },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = slugify(name, { 
      lower: true, 
      strict: true,
      trim: true
    });

    // Check for existing product with same slug or SKU
    const existingProduct = await Product.findOne({
      $or: [
        { slug },
        { sku }
      ]
    });

    if (existingProduct) {
      return NextResponse.json(
        { 
          success: false, 
          message: existingProduct.slug === slug ? 
            'Product with this name already exists' : 
            'Product with this SKU already exists'
        },
        { status: 409 }
      );
    }

    // Upload images to Cloudinary
    const [uploadedImages, uploadedThumbnail] = await Promise.all([
      uploadMultipleToCloudinary(imageFiles),
      uploadToCloudinary(thumbnailFile)
    ]);

    // Validate that thumbnail is in images array
    const allImages = [...uploadedImages];
    if (!allImages.includes(uploadedThumbnail)) {
      allImages.push(uploadedThumbnail);
    }

    // Create new product
    const newProduct = new Product({
      name,
      slug,
      description,
      sku,
      brand: brand || undefined,
      category,
      images: allImages,
      thumbnail: uploadedThumbnail,
      price,
      discountPrice: discountPrice || undefined,
      stock,
      variants: variants || [],
      tags,
      collections,
      averageRating: 0,
      totalReviews: 0,
      isFeatured,
      isPublished,
      metaTitle: metaTitle || undefined,
      metaDescription: metaDescription || undefined,
    });

    // Save to database
    const savedProduct = await newProduct.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Product created successfully',
        data: savedProduct
      },
      { status: 201 }
    );

  } catch (error: unknown) {

    let message = 'Something went wrong';
    if (typeof error === 'string') message = error;
    else if (error instanceof Error) message = error.message;
    console.error('Error creating product:', message);

   return NextResponse.json(
     {
       success: false,
       message: 'Error creating product'
     },
     { status: 500 }
   )
 
  }
}

// Optional: Add GET method to fetch products
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({ isPublished: true }).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: products
    });
  } catch (error: unknown) {
    let message = 'Something went wrong';
    if (typeof error === 'string') message = error;
    else if (error instanceof Error) message = error.message;
    console.log(message)
    return NextResponse.json(

      {
        success: false,
        message: 'Error fetching products'
      },
      { status: 500 }
    );
  }
}