import { Order } from '@/schema/schema';
import { auth } from '@clerk/nextjs/server'
import React from 'react'
import OrderCard from '@/components/orderCard';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { IOrder } from '@/types';
import Link from 'next/link';
import connectDB from '@/lib/mongodb';



const Page = async () => {
  await connectDB()
  const { userId } = await auth();

  if (!userId) return null;

  const userOrders = await Order.find({ clerkId: userId });
  const orders: IOrder[] = userOrders ? JSON.parse(JSON.stringify(userOrders)) : null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'placed': return <Clock className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white rounded-lg shadow-sm border">
              <Package className="h-6 w-6 text-gray-700" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          </div>
          <p className="text-gray-600">
            {orders?.length || 0} order{orders?.length !== 1 ? 's' : ''} placed
          </p>
        </div>

        {/* Orders List */}
        {!orders || orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">When you place orders, they will appear here.</p>
         <Link 
  href="/shop"
  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors inline-block"
>
  Start Shopping
</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                statusIcon={getStatusIcon(order.orderStatus)}
                statusColor={getStatusColor(order.orderStatus)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;