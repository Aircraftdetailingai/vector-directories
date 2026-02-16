"use client";

import { useState, useTransition } from "react";
import { submitLead, type LeadResult } from "../actions";

interface LeadFormProps {
  companyId: string;
  companyName: string;
}

export function LeadForm({ companyId, companyName }: LeadFormProps) {
  const [result, setResult] = useState<LeadResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await submitLead(formData);
      setResult(res);
    });
  }

  if (result?.success) {
    return (
      <div className="rounded-xl border border-forest-200 bg-forest-50 p-6 text-center">
        <svg
          className="mx-auto h-10 w-10 text-forest-600"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clipRule="evenodd"
          />
        </svg>
        <p className="mt-3 font-heading text-sm font-semibold text-forest-800">
          Request sent!
        </p>
        <p className="mt-1 text-sm text-forest-600">
          {companyName} will be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-forest-800">
        Get a Free Quote
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Contact {companyName} directly
      </p>

      <form action={handleSubmit} className="mt-4 space-y-3">
        <input type="hidden" name="company_id" value={companyId} />

        <div>
          <label htmlFor="lead-name" className="sr-only">
            Name
          </label>
          <input
            id="lead-name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500"
          />
        </div>

        <div>
          <label htmlFor="lead-email" className="sr-only">
            Email
          </label>
          <input
            id="lead-email"
            name="email"
            type="email"
            required
            placeholder="Email address"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500"
          />
        </div>

        <div>
          <label htmlFor="lead-phone" className="sr-only">
            Phone
          </label>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            placeholder="Phone (optional)"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500"
          />
        </div>

        <div>
          <label htmlFor="lead-message" className="sr-only">
            Message
          </label>
          <textarea
            id="lead-message"
            name="message"
            required
            rows={3}
            placeholder="Tell them about your aircraft and what you need..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500"
          />
        </div>

        {result?.error && (
          <p className="text-sm text-red-600" role="alert">
            {result.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-forest-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Sending..." : "Send Request"}
        </button>
      </form>
    </div>
  );
}
