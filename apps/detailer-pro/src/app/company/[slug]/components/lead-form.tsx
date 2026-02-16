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
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <h2 className="font-heading text-lg font-semibold text-white">
        Request Quote
      </h2>
      <p className="mt-1 text-sm text-slate-400">
        Send a message to {companyName}
      </p>

      {sent && (
        <div className="mt-4 rounded-lg bg-electric-500/10 border border-electric-500/30 p-4">
          <p className="text-sm font-medium text-electric-400">
            Quote request sent. The team will follow up shortly.
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/30 p-4">
          <p className="text-sm font-medium text-red-400">{error}</p>
        </div>
      )}

      {!sent && (
        <form ref={formRef} onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="lead-name"
              className="block text-sm font-medium text-slate-300"
            >
              Name <span className="text-red-400">*</span>
            </label>
            <input
              id="lead-name"
              name="name"
              type="text"
              required
              className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white shadow-sm placeholder:text-slate-500 focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              htmlFor="lead-email"
              className="block text-sm font-medium text-slate-300"
            >
              Email <span className="text-red-400">*</span>
            </label>
            <input
              id="lead-email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white shadow-sm placeholder:text-slate-500 focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="lead-phone"
              className="block text-sm font-medium text-slate-300"
            >
              Phone <span className="text-slate-500">(optional)</span>
            </label>
            <input
              id="lead-phone"
              name="phone"
              type="tel"
              className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white shadow-sm placeholder:text-slate-500 focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500"
              placeholder="(555) 000-0000"
            />
          </div>

          <div>
            <label
              htmlFor="lead-message"
              className="block text-sm font-medium text-slate-300"
            >
              Message <span className="text-red-400">*</span>
            </label>
            <textarea
              id="lead-message"
              name="message"
              required
              rows={4}
              className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white shadow-sm placeholder:text-slate-500 focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500"
              placeholder="Describe the aircraft and services needed..."
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-electric-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-electric-600 focus:outline-none focus:ring-2 focus:ring-electric-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Sending..." : "Request Quote"}
          </button>
        </form>
      )}
    </div>
  );
}
