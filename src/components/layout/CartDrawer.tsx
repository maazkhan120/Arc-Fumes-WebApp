"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import { X, Plus, Minus, Trash2, ArrowRight } from "lucide-react";

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-6 border-b border-black/5 flex items-center justify-between">
            <div>
              <h2 className="text-sm uppercase tracking-[0.2em] font-semibold text-razen-black">
                Your Basket
              </h2>
              <p className="text-xs text-razen-muted mt-0.5">
                {items.length === 0
                  ? "0 items"
                  : `${items.reduce((s, i) => s + i.quantity, 0)} signature scent(s)`}
              </p>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-razen-muted hover:text-razen-black transition-colors"
              aria-label="Close Basket"
            >
              <X size={20} />
            </button>
          </div>

          {/* Complimentary Shipping Banner */}
          <div className="bg-razen-sand/40 px-6 py-2.5 text-center border-b border-black/5">
            <p className="text-[11px] text-razen-gold-dark font-medium tracking-wide">
              ✦ Complimentary express delivery across Pakistan
            </p>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-razen-sand flex items-center justify-center text-razen-gold text-2xl font-display">
                  0
                </div>
                <p className="text-sm text-razen-charcoal font-medium">Your basket is empty</p>
                <p className="text-xs text-razen-muted max-w-xs leading-relaxed">
                  Discover our curated trio of signature perfumes crafted for distinct moods and presence.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 inline-flex items-center text-xs uppercase tracking-[0.2em] font-semibold text-razen-gold hover:text-razen-gold-dark"
                >
                  Explore Collection →
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="flex space-x-4 pb-6 border-b border-black/5 last:border-b-0"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 bg-razen-sand/30 rounded flex items-center justify-center p-2 flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-medium text-razen-black">{item.name}</h4>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-razen-muted hover:text-red-500 transition-colors p-1"
                          aria-label="Remove Item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-[11px] text-razen-muted mt-0.5">{item.size}</p>
                      <p className="text-xs font-semibold text-razen-charcoal mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3 mt-2">
                      <div className="flex items-center border border-black/10 rounded-full px-2 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 text-razen-muted hover:text-razen-black transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-medium px-3 text-razen-black min-w-[20px] text-center">
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
                      <span className="text-xs text-razen-muted">
                        Subtotal: {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-black/5 bg-razen-surface space-y-4">
              <div className="flex items-center justify-between text-xs text-razen-muted">
                <span>Shipping</span>
                <span className="text-razen-gold font-medium uppercase tracking-wider text-[11px]">
                  Free
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-razen-black font-semibold">
                <span>Estimated Total</span>
                <span className="text-base font-bold">{formatPrice(subtotal)}</span>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-razen-gold hover:bg-razen-gold-dark text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] flex items-center justify-center space-x-2 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={14} />
                </Link>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-center text-[11px] uppercase tracking-widest text-razen-muted hover:text-razen-black py-2 transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
