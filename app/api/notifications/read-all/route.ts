import connectDB from "@/lib/mongodb";
import { Notification, User } from "@/schema/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req:NextRequest) {
    try {
        await connectDB();

        const {userId} = await auth();


        if(!userId) {
            return NextResponse.json({message: "Please Sign In"}, {status: 401})
        }


        const user = await User.findOne({clerkId: userId});

        if(!user) {
            return NextResponse.json({message: "User not found"}, {status: 404})
        }


        const result = await Notification.updateMany({
            'recipient._id': user._id,
            isRead: false
        },
        {
            $set: {
                isRead: true
            }
        }
    )


    return NextResponse.json({
        success: true,
        message: "Notifications marked as read",
        modifiedCount: result.modifiedCount
    })
    } catch (error: unknown) {
        let msg = 'Something went wrong';
        if(typeof error === 'string') msg = error
        else if(error instanceof Error) msg = error.message
        return NextResponse.json({message: msg}, {status: 500})
    }
}