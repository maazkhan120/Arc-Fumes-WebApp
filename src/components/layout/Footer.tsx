"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Never render storefront footer on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="relative bg-[#f7f6f3] border-t border-black/5 pt-20 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Intro */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <span className="brand-wordmark text-2xl tracking-[0.25em] text-razen-black font-light">
                a r c f u m e s
              </span>
            </Link>
            <p className="text-xs text-razen-muted leading-relaxed font-light">
              A niche luxury fragrance house rooted in the tension between restraint and depth. Minimal. Modern. Unforgettable.
            </p>
            <p className="text-[11px] uppercase tracking-widest text-razen-gold font-medium">
              Est. 2024 — Pakistan
            </p>
          </div>

          {/* Collection / Shop Column */}
          <div className="space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-razen-black">
              Shop & Categories
            </h4>
            <ul className="space-y-2 text-xs text-razen-muted">
              <li>
                <Link href="/products?category=MEN" className="hover:text-razen-gold transition-colors">
                  Men&apos;s Fragrances
                </Link>
              </li>
              <li>
                <Link href="/products?category=WOMEN" className="hover:text-razen-gold transition-colors">
                  Women&apos;s Fragrances
                </Link>
              </li>
              <li>
                <Link href="/products?category=UNISEX" className="hover:text-razen-gold transition-colors">
                  Unisex Fragrances
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-razen-gold transition-colors font-medium">
                  Complete Collection →
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Concierge */}
          <div className="space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-razen-black">
              Support
            </h4>
            <ul className="space-y-2 text-xs text-razen-muted">
              <li>
                <Link href="/track-order" className="hover:text-razen-gold transition-colors font-medium">
                  Track My Order
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-razen-gold transition-colors">
                  Contact Concierge
                </Link>
              </li>
              <li>
                <a
                  href="mailto:orders@arcfumes.com"
                  className="hover:text-razen-gold transition-colors"
                >
                  orders@arcfumes.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/923348186262"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-razen-gold transition-colors"
                >
                  WhatsApp: +92 334 8186262
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Admin */}
          <div className="space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-razen-black">
              Connect
            </h4>
            <ul className="space-y-2 text-xs text-razen-muted">
              <li>
                <a
                  href="https://www.instagram.com/arcfumes.official/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-razen-gold transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com/arcfumes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-razen-gold transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <Link href="/#story" className="hover:text-razen-gold transition-colors">
                  Brand Philosophy
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-razen-gold transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-black/5 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-razen-muted gap-4">
          <p>© {currentYear} Arcfumes. All rights reserved.</p>
          <p className="tracking-widest uppercase text-[10px]">Luxury Fragrance — Pakistan</p>
        </div>
      </div>

      {/* Large Decorative Watermark in Background */}
      <div
        className="pointer-events-none select-none absolute -bottom-10 left-1/2 -translate-x-1/2 text-black/[0.03] text-[15vw] font-light tracking-[0.3em] uppercase whitespace-nowrap brand-wordmark"
        aria-hidden="true"
      >
        a r c f u m e s
      </div>
    </footer>
  );
}
