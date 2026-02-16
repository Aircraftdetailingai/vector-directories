import type { Listing } from "@vector/types";

interface PortfolioShowcaseProps {
  listings: Listing[];
}

const statusIndicator: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-green-500" },
  inactive: { label: "Inactive", color: "bg-slate-500" },
  pending: { label: "Pending", color: "bg-yellow-500" },
  archived: { label: "Archived", color: "bg-slate-600" },
};

export default function PortfolioShowcase({ listings }: PortfolioShowcaseProps) {
  if (listings.length === 0) return null;

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <h2 className="font-heading text-lg font-semibold text-white">
        Service Portfolio
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {listings.map((listing) => {
          const status = statusIndicator[listing.status] ?? statusIndicator.active;
          return (
            <div
              key={listing.id}
              className="bg-slate-900 rounded-lg border border-slate-700 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-heading text-sm font-semibold text-white">
                  {listing.title}
                </h3>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span
                    className={`h-2 w-2 rounded-lg ${status.color}`}
                    aria-hidden="true"
                  />
                  <span className="text-xs text-slate-500">{status.label}</span>
                </div>
              </div>
              <span className="mt-2 inline-block rounded-lg bg-electric-500/10 px-2 py-0.5 text-xs font-medium text-electric-400">
                {listing.category}
              </span>
              {listing.description && (
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  {listing.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
