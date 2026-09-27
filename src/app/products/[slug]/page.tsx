import React from "react";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/products";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return { title: "Fragrance Not Found — Arcfumes" };
  }

  const mainImage = product.images?.[0]?.imageUrl || "/razen-assets/relma1.png";

  return {
    title: `${product.name} Eau de Parfum — Arcfumes Luxury Fragrance`,
    description: product.shortDescription || product.description,
    openGraph: {
      title: `${product.name} — Arcfumes`,
      description: product.shortDescription,
      images: [mainImage],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
