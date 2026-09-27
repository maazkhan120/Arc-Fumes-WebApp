import React from "react";

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6 animate-pulse">
      {/* Brand logo shimmer */}
      <div className="h-6 w-36 bg-neutral-200 rounded-full mb-6" />
      {/* Subtle bar indicator */}
      <div className="w-24 h-0.5 bg-[#9e8c78]/40 rounded-full overflow-hidden relative">
        <div className="absolute inset-0 bg-[#9e8c78] animate-[shimmer_1.5s_infinite_linear]" />
      </div>
      <p className="text-[10px] uppercase tracking-[0.25em] text-[#9e8c78] mt-4 font-medium">
        Arcfumes
      </p>
    </div>
  );
}
