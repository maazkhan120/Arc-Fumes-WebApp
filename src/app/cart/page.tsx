"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, shippingAmount, totalAmount } = useCart();

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-[11px] uppercase tracking-[0.3em] text-razen-gold font-medium mb-2">
            Shopping Basket
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-light text-razen-black">
            Your Selected Fragrances
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-razen-surface rounded-2xl border border-black/5 max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-razen-sand flex items-center justify-center mx-auto text-razen-gold">
              <ShoppingBag size={24} />
            </div>
            <h3 className="text-base font-medium text-razen-black">Your basket is currently empty</h3>
            <p className="text-xs text-razen-muted max-w-xs mx-auto">
              Explore our signature trio and select a fragrance crafted for your aura.
            </p>
            <div className="pt-4">
              <Link
                href="/products"
                className="inline-flex items-center space-x-2 bg-razen-black hover:bg-razen-gold text-white px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] transition-colors"
              >
                <span>Discover Collection</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Items Table */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-razen-surface rounded-2xl border border-black/5 p-6 divide-y divide-black/5">
                {items.map((item) => (
                  <div key={item.productId} className="py-6 first:pt-0 last:pb-0 flex space-x-6">
                    <div className="relative w-24 h-28 bg-white rounded-lg p-2 flex items-center justify-center flex-shrink-0 border border-black/5">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-base font-medium text-razen-black">{item.name}</h3>
                          <p className="text-xs text-razen-muted mt-0.5">{item.size}</p>
                          <p className="text-xs font-semibold text-razen-charcoal mt-1">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-razen-muted hover:text-red-500 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-black/15 rounded-full px-3 py-1">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-1 text-razen-muted hover:text-razen-black transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-semibold px-4 text-razen-black min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-1 text-razen-muted hover:text-razen-black transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <span className="text-sm font-semibold text-razen-black">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Column */}
            <div className="lg:col-span-4 bg-razen-surface rounded-2xl border border-black/5 p-8 space-y-6">
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-razen-black">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs text-razen-muted border-b border-black/5 pb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-razen-black font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-razen-gold font-medium uppercase tracking-wider text-[11px]">
                    Free
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-baseline text-razen-black font-bold">
                <span className="text-sm">Total</span>
                <span className="text-2xl">{formatPrice(totalAmount)}</span>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-razen-gold hover:bg-razen-gold-dark text-white py-4 rounded-full text-xs font-semibold uppercase tracking-[0.2em] flex items-center justify-center space-x-2 transition-all duration-300 shadow-md hover:shadow-xl"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
