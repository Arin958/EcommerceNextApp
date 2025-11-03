import connectDB from "@/lib/mongodb";
import { Review, User } from "@/schema/schema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params; 
        await connectDB();

        const {userId} = await auth()

        if(!userId) {
            return NextResponse.json({message: "Please Sign In"}, {status: 401})
        }

        const review = await Review.findById(id)
        if(!review) {
            return NextResponse.json({message: "Review not found"}, {status: 404})
        }

        const user = await User.findOne({clerkId: userId})
        if(!user) {
            return NextResponse.json({message: "User not found"}, {status: 404})
        }

        const hasLiked = review.likedBy.includes(userId)
        const hasDisliked = review.dislikedBy.includes(userId)

        // Toggle dislike
        if(hasDisliked) {
            review.dislikes -= 1;
            review.dislikedBy.pull(userId)
        } else {
            review.dislikes += 1;
            review.dislikedBy.push(userId)
        }

        // Remove from likes if user was liking
        if(hasLiked) {
            review.likes -= 1;
            review.likedBy.pull(userId)
        }

        await review.save()
        
        return NextResponse.json(
            { 
                message: "Review dislike updated successfully",
                likes: review.likes,
                dislikes: review.dislikes,
                hasLiked: false, // Always false when disliking
                hasDisliked: !hasDisliked // Return the new state
            }, 
            {status: 200}
        )

    } catch (error: unknown) {
        let msg = 'Something went wrong'
        if(typeof error === 'string') msg = error
        else if(error instanceof Error) msg = error.message
        return NextResponse.json({message: msg}, {status: 500})        
    }
}