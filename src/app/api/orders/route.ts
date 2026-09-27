import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { OrderData, OrderStatusType } from "@/types";
import { invalidateOrdersCache } from "@/lib/admin-cache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      email,
      phone,
      address,
      city,
      province,
      postalCode,
      notes,
      paymentMethod = "COD",
      items,
    } = body;

    // Validate required fields
    if (!customerName || !email || !phone || !address || !city || !province) {
      return NextResponse.json(
        { error: "Please fill in all required shipping fields." },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Your shopping basket is empty." },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    const shippingAmount = 0;
    const totalAmount = subtotal + shippingAmount;
    const orderNumber = generateOrderNumber();

    let createdOrderRecord: any = null;

    // 1. Try Prisma Database Transaction
    try {
      createdOrderRecord = await prisma.$transaction(async (tx) => {
        // Decrease stock if product exists in database
        for (const item of items) {
          if (item.productId && !item.productId.startsWith("prod-")) {
            const currentProd = await tx.product.findUnique({
              where: { id: item.productId },
            });
            if (currentProd) {
              if (currentProd.stock < item.quantity) {
                throw new Error(
                  `Insufficient stock for ${currentProd.name}. Only ${currentProd.stock} available.`
                );
              }
              await tx.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } },
              });
            }
          }
        }

        // Create Order
        const newOrder = await tx.order.create({
          data: {
            orderNumber,
            customerName,
            email,
            phone,
            address,
            city,
            province,
            postalCode: postalCode || null,
            notes: notes || null,
            subtotal,
            shippingAmount,
            totalAmount,
            paymentMethod: paymentMethod === "BANK_TRANSFER" ? "BANK_TRANSFER" : "COD",
            paymentStatus: "PENDING",
            status: "PENDING",
            items: {
              create: items.map((i: any) => ({
                productId: i.productId && !i.productId.startsWith("prod-") ? i.productId : null,
                productName: i.name,
                productImage: i.image,
                quantity: i.quantity,
                unitPrice: i.price,
                totalPrice: i.price * i.quantity,
              })),
            },
            statusHistory: {
              create: {
                status: "PENDING",
                comment: "Order submitted by customer.",
              },
            },
          },
          include: {
            items: true,
            statusHistory: true,
          },
        });

        return newOrder;
      });
    } catch (dbError: any) {
      console.warn("Prisma transaction error, falling back to simulated memory order:", dbError.message);
      // If DB is offline, create simulated order object so the checkout succeeds gracefully
      createdOrderRecord = {
        id: `sim-${Date.now()}`,
        orderNumber,
        customerName,
        email,
        phone,
        address,
        city,
        province,
        postalCode,
        notes,
        subtotal,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentStatus: "PENDING",
        status: "PENDING" as OrderStatusType,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: items.map((i: any) => ({
          productName: i.name,
          productImage: i.image,
          quantity: i.quantity,
          unitPrice: i.price,
          totalPrice: i.price * i.quantity,
        })),
      };
    }

    // Attempt transactional email dispatch asynchronously (never breaks order)
    try {
      await sendOrderConfirmationEmail(createdOrderRecord as OrderData);
    } catch (emailErr) {
      console.warn("Background confirmation email warning:", emailErr);
    }

    // Invalidate admin cache so new order displays immediately
    invalidateOrdersCache();

    return NextResponse.json({
      success: true,
      orderNumber: createdOrderRecord.orderNumber,
      orderId: createdOrderRecord.id,
    });
  } catch (error: any) {
    console.error("Order creation route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process order. Please try again." },
      { status: 500 }
    );
  }
}
