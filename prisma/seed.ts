import { PrismaClient, Category } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting RAZEN Perfume database seed...");

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "admin@razenperfume.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "RazenAdmin2026!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: "RAZEN Admin",
    },
    create: {
      email: adminEmail,
      name: "RAZEN Admin",
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });
  console.log(`✅ Admin user seeded: ${admin.email}`);

  // 2. Seed 3 Signature Perfumes
  const perfumes = [
    {
      name: "Elma",
      slug: "elma",
      sku: "RAZ-ELM-01",
      price: 2350,
      compareAtPrice: 2645,
      category: Category.UNISEX,
      size: "30ml EDP",
      stock: 50,
      featured: true,
      active: true,
      shortDescription: "Warm golden sunlight captured in glass.",
      description:
        "Elma blooms with the delicate sweetness of apple blossom and bright bergamot, unfolding into a warm amber heart. A radiant scent that captures golden sunlight in a bottle. Crafted for those who appreciate quiet refinement and modern luxury.",
      fragranceNotes: "Apple blossom, Bergamot, Rose absolute, Amber, White cedar, Musk",
      topNotes: "Apple blossom, Bergamot",
      middleNotes: "Rose absolute, Amber",
      baseNotes: "White cedar, Musk",
      images: [
        { imageUrl: "/razen-assets/relma1.png", altText: "Elma Eau De Parfum Bottle", sortOrder: 0 },
        { imageUrl: "/razen-assets/hs2.png", altText: "Elma Fragrance Notes Texture", sortOrder: 1 },
      ],
    },
    {
      name: "Mavi",
      slug: "mavi",
      sku: "RAZ-MAV-02",
      price: 2350,
      compareAtPrice: 2645,
      category: Category.UNISEX,
      size: "30ml EDP",
      stock: 45,
      featured: true,
      active: true,
      shortDescription: "Cool ocean breeze and coastal tranquility.",
      description:
        "Mavi opens with the crisp, bracing energy of sea salt and bergamot, settling into a tranquil driftwood heart. A scent that evokes the serenity of a cool ocean breeze, pristine shores, and timeless open skies.",
      fragranceNotes: "Sea salt, Bergamot, Driftwood, Blue lotus, Oakmoss, Ambergris",
      topNotes: "Sea salt, Bergamot",
      middleNotes: "Driftwood, Blue lotus",
      baseNotes: "Oakmoss, Ambergris",
      images: [
        { imageUrl: "/razen-assets/rmavi1.png", altText: "Mavi Eau De Parfum Bottle", sortOrder: 0 },
        { imageUrl: "/razen-assets/hs3.png", altText: "Mavi Fragrance Notes Texture", sortOrder: 1 },
      ],
    },
    {
      name: "Serin",
      slug: "serin",
      sku: "RAZ-SER-03",
      price: 2350,
      compareAtPrice: 2645,
      category: Category.UNISEX,
      size: "30ml EDP",
      stock: 40,
      featured: true,
      active: true,
      shortDescription: "Dark, enigmatic, matte elegance.",
      description:
        "Serin is a deep, enigmatic fragrance where smoky vanilla meets the raw intensity of black oud and rich leather. A daring composition that leaves a matte, mysterious trail for those who command presence without uttering a word.",
      fragranceNotes: "Black oud, Vetiver, Smoked vanilla, Leather, Sandalwood, Incense",
      topNotes: "Black oud, Vetiver",
      middleNotes: "Smoked vanilla, Leather",
      baseNotes: "Sandalwood, Incense",
      images: [
        { imageUrl: "/razen-assets/rserin1.png", altText: "Serin Eau De Parfum Bottle", sortOrder: 0 },
        { imageUrl: "/razen-assets/hs1.png", altText: "Serin Fragrance Notes Texture", sortOrder: 1 },
      ],
    },
  ];

  for (const perfume of perfumes) {
    const { images, ...productData } = perfume;
    const existing = await prisma.product.findUnique({
      where: { slug: perfume.slug },
    });

    let productId: string;
    if (existing) {
      const updated = await prisma.product.update({
        where: { slug: perfume.slug },
        data: productData,
      });
      productId = updated.id;
      // Delete old images to avoid duplicate links
      await prisma.productImage.deleteMany({ where: { productId } });
    } else {
      const created = await prisma.product.create({
        data: productData,
      });
      productId = created.id;
    }

    // Insert images
    for (const img of images) {
      await prisma.productImage.create({
        data: {
          productId,
          imageUrl: img.imageUrl,
          altText: img.altText,
          sortOrder: img.sortOrder,
        },
      });
    }

    console.log(`✅ Perfume seeded: ${perfume.name} (${perfume.slug})`);
  }

  console.log("✨ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
