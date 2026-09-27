"use client";

import React, { useState } from "react";
import Image from "next/image";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderData, OrderStatusType } from "@/types";
import {
  Search,
  CheckCircle2,
  Truck,
  Ban,
  RotateCcw,
  Clock,
  Eye,
  X,
  Send,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function OrdersManagerClient({ initialOrders }: { initialOrders: OrderData[] }) {
  const [orders, setOrders] = useState<OrderData[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

  // Status update modal state
  const [isUpdating, setIsUpdating] = useState(false);
  const [targetStatus, setTargetStatus] = useState<OrderStatusType | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState("");
  const [adminComment, setAdminComment] = useState("");
  const [actionError, setActionError] = useState("");

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenStatusModal = (status: OrderStatusType) => {
    setTargetStatus(status);
    setActionError("");
    setAdminComment("");
    setTrackingNumberInput(selectedOrder?.trackingNumber || "");
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !targetStatus || isUpdating) return;
    setIsUpdating(true);
    setActionError("");

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: targetStatus,
          comment: adminComment,
          trackingNumber: trackingNumberInput || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update status.");
      }

      // Update state in orders list
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, ...data.order } : o))
      );
      setSelectedOrder({ ...selectedOrder, ...data.order });
      setTargetStatus(null);
    } catch (err: any) {
      setActionError(err.message || "Failed to update order.");
    } finally {
      setIsUpdating(false);
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "CONFIRMED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "DISPATCHED":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200";
      case "RETURNED":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Order Fulfillment</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review incoming orders, advance fulfillment stages, add tracking, and trigger customer updates.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer, phone..."
            className="w-full text-xs pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-razen-gold"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            "ALL",
            "PENDING",
            "CONFIRMED",
            "DISPATCHED",
            "COMPLETED",
            "CANCELLED",
            "RETURNED",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No orders match your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Order #</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Payment</th>
                  <th className="py-3.5 px-6">Amount</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono font-semibold text-slate-900">
                      #{o.orderNumber}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900">{o.customerName}</div>
                      <div className="text-[11px] text-slate-500">{o.phone}</div>
                      <div className="text-[11px] text-slate-400">{o.city}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono uppercase text-[11px] font-medium text-slate-700">
                        {o.paymentMethod}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {formatPrice(o.totalAmount)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadge(
                          o.status
                        )}`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-mono">
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="inline-flex items-center space-x-1 bg-slate-100 hover:bg-razen-gold hover:text-white px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700 transition-colors"
                      >
                        <Eye size={13} />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-razen-gold font-bold">
                  Order Management
                </span>
                <h3 className="text-xl font-mono font-bold text-slate-900">
                  #{selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-slate-400 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-slate-700">
              {/* Status Action Buttons Bar (Section 13 & 18 rules) */}
              <div className="bg-slate-100/70 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-slate-500 block text-[11px]">Current Lifecycle State</span>
                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusBadge(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {selectedOrder.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleOpenStatusModal("CONFIRMED")}
                        disabled={isUpdating}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg font-semibold flex items-center space-x-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle2 size={14} />
                        <span>Confirm Order</span>
                      </button>
                      <button
                        onClick={() => handleOpenStatusModal("CANCELLED")}
                        disabled={isUpdating}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-semibold flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Ban size={14} />
                        <span>Cancel Order</span>
                      </button>
                    </>
                  )}

                  {selectedOrder.status === "CONFIRMED" && (
                    <>
                      <button
                        onClick={() => handleOpenStatusModal("DISPATCHED")}
                        disabled={isUpdating}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3.5 py-2 rounded-lg font-semibold flex items-center space-x-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Truck size={14} />
                        <span>Dispatch Shipment</span>
                      </button>
                      <button
                        onClick={() => handleOpenStatusModal("CANCELLED")}
                        disabled={isUpdating}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-semibold flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Ban size={14} />
                        <span>Cancel Order</span>
                      </button>
                    </>
                  )}

                  {selectedOrder.status === "DISPATCHED" && (
                    <>
                      <button
                        onClick={() => handleOpenStatusModal("COMPLETED")}
                        disabled={isUpdating}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg font-semibold flex items-center space-x-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle2 size={14} />
                        <span>Mark Completed</span>
                      </button>
                      <button
                        onClick={() => handleOpenStatusModal("RETURNED")}
                        disabled={isUpdating}
                        className="bg-slate-700 hover:bg-slate-800 text-white px-3 py-2 rounded-lg font-semibold flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RotateCcw size={14} />
                        <span>Mark Returned</span>
                      </button>
                    </>
                  )}

                  {selectedOrder.status === "COMPLETED" && (
                    <button
                      onClick={() => handleOpenStatusModal("RETURNED")}
                      disabled={isUpdating}
                      className="bg-slate-700 hover:bg-slate-800 text-white px-3 py-2 rounded-lg font-semibold flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RotateCcw size={14} />
                      <span>Process Return</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Status Action Confirmation Modal */}
              {targetStatus && (
                <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-amber-900 text-sm">
                      Advance Status to {targetStatus}?
                    </h4>
                    <button
                      onClick={() => setTargetStatus(null)}
                      className="text-amber-800 hover:text-black font-semibold text-xs"
                    >
                      Dismiss
                    </button>
                  </div>

                  {targetStatus === "DISPATCHED" && (
                    <div>
                      <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                        Courier Tracking Number (Required for Dispatched)
                      </label>
                      <input
                        type="text"
                        value={trackingNumberInput}
                        onChange={(e) => setTrackingNumberInput(e.target.value)}
                        placeholder="e.g. TCS-894192 / Leopard-1234"
                        className="w-full p-2.5 rounded-lg border border-amber-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                      Admin Comment / Internal Note
                    </label>
                    <input
                      type="text"
                      value={adminComment}
                      onChange={(e) => setAdminComment(e.target.value)}
                      placeholder="e.g. Verified payment via WhatsApp / Dispatched via Leopards"
                      className="w-full p-2.5 rounded-lg border border-amber-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {actionError && (
                    <p className="text-red-600 text-xs font-semibold">{actionError}</p>
                  )}

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      onClick={() => setTargetStatus(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateStatus}
                      disabled={isUpdating}
                      className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-razen-gold text-white text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
                    >
                      {isUpdating && <Loader2 size={13} className="animate-spin" />}
                      <span>{isUpdating ? "Saving..." : "Confirm & Send Email"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Ordered Items
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {item.productImage && (
                          <div className="relative w-10 h-12 bg-slate-50 rounded p-1 flex-shrink-0">
                            <Image
                              src={item.productImage}
                              alt={item.productName}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-800">{item.productName}</p>
                          <p className="text-[11px] text-slate-500">
                            {item.quantity} × {formatPrice(item.unitPrice)}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900">
                        {formatPrice(item.totalPrice)}
                      </span>
                    </div>
                  ))}
                  <div className="p-3 bg-slate-50 flex justify-between font-bold text-slate-900">
                    <span>Total Amount</span>
                    <span>{formatPrice(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Customer & Shipping Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 border border-slate-200 p-4 rounded-xl">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    Customer Details
                  </h4>
                  <p>
                    <span className="text-slate-500">Name:</span> {selectedOrder.customerName}
                  </p>
                  <p>
                    <span className="text-slate-500">Email:</span> {selectedOrder.email}
                  </p>
                  <p>
                    <span className="text-slate-500">Phone:</span> {selectedOrder.phone}
                  </p>
                </div>

                <div className="space-y-2 border border-slate-200 p-4 rounded-xl">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    Destination Address
                  </h4>
                  <p>{selectedOrder.address}</p>
                  <p>
                    {selectedOrder.city}, {selectedOrder.province} {selectedOrder.postalCode || ""}
                  </p>
                  {selectedOrder.notes && (
                    <p className="text-amber-800 italic pt-1">
                      Notes: "{selectedOrder.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Status History Timeline */}
              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    Audit Status History
                  </h4>
                  <div className="space-y-2">
                    {selectedOrder.statusHistory.map((hist) => (
                      <div
                        key={hist.id}
                        className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px]"
                      >
                        <div>
                          <span className="font-bold text-slate-800">{hist.status}</span>
                          {hist.comment && (
                            <span className="text-slate-500 ml-2 italic">— {hist.comment}</span>
                          )}
                        </div>
                        <span className="text-slate-400 font-mono">
                          {formatDate(hist.createdAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
