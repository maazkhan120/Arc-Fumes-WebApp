import React from "react";
import { getProducts } from "@/lib/products";
import ProductsManagerClient from "./ProductsManagerClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getProducts();
  return <ProductsManagerClient initialProducts={products} />;
}
