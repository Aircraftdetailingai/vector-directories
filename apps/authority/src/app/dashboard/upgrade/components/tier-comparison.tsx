"use client";

import type { Tier } from "@vector/types";
import UpgradeButton from "./upgrade-button";

interface TierPlan {
  key: Tier;
  name: string;
  price: number;
  description: string;
}

const TIERS: TierPlan[] = [
  {
    key: "basic",
    name: "Basic",
    price: 0,
    description: "Get listed with essential info",
  },
  {
    key: "enhanced",
    name: "Enhanced",
    price: 49,
    description: "Photos, analytics & more visibility",
  },
  {
    key: "premium",
    name: "Premium",
    price: 129,
    description: "Lead capture, priority support & branding",
  },
  {
    key: "featured",
    name: "Featured",
    price: 249,
    description: "Top placement & featured badge",
  },
  {
    key: "bundle_all",
    name: "Bundle All",
    price: 349,
    description: "Everything, unlimited, across all sites",
  },
];

interface FeatureRow {
  label: string;
  values: Record<Tier, string | boolean>;
}

const FEATURES: FeatureRow[] = [
  {
    label: "Listings",
    values: { basic: "1", enhanced: "5", premium: "25", featured: "50", bundle_all: "Unlimited" },
  },
  {
    label: "Locations",
    values: { basic: "1", enhanced: "3", premium: "10", featured: "25", bundle_all: "Unlimited" },
  },
  {
    label: "Photo Gallery",
    values: { basic: false, enhanced: "5 photos", premium: "20 photos", featured: "50 photos", bundle_all: "Unlimited" },
  },
  {
    label: "Analytics",
    values: { basic: false, enhanced: true, premium: true, featured: true, bundle_all: true },
  },
  {
    label: "Priority Support",
    values: { basic: false, enhanced: false, premium: true, featured: true, bundle_all: true },
  },
  {
    label: "Featured Placement",
    values: { basic: false, enhanced: false, premium: false, featured: true, bundle_all: true },
  },
  {
    label: "Custom Branding",
    values: { basic: false, enhanced: false, premium: true, featured: true, bundle_all: true },
  },
  {
    label: "Lead Capture",
    values: { basic: false, enhanced: false, premium: true, featured: true, bundle_all: true },
  },
  {
    label: "API Access",
    values: { basic: false, enhanced: false, premium: false, featured: false, bundle_all: true },
  },
];

function renderValue(value: string | boolean) {
  if (value === true) {
    return <span className="font-semibold text-gold-600">Yes</span>;
  }
  if (value === false) {
    return <span className="text-navy-300">&mdash;</span>;
  }
  return <span className="text-navy-700 text-sm">{value}</span>;
}

export default function TierComparison({
  currentTier,
}: {
  currentTier: Tier;
}) {
  return (
    <div>
      {/* ── Desktop Table ──────────────────────────────────────────── */}
      <div className="hidden lg:block">
        <div className="rounded-xl border border-navy-100 bg-white shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-navy-100">
                <th className="px-6 py-4 text-left text-sm font-medium text-navy-500 font-body w-48">
                  Feature
                </th>
                {TIERS.map((t) => (
                  <th
                    key={t.key}
                    className={`px-4 py-4 text-center ${
                      t.key === currentTier
                        ? "bg-gold-50 ring-2 ring-inset ring-gold-400"
                        : ""
                    }`}
                  >
                    <div className="font-heading text-base font-semibold text-navy-900">
                      {t.name}
                    </div>
                    <div className="mt-1">
                      <span className="text-2xl font-bold text-navy-800 font-heading">
                        ${t.price}
                      </span>
                      {t.price > 0 && (
                        <span className="text-sm text-navy-500 font-body">
                          /mo
                        </span>
                      )}
                    </div>
                    {t.key === currentTier && (
                      <span className="mt-2 inline-flex items-center rounded-full bg-gold-500 px-2.5 py-0.5 text-xs font-semibold text-navy-900">
                        Current Plan
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((feature, idx) => (
                <tr
                  key={feature.label}
                  className={idx % 2 === 0 ? "bg-white" : "bg-navy-50/30"}
                >
                  <td className="px-6 py-3 text-sm font-medium text-navy-700 font-body">
                    {feature.label}
                  </td>
                  {TIERS.map((t) => (
                    <td
                      key={t.key}
                      className={`px-4 py-3 text-center ${
                        t.key === currentTier ? "bg-gold-50/50" : ""
                      }`}
                    >
                      {renderValue(feature.values[t.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-navy-100">
                <td className="px-6 py-4" />
                {TIERS.map((t) => (
                  <td
                    key={t.key}
                    className={`px-4 py-4 text-center ${
                      t.key === currentTier ? "bg-gold-50/50" : ""
                    }`}
                  >
                    {t.key !== "basic" && (
                      <UpgradeButton
                        tier={t.key}
                        isCurrent={t.key === currentTier}
                      />
                    )}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ── Mobile Cards ───────────────────────────────────────────── */}
      <div className="lg:hidden space-y-4">
        {TIERS.map((t) => {
          const isCurrent = t.key === currentTier;
          return (
            <div
              key={t.key}
              className={`rounded-xl border bg-white p-5 shadow-sm ${
                isCurrent
                  ? "border-gold-400 ring-2 ring-gold-400"
                  : "border-navy-100"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-heading text-lg font-semibold text-navy-900">
                    {t.name}
                  </h3>
                  <p className="text-xs text-navy-500 font-body">
                    {t.description}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-navy-800 font-heading">
                    ${t.price}
                  </span>
                  {t.price > 0 && (
                    <span className="text-sm text-navy-500 font-body">
                      /mo
                    </span>
                  )}
                </div>
              </div>

              {isCurrent && (
                <div className="mb-3">
                  <span className="inline-flex items-center rounded-full bg-gold-500 px-2.5 py-0.5 text-xs font-semibold text-navy-900">
                    Current Plan
                  </span>
                </div>
              )}

              <ul className="mb-4 space-y-2">
                {FEATURES.map((feature) => {
                  const val = feature.values[t.key];
                  if (val === false) return null;
                  return (
                    <li
                      key={feature.label}
                      className="flex items-center gap-2 text-sm text-navy-700 font-body"
                    >
                      <svg
                        className="h-4 w-4 shrink-0 text-gold-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                      <span>
                        {feature.label}
                        {typeof val === "string" && (
                          <span className="ml-1 text-navy-500">({val})</span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {t.key !== "basic" && (
                <UpgradeButton tier={t.key} isCurrent={isCurrent} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
