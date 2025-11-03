"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Trash2, MoreHorizontal } from "lucide-react";
import { IOrder, OrderStatus } from "@/types";

const orderStatuses: OrderStatus[] = ["placed", "shipped", "delivered", "cancelled"];

interface OrdersTableProps {
  orders: IOrder[];
  loading: boolean;
  onViewDetails: (order: IOrder) => void;
  onDeleteOrder: (id: string) => void;
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusVariant: (status: string) => "secondary" | "default" | "success" | "destructive";
  getPaymentVariant: (status: string) => "success" | "destructive";
    updatingOrderId?: string | null; 
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  loading,
  onViewDetails,
  onDeleteOrder,
  onUpdateOrderStatus,
  getStatusIcon,
  getStatusVariant,
  getPaymentVariant,

}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center text-gray-500 py-16">
        <div className="text-lg font-medium">No orders found</div>
        <p className="text-sm text-muted-foreground mt-1">
          No orders match your current filters
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order._id} className="hover:bg-muted/50">
            <TableCell className="font-medium">
              <div className="flex flex-col">
                <span className="font-semibold">{order.orderId}</span>
                <span className="text-xs text-muted-foreground">
                  {order.transactionId}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span>{order.shippingAddress.fullName}</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {order.paymentMethod}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-semibold">
                  ${order.total.toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant={getPaymentVariant(order.paymentStatus)}
                className="capitalize"
              >
                {order.paymentStatus}
              </Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 px-2">
                    <Badge
                      variant={getStatusVariant(order.orderStatus)}
                      className="capitalize flex items-center gap-1"
                    >
                      {getStatusIcon(order.orderStatus)}
                      {order.orderStatus}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
               
{orderStatuses.map((status) => (
  <DropdownMenuItem
    key={status}
    onClick={() => onUpdateOrderStatus(order._id as string, status)}
    className="capitalize"
  >
    {status}
  </DropdownMenuItem>
))}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewDetails(order)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDeleteOrder(order._id as string)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Order
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrdersTable;