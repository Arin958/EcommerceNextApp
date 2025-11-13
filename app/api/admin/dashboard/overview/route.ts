import connectDB from "@/lib/mongodb";
import { Order, Product, Review, User } from "@/schema/schema";
import { auth } from "@clerk/nextjs/server";

import {NextResponse } from "next/server";


export async function GET() {
    try {
        await connectDB()

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

        // Get date range for analytics 
        const today = new Date();

        const startOfToday = new Date(today.setHours(0, 0, 0, 0));
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);


        const [totalRevenue, todayRevenue, totalOrders, todayOrders, totalProducts, lowStockProducts, totalUsers, pendingOrders,recentReviews, monthlyRevenue] = await Promise.all([
            Order.aggregate([
                 { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
            ]),
               Order.aggregate([
        { 
          $match: { 
            paymentStatus: 'paid',
            createdAt: { $gte: startOfToday }
          } 
        },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),

        Order.countDocuments(),
      
      // Today's Orders
      Order.countDocuments({ createdAt: { $gte: startOfToday } }),
      
      // Total Products
      Product.countDocuments(),
      
      // Low Stock Products
      Product.countDocuments({ stock: { $lt: 10 } }),
      
      // Total Users
      User.countDocuments(),
      
      // Pending Orders
      Order.countDocuments({ orderStatus: { $in: ['placed', 'confirmed'] } }),
      
      // Recent Reviews with product info
      Review.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('productId', 'name slug'),
      
      // Monthly Revenue for chart
      Order.aggregate([
        {
          $match: {
            paymentStatus: 'paid',
            createdAt: { $gte: startOfMonth }
          }
        },
        {
          $group: {
            _id: {
              day: { $dayOfMonth: '$createdAt' },
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' }
            },
            revenue: { $sum: '$total' },
            orders: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ])
        ])


            const overviewData = {
      summary: {
        totalRevenue: totalRevenue[0]?.total || 0,
        todayRevenue: todayRevenue[0]?.total || 0,
        totalOrders,
        todayOrders,
        totalProducts,
        lowStockProducts,
        totalUsers,
        pendingOrders
      },
      recentReviews,
      monthlyRevenue: monthlyRevenue.map(item => ({
        date: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}-${item._id.day.toString().padStart(2, '0')}`,
        revenue: item.revenue,
        orders: item.orders
      }))
    };

    return NextResponse.json(overviewData);

        

    } catch (error: unknown) {
        let msg = 'Something went wrong'
        if(typeof error === 'string') msg = error
        else if(error instanceof Error) msg = error.message
        return NextResponse.json({message: msg}, {status: 500})
        
    }
}