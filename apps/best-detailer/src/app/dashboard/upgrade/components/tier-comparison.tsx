import type { Tier } from "@vector/types";
import { TIER_FEATURES } from "@vector/utils";
import { UpgradeButton } from "./upgrade-button";

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

export function TierComparison({
  currentTier,
  companyId,
}: TierComparisonProps) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden border border-ivory-200 lg:block rounded-sm">
        <table className="min-w-full divide-y divide-ivory-200">
          <thead>
            <tr>
              <th className="bg-noir-900 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gold-500">
                Feature
              </th>
              {TIERS.map((t) => (
                <th
                  key={t.key}
                  className={`px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider ${
                    t.key === currentTier
                      ? "bg-noir-900 text-gold-500 ring-2 ring-inset ring-gold-500"
                      : "bg-noir-900 text-ivory-400"
                  }`}
                >
                  <div>{t.name}</div>
                  <div className="mt-1 text-lg font-bold normal-case tracking-normal">
                    {t.price}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ivory-100 bg-white">
            {FEATURE_ROWS.map((row) => (
              <tr key={row.label}>
                <td className="px-6 py-3 text-sm font-medium text-noir-900">
                  {row.label}
                </td>
                {TIERS.map((t) => {
                  const val = row.getValue(t.key);
                  return (
                    <td
                      key={t.key}
                      className={`px-6 py-3 text-center text-sm ${
                        t.key === currentTier ? "bg-gold-50/30" : ""
                      } ${val === "Yes" ? "font-semibold text-gold-600" : val === "\u2014" ? "text-ivory-300" : "text-noir-900"}`}
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
                  className={`px-6 py-4 text-center ${t.key === currentTier ? "bg-gold-50/30" : ""}`}
                >
                  {t.key === "basic" ? (
                    t.key === currentTier ? (
                      <span className="text-sm text-ivory-400">
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
              className={`border p-6 rounded-sm ${
                isCurrent
                  ? "border-gold-500 bg-white ring-2 ring-gold-500"
                  : "border-ivory-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-semibold text-noir-900">
                    {t.name}
                  </h3>
                  <p className="text-2xl font-bold text-gold-500">
                    {t.price}
                  </p>
                </div>
                {isCurrent && (
                  <span className="bg-gold-500 px-3 py-1 text-xs font-semibold text-noir-900 rounded-sm">
                    Current
                  </span>
                )}
              </div>

              <dl className="mt-4 space-y-2">
                {FEATURE_ROWS.map((row) => {
                  const val = row.getValue(t.key);
                  return (
                    <div key={row.label} className="flex justify-between">
                      <dt className="text-sm text-ivory-500">{row.label}</dt>
                      <dd
                        className={`text-sm font-medium ${val === "Yes" ? "text-gold-600" : val === "\u2014" ? "text-ivory-300" : "text-noir-900"}`}
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
