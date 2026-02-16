import Link from "next/link";
import type { Company } from "@vector/types";

interface CompanyHeroProps {
  company: Company;
  city?: string;
  state?: string;
}

const TIER_LABELS: Record<string, string> = {
  basic: "Basic",
  enhanced: "Enhanced",
  premium: "Premium",
  featured: "Featured",
  bundle_all: "All Access",
};

export default function CompanyHero({ company, city, state }: CompanyHeroProps) {
  const scorePercent =
    company.trust_score !== null
      ? Math.min(100, Math.max(0, company.trust_score))
      : 0;

  return (
    <section className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          {/* Left: name + location + badges */}
          <div className="flex-1">
            <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl">
              {company.name}
            </h1>
            {(city || state) && (
              <p className="mt-2 text-lg text-white/80">
                {[city, state].filter(Boolean).join(", ")}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {/* Tier badge */}
              <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white">
                {TIER_LABELS[company.tier] ?? company.tier}
              </span>

              {/* Verified / Claim badge */}
              {company.is_claimed ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified
                </span>
              ) : (
                <Link
                  href={`/claim/${company.slug}`}
                  className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white underline decoration-white/40 hover:bg-white/30"
                >
                  Claim This Listing
                </Link>
              )}
            </div>
          </div>

          {/* Right: trust score */}
          {company.trust_score !== null && (
            <div className="flex flex-col items-center gap-2 sm:items-end">
              <span className="font-heading text-5xl font-bold text-white">
                {company.trust_score}
              </span>
              <span className="text-sm text-white/80">Trust Score</span>
              <div className="w-32">
                <div className="h-2 w-full rounded-full bg-white/30">
                  <div
                    className="h-2 rounded-full bg-white"
                    style={{ width: `${scorePercent}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
