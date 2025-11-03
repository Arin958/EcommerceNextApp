import connectDB from "@/lib/mongodb";
import { Order, User } from "@/schema/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";



export async function DELETE (req:NextRequest, context: { params: Promise<{ id: string }> }) {
try {
    await connectDB();

    const {id} = await context.params;
    const {userId} = await auth();
    if(!userId) {
        return NextResponse.json({message: "Unauthorized"}, {status: 401})
    }

    const user = await User.findOne({clerkId: userId});

    if(!user) {
        return NextResponse.json({message: "User not found"}, {status: 404})
    }

    if(user.role !== "admin") {
        return NextResponse.json({message: "Unauthorized"}, {status: 403})
    }

    const order = await Order.findById(id);
    if(!order) {
        return NextResponse.json({message: "Order not found"}, {status: 404})
    }

    await Order.findByIdAndDelete(id);
    return NextResponse.json({message: "Order deleted successfully"}, {status: 200})
} catch (error: unknown) {
    let errorMessage = "An error occurred";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
}
}