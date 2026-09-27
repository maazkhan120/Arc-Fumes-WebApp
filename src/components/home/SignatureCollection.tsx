"use client";

import React from "react";
import Link from "next/link";
import { ProductItem } from "@/types";

interface SignatureCollectionProps {
  products?: ProductItem[];
}

export default function SignatureCollection({ products }: SignatureCollectionProps) {
  return (
    <section className="showcase" id="collection">
      {/* Header matching original index.html */}
      <div className="showcase-header">
        <p className="section-label">The Collection</p>
        <h2 className="section-title">
          Three Worlds.<br />One House.
        </h2>
      </div>

      {/* Scent cards matching original index.html */}
      <div className="scent-cards">
        {/* ELMA */}
        <article className="scent-card scent-elma" id="card-elma" data-mood="warm">
          <div className="card-glow card-glow-warm" />
          <div className="card-info">
            <p className="card-number">01</p>
            <h3 className="card-name">Elma</h3>
            <p className="card-price">PKR 2,350</p>
            <Link
              href="/products/elma"
              className="btn-ghost"
            >
              Shop Now
            </Link>
          </div>

          <div className="showcase-container-horizontal">
            {/* Bottle Layer */}
            <div className="bottle-wrapper">
              <img
                src="/razen-assets/relma1.png"
                alt="Elma Bottle"
                className="bottle-horizontal"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Notes Layer (slides horizontally on hover) */}
            <div className="notes-wrapper">
              <div className="note-item">
                <div className="note-label">Top Notes (Apple Blossom)</div>
                <div className="note-strip-container">
                  <img
                    src="/razen-assets/hs2.png"
                    alt="Top Notes"
                    className="note-strip-image"
                    style={{ objectPosition: "top" }}
                  />
                </div>
              </div>

              <div className="note-item">
                <div className="note-label">Heart Notes (Amber)</div>
                <div className="note-strip-container">
                  <img
                    src="/razen-assets/hs2.png"
                    alt="Heart Notes"
                    className="note-strip-image"
                    style={{ objectPosition: "center" }}
                  />
                </div>
              </div>

              <div className="note-item">
                <div className="note-label">Base Notes (White Cedar)</div>
                <div className="note-strip-container">
                  <img
                    src="/razen-assets/hs2.png"
                    alt="Base Notes"
                    className="note-strip-image"
                    style={{ objectPosition: "bottom" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* MAVI */}
        <article className="scent-card scent-mavi" id="card-mavi" data-mood="cool">
          <div className="card-glow card-glow-cool" />
          <div className="card-info">
            <p className="card-number">02</p>
            <h3 className="card-name">Mavi</h3>
            <p className="card-price">PKR 2,350</p>
            <Link
              href="/products/mavi"
              className="btn-ghost"
            >
              Shop Now
            </Link>
          </div>

          <div className="showcase-container-horizontal">
            {/* Bottle Layer */}
            <div className="bottle-wrapper">
              <img
                src="/razen-assets/rmavi1.png"
                alt="Mavi Bottle"
                className="bottle-horizontal"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Notes Layer (slides horizontally on hover) */}
            <div className="notes-wrapper">
              <div className="note-item">
                <div className="note-label">Top Notes (Sea Salt)</div>
                <div className="note-strip-container">
                  <img
                    src="/razen-assets/hs3.png"
                    alt="Top Notes"
                    className="note-strip-image"
                    style={{ objectPosition: "top" }}
                  />
                </div>
              </div>

              <div className="note-item">
                <div className="note-label">Heart Notes (Bergamot)</div>
                <div className="note-strip-container">
                  <img
                    src="/razen-assets/hs3.png"
                    alt="Heart Notes"
                    className="note-strip-image"
                    style={{ objectPosition: "center" }}
                  />
                </div>
              </div>

              <div className="note-item">
                <div className="note-label">Base Notes (Driftwood)</div>
                <div className="note-strip-container">
                  <img
                    src="/razen-assets/hs3.png"
                    alt="Base Notes"
                    className="note-strip-image"
                    style={{ objectPosition: "bottom" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* SERIN */}
        <article className="scent-card scent-serin" id="card-serin" data-mood="dark">
          <div className="card-glow card-glow-dark" />
          <div className="card-info">
            <p className="card-number">03</p>
            <h3 className="card-name">Serin</h3>
            <p className="card-price">PKR 2,350</p>
            <Link
              href="/products/serin"
              className="btn-ghost"
            >
              Shop Now
            </Link>
          </div>

          <div className="showcase-container-horizontal">
            {/* Bottle Layer */}
            <div className="bottle-wrapper">
              <img
                src="/razen-assets/rserin1.png"
                alt="Serin Bottle"
                className="bottle-horizontal"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Notes Layer (slides horizontally on hover) */}
            <div className="notes-wrapper">
              <div className="note-item">
                <div className="note-label">Top Notes (Black Oud)</div>
                <div className="note-strip-container">
                  <img
                    src="/razen-assets/hs1.png"
                    alt="Top Notes"
                    className="note-strip-image"
                    style={{ objectPosition: "top" }}
                  />
                </div>
              </div>

              <div className="note-item">
                <div className="note-label">Heart Notes (Vetiver)</div>
                <div className="note-strip-container">
                  <img
                    src="/razen-assets/hs1.png"
                    alt="Heart Notes"
                    className="note-strip-image"
                    style={{ objectPosition: "center" }}
                  />
                </div>
              </div>

              <div className="note-item">
                <div className="note-label">Base Notes (Smoked Vanilla)</div>
                <div className="note-strip-container">
                  <img
                    src="/razen-assets/hs1.png"
                    alt="Base Notes"
                    className="note-strip-image"
                    style={{ objectPosition: "bottom" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
