import connectDB from "@/lib/mongodb";
import { Notification, User } from "@/schema/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const {userId} = await auth();

        if(!userId) {
            return NextResponse.json({message: "Please Sign In"}, {status: 401});
        }

        const user = await User.findOne({clerkId: userId});


       const notifications = await Notification.find({
      'recipient._id': user?._id
    })
    .sort({ createdAt: -1 })
    .limit(50);
        return NextResponse.json({success: true, data: notifications, count: notifications.length});
       
    } catch (error: unknown) {
        let msg = 'Something went wrong';
        if(typeof error === 'string') msg = error
        else if(error instanceof Error) msg = error.message
        return NextResponse.json({message: msg}, {status: 500})
    }
}