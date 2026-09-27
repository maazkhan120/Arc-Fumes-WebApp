"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { ProductItem } from "@/types";

export default function InteractiveShowcase({ products }: { products: ProductItem[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const currentProduct = products[selectedIndex] || products[0];
  if (!currentProduct) return null;

  const mainImage = currentProduct.images?.[0]?.imageUrl || "/razen-assets/relma1.png";
  const noteStrip = currentProduct.images?.[1]?.imageUrl || "/razen-assets/hs2.png";

  const variants = [
    {
      name: "Elma",
      liquidColor: "linear-gradient(135deg, #f7dfdf, #e5c3c3)",
      glowColor: "rgba(158, 140, 120, 0.2)",
    },
    {
      name: "Mavi",
      liquidColor: "linear-gradient(135deg, #fcedb6, #f3de92)",
      glowColor: "rgba(70, 130, 220, 0.2)",
    },
    {
      name: "Serin",
      liquidColor: "linear-gradient(135deg, #3d3d3d, #0a0a0a)",
      glowColor: "rgba(120, 40, 40, 0.25)",
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-razen-surface border-y border-black/5 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-[11px] uppercase tracking-[0.3em] text-razen-gold font-medium mb-2">
            Interactive Experience
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-light text-razen-black">
            The Olfactory Spectrum
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Column */}
          <div className="lg:col-span-6 flex items-center justify-center relative">
            {/* Variant Selector Liquid Dots */}
            <div className="flex flex-col space-y-4 mr-6 sm:mr-10 z-20">
              {products.map((p, idx) => {
                const varStyle = variants[idx] || variants[0];
                const isActive = selectedIndex === idx;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedIndex(idx);
                      setQuantity(1);
                    }}
                    className={`relative w-10 h-10 rounded-full transition-all duration-300 p-0.5 ${
                      isActive
                        ? "ring-2 ring-razen-gold ring-offset-4 ring-offset-razen-surface scale-110"
                        : "opacity-60 hover:opacity-90 hover:scale-105"
                    }`}
                    aria-label={`Select ${p.name}`}
                  >
                    <span
                      className="block w-full h-full rounded-full shadow-inner"
                      style={{ background: varStyle.liquidColor }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Bottle Showcase with Glow */}
            <div className="relative w-72 sm:w-96 h-96 sm:h-[460px] flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full blur-3xl transition-colors duration-700 pointer-events-none"
                style={{
                  background: variants[selectedIndex]?.glowColor || "rgba(158, 140, 120, 0.2)",
                }}
              />
              <div className="relative w-full h-full p-6 transition-all duration-700 animate-fade-in">
                <Image
                  key={currentProduct.id}
                  src={mainImage}
                  alt={currentProduct.name}
                  fill
                  className="object-contain drop-shadow-2xl transition-all duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.25em] text-razen-gold font-medium">
                Arcfumes Collection — 0{selectedIndex + 1}
              </p>
              <h3 className="font-display text-4xl sm:text-5xl font-light text-razen-black">
                {currentProduct.name}
              </h3>
              <p className="text-xs uppercase tracking-widest text-razen-muted">
                {currentProduct.size}
              </p>
            </div>

            <p className="text-sm text-razen-muted leading-relaxed font-light max-w-lg">
              {currentProduct.description}
            </p>

            {/* Fragrance Notes Matrix */}
            <div className="border-y border-black/10 py-5 space-y-3">
              <div className="flex items-start text-xs">
                <span className="w-16 uppercase tracking-[0.2em] font-semibold text-razen-gold text-[10px]">
                  Top
                </span>
                <span className="text-razen-charcoal font-light flex-1">
                  {currentProduct.topNotes}
                </span>
              </div>
              <div className="flex items-start text-xs">
                <span className="w-16 uppercase tracking-[0.2em] font-semibold text-razen-gold text-[10px]">
                  Heart
                </span>
                <span className="text-razen-charcoal font-light flex-1">
                  {currentProduct.middleNotes}
                </span>
              </div>
              <div className="flex items-start text-xs">
                <span className="w-16 uppercase tracking-[0.2em] font-semibold text-razen-gold text-[10px]">
                  Base
                </span>
                <span className="text-razen-charcoal font-light flex-1">
                  {currentProduct.baseNotes}
                </span>
              </div>
            </div>

            {/* Price & Cart Actions */}
            <div className="space-y-5 pt-2">
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-semibold text-razen-black">
                  {formatPrice(currentProduct.price)}
                </span>
                {currentProduct.compareAtPrice && (
                  <span className="text-sm text-razen-muted line-through">
                    {formatPrice(currentProduct.compareAtPrice)}
                  </span>
                )}
                <span className="text-[10px] uppercase tracking-widest font-semibold bg-razen-sand text-razen-gold-dark px-2.5 py-0.5 rounded-full">
                  Complimentary Shipping
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-black/15 rounded-full px-4 py-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-razen-muted hover:text-razen-black transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="mx-4 text-xs font-semibold text-razen-black min-w-[20px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(currentProduct.stock || 99, quantity + 1))}
                    className="text-razen-muted hover:text-razen-black transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Add to cart */}
                <button
                  onClick={() =>
                    addItem(
                      {
                        id: currentProduct.id,
                        productId: currentProduct.id,
                        name: currentProduct.name,
                        slug: currentProduct.slug,
                        price: currentProduct.price,
                        image: mainImage,
                        size: currentProduct.size,
                        stock: currentProduct.stock,
                      },
                      quantity
                    )
                  }
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-3 bg-razen-black hover:bg-razen-gold text-white px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  <ShoppingBag size={14} />
                  <span>Add to Basket</span>
                </button>

                {/* View Details Link */}
                <Link
                  href={`/products/${currentProduct.slug}`}
                  className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-[0.18em] font-medium text-razen-muted hover:text-razen-gold transition-colors py-2 px-3"
                >
                  <span>Product Story</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
