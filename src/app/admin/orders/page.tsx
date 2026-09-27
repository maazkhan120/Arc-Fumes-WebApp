import React from "react";
import { getAdminOrders } from "@/lib/admin-cache";
import OrdersManagerClient from "./OrdersManagerClient";
import { OrderData } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  let orders: OrderData[] = [];

  try {
    const dbOrders = await getAdminOrders();
    orders = dbOrders as unknown as OrderData[];
  } catch (error) {
    console.warn("Could not fetch orders:", error);
  }

  return <OrdersManagerClient initialOrders={orders} />;
}
