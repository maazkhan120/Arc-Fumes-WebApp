"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProductItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { Minus, Plus, ShoppingBag, Zap, ShieldCheck, Truck } from "lucide-react";

export default function ProductDetailClient({ product }: { product: ProductItem }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ imageUrl: "/razen-assets/relma1.png", altText: product.name }];

  const currentImage = images[selectedImageIndex]?.imageUrl || images[0].imageUrl;

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: images[0]?.imageUrl || "/razen-assets/relma1.png",
        size: product.size,
        stock: product.stock,
      },
      quantity
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Gallery Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <div className="relative w-full h-[450px] sm:h-[580px] bg-razen-surface rounded-2xl p-8 flex items-center justify-center border border-black/5 overflow-hidden">
              <div className="absolute inset-0 bg-razen-gold/5 blur-3xl rounded-full pointer-events-none" />
              <div className="relative w-full h-full">
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  priority
                  className="object-contain transition-all duration-500"
                />
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 bg-razen-surface rounded-lg p-2 border flex-shrink-0 transition-all ${
                      selectedImageIndex === idx
                        ? "border-razen-gold shadow-md"
                        : "border-black/5 hover:border-black/20 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.imageUrl}
                      alt={img.altText || `${product.name} thumbnail ${idx + 1}`}
                      fill
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Purchase Column (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.25em] text-razen-gold font-semibold">
                  Arcfumes Niche House
                </span>
                <span className="text-[10px] uppercase tracking-widest bg-razen-sand text-razen-charcoal px-2.5 py-0.5 rounded-full font-medium">
                  {product.category}
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl font-light text-razen-black leading-tight">
                {product.name}
              </h1>
              <p className="text-xs uppercase tracking-widest text-razen-muted">
                {product.size}
              </p>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline space-x-3 pb-6 border-b border-black/5">
              <span className="text-3xl font-semibold text-razen-black">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-base text-razen-muted/60 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
              <span className="text-[10px] uppercase tracking-widest font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                In Stock ({product.stock} bottles)
              </span>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-razen-black">
                Fragrance Narrative
              </h3>
              <p className="text-sm text-razen-muted leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {/* Notes Pyramid */}
            <div className="bg-razen-surface rounded-xl p-6 border border-black/5 space-y-4">
              <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-razen-gold">
                Olfactory Notes
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex">
                  <span className="w-20 uppercase tracking-widest text-[10px] font-semibold text-razen-muted">
                    Opening
                  </span>
                  <span className="text-razen-black font-light">{product.topNotes}</span>
                </div>
                <div className="flex">
                  <span className="w-20 uppercase tracking-widest text-[10px] font-semibold text-razen-muted">
                    Heart
                  </span>
                  <span className="text-razen-black font-light">{product.middleNotes}</span>
                </div>
                <div className="flex">
                  <span className="w-20 uppercase tracking-widest text-[10px] font-semibold text-razen-muted">
                    Dry Down
                  </span>
                  <span className="text-razen-black font-light">{product.baseNotes}</span>
                </div>
              </div>
            </div>

            {/* Purchase Controls */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {/* Quantity */}
                <div className="flex items-center border border-black/15 rounded-full px-4 py-3">
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
                    onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                    className="text-razen-muted hover:text-razen-black transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-razen-gold hover:bg-razen-gold-dark text-white py-3.5 px-6 rounded-full text-xs font-semibold uppercase tracking-[0.2em] flex items-center justify-center space-x-2 transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  <ShoppingBag size={14} />
                  <span>Add to Cart</span>
                </button>
              </div>

              {/* Buy Now Button */}
              <button
                onClick={handleBuyNow}
                className="w-full bg-razen-black hover:bg-razen-charcoal text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] flex items-center justify-center space-x-2 transition-all duration-300"
              >
                <Zap size={14} />
                <span>Buy Now — Cash on Delivery</span>
              </button>
            </div>

            {/* Reassurance Badges */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/5 text-xs text-razen-muted">
              <div className="flex items-center space-x-2.5">
                <Truck size={16} className="text-razen-gold" />
                <span className="font-light">Free Courier Shipping</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <ShieldCheck size={16} className="text-razen-gold" />
                <span className="font-light">100% Authentic Batch</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
