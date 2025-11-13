import connectDB from "@/lib/mongodb";
import { Order, Review, User } from "@/schema/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {

         const {userId} = await auth()
      
              if(!userId) {
                  return NextResponse.json({message: "Unauthorized"}, {status: 401})
              }
      
      
              const user = await User.findOne({clerkId: userId})
      
              if(!user) {
                  return NextResponse.json({message: "Unauthorized"}, {status: 401})
              } 
      
              if(user.role !== "admin") {
                  return NextResponse.json({message: "Unauthorized"}, {status: 401})
              }
        await connectDB();

        const {searchParams} = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '10');


        const [recentOrders,recentReviews, newUsers] = await Promise.all([
             Order.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('orderId total orderStatus createdAt')
        .lean(),
      
      Review.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('productId', 'name')
        .select('rating title comment createdAt productId')
        .lean(),
      
      User.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('username email createdAt')
        .lean()
        ])

        const activities = [
      ...recentOrders.map(order => ({
        type: 'order' as const,
        id: order.orderId,
        title: `New Order #${order.orderId}`,
        description: `Order ${order.orderStatus} - $${order.total}`,
        timestamp: order.createdAt,
        meta: { status: order.orderStatus, amount: order.total }
      })),
      
      ...recentReviews.map(review => ({
        type: 'review' as const,
        id: review._id,
        title: `New Review for ${review.productId.name}`,
        description: `${review.rating} stars - ${review.title || 'No title'}`,
        timestamp: review.createdAt,
        meta: { rating: review.rating, product: review.productId.name }
      })),
      
      ...newUsers.map(user => ({
        type: 'user' as const,
        id: user._id,
        title: `New User Registered`,
        description: `${user.username} (${user.email})`,
        timestamp: user.createdAt,
        meta: { email: user.email, username: user.username }
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
     .slice(0, limit);

    return NextResponse.json(activities);
    } catch (error: unknown) {
        let msg = 'Something went wrong';
        if(typeof error === 'string') msg = error
        else if(error instanceof Error) msg = error.message
        return NextResponse.json({message: msg}, {status: 500})
    }
}