import React from "react";
import { getCurrentAdmin } from "@/lib/auth";
import { Shield, Key, Mail, HardDrive, Server } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const admin = await getCurrentAdmin();

  const r2Configured = Boolean(
    process.env.R2_ACCOUNT_ID &&
    !process.env.R2_ACCOUNT_ID.includes("demo-") &&
    !process.env.R2_ACCOUNT_ID.includes("your-")
  );

  const smtpConfigured = Boolean(
    process.env.SMTP_PASSWORD &&
    !process.env.SMTP_PASSWORD.includes("demo-") &&
    !process.env.SMTP_PASSWORD.includes("your-")
  );

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Infrastructure configurations, storage connectors, and administrative profiles.
        </p>
      </div>

      {/* Admin Profile */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
          <Shield size={18} className="text-razen-gold" />
          <h2 className="text-sm font-bold text-slate-900">Current Administrative Session</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <span className="text-slate-400 block text-[11px]">Administrator Name</span>
            <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
              {admin?.name || "Master Admin"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Email Address</span>
            <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
              {admin?.email || "admin@razenperfume.com"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Authorization Role</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded inline-block mt-0.5">
              {admin?.role || "SUPER_ADMIN"}
            </span>
          </div>
        </div>
      </div>

      {/* Cloudflare R2 Integration */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-3">
            <HardDrive size={18} className="text-razen-gold" />
            <h2 className="text-sm font-bold text-slate-900">Cloudflare R2 Storage (S3 API)</h2>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              r2Configured ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
            }`}
          >
            {r2Configured ? "Live Cloudflare R2" : "Local Storage Active"}
          </span>
        </div>

        <p className="text-slate-500 leading-relaxed">
          Product images uploaded through the admin portal use the official S3-compatible Cloudflare R2 API.
          When live credentials are not present, images automatically save to the local public folder.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600 font-mono text-[11px] bg-slate-50 p-4 rounded-lg">
          <div>Bucket: {process.env.R2_BUCKET_NAME || "razen-perfume-images"}</div>
          <div>Public URL: {process.env.R2_PUBLIC_URL || "/razen-assets"}</div>
        </div>
      </div>

      {/* SMTP Email Configuration */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-3">
            <Mail size={18} className="text-razen-gold" />
            <h2 className="text-sm font-bold text-slate-900">Nodemailer Transactional SMTP</h2>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              smtpConfigured ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
            }`}
          >
            {smtpConfigured ? "Live SMTP Connected" : "Console Simulator Mode"}
          </span>
        </div>

        <p className="text-slate-500 leading-relaxed">
          Transactional emails are triggered for order confirmations and status changes (Confirmed, Dispatched with tracking, Completed, Cancelled, Returned).
          As specified in the architecture, if SMTP credentials are offline, orders never fail and errors are safely captured in the EmailLog table.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600 font-mono text-[11px] bg-slate-50 p-4 rounded-lg">
          <div>SMTP Host: {process.env.SMTP_HOST || "smtp.gmail.com"}</div>
          <div>Support Email: {process.env.SUPPORT_EMAIL || "orders@arcfumes.com"}</div>
        </div>
      </div>
    </div>
  );
}
