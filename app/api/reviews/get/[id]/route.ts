// api/reviews/get/[id]/route.ts

import {NextResponse, NextRequest} from 'next/server'


import connectDB from "@/lib/mongodb";
import { Review } from "@/schema/schema";
import { IReview } from "@/types";


export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {

        const { id } = await context.params;
        await connectDB();

        const review = await Review.findById(id).lean<IReview>

        if(!review) {
            return NextResponse.json({message: "Review not found"}, {status: 404})
        }


        return NextResponse.json({
            success: true, data: review
        })
    } catch (error: unknown) {
        let msg = 'Something went wrong'
        if(typeof error === 'string') msg = error
        else if(error instanceof Error) msg = error.message
        return NextResponse.json({message: msg}, {status: 500})
        
    }
}