"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, QrCode, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shippingAmount, totalAmount, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "Punjab",
    postalCode: "",
    notes: "",
    paymentMethod: "COD",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const provinces = [
    "Punjab",
    "Sindh",
    "Khyber Pakhtunkhwa",
    "Balochistan",
    "Islamabad Capital Territory",
    "Azad Kashmir",
    "Gilgit-Baltistan",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (isSubmitting) return;
    if (items.length === 0) {
      setErrorMessage("Your shopping basket is empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to place order.");
      }

      clearCart();
      router.push(`/order-success/${data.orderNumber}`);
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-36 pb-24 bg-white min-h-screen text-center">
        <div className="max-w-md mx-auto px-6 space-y-4">
          <h2 className="text-xl font-medium text-razen-black">Your basket is empty</h2>
          <p className="text-xs text-razen-muted">
            Please select at least one fragrance before navigating to checkout.
          </p>
          <div className="pt-4">
            <Link
              href="/products"
              className="inline-block bg-razen-black hover:bg-razen-gold text-white px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-[0.2em] transition-colors"
            >
              Browse Fragrances
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-razen-surface min-h-screen">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-razen-muted hover:text-razen-black transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Basket</span>
          </Link>
          <h1 className="font-display text-3xl sm:text-5xl font-light text-razen-black mt-3">
            Checkout & Shipping
          </h1>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Shipping Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-black/5 shadow-sm space-y-6">
            <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-razen-black border-b border-black/5 pb-3">
              1. Delivery Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[11px] uppercase tracking-widest text-razen-muted font-medium mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  required
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="e.g. Ayesha Khan"
                  className="w-full text-xs p-3 rounded-lg border border-black/15 focus:border-razen-gold focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-razen-muted font-medium mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full text-xs p-3 rounded-lg border border-black/15 focus:border-razen-gold focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-razen-muted font-medium mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0300-1234567"
                  className="w-full text-xs p-3 rounded-lg border border-black/15 focus:border-razen-gold focus:outline-none transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] uppercase tracking-widest text-razen-muted font-medium mb-1.5">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House, street, area details"
                  className="w-full text-xs p-3 rounded-lg border border-black/15 focus:border-razen-gold focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-razen-muted font-medium mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Lahore / Karachi / Islamabad"
                  className="w-full text-xs p-3 rounded-lg border border-black/15 focus:border-razen-gold focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-razen-muted font-medium mb-1.5">
                  Province *
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="w-full text-xs p-3 rounded-lg border border-black/15 focus:border-razen-gold focus:outline-none transition-colors bg-white"
                >
                  {provinces.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-razen-muted font-medium mb-1.5">
                  Postal Code (Optional)
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="54000"
                  className="w-full text-xs p-3 rounded-lg border border-black/15 focus:border-razen-gold focus:outline-none transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] uppercase tracking-widest text-razen-muted font-medium mb-1.5">
                  Order Notes / Special Delivery Instructions
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Ring the bell, landmark instructions, etc."
                  className="w-full text-xs p-3 rounded-lg border border-black/15 focus:border-razen-gold focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="pt-4 border-t border-black/5 space-y-3">
              <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-razen-black">
                2. Payment Method
              </h2>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={`flex items-start p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === "COD"
                      ? "border-razen-gold bg-razen-sand/20 shadow-sm"
                      : "border-black/10 hover:border-black/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === "COD"}
                    onChange={handleChange}
                    className="mt-1 text-razen-gold focus:ring-razen-gold"
                  />
                  <div className="ml-3">
                    <span className="text-xs font-semibold text-razen-black block">
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-[11px] text-razen-muted leading-relaxed block mt-0.5">
                      Pay with cash when the courier delivers your signature perfume to your doorstep.
                    </span>
                  </div>
                </label>

                {/* Direct Bank Transfer / QR */}
                <label
                  className={`flex items-start p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === "BANK_TRANSFER"
                      ? "border-razen-gold bg-razen-sand/20 shadow-sm"
                      : "border-black/10 hover:border-black/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BANK_TRANSFER"
                    checked={formData.paymentMethod === "BANK_TRANSFER"}
                    onChange={handleChange}
                    className="mt-1 text-razen-gold focus:ring-razen-gold"
                  />
                  <div className="ml-3">
                    <span className="text-xs font-semibold text-razen-black block flex items-center space-x-2">
                      <span>Direct Bank Transfer (Meezan Bank)</span>
                    </span>
                    <span className="text-[11px] text-razen-muted leading-relaxed block mt-0.5">
                      Transfer directly to RAHI TRADERS (Meezan Bank). Account details shown on confirmation.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm space-y-6">
              <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-razen-black border-b border-black/5 pb-3">
                Order Review
              </h2>

              <div className="divide-y divide-black/5 max-h-72 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="py-3 first:pt-0 last:pb-0 flex items-center space-x-4">
                    <div className="relative w-14 h-16 bg-razen-surface rounded flex-shrink-0 p-1">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-medium text-razen-black">{item.name}</h4>
                      <p className="text-[11px] text-razen-muted">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-razen-black">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 text-xs text-razen-muted border-t border-black/5 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-razen-black font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expedited Shipping</span>
                  <span className="text-razen-gold font-semibold uppercase tracking-wider text-[11px]">
                    Free
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-baseline text-razen-black font-bold border-t border-black/5 pt-4">
                <span className="text-sm">Total Payable</span>
                <span className="text-2xl">{formatPrice(totalAmount)}</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-razen-gold hover:bg-razen-gold-dark text-white py-4 rounded-full text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                <span>{isSubmitting ? "Processing Order..." : "Place Order"}</span>
              </button>

              <div className="space-y-2 pt-2 text-[11px] text-razen-muted">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                  <span>No account creation required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck size={14} className="text-razen-gold flex-shrink-0" />
                  <span>2–4 business days delivery nationwide</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
