// api/reviews/get/[id]/replies/[replyId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectDB from "@/lib/mongodb";
import { Review } from '@/schema/schema';
import { auth } from '@clerk/nextjs/server';
import { User } from '@/schema/schema';

export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string; replyId: string }> }
) {
    try {
        // Await params first
        const { id, replyId } = await params;
        
        await connectDB();

        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const review = await Review.findById(id);

        if (!review) {
            return NextResponse.json({ message: "Review not found" }, { status: 404 });
        }

        // Find the reply within the review
        const reply = review.replies.id(replyId);

        if (!reply) {
            return NextResponse.json({ message: "Reply not found" }, { status: 404 });
        }

        const user = await User.findOne({ clerkId: userId });
        
        // Check if user is admin or the reply author
        if (reply.user._id.toString() !== userId && user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Remove the reply
        review.replies.pull({ _id: replyId });
        await review.save();

        return NextResponse.json({ message: "Reply deleted successfully" }, { status: 200 });
    } catch (error: unknown) {
        let msg = "Something went wrong";
        if (typeof error === "string") msg = error;
        else if (error instanceof Error) msg = error.message;
        return NextResponse.json({ message: msg }, { status: 500 });
    }
}