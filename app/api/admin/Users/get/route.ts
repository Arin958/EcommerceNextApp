import connectDB from "@/lib/mongodb";
import { User } from "@/schema/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ message: "Please Sign In" }, { status: 401 });
        }


        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }


        const getAllUsers = await User.find({}).lean().exec();
        console.log

        if (!getAllUsers) {
            return NextResponse.json({ message: "Users not found" }, { status: 404 });
        }







        return NextResponse.json({ success: true, data: getAllUsers });
    } catch (error: unknown) {
           let msg = "Something went wrong";
           if(typeof error === "string") msg = error;
           else if(error instanceof Error) msg = error.message;
           return NextResponse.json({message: msg}, {status: 500})
    }
}