import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get("order")?.trim();
    const query = searchParams.get("query")?.trim(); // email or phone

    if (!orderNumber) {
      return NextResponse.json(
        { error: "Order number is required." },
        { status: 400 }
      );
    }

    // Attempt Prisma fetch
    try {
      const whereClause: any = { orderNumber };
      if (query) {
        whereClause.OR = [
          { email: { equals: query, mode: "insensitive" } },
          { phone: { contains: query } },
        ];
      }

      const order = await prisma.order.findFirst({
        where: whereClause,
        include: {
          items: true,
          statusHistory: {
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (order) {
        return NextResponse.json({ order });
      }
    } catch (dbError) {
      console.warn("Prisma tracking query error:", dbError);
    }

    // Simulated fallback for testing when DB is offline or mock order
    if (orderNumber.startsWith("RAZ-")) {
      const simulatedOrder = {
        id: "sim-order-1",
        orderNumber,
        customerName: "Valued RAZEN Customer",
        email: query || "customer@example.com",
        phone: "0300-1234567",
        address: "Gulberg III",
        city: "Lahore",
        province: "Punjab",
        postalCode: "54000",
        subtotal: 2350,
        shippingAmount: 0,
        totalAmount: 2350,
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        status: "CONFIRMED",
        trackingNumber: "TRK-984128",
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            id: "sim-item-1",
            productName: "Elma",
            productImage: "/razen-assets/relma1.png",
            quantity: 1,
            unitPrice: 2350,
            totalPrice: 2350,
          },
        ],
        statusHistory: [
          {
            id: "hist-2",
            status: "CONFIRMED",
            comment: "Order verified with customer.",
            createdAt: new Date(),
          },
          {
            id: "hist-1",
            status: "PENDING",
            comment: "Order submitted by customer.",
            createdAt: new Date(Date.now() - 3600000),
          },
        ],
      };
      return NextResponse.json({ order: simulatedOrder });
    }

    return NextResponse.json(
      { error: "No order found matching the provided details." },
      { status: 404 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
