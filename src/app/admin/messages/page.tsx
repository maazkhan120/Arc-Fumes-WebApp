import React from "react";
import { getAdminMessages } from "@/lib/admin-cache";
import { formatDate } from "@/lib/utils";
import { Mail, MessageSquare, Phone } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  let messages: any[] = [];

  try {
    messages = await getAdminMessages();
  } catch (e) {
    console.warn("Could not query contact messages:", e);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Concierge Inquiries</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review customer inquiries submitted through the storefront contact form.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No contact messages received yet. Inquiries will appear here live.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {messages.map((m) => (
              <div key={m.id} className="p-6 hover:bg-slate-50/70 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-slate-900 text-sm">{m.name}</span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      {m.status}
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono">{formatDate(m.createdAt)}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <a
                    href={`mailto:${m.email}`}
                    className="flex items-center space-x-1 hover:text-razen-gold"
                  >
                    <Mail size={13} />
                    <span>{m.email}</span>
                  </a>
                  {m.phone && (
                    <span className="flex items-center space-x-1">
                      <Phone size={13} />
                      <span>{m.phone}</span>
                    </span>
                  )}
                </div>

                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100 text-xs text-slate-800 space-y-1">
                  <p className="font-semibold text-slate-900">Subject: {m.subject}</p>
                  <p className="whitespace-pre-wrap leading-relaxed">{m.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
