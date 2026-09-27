import React from "react";
import Image from "next/image";

export default function FragranceDiscovery() {
  const noteLevels = [
    {
      level: "The Opening",
      name: "Top Notes",
      time: "First 15 Minutes",
      desc: "The initial greeting. Delicate, evanescent molecules like handpicked Apple Blossom, Bergamot, and Sea Salt that capture the room before settling.",
      textureImg: "/razen-assets/hs2.png",
    },
    {
      level: "The Heart",
      name: "Heart Notes",
      time: "2 to 4 Hours",
      desc: "The true personality of the flacon. Rich Rose Absolute, Amber, Driftwood, and Smoked Vanilla that unfurl with body heat and movement.",
      textureImg: "/razen-assets/hs3.png",
    },
    {
      level: "The Soul",
      name: "Base Notes",
      time: "Up to 24 Hours",
      desc: "The lasting impression. Resinous White Cedar, Sandalwood, Oakmoss, and Black Oud that linger on skin, textiles, and memories.",
      textureImg: "/razen-assets/hs1.png",
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-white relative z-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <p className="text-[11px] uppercase tracking-[0.3em] text-razen-gold font-medium mb-3">
            Olfactory Architecture
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-razen-black leading-tight">
            How a Scent Evolves
          </h2>
          <p className="text-xs sm:text-sm text-razen-muted mt-3 font-light">
            Fragrance is time made tangible. Experience the three distinct temporal acts of Arcfumes composition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {noteLevels.map((item, idx) => (
            <div
              key={idx}
              className="bg-razen-surface rounded-xl overflow-hidden border border-black/5 hover:border-razen-gold/30 transition-all duration-300 p-8 flex flex-col justify-between"
            >
              <div>
                <div className="relative w-full h-32 mb-6 rounded-lg overflow-hidden">
                  <Image
                    src={item.textureImg}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-[10px] uppercase tracking-[0.2em] text-white font-medium">
                    {item.time}
                  </span>
                </div>

                <p className="text-[10px] uppercase tracking-[0.25em] text-razen-gold font-semibold mb-1">
                  {item.level}
                </p>
                <h3 className="font-display text-2xl font-light text-razen-black mb-3">
                  {item.name}
                </h3>
                <p className="text-xs text-razen-muted leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between text-[11px] text-razen-muted">
                <span>Phase 0{idx + 1}</span>
                <span className="text-razen-gold font-mono">100% Pure Extraction</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
