"use client";

import { useState, useMemo } from "react";

export interface SiteMetric {
  key: string;
  name: string;
  domain: string;
  pageViews: number;
  leads: number;
  contacts: number;
  claimed: number;
  paid: number;
  mrr: number;
}

type SortKey = keyof Pick<
  SiteMetric,
  "name" | "pageViews" | "leads" | "contacts" | "claimed" | "paid" | "mrr"
>;

const COLUMNS: { label: string; key: SortKey; align?: "right" }[] = [
  { label: "Site Name", key: "name" },
  { label: "Page Views (30d)", key: "pageViews", align: "right" },
  { label: "Leads", key: "leads", align: "right" },
  { label: "Contact Submissions", key: "contacts", align: "right" },
  { label: "Claimed Listings", key: "claimed", align: "right" },
  { label: "Paid Subscriptions", key: "paid", align: "right" },
  { label: "Est. MRR", key: "mrr", align: "right" },
];

function formatCurrency(cents: number): string {
  return `$${cents.toLocaleString()}`;
}

export function SiteMetricsTable({ sites }: { sites: SiteMetric[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = useMemo(() => {
    const copy = [...sites];
    copy.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortAsc
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortAsc
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
    return copy;
  }, [sites, sortKey, sortAsc]);

  const totals = useMemo(() => {
    return sites.reduce(
      (acc, s) => ({
        pageViews: acc.pageViews + s.pageViews,
        leads: acc.leads + s.leads,
        contacts: acc.contacts + s.contacts,
        claimed: acc.claimed + s.claimed,
        paid: acc.paid + s.paid,
        mrr: acc.mrr + s.mrr,
      }),
      { pageViews: 0, leads: 0, contacts: 0, claimed: 0, paid: 0, mrr: 0 },
    );
  }, [sites]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-forest-800 text-white">
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                className={`cursor-pointer whitespace-nowrap px-4 py-3 font-semibold select-none ${
                  col.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {col.label}
                {sortKey === col.key && (
                  <span className="ml-1">{sortAsc ? "\u25B2" : "\u25BC"}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((site) => (
            <tr
              key={site.key}
              className="border-b border-gray-100 transition-colors hover:bg-gray-50"
            >
              <td className="px-4 py-3 font-medium text-gray-900">
                <div>{site.name}</div>
                <div className="text-xs text-gray-400">{site.domain}</div>
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {site.pageViews.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {site.leads.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {site.contacts.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {site.claimed.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {site.paid.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right font-semibold tabular-nums">
                {formatCurrency(site.mrr)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-forest-800 bg-gray-50 font-bold">
            <td className="px-4 py-3 text-gray-900">Totals</td>
            <td className="px-4 py-3 text-right tabular-nums">
              {totals.pageViews.toLocaleString()}
            </td>
            <td className="px-4 py-3 text-right tabular-nums">
              {totals.leads.toLocaleString()}
            </td>
            <td className="px-4 py-3 text-right tabular-nums">
              {totals.contacts.toLocaleString()}
            </td>
            <td className="px-4 py-3 text-right tabular-nums">
              {totals.claimed.toLocaleString()}
            </td>
            <td className="px-4 py-3 text-right tabular-nums">
              {totals.paid.toLocaleString()}
            </td>
            <td className="px-4 py-3 text-right tabular-nums">
              {formatCurrency(totals.mrr)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
