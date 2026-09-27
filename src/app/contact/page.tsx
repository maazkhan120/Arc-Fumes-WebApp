"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageCircle, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit enquiry.");
      }

      setSuccessMessage(data.message);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="text-[11px] uppercase tracking-[0.3em] text-razen-gold font-medium mb-2">
            Get in Touch
          </p>
          <h1 className="font-display text-4xl sm:text-6xl font-light text-razen-black">
            Let's <span className="italic text-razen-gold font-normal">Connect</span>
          </h1>
          <p className="text-xs sm:text-sm text-razen-muted mt-3 font-light leading-relaxed">
            Whether it's a question about our extrait de parfum concentrations, delivery, or custom gifting, our concierge is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Info Panel (5 cols) */}
          <div className="lg:col-span-5 bg-razen-surface p-8 sm:p-10 rounded-2xl border border-black/5 space-y-8">
            <div className="space-y-2">
              <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-razen-black">
                Brand Concierge
              </h2>
              <p className="text-xs text-razen-muted font-light leading-relaxed">
                Dedicated client care available Monday through Saturday.
              </p>
            </div>

            <div className="space-y-6 text-xs">
              <div className="flex items-start space-x-3.5">
                <Mail size={18} className="text-razen-gold flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-razen-muted block">
                    Official Email
                  </span>
                  <a
                    href="mailto:orders@arcfumes.com"
                    className="font-medium text-razen-black hover:text-razen-gold transition-colors"
                  >
                    orders@arcfumes.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <MessageCircle size={18} className="text-razen-gold flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-razen-muted block">
                    WhatsApp Concierge
                  </span>
                  <a
                    href="https://wa.me/923348186262"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-razen-black hover:text-razen-gold transition-colors"
                  >
                    +92 334 8186262
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <MapPin size={18} className="text-razen-gold flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-razen-muted block">
                    Heritage
                  </span>
                  <span className="font-medium text-razen-black">
                    Crafted in Pakistan — Shipped Nationwide
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <Clock size={18} className="text-razen-gold flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-razen-muted block">
                    Response Window
                  </span>
                  <span className="font-medium text-razen-black">Within 24 business hours</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-black/5">
              <p className="text-[10px] uppercase tracking-widest text-razen-gold font-medium">
                Est. 2024 — Niche Fragrance House
              </p>
            </div>
          </div>

          {/* Right Form Panel (7 cols) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-black/5 shadow-sm space-y-6">
            <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-razen-black border-b border-black/5 pb-3">
              Send an Enquiry
            </h2>

            {successMessage ? (
              <div className="p-8 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 size={32} className="text-emerald-600 mx-auto" />
                <h3 className="text-sm font-semibold text-emerald-800">Message Dispatched</h3>
                <p className="text-xs text-emerald-700 max-w-sm mx-auto">{successMessage}</p>
                <button
                  onClick={() => setSuccessMessage("")}
                  className="mt-3 text-xs uppercase tracking-widest font-semibold text-emerald-800 underline"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-widest text-razen-muted font-medium mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      className="w-full text-xs p-3 rounded-lg border border-black/15 focus:border-razen-gold focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-widest text-razen-muted font-medium mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@domain.com"
                      className="w-full text-xs p-3 rounded-lg border border-black/15 focus:border-razen-gold focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-widest text-razen-muted font-medium mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0300..."
                      className="w-full text-xs p-3 rounded-lg border border-black/15 focus:border-razen-gold focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-widest text-razen-muted font-medium mb-1.5">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Fragrance enquiry, Custom order..."
                      className="w-full text-xs p-3 rounded-lg border border-black/15 focus:border-razen-gold focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-razen-muted font-medium mb-1.5">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How may our fragrance concierge assist you today?"
                    className="w-full text-xs p-3 rounded-lg border border-black/15 focus:border-razen-gold focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-razen-black hover:bg-razen-gold text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] flex items-center justify-center space-x-2 transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={13} />
                  )}
                  <span>{isSubmitting ? "Dispatching..." : "Send Message"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
