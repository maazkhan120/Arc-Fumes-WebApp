import React from "react";

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-[#faf8f5] pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Header skeleton */}
      <div className="text-center mb-16 space-y-4">
        <div className="h-3 w-28 bg-neutral-200 rounded-full mx-auto" />
        <div className="h-10 w-64 bg-neutral-200 rounded mx-auto" />
        <div className="h-4 w-96 max-w-full bg-neutral-200 rounded mx-auto" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white border border-black/5 rounded-2xl p-8 flex flex-col items-center animate-pulse"
          >
            <div className="w-full h-72 bg-neutral-100 rounded-xl mb-6" />
            <div className="h-3 w-16 bg-neutral-200 rounded mb-3" />
            <div className="h-6 w-32 bg-neutral-200 rounded mb-2" />
            <div className="h-4 w-24 bg-neutral-200 rounded mb-6" />
            <div className="h-10 w-full bg-neutral-200 rounded-full mt-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
