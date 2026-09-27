import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ArrowRight, MessageCircle } from "lucide-react";

interface OrderSuccessProps {
  params: { orderNumber: string };
}

export default function OrderSuccessPage({ params }: OrderSuccessProps) {
  const { orderNumber } = params;

  return (
    <div className="pt-36 pb-24 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-6 animate-pulse">
          <CheckCircle2 size={40} />
        </div>

        <p className="text-[11px] uppercase tracking-[0.3em] text-razen-gold font-semibold mb-2">
          Thank You
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-light text-razen-black leading-tight">
          Your Order is Confirmed
        </h1>
        <p className="text-xs sm:text-sm text-razen-muted mt-3 font-light max-w-md mx-auto">
          We have received your order. Our team will pack your fragrance with utmost care and dispatch it promptly.
        </p>

        {/* Order Number Card */}
        <div className="my-8 bg-razen-surface p-6 rounded-2xl border border-black/5 max-w-md mx-auto">
          <span className="text-[10px] uppercase tracking-[0.25em] text-razen-muted block mb-1">
            Order Reference
          </span>
          <span className="text-2xl sm:text-3xl font-mono font-bold text-razen-black tracking-wider">
            #{orderNumber}
          </span>
          <p className="text-[11px] text-razen-muted mt-2">
            A confirmation has been prepared for your email.
          </p>
        </div>

        {/* Manual Bank Transfer Instructions (From Original Cloned Site) */}
        <div className="my-8 text-left bg-razen-sand/30 p-8 rounded-2xl border border-black/5 max-w-lg mx-auto space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-razen-black">
              Bank Transfer Instructions (If Selected)
            </h3>
            <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-black/5 text-razen-gold-dark">
              Meezan Bank
            </span>
          </div>

          <div className="text-xs space-y-2 text-razen-charcoal">
            <div className="flex justify-between">
              <span className="text-razen-muted">Account Title:</span>
              <span className="font-semibold">RAHI TRADERS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-razen-muted">Account Number:</span>
              <span className="font-mono font-semibold">0931 0113897270</span>
            </div>
            <div className="flex justify-between">
              <span className="text-razen-muted">IBAN:</span>
              <span className="font-mono text-[11px] font-semibold">
                PK61 MEZN 0009 3101 1389 7270
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[11px] text-razen-muted">
              Kindly share transaction screenshot on WhatsApp with your Order #{orderNumber}.
            </div>
            <a
              href={`https://wa.me/923348186262?text=Assalam-o-Alaikum%2C+I+have+placed+order+%23${orderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-xs font-medium flex-shrink-0 transition-colors shadow-sm"
            >
              <MessageCircle size={14} />
              <span>Confirm on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href={`/track-order?order=${orderNumber}`}
            className="inline-flex items-center space-x-2 bg-razen-gold hover:bg-razen-gold-dark text-white px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 shadow-md hover:shadow-xl"
          >
            <span>Track Order Status</span>
            <ArrowRight size={14} />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center space-x-2 border border-black/15 hover:border-razen-gold text-razen-charcoal hover:text-razen-gold px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300"
          >
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
