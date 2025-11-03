import { uploadMultipleToCloudinary, uploadToCloudinary, deleteMultipleFromCloudinary } from "@/lib/cloudinary";
import connectDB from "@/lib/mongodb";
import { Product, User } from "@/schema/schema";
import { IProduct } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Access denied: Admins only" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    
    // Extract product ID
    const productId = formData.get('productId') as string;
    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Find existing product
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Extract text fields (all optional for update)
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const sku = formData.get('sku') as string;
    const brand = formData.get('brand') as string;
    const category = formData.get('category') as string;
    const price = formData.get('price') ? parseFloat(formData.get('price') as string) : undefined;
    const discountPrice = formData.get('discountPrice') 
      ? formData.get('discountPrice') === '' 
        ? null 
        : parseFloat(formData.get('discountPrice') as string)
      : undefined;
    const stock = formData.get('stock') 
      ? parseInt(formData.get('stock') as string) 
      : undefined;
    
    // Extract array fields
    const tags = formData.get('tags') 
      ? (formData.get('tags') as string).split(',').map(tag => tag.trim())
      : undefined;
    const collections = formData.get('collections')
      ? (formData.get('collections') as string).split(',').map(collection => collection.trim())
      : undefined;

    // Extract boolean fields
    const isFeatured = formData.has('isFeatured') 
      ? formData.get('isFeatured') === 'true' 
      : undefined;
    const isPublished = formData.has('isPublished')
      ? formData.get('isPublished') !== 'false'
      : undefined;

    // Extract variants
    const variantsJson = formData.get('variants') as string;
    const variants = variantsJson ? JSON.parse(variantsJson) : undefined;

    // Extract meta fields
    const metaTitle = formData.get('metaTitle') as string;
    const metaDescription = formData.get('metaDescription') as string;

    // Handle image deletion
    const imagesToDeleteJson = formData.get('imagesToDelete') as string;
    const imagesToDelete = imagesToDeleteJson ? JSON.parse(imagesToDeleteJson) as string[] : [];
    const deleteThumbnail = formData.get('deleteThumbnail') === 'true';

    // Handle image uploads (optional for update)
    const imageFiles = formData.getAll('images') as File[];
    const thumbnailFile = formData.get('thumbnail') as File;

    // Validate SKU uniqueness if being updated
    if (sku && sku !== existingProduct.sku) {
      const skuExists = await Product.findOne({ 
        sku, 
        _id: { $ne: productId } 
      });
      if (skuExists) {
        return NextResponse.json(
          { success: false, message: 'Product with this SKU already exists' },
          { status: 409 }
        );
      }
    }

    // Validate price and discount if provided
    if (
      price !== undefined &&
      discountPrice !== undefined &&
      discountPrice !== null &&
      discountPrice >= price
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Discount price must be less than regular price',
        },
        { status: 400 }
      );
    }

    // Generate new slug if name is being updated
    let slug = existingProduct.slug;
    if (name && name !== existingProduct.name) {
      slug = slugify(name, { 
        lower: true, 
        strict: true,
        trim: true
      });

      // Check for slug uniqueness
      const slugExists = await Product.findOne({ 
        slug, 
        _id: { $ne: productId } 
      });
      if (slugExists) {
        return NextResponse.json(
          { success: false, message: 'Product with this name already exists' },
          { status: 409 }
        );
      }
    }

    // Handle image management
    let uploadedImages = [...existingProduct.images];
    let uploadedThumbnail = existingProduct.thumbnail;

    // Delete images marked for deletion from Cloudinary and local array
    if (imagesToDelete.length > 0) {
      try {
        // Delete images from Cloudinary storage
        await deleteMultipleFromCloudinary(imagesToDelete);
        console.log(`Successfully deleted ${imagesToDelete.length} images from Cloudinary`);
      } catch (error) {
        console.error('Error deleting images from Cloudinary:', error);
        // Continue with the update even if Cloudinary deletion fails
        // The images will still be removed from the product reference
      }

      // Remove deleted images from the images array
      uploadedImages = uploadedImages.filter(image => !imagesToDelete.includes(image));
      
      // If thumbnail is marked for deletion or is in imagesToDelete, remove it
      if (deleteThumbnail || imagesToDelete.includes(uploadedThumbnail)) {
        uploadedThumbnail = '';
      }
    }

    // Upload new images if provided
    if (imageFiles.length > 0 || thumbnailFile) {
      const uploadPromises = [];
      
      if (imageFiles.length > 0) {
        uploadPromises.push(uploadMultipleToCloudinary(imageFiles));
      }
      
      if (thumbnailFile) {
        uploadPromises.push(uploadToCloudinary(thumbnailFile));
      }

      const uploadResults = await Promise.all(uploadPromises);
      
      // Handle new images upload
      if (imageFiles.length > 0) {
        const newImages = uploadResults[0] as string[];
        uploadedImages = [...uploadedImages, ...newImages];
        
        // If we uploaded thumbnail and images, thumbnail is second result
        if (thumbnailFile && imageFiles.length > 0) {
          uploadedThumbnail = uploadResults[1] as string;
        } else if (thumbnailFile) {
          // If only thumbnail was uploaded, it's first result
          uploadedThumbnail = uploadResults[0] as string;
        }
      } else if (thumbnailFile) {
        // If only thumbnail was uploaded
        uploadedThumbnail = uploadResults[0] as string;
      }

      // Ensure thumbnail is in images array and is unique
      if (uploadedThumbnail && !uploadedImages.includes(uploadedThumbnail)) {
        uploadedImages.push(uploadedThumbnail);
      }
    }

    // If thumbnail was deleted and no new thumbnail was uploaded, set a default or handle accordingly
    if (!uploadedThumbnail && uploadedImages.length > 0) {
      // Set the first image as thumbnail if available
      uploadedThumbnail = uploadedImages[0];
    } else if (!uploadedThumbnail && uploadedImages.length === 0) {
      // If no images remain, you might want to set a default thumbnail or handle this case
      console.warn('Product has no images after update');
    }

    // Build update object with only provided fields
    const updateData: Partial<IProduct> = {};

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (sku) updateData.sku = sku;
    if (brand !== undefined) updateData.brand = brand || null;
    if (category) updateData.category = category;
    if (price !== undefined) updateData.price = price;
    if (discountPrice !== undefined) updateData.discountPrice = discountPrice;
    if (stock !== undefined) updateData.stock = stock;
    if (tags !== undefined) updateData.tags = tags;
    if (collections !== undefined) updateData.collections = collections;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (isPublished !== undefined) updateData.isPublished = isPublished;
    if (variants !== undefined) updateData.variants = variants;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle || null;
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription || null;
    
    updateData.slug = slug;
    updateData.images = uploadedImages;
    updateData.thumbnail = uploadedThumbnail;

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    let message = 'Something went wrong';
    if (typeof error === 'string') message = error;
    else if (error instanceof Error) message = error.message;
    console.error('Error updating product:', message);

    return NextResponse.json(
      {
        success: false,
        message: 'Error updating product'
      },
      { status: 500 }
    );
  }
}