import { Order } from '@/schema/schema'
import { IOrder, IOrderItem } from '@/types';
import React from 'react'
import { 
  Package, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  Clock,
  Download,
  Printer,
  ArrowLeft,
  Mail
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import connectDB from '@/lib/mongodb';

const Page = async({ params }: { params: { id: string }}) => {
    await connectDB()
    const { id } = await params

    const orders = await Order.findById(id).lean<IOrder>();
    const orderData = orders ? JSON.parse(JSON.stringify(orders)) : null;

    if (!orderData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
                    <p className="text-gray-600 mb-6">The order you&apos;re looking for doesn&apos;t exist.</p>
                    <Link 
                        href="/my-orders"
                        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Back to Orders
                    </Link>
                </div>
            </div>
        )
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'placed': return <Clock className="h-5 w-5" />;
            case 'shipped': return <Truck className="h-5 w-5" />;
            case 'delivered': return <CheckCircle className="h-5 w-5" />;
            default: return <Package className="h-5 w-5" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'placed': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-800 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'failed': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link 
                        href="/my-orders"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Orders
                    </Link>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
                            <p className="text-gray-600 mt-1">Order #{orderData.orderId}</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <Printer className="h-4 w-4" />
                                Print
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <Download className="h-4 w-4" />
                                Download
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Status Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Order Status</h2>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(orderData.orderStatus)}
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(orderData.orderStatus)}`}>
                                        {orderData.orderStatus.charAt(0).toUpperCase() + orderData.orderStatus.slice(1)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Calendar className="h-4 w-4" />
                                <span>Placed on {formatDate(orderData.createdAt)}</span>
                            </div>
                        </div>

                        {/* Items Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Items Ordered</h2>
                            <div className="space-y-4">
                                {orderData.items.map((item: IOrderItem, index: number) => (
                                    <div key={index} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-b-0">
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={item.image!}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                                width={200}
                                                height={200}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                                <span>Qty: {item.quantity}</span>
                                                <span>•</span>
                                                <span>Color: {item.color}</span>
                                                <span>•</span>
                                                <span>Size: {item.size}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                            <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Address Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Shipping Address
                            </h2>
                            <div className="space-y-2 text-gray-600">
                                <p className="font-medium">{orderData.shippingAddress.fullName}</p>
                                <p>{orderData.shippingAddress.addressLine1}</p>
                                {orderData.shippingAddress.addressLine2 && (
                                    <p>{orderData.shippingAddress.addressLine2}</p>
                                )}
                                <p>
                                    {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.postalCode}
                                </p>
                                <p>{orderData.shippingAddress.country}</p>
                                <p className="pt-2">Phone: {orderData.shippingAddress.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span>${orderData.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span>${orderData.shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax</span>
                                    <span>${orderData.tax.toFixed(2)}</span>
                                </div>
                                {orderData.discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Discount</span>
                                        <span className="text-green-600">-${orderData.discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex justify-between font-semibold">
                                        <span>Total</span>
                                        <span>${orderData.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Payment Information
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Method</span>
                                    <span className="font-medium capitalize">{orderData.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Status</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(orderData.paymentStatus)}`}>
                                        {orderData.paymentStatus.charAt(0).toUpperCase() + orderData.paymentStatus.slice(1)}
                                    </span>
                                </div>
                                {orderData.transactionId && (
                                    <div>
                                        <span className="text-gray-600 text-sm">Transaction ID</span>
                                        <p className="text-sm font-mono text-gray-900 break-all">
                                            {orderData.transactionId}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                            <div className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
                                    <p className="text-blue-800 text-sm mb-3">
                                        Have questions about your order? Our support team is here to help.
                                    </p>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                        Contact Support
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page