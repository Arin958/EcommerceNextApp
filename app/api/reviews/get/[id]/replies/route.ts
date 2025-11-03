// api/reviews/get/[id]/replies/route.ts
import connectDB from "@/lib/mongodb";
import { Review, User } from "@/schema/schema";
import { IReviewReply } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Await the params first
        const { id } = await params;
        
        await connectDB();
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findOne({ clerkId: userId });

        if (user?.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Remove .lean() to get a Mongoose document and use the awaited id
        const review = await Review.findById(id);

        if (!review) {
            return NextResponse.json({ message: "Review not found" }, { status: 404 });
        }

        const body = await request.json();
        const { comment } = body;

        if (!comment || comment.trim() === "") {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const reply = {
            user: {
                _id: userId,
                username: user.username,
                role: user.role
            },
            comment: comment.trim()
        } as IReviewReply;

        // Now review is a Mongoose document that has .save() method
        review.replies.push(reply);
        await review.save();

        return NextResponse.json({
            success: true,
            message: 'Reply added successfully',
            data: review,
        });

    } catch (error: unknown) {
        console.log(error);
        let msg = "Something went wrong";
        
        if (typeof error === "string") msg = error;
        else if (error instanceof Error) msg = error.message;
        return NextResponse.json({ message: msg }, { status: 500 });
    }
}