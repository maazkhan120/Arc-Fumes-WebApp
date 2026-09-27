"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderData, OrderStatusType } from "@/types";
import { Search, CheckCircle2, Circle, Clock, PackageCheck, Truck, Ban, AlertCircle, Loader2 } from "lucide-react";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("order") || "");
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrder = async (orderNum: string, userQuery: string) => {
    if (!orderNum.trim() || isLoading) return;
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/orders/track?order=${encodeURIComponent(orderNum.trim())}&query=${encodeURIComponent(
          userQuery.trim()
        )}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Order not found.");
      }

      setOrder(data.order);
    } catch (err: any) {
      setError(err.message || "Could not locate order.");
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initialOrder = searchParams.get("order");
    const initialQuery = searchParams.get("query") || "";
    if (initialOrder) {
      fetchOrder(initialOrder, initialQuery);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderNumber, query);
  };

  const standardSteps: OrderStatusType[] = ["PENDING", "CONFIRMED", "DISPATCHED", "COMPLETED"];
  const isCancelled = order?.status === "CANCELLED";
  const isReturned = order?.status === "RETURNED";

  const getStepIndex = (status?: OrderStatusType) => {
    switch (status) {
      case "PENDING":
        return 0;
      case "CONFIRMED":
        return 1;
      case "DISPATCHED":
        return 2;
      case "COMPLETED":
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(order?.status);

  return (
    <>
      {/* Search Form Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-black/5 shadow-sm max-w-2xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-razen-muted font-medium mb-1.5">
                Order Number *
              </label>
              <input
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. RAZ-10231"
                className="w-full text-xs p-3 rounded-lg border border-black/15 focus:border-razen-gold focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-razen-muted font-medium mb-1.5">
                Email or Phone (Optional)
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="0300... or name@mail.com"
                className="w-full text-xs p-3 rounded-lg border border-black/15 focus:border-razen-gold focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-razen-black hover:bg-razen-gold text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] flex items-center justify-center space-x-2 transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Search size={14} />
            )}
            <span>{isLoading ? "Locating Order..." : "Track Order"}</span>
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 flex items-center space-x-2">
            <AlertCircle size={15} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Order Tracking Display */}
      {order && (
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 sm:p-10 space-y-10 animate-fade-in">
          {/* Top Order Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-black/5 gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-razen-gold font-semibold">
                Order Details
              </span>
              <h2 className="text-2xl font-mono font-bold text-razen-black mt-0.5">
                #{order.orderNumber}
              </h2>
              <p className="text-xs text-razen-muted mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-razen-muted">Current Status</span>
              <div className="text-sm font-semibold tracking-wider text-razen-black uppercase mt-0.5">
                {order.status}
              </div>
              {order.trackingNumber && (
                <p className="text-xs font-mono text-razen-gold mt-1">
                  Tracking #: {order.trackingNumber}
                </p>
              )}
            </div>
          </div>

          {/* Visual Timeline */}
          <div className="py-4">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-razen-black mb-8">
              Delivery Progression
            </h3>

            {isCancelled || isReturned ? (
              <div className="p-6 rounded-xl bg-red-50/70 border border-red-200/60 flex items-start space-x-4">
                <Ban size={22} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-red-700">
                    Order {order.status}
                  </h4>
                  <p className="text-xs text-red-600 mt-1 leading-relaxed">
                    This order has been updated to {order.status.toLowerCase()}. Please contact our concierge at orders@arcfumes.com for any enquiries.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 relative">
                {standardSteps.map((step, idx) => {
                  const isCompleted = currentStepIdx >= idx;
                  const isCurrent = currentStepIdx === idx;

                  return (
                    <div key={step} className="flex flex-col items-center text-center relative z-10">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 mb-3 ${
                          isCompleted
                            ? "bg-razen-gold text-white shadow-md"
                            : "bg-razen-surface border border-black/10 text-razen-muted"
                        } ${isCurrent ? "ring-4 ring-razen-gold/20" : ""}`}
                      >
                        {isCompleted ? <CheckCircle2 size={18} /> : <Circle size={14} />}
                      </div>

                      <span
                        className={`text-xs uppercase tracking-wider font-semibold ${
                          isCompleted ? "text-razen-black" : "text-razen-muted"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Status History Logs */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-black/5">
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-razen-black">
                Status History
              </h3>
              <div className="space-y-3">
                {order.statusHistory.map((hist) => (
                  <div
                    key={hist.id}
                    className="p-4 rounded-xl bg-razen-surface border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2"
                  >
                    <div className="space-y-0.5">
                      <span className="font-semibold text-razen-black tracking-wide">
                        {hist.status}
                      </span>
                      {hist.comment && (
                        <p className="text-razen-muted italic">"{hist.comment}"</p>
                      )}
                    </div>
                    <span className="text-[11px] text-razen-muted font-mono">
                      {formatDate(hist.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items in Order */}
          <div className="space-y-4 pt-6 border-t border-black/5">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-razen-black">
              Package Contents
            </h3>
            <div className="divide-y divide-black/5">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    {item.productImage && (
                      <div className="relative w-12 h-14 bg-razen-surface rounded p-1">
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-razen-black">{item.productName}</p>
                      <p className="text-[11px] text-razen-muted">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-razen-black">
                    {formatPrice(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-baseline pt-4 border-t border-black/5 text-razen-black font-bold">
              <span className="text-xs uppercase tracking-widest text-razen-muted">
                Total Paid / Due
              </span>
              <span className="text-lg">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          {/* Delivery Destination */}
          <div className="pt-6 border-t border-black/5 text-xs text-razen-muted space-y-1">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-razen-black mb-2">
              Destination Address
            </p>
            <p className="text-razen-charcoal">{order.customerName}</p>
            <p>{order.address}</p>
            <p>
              {order.city}, {order.province} {order.postalCode || ""}
            </p>
            <p>Phone: {order.phone}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="pt-32 pb-24 bg-razen-surface min-h-screen">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-[11px] uppercase tracking-[0.3em] text-razen-gold font-medium mb-2">
            Order Concierge
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-light text-razen-black">
            Track Your Shipment
          </h1>
          <p className="text-xs sm:text-sm text-razen-muted mt-3 font-light">
            Enter your order reference and phone number or email to view real-time delivery status.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="text-center py-12 text-xs text-razen-muted">
              Loading concierge tracking...
            </div>
          }
        >
          <TrackOrderContent />
        </Suspense>
      </div>
    </div>
  );
}
