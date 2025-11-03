import { deleteFromCloudinary } from "@/lib/cloudinary";
import connectDB from "@/lib/mongodb";
import { Product, User } from "@/schema/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 UPDATED TYPE
) {
  try {
    // ✅ Await params (new in Next.js 15+)
    const { id } = await context.params;

    // 🧩 Connect to MongoDB
    await connectDB();

    // 🔐 Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 🛡️ Check if user is an admin
    const user = await User.findOne({ clerkId: userId });
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { message: "Access denied: Admins only" },
        { status: 403 }
      );
    }

    // 📦 Validate product ID
    if (!id) {
      return NextResponse.json({ message: "Product ID required" }, { status: 400 });
    }

    // 🔍 Find product
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // 🗑️ Delete images from Cloudinary (if any)
    try {
      const imageUrls = [...(product.images || []), product.thumbnail].filter(Boolean);
      if (imageUrls.length > 0) {
        await Promise.allSettled(imageUrls.map((url) => deleteFromCloudinary(url)));
      }
    } catch (cloudinaryError) {
      console.error("⚠️ Cloudinary deletion error:", cloudinaryError);
      // Continue even if Cloudinary deletion fails
    }

    // 🧾 Delete product
    await Product.findByIdAndDelete(id);

    // ✅ Success response
    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
        data: {
          id: product._id,
          name: product.name,
          sku: product.sku,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("❌ Product deletion error:", error);
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ message }, { status: 500 });
  }
}
