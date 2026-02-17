"use client";

import { useTransition, useState } from "react";
import { submitLead } from "../actions";

export default function LeadForm({
  companyId,
  companyName,
}: {
  companyId: string;
  companyName: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{
    success: boolean;
    error?: string;
  } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("company_id", companyId);

    startTransition(async () => {
      const res = await submitLead(formData);
      setResult(res);
    });
  }

  /* ── Success State ─────────────────────────────────── */
  if (result?.success) {
    return (
      <div className="border border-gold-200 bg-gold-50 text-gold-800 p-6 rounded-sm">
        <div className="flex flex-col items-center text-center">
          <svg
            className="h-10 w-10 text-gold-500 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="font-heading text-lg text-noir-900 mb-1">
            Inquiry Received
          </h3>
          <p className="text-sm font-body text-gold-800">
            Your private inquiry has been sent to {companyName}. They will
            respond shortly.
          </p>
        </div>
      </div>
    );
  }

  /* ── Form ───────────────────────────────────────────── */
  return (
    <div className="bg-white border border-ivory-200 p-6 rounded-sm">
      <h3 className="font-heading text-lg text-noir-900 font-light tracking-wide mb-6">
        Private Inquiry
      </h3>
      <div className="h-px bg-gradient-to-r from-gold-500 to-transparent mb-6" />

      {result?.error && (
        <div className="mb-4 border border-red-200 bg-red-50 p-3 rounded-sm">
          <p className="text-sm text-red-700 font-body">{result.error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label
            htmlFor="lead-name"
            className="block text-xs font-body text-noir-600 uppercase tracking-widest mb-1.5"
          >
            Name
          </label>
          <input
            id="lead-name"
            name="name"
            type="text"
            required
            placeholder="Your full name"
            className="w-full border border-ivory-200 bg-white text-noir-900 px-3 py-2.5 text-sm placeholder:text-noir-400 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 rounded-sm font-body"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="lead-email"
            className="block text-xs font-body text-noir-600 uppercase tracking-widest mb-1.5"
          >
            Email
          </label>
          <input
            id="lead-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full border border-ivory-200 bg-white text-noir-900 px-3 py-2.5 text-sm placeholder:text-noir-400 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 rounded-sm font-body"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="lead-phone"
            className="block text-xs font-body text-noir-600 uppercase tracking-widest mb-1.5"
          >
            Phone
          </label>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            placeholder="(555) 123-4567"
            className="w-full border border-ivory-200 bg-white text-noir-900 px-3 py-2.5 text-sm placeholder:text-noir-400 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 rounded-sm font-body"
          />
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="lead-message"
            className="block text-xs font-body text-noir-600 uppercase tracking-widest mb-1.5"
          >
            Message
          </label>
          <textarea
            id="lead-message"
            name="message"
            rows={4}
            placeholder="Describe your aircraft and the services you need..."
            className="w-full border border-ivory-200 bg-white text-noir-900 px-3 py-2.5 text-sm placeholder:text-noir-400 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 rounded-sm resize-none font-body"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="bg-noir-900 hover:bg-noir-800 text-white w-full py-3 rounded-sm text-sm font-semibold tracking-widest uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-body"
        >
          {isPending ? "Sending..." : "Submit Inquiry"}
        </button>
      </form>
    </div>
  );
}
