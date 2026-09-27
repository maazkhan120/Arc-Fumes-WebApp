import React from "react";

export default function BrandStory() {
  return (
    <section className="brand-intro" id="fragrances">
      <div className="brand-intro-inner" id="story">
        <p className="intro-overline">Est. 2024 — Pakistan</p>

        <h2 className="intro-headline" id="intro-headline">
          <span className="split-line">Fresh on </span>
          <span className="split-line italic">Go</span>
        </h2>

        <div className="intro-body">
          <p>
            Arcfumes is a niche fragrance house rooted in the tension between
            restraint and depth. Each scent is a quiet statement — made for
            those who understand that true luxury whispers.
          </p>
        </div>

        <div className="intro-stats">
          <div className="stat">
            <span className="stat-num">3</span>
            <span className="stat-label">Signature Scents</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">∞</span>
            <span className="stat-label">Lasting Impression</span>
          </div>
        </div>
      </div>
    </section>
  );
}
