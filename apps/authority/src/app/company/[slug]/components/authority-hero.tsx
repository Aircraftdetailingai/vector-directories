import Link from "next/link";
import {
  getAuthorityLabel,
  getAuthorityTier,
} from "@/lib/authority-score";

/* ── Types ─────────────────────────────────────────────────────────────── */

interface Company {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  trust_score: number | null;
  tier: string;
  is_claimed: boolean;
  website: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  claimed_by: string | null;
  created_at: string;
  updated_at: string;
}

/* ── Tier Labels ───────────────────────────────────────────────────────── */

const TIER_CONFIG: Record<string, { label: string; classes: string }> = {
  bundle_all: {
    label: "Bundle All",
    classes: "bg-gold-500 text-navy-900 border-gold-600",
  },
  featured: {
    label: "Featured",
    classes: "bg-gold-100 text-gold-800 border-gold-300",
  },
  premium: {
    label: "Premium",
    classes: "bg-navy-100 text-navy-800 border-navy-300",
  },
  enhanced: {
    label: "Enhanced",
    classes: "bg-navy-50 text-navy-700 border-navy-200",
  },
  basic: {
    label: "Basic",
    classes: "bg-gray-100 text-gray-700 border-gray-300",
  },
};

/* ── Authority Score Ring SVG ──────────────────────────────────────────── */

function AuthorityScoreRing({
  score,
  size = 140,
}: {
  score: number | null;
  size?: number;
}) {
  const s = score ?? 0;
  const tier = getAuthorityTier(score);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (s / 100) * circumference;
  const isEliteOrExpert = tier === "elite" || tier === "expert";

  // Gold ring for elite/expert, navy for others
  const strokeColor = isEliteOrExpert ? "#D4A843" : "#1E3A5F";
  const trackColor = isEliteOrExpert ? "rgba(212,168,67,0.15)" : "rgba(30,58,95,0.15)";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={8}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`text-4xl font-bold font-heading ${
            isEliteOrExpert ? "text-gold-400" : "text-white"
          }`}
        >
          {s}
        </span>
        <span className="text-xs text-navy-300 uppercase tracking-wider mt-0.5">
          Score
        </span>
      </div>
    </div>
  );
}

/* ── Hero Component ────────────────────────────────────────────────────── */

export default function AuthorityHero({ company }: { company: Company }) {
  const tier = getAuthorityTier(company.trust_score);
  const label = getAuthorityLabel(company.trust_score);
  const tierConfig = TIER_CONFIG[company.tier] ?? TIER_CONFIG.basic;

  return (
    <section className="bg-navy-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-12">
          {/* ── Score Ring ──────────────────────────────────── */}
          <div className="shrink-0">
            <AuthorityScoreRing score={company.trust_score} size={160} />
          </div>

          {/* ── Company Info ────────────────────────────────── */}
          <div className="flex-1 text-center md:text-left">
            {/* Subtitle */}
            <p className="text-navy-300 text-sm uppercase tracking-widest mb-2 font-body">
              Independent Authority Assessment
            </p>

            {/* Company name */}
            <h1 className="text-gold-400 font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              {company.name}
            </h1>

            {/* Badges row */}
            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
              {/* Authority tier label */}
              <span
                className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold ${
                  tier === "elite" || tier === "expert"
                    ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                    : "bg-white/10 text-white border border-white/20"
                }`}
              >
                {label}
              </span>

              {/* Listing tier badge */}
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${tierConfig.classes}`}
              >
                {tierConfig.label}
              </span>

              {/* Claimed status */}
              {company.is_claimed ? (
                <span className="inline-flex items-center gap-1.5 text-sm text-gold-400">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Claimed
                </span>
              ) : (
                <Link
                  href={`/claim/${company.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-sm font-medium text-gold-400 hover:bg-gold-500/20 transition-colors"
                >
                  Unclaimed — Claim This Listing
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
