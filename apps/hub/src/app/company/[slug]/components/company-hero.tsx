import type { Company } from "@vector/types";
import Link from "next/link";

function getTierLabel(tier: string): { label: string; className: string } {
  switch (tier) {
    case "featured":
      return { label: "Featured Partner", className: "bg-coral-400 text-white" };
    case "premium":
      return { label: "Premium Member", className: "bg-coral-100 text-coral-700" };
    case "enhanced":
      return { label: "Enhanced Listing", className: "bg-teal-100 text-teal-700" };
    case "bundle_all":
      return { label: "All-Access Member", className: "bg-coral-400 text-white" };
    default:
      return { label: "Community Member", className: "bg-teal-50 text-teal-600" };
  }
}

function getTrustBadge(score: number | null): { className: string } {
  if (!score) return { className: "bg-teal-100 text-teal-700" };
  if (score >= 80) return { className: "bg-coral-400 text-white" };
  return { className: "bg-teal-100 text-teal-700" };
}

export default function CompanyHero({
  company,
  isClaimed,
}: {
  company: Company;
  isClaimed: boolean;
}) {
  const tier = getTierLabel(company.tier);
  const trustBadge = getTrustBadge(company.trust_score);

  return (
    <section className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-2xl px-6 py-10 sm:px-10 sm:py-12">
      <div className="flex flex-col gap-4">
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tier.className}`}
          >
            {tier.label}
          </span>

          {company.trust_score !== null && (
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${trustBadge.className}`}
            >
              Trust Score: {company.trust_score}/100
            </span>
          )}
        </div>

        {/* Company name */}
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-white leading-tight">
          {company.name}
        </h1>

        {/* Community tagline */}
        <p className="text-teal-100 text-sm font-body">
          Part of the Aviation Detailing Hub community
        </p>

        {/* Claimed status / CTA */}
        {isClaimed ? (
          <span className="inline-flex items-center gap-1.5 text-white/90 text-sm font-body">
            <svg
              className="w-5 h-5 text-coral-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.403 12.652a3 3 0 010-5.304 3 3 0 00-2.108-2.108 3 3 0 01-5.304 0 3 3 0 00-2.108 2.108 3 3 0 010 5.304 3 3 0 002.108 2.108 3 3 0 015.304 0 3 3 0 002.108-2.108zM13.28 8.72a.75.75 0 00-1.06-1.06L9 10.878 7.78 9.66a.75.75 0 00-1.06 1.06l1.75 1.75a.75.75 0 001.06 0l3.75-3.75z"
                clipRule="evenodd"
              />
            </svg>
            Claimed &amp; Verified
          </span>
        ) : (
          <Link
            href={`/claim/${company.slug}`}
            className="inline-flex items-center gap-2 bg-coral-400 hover:bg-coral-500 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors shadow-sm w-fit"
          >
            Join the Hub &mdash; Claim This Listing
          </Link>
        )}
      </div>
    </section>
  );
}
