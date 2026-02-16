"use client";

import Link from "next/link";
import type { CompanyWithDistance } from "@/lib/geo";
import { getTrustScoreLabel } from "@vector/utils";

interface CompanyCardProps {
  company: CompanyWithDistance;
  selected?: boolean;
  onClick?: () => void;
}

const tierLabels: Record<string, string> = {
  basic: "Basic",
  enhanced: "Enhanced",
  premium: "Premium",
  featured: "Featured",
  bundle_all: "Bundle",
};

const tierColors: Record<string, string> = {
  basic: "bg-gray-100 text-gray-600",
  enhanced: "bg-sky-50 text-sky-700",
  premium: "bg-amber-50 text-amber-700",
  featured: "bg-purple-50 text-purple-700",
  bundle_all: "bg-indigo-50 text-indigo-700",
};

export default function CompanyCard({
  company,
  selected,
  onClick,
}: CompanyCardProps) {
  const scoreLabel = getTrustScoreLabel(company.trust_score);

  return (
    <Link href={`/company/${company.slug}`} onClick={onClick}>
      <div
        className={`group p-4 rounded-lg border transition-shadow hover:shadow-md cursor-pointer ${
          selected
            ? "border-l-4 border-l-sky-500 border-sky-200 bg-sky-50/50"
            : "border-gray-200 bg-white"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-semibold text-gray-900 text-sm group-hover:text-sky-700 transition-colors truncate">
              {company.name}
            </h3>
            {(company.city || company.state) && (
              <p className="text-xs text-gray-500 mt-0.5">
                {[company.city, company.state].filter(Boolean).join(", ")}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Trust Score Badge */}
            {company.trust_score !== null && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {company.trust_score}
                <span className="text-emerald-500 font-normal">
                  {scoreLabel}
                </span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          {/* Tier Badge */}
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              tierColors[company.tier] ?? tierColors.basic
            }`}
          >
            {tierLabels[company.tier] ?? "Basic"}
          </span>

          {company.is_claimed && (
            <span className="text-xs text-sky-600 font-medium flex items-center gap-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  fillRule="evenodd"
                  d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              Claimed
            </span>
          )}

          {/* Distance */}
          {company.distance !== undefined && (
            <span className="text-xs text-gray-400 ml-auto">
              {company.distance < 1
                ? "< 1 mi"
                : `${Math.round(company.distance)} mi`}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
