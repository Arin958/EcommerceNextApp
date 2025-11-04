import connectDB from "@/lib/mongodb";
import { Review, Product, User } from "@/schema/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectDB();

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Find review and check existence
    const review = await Review.findById(id);
    if (!review) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }

    // ✅ Find user by Clerk ID and compare
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (String(review.user._id) !== String(user._id)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { rating, title, comment, images } = body;

    // ✅ Validate rating (only if it's provided)
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // ✅ Prepare updated data
    const updatedData: {
      rating?: number;
      title?: string;
      comment?: string;
      images?: string[];
    } = {};

    if (rating !== undefined) updatedData.rating = rating;
    if (title) updatedData.title = title;
    if (comment) updatedData.comment = comment;
    if (images) updatedData.images = images;

    // ✅ Update review
    const updatedReview = await Review.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    // ✅ Update product rating and review count
    const product = await Product.findById(review.productId);
    if (product) {
      const stats = await Review.aggregate([
        { $match: { productId: product._id } },
        {
          $group: {
            _id: "$productId",
            avgRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
      ]);

      if (stats.length > 0) {
        product.averageRating = stats[0].avgRating;
        product.totalReviews = stats[0].totalReviews;
      } else {
        product.averageRating = 0;
        product.totalReviews = 0;
      }

      await product.save();
    }

    return NextResponse.json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    });
  } catch (error: unknown) {
    let msg = "Something went wrong";
    if (typeof error === "string") msg = error;
    else if (error instanceof Error) msg = error.message;
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
