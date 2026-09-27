"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { Menu, X } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const y =
        window.pageYOffset ||
        window.scrollY ||
        document.documentElement?.scrollTop ||
        document.body?.scrollTop ||
        0;
      setScrolled(y > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  // Never render storefront header on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Solid background when scrolled or on inner pages
  const isSolidNav = pathname !== "/" || scrolled;

  return (
    <nav
      id="main-nav"
      className={`nav ${isSolidNav ? "scrolled" : ""}`}
    >
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-1.5 transition-colors text-black"
        aria-label="Toggle Navigation"
      >
        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Brand Logo Wordmark matching original index.html */}
      <div className="nav-brand">
        <Link href="/">
          <span className="nav-logo-text brand-wordmark">
            a r c f u m e s
          </span>
        </Link>
      </div>

      {/* Desktop Navigation Links */}
      <ul className="nav-links" id="nav-links">
        <li>
          <Link
            href="/"
            id="nav-home"
            className={pathname === "/" ? "active" : ""}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/products"
            id="nav-collection"
            className={pathname === "/products" ? "active" : ""}
          >
            Collection
          </Link>
        </li>
        <li>
          <Link
            href="/#story"
            id="nav-story"
          >
            Our Story
          </Link>
        </li>
        <li>
          <Link
            href="/track-order"
            id="nav-track-order"
            className={pathname?.startsWith("/track-order") ? "active" : ""}
          >
            Track My Order
          </Link>
        </li>
        <li>
          <Link
            href="/contact"
            id="nav-contact"
            className={pathname?.startsWith("/contact") ? "active" : ""}
          >
            Contact
          </Link>
        </li>
      </ul>

      {/* Basket Action Button */}
      <div className="nav-cta">
        <button
          onClick={() => setIsCartOpen(true)}
          className="btn-ghost"
          id="nav-basket"
          aria-label="Shopping Basket"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
        >
          <span>Basket</span>
          {itemCount > 0 && (
            <span
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "var(--gold)",
                color: "#ffffff",
                fontSize: "9px",
                fontWeight: "700",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {itemCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-black/10 px-6 py-6 space-y-4 shadow-xl z-50"
        >
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block text-xs uppercase tracking-[0.2em] font-medium transition-colors ${
              pathname === "/" ? "text-[#9e8c78] font-bold" : "text-[#2a2723] hover:text-[#9e8c78]"
            }`}
          >
            Home
          </Link>
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className={`block text-xs uppercase tracking-[0.2em] font-medium transition-colors ${
              pathname === "/products" ? "text-[#9e8c78] font-bold" : "text-[#2a2723] hover:text-[#9e8c78]"
            }`}
          >
            Collection
          </Link>
          <Link
            href="/#story"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs uppercase tracking-[0.2em] font-medium text-[#2a2723] hover:text-[#9e8c78]"
          >
            Our Story
          </Link>
          <Link
            href="/track-order"
            onClick={() => setMobileMenuOpen(false)}
            className={`block text-xs uppercase tracking-[0.2em] font-medium transition-colors ${
              pathname?.startsWith("/track-order") ? "text-[#9e8c78] font-bold" : "text-[#2a2723] hover:text-[#9e8c78]"
            }`}
          >
            Track My Order
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className={`block text-xs uppercase tracking-[0.2em] font-medium transition-colors ${
              pathname?.startsWith("/contact") ? "text-[#9e8c78] font-bold" : "text-[#2a2723] hover:text-[#9e8c78]"
            }`}
          >
            Contact
          </Link>
          <div className="pt-2 border-t border-black/5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsCartOpen(true);
              }}
              className="w-full flex items-center justify-between text-xs uppercase tracking-[0.2em] font-semibold text-[#9e8c78] py-2"
            >
              <span>Shopping Basket</span>
              <span className="bg-[#9e8c78] text-white px-2 py-0.5 rounded-full text-[10px]">
                {itemCount}
              </span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
