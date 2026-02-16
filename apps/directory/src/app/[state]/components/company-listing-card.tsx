import Link from "next/link";
import type { Company } from "@vector/types";
import {
  getTrustScoreLabel,
  getTrustScoreColor,
  formatTrustScore,
  formatPhone,
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

interface CompanyListingCardProps {
  company: Company & { city?: string; services?: string[] };
}

export function CompanyListingCard({ company }: CompanyListingCardProps) {
  const scoreColor = getTrustScoreColor(company.trust_score);
  const scoreClass = SCORE_BG[scoreColor] ?? SCORE_BG.gray;
  const tierClass = TIER_STYLE[company.tier] ?? TIER_STYLE.free;

  return (
    <div className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-forest-300 hover:shadow-lg hover:shadow-forest-100/50">
      <div className="flex items-start gap-4">
        {company.logo_url ? (
          <img
            src={company.logo_url}
            alt=""
            className="h-14 w-14 flex-shrink-0 rounded-lg border border-gray-100 object-contain"
          />
        ) : (
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-forest-100 font-heading text-xl font-bold text-forest-700">
            {company.name.charAt(0)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-heading text-lg font-semibold text-gray-900 group-hover:text-forest-700">
            {company.name}
          </h3>
          {company.city && (
            <p className="mt-0.5 text-sm text-gray-500">{company.city}</p>
          )}
          {company.description && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-500">
              {company.description}
            </p>
          )}
        </div>
      </div>

      {/* Trust score + claimed badge */}
      <div className="mt-4 flex items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${scoreClass}`}
        >
          {formatTrustScore(company.trust_score)}
        </span>
        <span className="text-xs text-gray-400">
          {getTrustScoreLabel(company.trust_score)}
        </span>
        {company.is_claimed && (
          <span className="ml-auto inline-flex items-center gap-1 text-xs text-forest-600">
            <svg
              className="h-3.5 w-3.5"
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

      {/* Tier badge + services */}
      <div className="mt-3 border-t border-gray-100 pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-medium capitalize ${tierClass}`}
          >
            {company.tier}
          </span>
          {company.services?.slice(0, 2).map((service) => (
            <span
              key={service}
              className="rounded-md bg-gray-50 px-2 py-0.5 text-xs text-gray-500"
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      {/* Phone + View Profile */}
      <div className="mt-4 flex items-center justify-between">
        {company.phone ? (
          <a
            href={`tel:${company.phone}`}
            className="text-sm text-gray-600 transition-colors hover:text-forest-700"
            onClick={(e) => e.stopPropagation()}
          >
            {formatPhone(company.phone)}
          </a>
        ) : (
          <span />
        )}
        <Link
          href={`/company/${company.slug}`}
          className="inline-flex items-center rounded-lg bg-forest-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest-700"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
