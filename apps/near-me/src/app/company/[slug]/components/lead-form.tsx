"use client";

import { useTransition, useState, useRef } from "react";
import { submitLead } from "../actions";

interface LeadFormProps {
  companyId: string;
  companyName: string;
}

export function LeadForm({ companyId, companyName }: LeadFormProps) {
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
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="font-heading text-lg font-semibold text-gray-900">
        Contact This Business
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Send a message to {companyName}
      </p>

      {sent && (
        <div className="mt-4 rounded-lg bg-emerald-50 p-4">
          <p className="text-sm font-medium text-emerald-700">
            Message sent! The business will get back to you soon.
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-4">
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
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
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
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
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
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="(555) 000-0000"
            />
          </div>

          <div>
            <label
              htmlFor="lead-message"
              className="block text-sm font-medium text-gray-700"
            >
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="lead-message"
              name="message"
              required
              rows={4}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="Describe what you need..."
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}
