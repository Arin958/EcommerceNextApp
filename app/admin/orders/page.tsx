"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { IOrder, OrderStatus, PaymentStatus } from "@/types";
import { Download, RefreshCw, Truck, Clock, CheckCircle, XCircle } from "lucide-react";
import FiltersAndSearch from "@/components/FiltersAndSearch";
import OrdersTable from "@/components/OrdersTable";
import OrderDetailsModal from "@/components/OrderModal";

interface OrderStats {
  total: number;
  paid: number;
  pending: number;
  shipped: number;
}




const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    paid: 0,
    pending: 0,
    shipped: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const limit = 10;

  const fetchOrders = async (page: number, search = "", status = "all", payment = "all") => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(status !== "all" && { status }),
        ...(payment !== "all" && { payment })
      });

      const res = await fetch(`/api/order/get?${queryParams}`);
      const data = await res.json();
      
      if (data.success) {
        setOrders(data.orders);
        setPages(data.pagination.pages);
        setStats(data.stats || stats);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete this order? This action cannot be undone.");
      if (!confirm) return;

      const res = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Order deleted successfully");
        fetchOrders(page, searchTerm, statusFilter, paymentFilter);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };

  const updateOrderStatus = async (id: string, newStatus: OrderStatus) => {
    try {
      setUpdatingOrderId(id);
      const res = await fetch(`/api/order/put/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders(page, searchTerm, statusFilter, paymentFilter);
        // Update selected order if it's the one being updated
        if (selectedOrder && selectedOrder._id === id) {
          setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const updatePaymentStatus = async (id: string, newStatus: PaymentStatus) => {
    try {
      setUpdatingOrderId(id);
      const res = await fetch(`/api/order/put/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentStatus: newStatus }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`Payment status updated to ${newStatus}`);
        fetchOrders(page, searchTerm, statusFilter, paymentFilter);
        // Update selected order if it's the one being updated
        if (selectedOrder && selectedOrder._id === id) {
          setSelectedOrder({ ...selectedOrder, paymentStatus: newStatus });
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleViewDetails = (order: IOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchOrders(1, searchTerm, statusFilter, paymentFilter);
  };

  const handleExport = () => {
    toast.info("Export feature coming soon...");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "placed": return <Clock className="h-3 w-3" />;
      case "shipped": return <Truck className="h-3 w-3" />;
      case "delivered": return <CheckCircle className="h-3 w-3" />;
      case "cancelled": return <XCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "placed": return "secondary";
      case "shipped": return "default";
      case "delivered": return "success";
      case "cancelled": return "destructive";
      default: return "secondary";
    }
  };

  const getPaymentVariant = (status: string) => {
    return status === "paid" ? "success" : "destructive";
  };

  useEffect(() => {
    fetchOrders(page, searchTerm, statusFilter, paymentFilter);
  }, [page, statusFilter, paymentFilter]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all customer orders
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            variant="outline" 
            onClick={() => fetchOrders(page, searchTerm, statusFilter, paymentFilter)}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <FiltersAndSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        paymentFilter={paymentFilter}
        onPaymentFilterChange={setPaymentFilter}
      />

      {/* Orders Table */}
      <Card className="shadow-sm">
        <CardContent className="p-0 overflow-x-auto">
          <OrdersTable
            orders={orders}
            loading={loading}
            onViewDetails={handleViewDetails}
            onDeleteOrder={deleteOrder}
            onUpdateOrderStatus={updateOrderStatus}
            getStatusIcon={getStatusIcon}
            getStatusVariant={getStatusVariant}
            getPaymentVariant={getPaymentVariant}
            updatingOrderId={updatingOrderId}
          />
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        getStatusVariant={getStatusVariant}
        getStatusIcon={getStatusIcon}
        getPaymentVariant={getPaymentVariant}
        onUpdateOrderStatus={updateOrderStatus}
        onUpdatePaymentStatus={updatePaymentStatus}
        updatingOrderId={updatingOrderId}
      />

      {/* Pagination */}
      {orders.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {orders.length} of {stats.total} orders
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <span className="px-3 py-2 text-sm font-medium">
              Page {page} of {pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === pages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;