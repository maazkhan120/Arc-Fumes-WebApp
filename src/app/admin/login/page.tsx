"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@arcfumes.com");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      window.location.href = "/admin";
    } catch (err: any) {
      setError(err.message || "Failed to log in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-razen-surface flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-black/5 shadow-xl p-8 sm:p-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-razen-sand flex items-center justify-center mx-auto text-razen-gold mb-3">
            <ShieldCheck size={24} />
          </div>
          <span className="brand-wordmark text-2xl font-light text-razen-black tracking-[0.25em]">
            a r c f u m e s
          </span>
          <h1 className="text-xs uppercase tracking-[0.25em] text-razen-muted font-medium pt-1">
            Admin Management Console
          </h1>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 flex items-center space-x-2">
            <AlertCircle size={15} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-razen-muted font-medium mb-1.5">
              Admin Email
            </label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-3.5 text-razen-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@razenperfume.com"
                className="w-full text-xs pl-10 pr-3 py-3 rounded-lg border border-black/15 focus:border-razen-gold focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-widest text-razen-muted font-medium mb-1.5">
              Master Password
            </label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3.5 text-razen-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs pl-10 pr-3 py-3 rounded-lg border border-black/15 focus:border-razen-gold focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="p-3 bg-razen-sand/40 rounded-lg text-[11px] text-razen-muted leading-relaxed">
            💡 Default dev credentials configured:
            <br />
            <span className="font-mono text-razen-charcoal">admin@razenperfume.com</span> /{" "}
            <span className="font-mono text-razen-charcoal">RazenAdmin2026!</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-razen-black hover:bg-razen-gold text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] flex items-center justify-center space-x-2 transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <ArrowRight size={14} />
            )}
            <span>{isLoading ? "Authenticating..." : "Sign In to Portal"}</span>
          </button>
        </form>

        <div className="text-center pt-2">
          <a href="/" className="text-[11px] uppercase tracking-widest text-razen-muted hover:text-razen-black transition-colors">
            ← Return to RAZEN Storefront
          </a>
        </div>
      </div>
    </div>
  );
}
