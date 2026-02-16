import Link from "next/link";
import type { Company } from "@vector/types";
import { getTrustScoreLabel, formatTrustScore } from "@vector/utils";

interface CompanyHeroProps {
  company: Company;
  city?: string;
  state?: string;
}

export function CompanyHero({ company, city, state }: CompanyHeroProps) {
  const tierLabels: Record<string, string> = {
    basic: "Basic",
    enhanced: "Enhanced",
    premium: "Premium",
    featured: "Featured",
    bundle_all: "All Access",
  };

  return (
    <section className="bg-gradient-to-r from-sky-600 to-sky-500">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
              {company.name}
            </h1>
            {(city || state) && (
              <p className="mt-2 text-lg text-sky-100">
                {[city, state].filter(Boolean).join(", ")}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {company.trust_score !== null && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-sm font-semibold text-white">
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
                  {formatTrustScore(company.trust_score)} &middot;{" "}
                  {getTrustScoreLabel(company.trust_score)}
                </span>
              )}
              <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white">
                {tierLabels[company.tier] ?? company.tier}
              </span>
            </div>
          </div>

          {!company.is_claimed && (
            <Link
              href={`/claim/${company.slug}`}
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-sky-600 shadow-sm transition-colors hover:bg-sky-50"
            >
              Claim This Listing
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
