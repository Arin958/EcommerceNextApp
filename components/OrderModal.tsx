// components/OrderDetailsModal.tsx
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  User,
  MapPin,
  Package,
  CreditCard,
  CalendarClock,
  ShoppingCart,
  Truck,
  DollarSign,
  FileText,
  X,
} from "lucide-react";
import { IOrder, IOrderItem, OrderStatus, PaymentStatus } from "@/types";
import { Separator } from "@/components/ui/separator";
import { StatusDropdown } from "./StatusDropdown";
import { InfoGrid } from "./InfoGrid";
import { DetailRow } from "./DetailRow";

interface OrderDetailsModalProps {
  order: IOrder | null;
  isOpen: boolean;
  onClose: () => void;
  getStatusVariant: (status: string) => "secondary" | "default" | "success" | "destructive";
  getStatusIcon: (status: string) => React.ReactNode;
  getPaymentVariant: (status: string) => "success" | "destructive";
  onUpdateOrderStatus?: (id: string, newStatus: OrderStatus) => void;
  onUpdatePaymentStatus?: (id: string, newStatus: PaymentStatus) => void;
  updatingOrderId?: string | null;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  getStatusVariant,
  getStatusIcon,
  getPaymentVariant,
  onUpdateOrderStatus,
  onUpdatePaymentStatus,
  updatingOrderId,
}) => {
  if (!order) return null;

  const orderStatusOptions = ["placed", "shipped", "delivered", "cancelled"];
  const paymentStatusOptions = ["paid", "pending"];
  const isUpdating = updatingOrderId === order._id;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-7xl w-full h-[95vh] sm:h-[90vh] md:h-[85vh] lg:max-w-7xl xl:max-w-8xl mx-auto p-0 overflow-hidden rounded-none sm:rounded-2xl shadow-2xl border-0 bg-background">
        <CloseButton onClose={onClose} />
        <ModalHeader 
          order={order}
          getStatusVariant={getStatusVariant}
          getStatusIcon={getStatusIcon}
          getPaymentVariant={getPaymentVariant}
          onUpdateOrderStatus={onUpdateOrderStatus}
          onUpdatePaymentStatus={onUpdatePaymentStatus}
          isUpdating={isUpdating}
          orderStatusOptions={orderStatusOptions}
          paymentStatusOptions={paymentStatusOptions}
        />
        <ModalContent 
          order={order}
          getStatusVariant={getStatusVariant}
          getStatusIcon={getStatusIcon}
        />
      </DialogContent>
    </Dialog>
  );
};

// Sub-components for OrderDetailsModal
const CloseButton: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <Button
    variant="ghost"
    size="icon"
    className="absolute right-4 top-4 z-50 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border"
    onClick={onClose}
  >
    <X className="h-4 w-4" />
  </Button>
);

interface ModalHeaderProps {
  order: IOrder;
  getStatusVariant: (status: string) => "secondary" | "default" | "success" | "destructive";
  getStatusIcon: (status: string) => React.ReactNode;
  getPaymentVariant: (status: string) => "success" | "destructive";
  onUpdateOrderStatus?: (id: string, newStatus: OrderStatus) => void;
  onUpdatePaymentStatus?: (id: string, newStatus: PaymentStatus) => void;
  isUpdating: boolean;
  orderStatusOptions: string[];
  paymentStatusOptions: string[];
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
  order,
  getStatusVariant,
  getStatusIcon,
  getPaymentVariant,
  onUpdateOrderStatus,
  onUpdatePaymentStatus,
  isUpdating,
  orderStatusOptions,
  paymentStatusOptions,
}) => (
  <DialogHeader className="px-4 sm:px-6 pt-6 pb-4 border-b border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-40">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
        <div className="p-2 rounded-xl bg-primary/10 flex-shrink-0">
          <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <DialogTitle className="text-xl sm:text-2xl font-bold flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className="truncate">Order #{order.orderId}</span>
            <div className="flex flex-wrap gap-2">
              <StatusBadgeWithDropdown
                status={order.orderStatus}
                getVariant={getStatusVariant}
                getIcon={getStatusIcon}
                onUpdateStatus={onUpdateOrderStatus}
                onStatusChange={(newStatus) => onUpdateOrderStatus?.(order._id, newStatus as OrderStatus)}
                isUpdating={isUpdating}
                options={orderStatusOptions}
                type="order"
              />
              <PaymentStatusBadgeWithDropdown
                status={order.paymentStatus}
                getVariant={getPaymentVariant}
                onUpdateStatus={onUpdatePaymentStatus}
                onStatusChange={(newStatus) => onUpdatePaymentStatus?.(order._id, newStatus as PaymentStatus)}
                isUpdating={isUpdating}
                options={paymentStatusOptions}
                type="payment"
              />
            </div>
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-muted-foreground mt-1 truncate">
            {new Date(order.createdAt).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </DialogDescription>
        </div>
      </div>
      <TotalAmount total={order.total} />
    </div>
  </DialogHeader>
);

const StatusBadgeWithDropdown: React.FC<{
  status: string;
  getVariant: (status: string) => "secondary" | "default" | "success" | "destructive";
  getIcon: (status: string) => React.ReactNode;
  onUpdateStatus?: (id: string, newStatus: OrderStatus) => void;
  onStatusChange: (newStatus: string) => void;
  isUpdating: boolean;
  options: string[];
  type: 'order' | 'payment';
}> = ({ status, getVariant, getIcon, onUpdateStatus, onStatusChange, isUpdating, options, type }) => (
  <div className="flex items-center gap-1">
    <Badge
      variant={getVariant(status)}
      className="capitalize flex items-center gap-1 px-2 py-1 text-xs sm:text-sm flex-shrink-0"
    >
      {getIcon(status)}
      <span className="truncate">{status}</span>
    </Badge>
    {onUpdateStatus && (
      <StatusDropdown
        currentStatus={status}
        options={options}
        onStatusChange={onStatusChange}
        disabled={isUpdating}
        type={type}
      />
    )}
  </div>
);

const PaymentStatusBadgeWithDropdown: React.FC<{
  status: string;
  getVariant: (status: string) => "success" | "destructive";
  onUpdateStatus?: (id: string, newStatus: PaymentStatus) => void;
  onStatusChange: (newStatus: string) => void;
  isUpdating: boolean;
  options: string[];
  type: 'order' | 'payment';
}> = ({ status, getVariant, onUpdateStatus, onStatusChange, isUpdating, options, type }) => (
  <div className="flex items-center gap-1">
    <Badge
      variant={getVariant(status)}
      className="capitalize px-2 py-1 text-xs sm:text-sm flex-shrink-0"
    >
      {status}
    </Badge>
    {onUpdateStatus && (
      <StatusDropdown
        currentStatus={status}
        options={options}
        onStatusChange={onStatusChange}
        disabled={isUpdating}
        type={type}
      />
    )}
  </div>
);

const TotalAmount: React.FC<{ total: number }> = ({ total }) => (
  <div className="text-left sm:text-right flex-shrink-0">
    <div className="text-2xl sm:text-3xl font-bold text-primary">
      ${total.toFixed(2)}
    </div>
    <div className="text-xs sm:text-sm text-muted-foreground">Total Amount</div>
  </div>
);

interface ModalContentProps {
  order: IOrder;
  getStatusVariant: (status: string) => "secondary" | "default" | "success" | "destructive";
  getStatusIcon: (status: string) => React.ReactNode;
}

const ModalContent: React.FC<ModalContentProps> = ({ order }) => (
  <div className="flex-1 overflow-auto p-4 sm:p-6">
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
      <LeftColumn order={order} />
      <RightColumn order={order} />
    </div>
  </div>
);

const LeftColumn: React.FC<{ order: IOrder }> = ({ order }) => (
  <div className="xl:col-span-2 space-y-4 sm:space-y-6">
    <OrderItemsCard items={order.items} />
    <TwoColumnGrid order={order} />
  </div>
);

const OrderItemsCard: React.FC<{ items: IOrderItem[] }> = ({ items }) => (
  <Card className="border border-border/40 shadow-lg hover:shadow-xl transition-all duration-300">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-lg font-semibold">
        <IconWrapper className="bg-blue-500/10">
          <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
        </IconWrapper>
        Order Items ({items.length})
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <OrderItemsTable items={items} />
    </CardContent>
  </Card>
);

const OrderItemsTable: React.FC<{ items: IOrderItem[] }> = ({ items }) => (
  <div className="overflow-x-auto">
    <Table>
      <TableHeader className="bg-muted/30">
        <TableRow>
          <TableHead className="font-semibold py-3 sm:py-4 min-w-[200px]">Product</TableHead>
          <TableHead className="font-semibold py-3 sm:py-4 w-20 text-center">Qty</TableHead>
          <TableHead className="font-semibold py-3 sm:py-4 w-28 text-right">Unit Price</TableHead>
          <TableHead className="font-semibold py-3 sm:py-4 w-28 text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item, index) => (
          <OrderItemRow key={index} item={item} index={index} />
        ))}
      </TableBody>
    </Table>
  </div>
);

const OrderItemRow: React.FC<{ item: IOrderItem; index: number }> = ({ item, index }) => (
  <TableRow className="hover:bg-muted/20 transition-colors duration-150 border-border/40">
    <TableCell className="py-3 sm:py-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
          <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-foreground truncate">
            {item.name || `Product ${index + 1}`}
          </p>
          {item.sku && (
            <p className="text-xs text-muted-foreground truncate">SKU: {item.sku}</p>
          )}
        </div>
      </div>
    </TableCell>
    <TableCell className="text-center py-3 sm:py-4">
      <Badge variant="outline" className="px-2 py-1 text-xs">
        {item.quantity || 1}
      </Badge>
    </TableCell>
    <TableCell className="text-right font-medium py-3 sm:py-4 whitespace-nowrap">
      ${(item.price || 0).toFixed(2)}
    </TableCell>
    <TableCell className="text-right font-semibold text-foreground py-3 sm:py-4 whitespace-nowrap">
      ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
    </TableCell>
  </TableRow>
);

const TwoColumnGrid: React.FC<{ order: IOrder }> = ({ order }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
    <OrderInfoCard order={order} />
    <CustomerInfoCard order={order} />
  </div>
);

const OrderInfoCard: React.FC<{ order: IOrder }> = ({ order }) => (
  <Card className="border border-border/40 shadow-lg hover:shadow-xl transition-all duration-300">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-semibold">
        <IconWrapper className="bg-green-500/10">
          <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
        </IconWrapper>
        Order Information
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3 sm:space-y-4">
      <InfoGrid
        items={[
          { label: "Order ID", value: order.orderId },
          { label: "Transaction ID", value: order.transactionId || "N/A" },
          { 
            label: "Order Date", 
            value: (
              <span className="flex items-center gap-2">
                <CalendarClock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-xs sm:text-sm">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </span>
            )
          },
          { label: "Payment Method", value: order.paymentMethod },
        ]}
      />
    </CardContent>
  </Card>
);

const CustomerInfoCard: React.FC<{ order: IOrder }> = ({ order }) => (
  <Card className="border border-border/40 shadow-lg hover:shadow-xl transition-all duration-300">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-semibold">
        <IconWrapper className="bg-purple-500/10">
          <User className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
        </IconWrapper>
        Customer Information
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3 sm:space-y-4">
      <InfoGrid
        items={[
          { 
            label: "Customer ID", 
            value: <span className="font-mono text-xs sm:text-sm truncate">{order.clerkId}</span> 
          },
          { label: "Contact", value: order.shippingAddress.phone },
          { label: "Email", value: order.shippingAddress.email || "N/A" },
        ]}
      />
    </CardContent>
  </Card>
);

const RightColumn: React.FC<{ order: IOrder }> = ({ order }) => (
  <div className="space-y-4 sm:space-y-6">
    <FinancialSummaryCard order={order} />
    <ShippingAddressCard order={order} />
    {order.notes && <OrderNotesCard notes={order.notes} />}
  </div>
);

const FinancialSummaryCard: React.FC<{ order: IOrder }> = ({ order }) => (
  <Card className="border border-border/40 shadow-lg hover:shadow-xl transition-all duration-300 xl:top-6">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-semibold">
        <IconWrapper className="bg-amber-500/10">
          <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
        </IconWrapper>
        Financial Summary
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3 sm:space-y-4">
      <DetailRow label="Subtotal" value={order.subtotal} />
      <DetailRow label="Shipping" value={order.shipping} />
      <DetailRow label="Tax" value={order.tax} />
      <DetailRow label="Discount" value={-order.discount} negative />
      <Separator className="my-2 sm:my-3" />
      <DetailRow
        label="Total Amount"
        value={order.total}
        strong
        large
      />
      <div className="pt-1 sm:pt-2">
        <DetailRow
          label="Amount Paid"
          value={order.total}
          strong
          success
        />
      </div>
    </CardContent>
  </Card>
);

const ShippingAddressCard: React.FC<{ order: IOrder }> = ({ order }) => (
  <Card className="border border-border/40 shadow-lg hover:shadow-xl transition-all duration-300">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-semibold">
        <IconWrapper className="bg-red-500/10">
          <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
        </IconWrapper>
        Shipping Address
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ShippingAddressContent address={order.shippingAddress} />
    </CardContent>
  </Card>
);

const ShippingAddressContent: React.FC<{ address: IOrder['shippingAddress'] }> = ({ address }) => (
  <div className="space-y-2 sm:space-y-3 text-sm">
    <div className="flex items-start gap-2 sm:gap-3">
      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
      <div className="space-y-1 min-w-0 flex-1">
        <p className="font-semibold text-foreground text-sm">{address.fullName}</p>
        <p className="text-muted-foreground text-xs sm:text-sm">{address.addressLine1}</p>
        {address.addressLine2 && (
          <p className="text-muted-foreground text-xs sm:text-sm">{address.addressLine2}</p>
        )}
        <p className="text-muted-foreground text-xs sm:text-sm">
          {address.city}, {address.state} {address.postalCode}
        </p>
        <p className="text-muted-foreground text-xs sm:text-sm">{address.country}</p>
        <p className="text-muted-foreground text-xs sm:text-sm flex items-center gap-1 mt-1 sm:mt-2">
          📞 {address.phone}
        </p>
        {address.email && (
          <p className="text-muted-foreground text-xs sm:text-sm flex items-center gap-1">
            ✉️ {address.email}
          </p>
        )}
      </div>
    </div>
  </div>
);

const OrderNotesCard: React.FC<{ notes: string }> = ({ notes }) => (
  <Card className="border border-border/40 shadow-lg hover:shadow-xl transition-all duration-300">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-semibold">
        <IconWrapper className="bg-blue-500/10">
          <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
        </IconWrapper>
        Order Notes
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-xs sm:text-sm text-muted-foreground italic">{notes}</p>
    </CardContent>
  </Card>
);

const IconWrapper: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`p-2 rounded-lg ${className}`}>
    {children}
  </div>
);

export default OrderDetailsModal;