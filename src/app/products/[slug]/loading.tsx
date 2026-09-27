import React from "react";

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Bottle visual skeleton */}
        <div className="flex justify-center items-center h-[520px] bg-neutral-50 rounded-2xl animate-pulse">
          <div className="w-56 h-80 bg-neutral-200/60 rounded-xl" />
        </div>

        {/* Info skeleton */}
        <div className="space-y-6 animate-pulse">
          <div className="h-3 w-32 bg-neutral-200 rounded" />
          <div className="h-12 w-3/4 bg-neutral-200 rounded" />
          <div className="h-4 w-1/3 bg-neutral-200 rounded" />
          <div className="space-y-2 py-4 border-y border-neutral-100">
            <div className="h-4 w-full bg-neutral-100 rounded" />
            <div className="h-4 w-5/6 bg-neutral-100 rounded" />
            <div className="h-4 w-4/6 bg-neutral-100 rounded" />
          </div>
          <div className="h-8 w-40 bg-neutral-200 rounded" />
          <div className="h-12 w-52 bg-neutral-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}
