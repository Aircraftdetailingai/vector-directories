import type { Tier } from "@vector/types";
import { TIER_FEATURES } from "@vector/utils";
import UpgradeButton from "./upgrade-button";

const TIERS: { key: Tier; name: string; price: string }[] = [
  { key: "basic", name: "Basic", price: "$0" },
  { key: "enhanced", name: "Enhanced", price: "$49/mo" },
  { key: "premium", name: "Premium", price: "$129/mo" },
  { key: "featured", name: "Featured", price: "$249/mo" },
  { key: "bundle_all", name: "Bundle All", price: "$349/mo" },
];

const FEATURE_ROWS: {
  label: string;
  getValue: (tier: Tier) => string;
}[] = [
  {
    label: "Listings",
    getValue: (t) => {
      const v = TIER_FEATURES[t].maxListings;
      return v === Infinity ? "Unlimited" : String(v);
    },
  },
  {
    label: "Locations",
    getValue: (t) => {
      const v = TIER_FEATURES[t].maxLocations;
      return v === Infinity ? "Unlimited" : String(v);
    },
  },
  {
    label: "Photos",
    getValue: (t) => {
      const v = TIER_FEATURES[t].maxPhotos;
      return v === Infinity ? "Unlimited" : String(v);
    },
  },
  {
    label: "Analytics",
    getValue: (t) => (TIER_FEATURES[t].analytics ? "Yes" : "\u2014"),
  },
  {
    label: "Photo Gallery",
    getValue: (t) => (TIER_FEATURES[t].photoGallery ? "Yes" : "\u2014"),
  },
  {
    label: "Lead Capture",
    getValue: (t) => (TIER_FEATURES[t].leadCapture ? "Yes" : "\u2014"),
  },
  {
    label: "Priority Support",
    getValue: (t) => (TIER_FEATURES[t].prioritySupport ? "Yes" : "\u2014"),
  },
  {
    label: "Featured Placement",
    getValue: (t) => (TIER_FEATURES[t].featuredPlacement ? "Yes" : "\u2014"),
  },
  {
    label: "Custom Branding",
    getValue: (t) => (TIER_FEATURES[t].customBranding ? "Yes" : "\u2014"),
  },
  {
    label: "API Access",
    getValue: (t) => (TIER_FEATURES[t].apiAccess ? "Yes" : "\u2014"),
  },
];

interface TierComparisonProps {
  currentTier: Tier;
  companyId: string;
}

export default function TierComparison({
  currentTier,
  companyId,
}: TierComparisonProps) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-lg border border-slate-700 lg:block">
        <table className="min-w-full divide-y divide-slate-700">
          <thead>
            <tr>
              <th className="bg-slate-900 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Feature
              </th>
              {TIERS.map((t) => (
                <th
                  key={t.key}
                  className={`px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider ${
                    t.key === currentTier
                      ? "bg-electric-500/10 text-electric-400 ring-2 ring-inset ring-electric-500/40"
                      : "bg-slate-900 text-slate-400"
                  }`}
                >
                  <div>{t.name}</div>
                  <div className="mt-1 text-lg font-bold normal-case tracking-normal text-white">
                    {t.price}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-800">
            {FEATURE_ROWS.map((row) => (
              <tr key={row.label}>
                <td className="px-6 py-3 text-sm font-medium text-slate-300">
                  {row.label}
                </td>
                {TIERS.map((t) => {
                  const val = row.getValue(t.key);
                  return (
                    <td
                      key={t.key}
                      className={`px-6 py-3 text-center text-sm ${
                        t.key === currentTier ? "bg-electric-500/5" : ""
                      } ${val === "Yes" ? "font-semibold text-green-400" : val === "\u2014" ? "text-slate-600" : "text-slate-300"}`}
                    >
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))}
            {/* Action row */}
            <tr>
              <td className="px-6 py-4" />
              {TIERS.map((t) => (
                <td
                  key={t.key}
                  className={`px-6 py-4 text-center ${t.key === currentTier ? "bg-electric-500/5" : ""}`}
                >
                  {t.key === "basic" ? (
                    t.key === currentTier ? (
                      <span className="text-sm text-slate-500">
                        Current Plan
                      </span>
                    ) : null
                  ) : (
                    <UpgradeButton
                      tier={t.key}
                      companyId={companyId}
                      isCurrent={t.key === currentTier}
                    />
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-4 lg:hidden">
        {TIERS.map((t) => {
          const isCurrent = t.key === currentTier;
          return (
            <div
              key={t.key}
              className={`rounded-lg border p-6 ${
                isCurrent
                  ? "border-electric-500/50 bg-electric-500/5 ring-2 ring-electric-500/30"
                  : "border-slate-700 bg-slate-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-white">
                    {t.name}
                  </h3>
                  <p className="text-2xl font-bold text-electric-400">
                    {t.price}
                  </p>
                </div>
                {isCurrent && (
                  <span className="rounded-lg bg-electric-500/10 px-3 py-1 text-xs font-semibold text-electric-400 border border-electric-500/30">
                    Current
                  </span>
                )}
              </div>

              <dl className="mt-4 space-y-2">
                {FEATURE_ROWS.map((row) => {
                  const val = row.getValue(t.key);
                  return (
                    <div key={row.label} className="flex justify-between">
                      <dt className="text-sm text-slate-400">{row.label}</dt>
                      <dd
                        className={`text-sm font-medium ${val === "Yes" ? "text-green-400" : val === "\u2014" ? "text-slate-600" : "text-slate-300"}`}
                      >
                        {val}
                      </dd>
                    </div>
                  );
                })}
              </dl>

              {t.key !== "basic" && (
                <div className="mt-4">
                  <UpgradeButton
                    tier={t.key}
                    companyId={companyId}
                    isCurrent={isCurrent}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
