import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { sendOrderStatusEmail } from "@/lib/email";
import { OrderData, OrderStatusType } from "@/types";
import { invalidateOrdersCache } from "@/lib/admin-cache";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const { status, comment, trackingNumber } = await req.json();

    if (!status) {
      return NextResponse.json({ error: "New status is required." }, { status: 400 });
    }

    const orderId = params.id;

    // 1. Fetch current order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const previousStatus = order.status;
    const newStatus = status as OrderStatusType;

    // 2. Perform Stock Restoration if order is Cancelled or Returned
    const shouldRestoreStock =
      (newStatus === "CANCELLED" && previousStatus !== "CANCELLED" && previousStatus !== "RETURNED") ||
      (newStatus === "RETURNED" && previousStatus !== "RETURNED" && previousStatus !== "CANCELLED");

    const updatedOrder = await prisma.$transaction(async (tx) => {
      if (shouldRestoreStock) {
        for (const item of order.items) {
          if (item.productId) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity } },
            });
          }
        }
      }

      // Update Order record
      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          status: newStatus,
          ...(trackingNumber ? { trackingNumber } : {}),
          statusHistory: {
            create: {
              status: newStatus,
              comment: comment || `Status modified from ${previousStatus} to ${newStatus} by admin.`,
            },
          },
        },
        include: {
          items: true,
          statusHistory: {
            orderBy: { createdAt: "desc" },
          },
        },
      });

      return updated;
    });

    // 3. Dispatch status update email
    try {
      await sendOrderStatusEmail(
        updatedOrder as unknown as OrderData,
        newStatus,
        comment
      );
    } catch (emailErr) {
      console.warn("Background status email notification warning:", emailErr);
    }

    // Invalidate admin cache so status update displays immediately across dashboard & orders
    invalidateOrdersCache();

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error("Order status update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update status." },
      { status: 500 }
    );
  }
}
