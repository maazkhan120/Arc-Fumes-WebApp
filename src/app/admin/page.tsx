import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  DollarSign,
  Package,
  TrendingUp,
  XCircle,
  RotateCcw,
  ArrowRight,
} from "lucide-react";

import { getAdminOrders } from "@/lib/admin-cache";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let orders: any[] = [];
  let totalRevenue = 0;
  let todayOrdersCount = 0;
  let todayRevenue = 0;

  try {
    orders = await getAdminOrders();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    totalRevenue = orders
      .filter((o) => o.status !== "CANCELLED" && o.status !== "RETURNED")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const todayOrders = orders.filter((o) => new Date(o.createdAt) >= startOfToday);
    todayOrdersCount = todayOrders.length;
    todayRevenue = todayOrders
      .filter((o) => o.status !== "CANCELLED" && o.status !== "RETURNED")
      .reduce((sum, o) => sum + o.totalAmount, 0);
  } catch (error) {
    console.warn("Could not fetch dashboard metrics:", error);
  }

  // Calculate status breakdowns
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const confirmedCount = orders.filter((o) => o.status === "CONFIRMED").length;
  const dispatchedCount = orders.filter((o) => o.status === "DISPATCHED").length;
  const completedCount = orders.filter((o) => o.status === "COMPLETED").length;
  const cancelledCount = orders.filter((o) => o.status === "CANCELLED").length;
  const returnedCount = orders.filter((o) => o.status === "RETURNED").length;

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
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time sales, order lifecycle, and fulfillment analytics.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/orders"
            className="bg-razen-gold hover:bg-razen-gold-dark text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-colors shadow-sm"
          >
            <span>Manage Orders</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Top High-Level KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <DollarSign size={24} />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Total Net Revenue</span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">{formatPrice(totalRevenue)}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <ShoppingBag size={24} />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Total Orders</span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">{orders.length}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Today's Revenue</span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">{formatPrice(todayRevenue)}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Today's Orders</span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">{todayOrdersCount}</h3>
          </div>
        </div>
      </div>

      {/* Lifecycle Order Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] uppercase font-semibold tracking-wider text-amber-700 block">
            Pending
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{pendingCount}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] uppercase font-semibold tracking-wider text-blue-700 block">
            Confirmed
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{confirmedCount}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] uppercase font-semibold tracking-wider text-purple-700 block">
            Dispatched
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{dispatchedCount}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] uppercase font-semibold tracking-wider text-emerald-700 block">
            Completed
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{completedCount}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] uppercase font-semibold tracking-wider text-red-700 block">
            Cancelled
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{cancelledCount}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] uppercase font-semibold tracking-wider text-slate-600 block">
            Returned
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{returnedCount}</span>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-razen-gold hover:text-razen-gold-dark"
          >
            View All Orders →
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No orders recorded yet. As orders are placed, they will appear here live.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Order #</th>
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">Amount</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Placed At</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 8).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono font-semibold text-slate-900">
                      #{order.orderNumber}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-800">{order.customerName}</div>
                      <div className="text-[11px] text-slate-400">{order.city}</div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-mono">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/admin/orders?search=${order.orderNumber}`}
                        className="text-xs font-semibold text-razen-gold hover:text-razen-gold-dark"
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
