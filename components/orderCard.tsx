import React from 'react';
import { Calendar, MapPin, CreditCard, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { IAddress, IOrder } from '@/types';







interface OrderCardProps {
    order: IOrder;
    statusIcon: React.ReactNode;
    statusColor: string;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, statusIcon, statusColor }) => {

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatAddress = (address: IAddress) => {
        return `${address.addressLine1}, ${address.city}, ${address.state} ${address.postalCode}`;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Order Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            {statusIcon}
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                            </span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Order #{order.orderId}</h3>
                            <p className="text-sm text-gray-600">Placed on {formatDate(order.createdAt.toString())}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">${order.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="p-6 border-b border-gray-100">
                <div className="space-y-4">
                    {order.items.map((item, index: number) => (
                        <div key={index} className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                    src={item.image || '/api/placeholder/64/64'}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    width={64}
                                    height={64}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-sm text-gray-600">Color: {item.color}</span>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-sm text-gray-600">Size: {item.size}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Order Details */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Shipping Address */}
                    <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="font-medium text-gray-900 mb-1">Shipping Address</h4>
                            <p className="text-sm text-gray-600">
                                {order.shippingAddress.fullName}<br />
                                {formatAddress(order.shippingAddress)}<br />
                                {order.shippingAddress.country}
                            </p>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="flex items-start gap-3">
                        <CreditCard className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="font-medium text-gray-900 mb-1">Payment</h4>
                            <p className="text-sm text-gray-600 capitalize">
                                {order.paymentMethod} • {order.paymentStatus}
                            </p>
                            {order.transactionId && (
                                <p className="text-xs text-gray-500 mt-1">
                                    ID: {order.transactionId}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span>${order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping:</span>
                                    <span>${order.shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax:</span>
                                    <span>${order.tax.toFixed(2)}</span>
                                </div>
                                {(order.discount ?? 0) > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Discount:</span>
                                        <span className="text-green-600">-${(order.discount ?? 0).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between border-t border-gray-200 pt-1 font-medium">
                                    <span>Total:</span>
                                    <span>${order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                    <Link href={`/my-orders-details/${order._id}`} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">

                        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                            View Details
                        </button>
                    </Link>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
                        Track Order
                        <ExternalLink className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;