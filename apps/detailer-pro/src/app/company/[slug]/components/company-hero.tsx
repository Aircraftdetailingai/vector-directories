import Link from "next/link";
import type { Company } from "@vector/types";
import ProBadge from "@/components/pro-badge";

interface CompanyHeroProps {
  company: Company;
  city?: string;
  state?: string;
}

const tierConfig: Record<string, { label: string; color: string }> = {
  featured: { label: "Featured", color: "bg-electric-500 text-white" },
  premium: { label: "Premium", color: "bg-electric-400/20 text-electric-400 border border-electric-400/30" },
  enhanced: { label: "Enhanced", color: "bg-slate-400/20 text-slate-400 border border-slate-400/30" },
  basic: { label: "Basic", color: "bg-slate-600/20 text-slate-500 border border-slate-600/30" },
  bundle_all: { label: "All Access", color: "bg-electric-500 text-white" },
};

export default function CompanyHero({ company, city, state }: CompanyHeroProps) {
  const tier = tierConfig[company.tier] ?? tierConfig.basic;

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <ProBadge score={company.trust_score} size="lg" />
          <div>
            <h1 className="font-heading text-2xl font-bold text-white">
              {company.name}
            </h1>
            {(city || state) && (
              <p className="mt-1 text-sm text-slate-400">
                {[city, state].filter(Boolean).join(", ")}
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${tier.color}`}
              >
                {tier.label}
              </span>
              {company.is_claimed ? (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-electric-500/10 px-2.5 py-1 text-xs font-semibold text-electric-400 border border-electric-500/30">
                  <svg
                    className="h-3.5 w-3.5"
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
                  Pro Verified
                </span>
              ) : (
                <Link
                  href={`/claim/${company.slug}`}
                  className="inline-flex items-center rounded-lg bg-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-600 hover:text-white"
                >
                  Claim Profile
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      {company.description && (
        <p className="mt-5 font-body text-sm leading-relaxed text-slate-300">
          {company.description}
        </p>
      )}
    </div>
  );
}
