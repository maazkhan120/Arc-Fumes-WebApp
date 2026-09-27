import React from "react";
import Link from "next/link";
import { getProducts } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { CategoryType, ProductItem } from "@/types";

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams: { category?: string };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const rawCat = (searchParams.category?.toUpperCase() || "ALL");
  const normalizedCat = rawCat === "MEN" ? "MALE" : rawCat === "WOMEN" ? "FEMALE" : rawCat;
  const allProducts = await getProducts();

  const filteredProducts =
    normalizedCat === "ALL"
      ? allProducts
      : allProducts.filter((p) => {
          const cat = p.category?.toUpperCase();
          return cat === normalizedCat || cat === "UNISEX";
        });

  const categories = [
    { label: "All", value: "ALL" },
    { label: "Men", value: "MEN" },
    { label: "Women", value: "WOMEN" },
    { label: "Unisex", value: "UNISEX" },
  ];

  const getProductStyling = (product: ProductItem, index: number) => {
    const slug = product.slug?.toLowerCase();
    if (slug === "elma") {
      return {
        cardClass: "scent-elma",
        glowClass: "card-glow-warm",
        bottleImage: "/razen-assets/relma1.png",
        noteStripImage: "/razen-assets/hs2.png",
        mood: "warm",
      };
    }
    if (slug === "mavi") {
      return {
        cardClass: "scent-mavi",
        glowClass: "card-glow-cool",
        bottleImage: "/razen-assets/rmavi1.png",
        noteStripImage: "/razen-assets/hs3.png",
        mood: "cool",
      };
    }
    if (slug === "serin") {
      return {
        cardClass: "scent-serin",
        glowClass: "card-glow-dark",
        bottleImage: "/razen-assets/rserin1.png",
        noteStripImage: "/razen-assets/hs1.png",
        mood: "dark",
      };
    }

    // Default styling for additional catalog items
    const configs = [
      { cardClass: "scent-elma", glowClass: "card-glow-warm", noteStripImage: "/razen-assets/hs2.png", defaultBottle: "/razen-assets/relma1.png", mood: "warm" },
      { cardClass: "scent-mavi", glowClass: "card-glow-cool", noteStripImage: "/razen-assets/hs3.png", defaultBottle: "/razen-assets/rmavi1.png", mood: "cool" },
      { cardClass: "scent-serin", glowClass: "card-glow-dark", noteStripImage: "/razen-assets/hs1.png", defaultBottle: "/razen-assets/rserin1.png", mood: "dark" },
    ];
    const config = configs[index % configs.length];
    return {
      cardClass: config.cardClass,
      glowClass: config.glowClass,
      bottleImage: product.images?.[0]?.imageUrl || config.defaultBottle,
      noteStripImage: config.noteStripImage,
      mood: config.mood,
    };
  };

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header matching original luxury aesthetic */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="section-label" style={{ marginBottom: "0.75rem" }}>
            The Catalog
          </p>
          <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
            Curated Fragrances
          </h1>
          <p className="text-xs sm:text-sm text-razen-muted mt-3 font-light">
            Pure, highly concentrated extractions formulated for distinctive presence.
          </p>

          {/* Category Filter */}
          <div className="flex items-center justify-center space-x-3 sm:space-x-6 mt-8 border-b border-black/5 pb-4">
            {categories.map((cat) => {
              const isActive =
                cat.value === "ALL"
                  ? normalizedCat === "ALL"
                  : cat.value === "MEN"
                  ? normalizedCat === "MALE"
                  : cat.value === "WOMEN"
                  ? normalizedCat === "FEMALE"
                  : normalizedCat === "UNISEX";
              return (
                <Link
                  key={cat.value}
                  href={cat.value === "ALL" ? "/products" : `/products?category=${cat.value}`}
                  className={`text-xs uppercase tracking-[0.2em] font-medium px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-razen-black text-white shadow-sm"
                      : "text-razen-muted hover:text-razen-black hover:bg-razen-sand/50"
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Scent Cards with Three Worlds interactive horizontal showcase animation */}
        <div className="scent-cards" style={{ borderRadius: "12px", overflow: "hidden" }}>
          {filteredProducts.map((product, idx) => {
            const styling = getProductStyling(product, idx);
            const bottleImg = product.images?.[0]?.imageUrl || styling.bottleImage;
            const itemNumber = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;

            return (
              <article
                key={product.id}
                className={`scent-card ${styling.cardClass}`}
                id={`card-${product.slug}`}
                data-mood={styling.mood}
              >
                {/* Ambient Card Glow */}
                <div className={`card-glow ${styling.glowClass}`} />

                {/* Card Info Overlay */}
                <div className="card-info">
                  <p className="card-number">{itemNumber}</p>
                  <h3 className="card-name">{product.name}</h3>
                  <p className="card-price">
                    {formatPrice(product.price)}
                  </p>
                  <Link
                    href={`/products/${product.slug}`}
                    className="btn-ghost"
                  >
                    Shop Now
                  </Link>
                </div>

                {/* Horizontal Showcase Animation Container */}
                <div className="showcase-container-horizontal">
                  {/* Bottle Layer (Foreground) */}
                  <div className="bottle-wrapper">
                    <img
                      src={bottleImg}
                      alt={`${product.name} Bottle`}
                      className="bottle-horizontal"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  {/* Notes Layer (Background, slides horizontally to the right on hover) */}
                  <div className="notes-wrapper">
                    {/* Top Notes */}
                    <div className="note-item">
                      <div className="note-label">
                        Top Notes ({product.topNotes || "Delicate Opening"})
                      </div>
                      <div className="note-strip-container">
                        <img
                          src={styling.noteStripImage}
                          alt="Top Notes"
                          className="note-strip-image"
                          style={{ objectPosition: "top" }}
                        />
                      </div>
                    </div>

                    {/* Heart Notes */}
                    <div className="note-item">
                      <div className="note-label">
                        Heart Notes ({product.middleNotes || "Warm Core"})
                      </div>
                      <div className="note-strip-container">
                        <img
                          src={styling.noteStripImage}
                          alt="Heart Notes"
                          className="note-strip-image"
                          style={{ objectPosition: "center" }}
                        />
                      </div>
                    </div>

                    {/* Base Notes */}
                    <div className="note-item">
                      <div className="note-label">
                        Base Notes ({product.baseNotes || "Lingering Trail"})
                      </div>
                      <div className="note-strip-container">
                        <img
                          src={styling.noteStripImage}
                          alt="Base Notes"
                          className="note-strip-image"
                          style={{ objectPosition: "bottom" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
