"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full h-screen min-h-[640px] flex items-center overflow-hidden bg-[#0a0b0d]">
      {/* Background Arch Rings (Authentic luxury portal from original site) */}
      <div className="hero-arch absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="absolute w-[500px] sm:w-[640px] h-[500px] sm:h-[640px] rounded-full bg-razen-gold/[0.03] blur-3xl animate-pulse-glow" />
        <div className="absolute w-[360px] sm:w-[440px] h-[360px] sm:h-[440px] rounded-full border border-razen-gold/[0.06] animate-ring-expand-1" />
        <div className="absolute w-[460px] sm:w-[560px] h-[460px] sm:h-[560px] rounded-full border border-razen-gold/[0.04] animate-ring-expand-2" />
        <div className="absolute w-[580px] sm:w-[700px] h-[580px] sm:h-[700px] rounded-full border border-razen-gold/[0.02] animate-ring-expand-3" />
      </div>

      {/* Atmospheric Background Image - NO WHITE GLARE */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/razen-assets/landing1.png"
          alt="Arcfumes Signature Scent"
          fill
          priority
          className="object-cover object-[25%_center] sm:object-center select-none"
        />
        {/* Subtle dark ambient edge transition without masking the smoke */}
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-40" />
      </div>

      {/* Hero Content - Placed on left just like original */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 w-full pt-16">
        <div className="max-w-2xl">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#9e8c78] font-medium mb-3 sm:mb-4">
            Niche Fragrance House
          </p>

          {/* Arcfumes Brand Wordmark matching original exact classes */}
          <h1
            className="hero-wordmark brand-wordmark"
            id="h-wordmark"
          >
            a r c f u m e s
          </h1>

          <p className="text-sm sm:text-base text-[#8c857e] font-light leading-relaxed mb-8 max-w-md">
            Crafted for presence.
            <br />
            Minimal. Modern. Unforgettable.
          </p>

          <div className="flex items-center space-x-6">
            <Link
              href="#collection"
              className="inline-flex items-center space-x-2.5 bg-[#9e8c78] hover:bg-[#8a7a68] text-white px-7 py-3 rounded-full text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5"
            >
              <span>Explore Collection</span>
              <span className="text-sm">↗</span>
            </Link>

            <Link
              href="/products/serin"
              className="text-xs uppercase tracking-[0.15em] font-medium text-[#8c857e] hover:text-white transition-colors py-2"
            >
              Serin →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center space-y-2 pointer-events-none opacity-50">
        <div className="w-[1px] h-10 bg-gradient-to-b from-transparent to-[#9e8c78] animate-pulse" />
        <span className="text-[9px] uppercase tracking-[0.3em] text-[#8c857e] font-light">
          Scroll
        </span>
      </div>
    </section>
  );
}
