import { NextResponse, NextRequest } from 'next/server'
import connectDB from "@/lib/mongodb";
import { Order, User } from "@/schema/schema";
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
    try {
        await connectDB();


        const {userId} = await auth()

        if(!userId){
            return NextResponse.json({ success: false, message: 'Please sign in' });
        }

        const user = await User.findOne({clerkId: userId})
        if(!user){
            return NextResponse.json({ success: false, message: 'User not found' });
        }

        if(user.role !== "admin"){
            return NextResponse.json({ success: false, message: 'Unauthorized' });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get("status");

        const skip = (page - 1) * limit;

        let filter = {};
        if (status && status !== "all") {
            filter = { orderStatus: status }
        }

        const orders = await Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();

        const total = await Order.countDocuments(filter);

        return NextResponse.json({ success: true, pagination: { page, limit, total, pages: Math.ceil(total / limit) }, orders });
    } catch (error: unknown) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch orders' });


    }
}