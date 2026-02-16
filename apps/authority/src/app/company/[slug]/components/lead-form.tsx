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
      <div className="rounded-xl border border-gold-200 bg-gold-50 p-6">
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
          <h3 className="font-heading text-lg font-bold text-navy-900 mb-1">
            Quote Requested
          </h3>
          <p className="text-sm text-navy-600 font-body">
            Your request has been sent to {companyName}. They will be in touch
            shortly.
          </p>
        </div>
      </div>
    );
  }

  /* ── Form ───────────────────────────────────────────── */
  return (
    <div className="rounded-xl border border-navy-200 bg-white p-6">
      <h3 className="font-heading text-lg font-bold text-navy-900 mb-5">
        Request a Quote
      </h3>

      {result?.error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-700 font-body">{result.error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label
            htmlFor="lead-name"
            className="block text-sm font-medium text-navy-700 mb-1 font-body"
          >
            Name
          </label>
          <input
            id="lead-name"
            name="name"
            type="text"
            required
            placeholder="Your full name"
            className="w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 placeholder:text-navy-300 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20 font-body"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="lead-email"
            className="block text-sm font-medium text-navy-700 mb-1 font-body"
          >
            Email
          </label>
          <input
            id="lead-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 placeholder:text-navy-300 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20 font-body"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="lead-phone"
            className="block text-sm font-medium text-navy-700 mb-1 font-body"
          >
            Phone
          </label>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            placeholder="(555) 123-4567"
            className="w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 placeholder:text-navy-300 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20 font-body"
          />
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="lead-message"
            className="block text-sm font-medium text-navy-700 mb-1 font-body"
          >
            Message
          </label>
          <textarea
            id="lead-message"
            name="message"
            rows={4}
            placeholder="Describe your aircraft and the services you need..."
            className="w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 placeholder:text-navy-300 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20 resize-none font-body"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-body"
        >
          {isPending ? "Sending..." : "Send Quote Request"}
        </button>
      </form>
    </div>
  );
}
