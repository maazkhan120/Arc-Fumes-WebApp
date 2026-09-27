import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { INITIAL_PRODUCTS } from "@/lib/products-static";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const where: any = {};
    if (category && category !== "ALL") {
      where.category = category;
    }

    try {
      const products = await prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { sortOrder: "asc" } },
        },
        orderBy: { createdAt: "desc" },
      });

      if (products.length > 0) {
        return NextResponse.json({ products });
      }
    } catch (e) {
      console.warn("Prisma products fetch failed, using fallback:", e);
    }

    return NextResponse.json({ products: INITIAL_PRODUCTS });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      description,
      shortDescription,
      price,
      compareAtPrice,
      category = "UNISEX",
      stock = 0,
      sku,
      size = "30ml EDP",
      fragranceNotes,
      topNotes,
      middleNotes,
      baseNotes,
      featured = false,
      active = true,
      images = [],
    } = body;

    if (!name || !price || !sku || !topNotes || !middleNotes || !baseNotes) {
      return NextResponse.json(
        { error: "Name, price, SKU, and fragrance notes are required." },
        { status: 400 }
      );
    }

    const slug = slugify(name);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || "",
        shortDescription: shortDescription || "",
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        category,
        stock: parseInt(stock, 10),
        sku,
        size,
        fragranceNotes,
        topNotes,
        middleNotes,
        baseNotes,
        featured: Boolean(featured),
        active: Boolean(active),
        images: {
          create: images.map((img: any, idx: number) => ({
            imageUrl: img.imageUrl,
            r2Key: img.r2Key || null,
            altText: img.altText || name,
            sortOrder: idx,
          })),
        },
      },
      include: { images: true },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create product." },
      { status: 500 }
    );
  }
}
