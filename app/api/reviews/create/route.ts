import connectDB from "@/lib/mongodb";
import { Notification, Review, User, Product } from "@/schema/schema"; // ✅ include Product
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, rating, title, comment, images } = body;

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const existingReview = await Review.findOne({
      productId,
      "user._id": user._id,
    });

    if (existingReview) {
      return NextResponse.json(
        { message: "You have already reviewed this product" },
        { status: 400 }
      );
    }

    // ✅ Create review
    const review = new Review({
      productId: product._id.toString(),
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
      rating,
      title,
      comment,
      images,
    });

    await review.save();

    // ✅ Update product's average rating and total reviews
    const stats = await Review.aggregate([
      { $match: { productId: product._id.toString() } },
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

    // ✅ Notify admins
    const admins = await User.find({ role: "admin" });
    const notifications = admins.map((admin) => ({
      recipient: {
        _id: admin._id.toString(),
        clerkId: admin.clerkId,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
      sender: {
        _id: user._id.toString(),
        clerkId: user.clerkId,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      type: "review_posted",
      title: "New review posted",
      message: `A new review has been posted by ${user.username} for the product "${product.name}"`,
      url: `/admin/reviews/${review._id}`,
    }));

    await Notification.insertMany(notifications);

    return NextResponse.json(
      { message: "Review created successfully", data: review },
      { status: 201 }
    );
  } catch (error: unknown) {
    let msg = "Something went wrong";
    if (typeof error === "string") msg = error;
    else if (error instanceof Error) msg = error.message;
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
