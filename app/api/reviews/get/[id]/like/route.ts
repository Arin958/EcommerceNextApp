import connectDB from "@/lib/mongodb";
import { Review, User, Notification } from "@/schema/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectDB();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Please Sign In" }, { status: 401 });
    }

    const review = await Review.findById(id);
    if (!review) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const hasLiked = review.likedBy.includes(userId);
    const hasDisliked = review.dislikedBy.includes(userId);

    if (hasLiked) {
      // ✅ User unliked the review
      review.likes -= 1;
      review.likedBy.pull(userId);
    } else {
      // ✅ User liked the review
      review.likes += 1;
      review.likedBy.push(userId);

      // Remove dislike if previously disliked
      if (hasDisliked) {
        review.dislikes -= 1;
        review.dislikedBy.pull(userId);
      }

      // ✅ Create notification only if the liker is not the same user as the review author
      if (review.user._id.toString() !== user._id.toString()) {
        await Notification.create({
          recipient: {
            _id: review.user._id,// optional if you store clerkId in review.user
            username: review.user.username,
            email: review.user.email,
        
          },
          sender: {
            _id: user._id,
            clerkId: user.clerkId,
            username: user.username,
            email: user.email,
            role: user.role,
          },
          type: "review_liked",
          title: "Your review got a like!",
          message: `${user.username} liked your review.`,
          reviewId: review._id.toString(),
          productId: review.productId.toString(),
          url: `/product/${review.productId}`,
          meta: { likerId: user._id, likerName: user.username },
        });
      }
    }

    await review.save();

    return NextResponse.json(
      {
        message: hasLiked ? "Review unliked successfully" : "Review liked successfully",
        likes: review.likes,
        dislikes: review.dislikes,
        hasLiked: !hasLiked,
        hasDisliked: hasDisliked && !hasLiked,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    let msg = "Something went wrong";
    if (typeof error === "string") msg = error;
    else if (error instanceof Error) msg = error.message;
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
