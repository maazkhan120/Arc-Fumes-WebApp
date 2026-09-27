import React from "react";
import Hero from "@/components/home/Hero";
import BrandStory from "@/components/home/BrandStory";
import SignatureCollection from "@/components/home/SignatureCollection";
import FragranceDiscovery from "@/components/home/FragranceDiscovery";
import { getProducts } from "@/lib/products";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      <Hero />
      <BrandStory />
      <SignatureCollection products={products} />
      <FragranceDiscovery />

      {/* Editorial Final Call to Action */}
      <section className="py-24 sm:py-32 bg-razen-surface border-t border-black/5 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 relative z-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-razen-gold font-medium mb-3">
            Pure Distinction
          </p>
          <h2 className="font-display text-4xl sm:text-6xl font-light text-razen-black leading-tight mb-6">
            Find Your Signature Presence
          </h2>
          <p className="text-sm text-razen-muted font-light leading-relaxed max-w-lg mx-auto mb-10">
            Each flacon arrives packaged in our signature matte presentation box with complimentary expedited courier delivery.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center space-x-2 bg-razen-black hover:bg-razen-gold text-white px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 shadow-md hover:shadow-xl"
            >
              <span>Explore All Fragrances</span>
              <ArrowUpRight size={14} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 border border-black/15 hover:border-razen-gold text-razen-charcoal hover:text-razen-gold px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300"
            >
              <span>Speak to Concierge</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
