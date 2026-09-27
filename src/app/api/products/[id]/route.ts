import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
      category,
      stock,
      sku,
      size,
      fragranceNotes,
      topNotes,
      middleNotes,
      baseNotes,
      featured,
      active,
      images,
    } = body;

    const productId = params.id;

    const updated = await prisma.$transaction(async (tx) => {
      // Update core fields
      const p = await tx.product.update({
        where: { id: productId },
        data: {
          ...(name ? { name } : {}),
          ...(description !== undefined ? { description } : {}),
          ...(shortDescription !== undefined ? { shortDescription } : {}),
          ...(price !== undefined ? { price: parseFloat(price) } : {}),
          ...(compareAtPrice !== undefined
            ? { compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null }
            : {}),
          ...(category ? { category } : {}),
          ...(stock !== undefined ? { stock: parseInt(stock, 10) } : {}),
          ...(sku ? { sku } : {}),
          ...(size ? { size } : {}),
          ...(fragranceNotes !== undefined ? { fragranceNotes } : {}),
          ...(topNotes ? { topNotes } : {}),
          ...(middleNotes ? { middleNotes } : {}),
          ...(baseNotes ? { baseNotes } : {}),
          ...(featured !== undefined ? { featured: Boolean(featured) } : {}),
          ...(active !== undefined ? { active: Boolean(active) } : {}),
        },
      });

      // Update images if provided
      if (images && Array.isArray(images)) {
        await tx.productImage.deleteMany({ where: { productId } });
        for (let i = 0; i < images.length; i++) {
          await tx.productImage.create({
            data: {
              productId,
              imageUrl: images[i].imageUrl,
              r2Key: images[i].r2Key || null,
              altText: images[i].altText || p.name,
              sortOrder: i,
            },
          });
        }
      }

      return p;
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update product." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete product." },
      { status: 500 }
    );
  }
}
