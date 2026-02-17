"use client";

import { useState } from "react";
import type { Lead } from "@vector/types";

interface LeadsTableProps {
  leads: Lead[];
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (leads.length === 0) {
    return (
      <div className="border border-dashed border-ivory-300 bg-ivory-50 py-12 text-center rounded-sm">
        <svg
          className="mx-auto h-10 w-10 text-ivory-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z"
          />
        </svg>
        <p className="mt-3 text-sm text-ivory-500">
          No leads yet. Your profile is live and accepting inquiries.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-ivory-200 rounded-sm">
      <table className="min-w-full divide-y divide-ivory-200">
        <thead className="bg-noir-900">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-500">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-500">
              Email
            </th>
            <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-500 sm:table-cell">
              Phone
            </th>
            <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-500 md:table-cell">
              Message
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-500">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ivory-100 bg-white">
          {leads.map((lead) => {
            const isExpanded = expandedId === lead.id;
            return (
              <tr
                key={lead.id}
                className="cursor-pointer transition-colors hover:bg-gold-50/50"
                onClick={() =>
                  setExpandedId(isExpanded ? null : lead.id)
                }
              >
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-noir-900">
                  {lead.name}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-ivory-500">
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-gold-500 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {lead.email}
                  </a>
                </td>
                <td className="hidden whitespace-nowrap px-4 py-3 text-sm text-ivory-500 sm:table-cell">
                  {lead.phone ?? "\u2014"}
                </td>
                <td className="hidden max-w-xs truncate px-4 py-3 text-sm text-ivory-500 md:table-cell">
                  {isExpanded
                    ? lead.message
                    : (lead.message?.slice(0, 60) ?? "\u2014") +
                      ((lead.message?.length ?? 0) > 60 ? "..." : "")}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-ivory-400">
                  {new Date(lead.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
