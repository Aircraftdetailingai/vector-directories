"use client";

import { useTransition, useState } from "react";
import { submitLead } from "../actions";

export default function LeadForm({ companyId }: { companyId: string }) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("company_id", companyId);

    startTransition(async () => {
      setError(null);
      setSuccess(false);

      const result = await submitLead(formData);

      if (result.success) {
        setSuccess(true);
        form.reset();
      } else {
        setError(result.error ?? "Something went wrong. Please try again.");
      }
    });
  }

  if (success) {
    return (
      <section className="bg-coral-50 border border-coral-200 rounded-2xl p-6 text-center">
        <p className="text-2xl mb-2" aria-hidden="true">
          &#127881;
        </p>
        <h2 className="font-heading font-bold text-lg text-coral-700 mb-1">
          Message Sent!
        </h2>
        <p className="text-coral-600 font-body text-sm">
          Thanks for reaching out. The team will get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-4 text-teal-600 hover:text-teal-700 text-sm font-medium underline"
        >
          Send another message
        </button>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl border border-teal-100 p-6">
      <h2 className="font-heading font-bold text-lg text-gray-800 mb-1">
        Send a Message &#128075;
      </h2>
      <p className="text-gray-400 font-body text-sm mb-5">
        Have a question? We&apos;d love to hear from you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label
            htmlFor="lead-name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            id="lead-name"
            name="name"
            type="text"
            required
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-colors"
            placeholder="Your name"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="lead-email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="lead-email"
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-colors"
            placeholder="you@example.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="lead-phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone
            <span className="text-gray-400 font-normal"> (optional)</span>
          </label>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-colors"
            placeholder="(555) 123-4567"
          />
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="lead-message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Message
          </label>
          <textarea
            id="lead-message"
            name="message"
            required
            rows={4}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-colors resize-y"
            placeholder="Tell us about your aircraft and what services you need..."
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600 font-body">{error}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white text-sm font-semibold rounded-full px-6 py-3 transition-colors"
        >
          {isPending ? "Sending..." : "Send Message"}
        </button>
      </form>
    </section>
  );
}
