import React from "react";
import { getAdminOrders } from "@/lib/admin-cache";
import { formatPrice, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  let customers: any[] = [];

  try {
    const orders = await getAdminOrders();

    const customerMap = new Map<string, any>();

    for (const order of orders) {
      const key = order.email.toLowerCase();
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          name: order.customerName,
          email: order.email,
          phone: order.phone,
          city: order.city,
          orderCount: 1,
          totalSpent: order.totalAmount,
          lastOrderDate: order.createdAt,
        });
      } else {
        const existing = customerMap.get(key);
        existing.orderCount += 1;
        existing.totalSpent += order.totalAmount;
      }
    }

    customers = Array.from(customerMap.values());
  } catch (error) {
    console.warn("Customer aggregation error:", error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Directory</h1>
        <p className="text-xs text-slate-500 mt-1">
          Aggregated client profiles derived from order history and repeat patronage.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {customers.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No customer profiles compiled yet. Placed orders will automatically generate client profiles.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Customer Name</th>
                  <th className="py-3.5 px-6">Email Address</th>
                  <th className="py-3.5 px-6">Phone Number</th>
                  <th className="py-3.5 px-6">Location</th>
                  <th className="py-3.5 px-6">Total Orders</th>
                  <th className="py-3.5 px-6">Lifetime Value</th>
                  <th className="py-3.5 px-6 text-right">Last Purchase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">{c.name}</td>
                    <td className="py-4 px-6 text-slate-600">{c.email}</td>
                    <td className="py-4 px-6 font-mono text-slate-500">{c.phone}</td>
                    <td className="py-4 px-6 text-slate-700">{c.city}</td>
                    <td className="py-4 px-6 font-semibold text-slate-800">
                      {c.orderCount} order{c.orderCount > 1 ? "s" : ""}
                    </td>
                    <td className="py-4 px-6 font-bold text-emerald-700">
                      {formatPrice(c.totalSpent)}
                    </td>
                    <td className="py-4 px-6 text-right text-slate-500 font-mono">
                      {formatDate(c.lastOrderDate)}
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
