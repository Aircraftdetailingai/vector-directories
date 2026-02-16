import type { Company } from "@vector/types";
import {
  getTrustScoreLabel,
  getTrustScoreColor,
  formatTrustScore,
} from "@vector/utils";

const SCORE_BG: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-800",
  green: "bg-green-100 text-green-800",
  lime: "bg-lime-100 text-lime-800",
  yellow: "bg-yellow-100 text-yellow-800",
  orange: "bg-orange-100 text-orange-800",
  red: "bg-red-100 text-red-800",
  gray: "bg-gray-100 text-gray-600",
};

const TIER_STYLE: Record<string, string> = {
  enterprise: "bg-purple-100 text-purple-800",
  pro: "bg-forest-100 text-forest-800",
  starter: "bg-blue-100 text-blue-800",
  free: "bg-gray-100 text-gray-600",
};

interface CompanyHeaderProps {
  company: Company;
}

export function CompanyHeader({ company }: CompanyHeaderProps) {
  const scoreColor = getTrustScoreColor(company.trust_score);
  const scoreClass = SCORE_BG[scoreColor] ?? SCORE_BG.gray;
  const tierClass = TIER_STYLE[company.tier] ?? TIER_STYLE.free;

  return (
    <section className="bg-white py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {/* Logo */}
          {company.logo_url ? (
            <img
              src={company.logo_url}
              alt=""
              className="h-24 w-24 flex-shrink-0 rounded-xl border border-gray-100 object-contain"
            />
          ) : (
            <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-xl bg-forest-100 font-heading text-3xl font-bold text-forest-700">
              {company.name.charAt(0)}
            </div>
          )}

          <div className="min-w-0 flex-1">
            {/* Name + badges */}
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-2xl font-bold text-gray-900 sm:text-3xl">
                {company.name}
              </h1>
              <span
                className={`rounded-md px-2.5 py-1 text-xs font-semibold capitalize ${tierClass}`}
              >
                {company.tier}
              </span>
            </div>

            {/* Trust score + verified */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${scoreClass}`}
              >
                {formatTrustScore(company.trust_score)}
              </span>
              <span className="text-sm text-gray-500">
                {getTrustScoreLabel(company.trust_score)}
              </span>
              {company.is_claimed && (
                <span className="inline-flex items-center gap-1 text-sm text-forest-600">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
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
              )}
            </div>

            {/* Description */}
            {company.description && (
              <p className="mt-4 max-w-3xl text-gray-600">
                {company.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
