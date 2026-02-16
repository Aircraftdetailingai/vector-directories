"use client";

import { useTransition, useState, useRef } from "react";
import { submitLead } from "../actions";

interface LeadFormProps {
  companyId: string;
  companyName: string;
}

export default function LeadForm({ companyId, companyName }: LeadFormProps) {
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("company_id", companyId);

    setError(null);

    startTransition(async () => {
      const result = await submitLead(formData);
      if (result.success) {
        setSent(true);
        formRef.current?.reset();
      } else {
        setError(result.error ?? "Something went wrong. Please try again.");
      }
    });
  }

  return (
    <div className="rounded-xl border border-brand-100 bg-white p-6">
      <h2 className="font-heading text-lg font-semibold text-brown-500">
        Request a Quote
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        Send a quote request to {companyName}
      </p>

      {sent && (
        <div className="mt-4 rounded-xl border border-brand-200 bg-brand-50 p-4">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-brand-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm font-medium text-brand-600">
              Quote request sent! They will get back to you soon.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {!sent && (
        <form ref={formRef} onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="lead-name"
              className="block text-sm font-medium text-gray-700"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="lead-name"
              name="name"
              type="text"
              required
              className="mt-1 block w-full rounded-xl border border-brand-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              htmlFor="lead-email"
              className="block text-sm font-medium text-gray-700"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="lead-email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-xl border border-brand-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="lead-phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone <span className="text-gray-400">(optional)</span>
            </label>
            <input
              id="lead-phone"
              name="phone"
              type="tel"
              className="mt-1 block w-full rounded-xl border border-brand-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="(555) 000-0000"
            />
          </div>

          <div>
            <label
              htmlFor="lead-services"
              className="block text-sm font-medium text-gray-700"
            >
              Services Interested In
            </label>
            <input
              id="lead-services"
              name="services"
              type="text"
              className="mt-1 block w-full rounded-xl border border-brand-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="e.g., Exterior wash, ceramic coating"
            />
          </div>

          <div>
            <label
              htmlFor="lead-message"
              className="block text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="lead-message"
              name="message"
              rows={4}
              className="mt-1 block w-full rounded-xl border border-brand-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="Tell us about your aircraft and what you need..."
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Sending..." : "Request Quote"}
          </button>
        </form>
      )}
    </div>
  );
}
