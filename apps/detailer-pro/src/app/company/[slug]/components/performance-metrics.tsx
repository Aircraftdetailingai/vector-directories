import type { Company, Location, Listing } from "@vector/types";

interface PerformanceMetricsProps {
  company: Company;
  locations: Location[];
  listings: Listing[];
}

export default function PerformanceMetrics({
  company,
  locations,
  listings,
}: PerformanceMetricsProps) {
  const activeListings = listings.filter((l) => l.status === "active");
  const score = company.trust_score ?? 0;

  const metrics = [
    {
      label: "Trust Score",
      value: company.trust_score !== null ? String(company.trust_score) : "--",
      hasBar: true,
    },
    {
      label: "Locations",
      value: String(locations.length),
      hasBar: false,
    },
    {
      label: "Services",
      value: String(activeListings.length),
      hasBar: false,
    },
    {
      label: "Status",
      value: company.is_claimed ? "Verified" : "Unclaimed",
      hasBar: false,
    },
  ];

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <h2 className="font-heading text-lg font-semibold text-white">
        Performance Metrics
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-slate-900 rounded-lg border border-slate-700 p-4"
          >
            <p className="metric-label text-xs font-medium uppercase tracking-wider text-slate-500">
              {metric.label}
            </p>
            <p className="metric-value mt-1 font-heading text-2xl font-bold text-white">
              {metric.value}
            </p>
            {metric.hasBar && company.trust_score !== null && (
              <div className="mt-2 h-1.5 w-full rounded-lg bg-slate-700">
                <div
                  className="h-1.5 rounded-lg bg-electric-500 transition-all"
                  style={{ width: `${Math.min(score, 100)}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
