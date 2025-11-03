// api/reviews/put/[id]/route.ts

import connectDB from '@/lib/mongodb'
import { Review } from '@/schema/schema';

import { auth } from '@clerk/nextjs/server';
import {NextRequest, NextResponse} from 'next/server'

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
try {

    const {id} = await context.params;
    await connectDB();

    const {userId} = await auth();

    if(!userId) {
        return NextResponse.json({message: "Unauthorized"}, {status: 401})
    }

    const review = await Review.findById(id);

    if(!review) {
        return NextResponse.json({message: "Review not found"}, {status: 404})
    }


    if(review.user._id !== userId) {
        return NextResponse.json({message: "Unauthorized"}, {status: 401})
    }

    const body = await req.json();

    const {rating, title, comment} = body;


    if(!rating && (rating < 1 || rating > 5)) {
        return NextResponse.json({message: "Rating must be between 1 and 5"}, {status: 400})
    }


const updatedData: {
    rating?: number,
    title?: string,
    comment?: string
} = {rating, title, comment};



    if(rating) updatedData.rating = rating;
    if(title) updatedData.title = title;
    if(comment) updatedData.comment = comment;

    const updatedReview = await Review.findByIdAndUpdate(id, updatedData, {new: true, runValidators: true});


    return NextResponse.json({
        success: true,
        data: updatedReview
    })
} catch (error: unknown) {
    let msg = "Something went wrong";

    if(typeof error === "string") msg = error;
    else if(error instanceof Error) msg = error.message;
    return NextResponse.json({message: msg}, {status: 500})
    
}
}

