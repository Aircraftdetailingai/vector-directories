"use client";

import { useState } from "react";
import type { Lead, Tier } from "@vector/types";

export default function LeadsTable({
  leads,
  tier,
}: {
  leads: Lead[];
  tier: Tier;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Suppress unused variable lint
  void tier;

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-navy-100 bg-white p-10 text-center shadow-sm">
        <svg
          className="mx-auto h-10 w-10 text-navy-300 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
        <p className="font-heading text-base font-semibold text-navy-900 mb-1">
          No Leads Yet
        </p>
        <p className="text-sm text-navy-500 font-body">
          Leads will appear here when potential customers contact you through
          your listing.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-navy-100 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-5 py-3 bg-navy-50 border-b border-navy-100 text-xs font-semibold text-navy-600 uppercase tracking-wide">
        <div className="col-span-3">Name</div>
        <div className="col-span-3">Email</div>
        <div className="col-span-2">Phone</div>
        <div className="col-span-3">Date</div>
        <div className="col-span-1" />
      </div>

      {/* Rows */}
      {leads.map((lead) => {
        const isExpanded = expandedId === lead.id;

        return (
          <div key={lead.id} className="border-b border-navy-50 last:border-b-0">
            <button
              onClick={() => setExpandedId(isExpanded ? null : lead.id)}
              className="w-full text-left px-5 py-4 hover:bg-navy-50/50 transition-colors"
            >
              <div className="sm:grid sm:grid-cols-12 gap-4 items-center">
                <div className="col-span-3">
                  <span className="font-medium text-navy-900 text-sm">
                    {lead.name}
                  </span>
                </div>
                <div className="col-span-3">
                  <span className="text-sm text-navy-600 font-body">
                    {lead.email}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-navy-500 font-body">
                    {lead.phone ?? "—"}
                  </span>
                </div>
                <div className="col-span-3">
                  <span className="text-sm text-navy-500 font-body">
                    {formatDate(lead.created_at)}
                  </span>
                </div>
                <div className="col-span-1 flex justify-end">
                  <svg
                    className={`h-4 w-4 text-navy-400 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>

              {/* Mobile summary */}
              <div className="sm:hidden mt-1 text-xs text-navy-500 font-body">
                {lead.email} &middot; {formatDate(lead.created_at)}
              </div>
            </button>

            {/* Expanded message */}
            {isExpanded && lead.message && (
              <div className="px-5 pb-4">
                <div className="rounded-lg bg-navy-50 border border-navy-100 p-4">
                  <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide mb-1">
                    Message
                  </p>
                  <p className="text-sm text-navy-800 font-body leading-relaxed">
                    {lead.message}
                  </p>
                  <div className="mt-3 flex gap-3">
                    <a
                      href={`mailto:${lead.email}`}
                      className="inline-flex items-center rounded-lg bg-navy-900 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-800 transition-colors"
                    >
                      Reply via Email
                    </a>
                    {lead.phone && (
                      <a
                        href={`tel:${lead.phone}`}
                        className="inline-flex items-center rounded-lg border border-navy-200 px-4 py-2 text-xs font-semibold text-navy-700 hover:bg-navy-50 transition-colors"
                      >
                        Call {lead.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Summary */}
      <div className="px-5 py-3 bg-navy-50 border-t border-navy-100">
        <p className="text-xs text-navy-500 font-body">
          Showing <span className="font-semibold text-gold-600">{leads.length}</span>{" "}
          {leads.length === 1 ? "lead" : "leads"}
        </p>
      </div>
    </div>
  );
}
