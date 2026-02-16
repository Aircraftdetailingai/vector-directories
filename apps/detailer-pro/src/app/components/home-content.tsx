"use client";

import Link from "next/link";
import type { Company } from "@vector/types";
import { SPECIALIZATIONS } from "@/lib/specializations";
import ProBadge from "@/components/pro-badge";

interface HomeContentProps {
  companies: Company[];
}

function getTierLabel(tier: string): string {
  switch (tier) {
    case "featured":
      return "Featured";
    case "premium":
      return "Premium";
    case "enhanced":
      return "Enhanced";
    case "bundle_all":
      return "Bundle";
    default:
      return "Basic";
  }
}

function getTierClasses(tier: string): string {
  switch (tier) {
    case "featured":
      return "bg-electric-500/10 text-electric-400 border-electric-500/30";
    case "premium":
      return "bg-electric-500/10 text-electric-400 border-electric-500/30";
    case "enhanced":
      return "bg-slate-500/10 text-slate-300 border-slate-500/30";
    default:
      return "bg-slate-700/30 text-slate-500 border-slate-600/30";
  }
}

const stats = [
  { value: "2,400+", label: "Verified Pros" },
  { value: "150+", label: "Airports Served" },
  { value: "98%", label: "Client Satisfaction" },
];

export default function HomeContent({ companies }: HomeContentProps) {
  const specializations = SPECIALIZATIONS.slice(0, 8);

  return (
    <main className="min-h-screen bg-slate-950">
      {/* Section 1 — Hero */}
      <section
        className="relative overflow-hidden bg-slate-950 py-20 md:py-28"
        style={{
          backgroundImage:
            "linear-gradient(rgba(51,65,85,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(51,65,85,0.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white leading-tight">
            The Professional Network
            <br />
            <span className="text-electric-500">for Aircraft Detailing</span>
          </h1>
          <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
            Connect with verified pros. Showcase your portfolio. Grow your
            business.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/search"
              className="bg-electric-500 hover:bg-electric-600 text-white rounded-lg px-6 py-3 text-sm font-medium transition-colors"
            >
              Browse Network
            </Link>
            <Link
              href="/claim/example"
              className="border border-electric-500 text-electric-400 hover:bg-electric-500/10 rounded-lg px-6 py-3 text-sm font-medium transition-colors"
            >
              Join as Pro
            </Link>
          </div>

          {/* Stats Row */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="metric-value">{stat.value}</div>
                <div className="metric-label mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2 — Top Performers */}
      <section className="py-16 md:py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-8">
            Top Rated Professionals
          </h2>

          <div className="border border-slate-700 rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-900 text-xs font-medium uppercase tracking-wider text-slate-500 border-b border-slate-700">
              <div className="col-span-1">Rank</div>
              <div className="col-span-4">Company</div>
              <div className="col-span-3">Trust Score</div>
              <div className="col-span-2">Tier</div>
              <div className="col-span-2">Status</div>
            </div>

            {/* Rows */}
            {companies.map((company, index) => {
              const rank = index + 1;
              const isTopRank = rank === 1;
              const score = company.trust_score ?? 0;

              return (
                <Link
                  key={company.id}
                  href={`/company/${company.slug}`}
                  className={`
                    grid grid-cols-12 gap-4 px-6 py-4 items-center
                    bg-slate-800 hover:bg-slate-750 border-b border-slate-700
                    transition-colors cursor-pointer
                    ${isTopRank ? "glow-blue" : ""}
                  `}
                >
                  {/* Rank */}
                  <div className="col-span-2 md:col-span-1">
                    <span
                      className={`font-heading font-bold text-lg ${
                        isTopRank ? "text-electric-400" : "text-slate-500"
                      }`}
                    >
                      #{rank}
                    </span>
                  </div>

                  {/* Company Name + Description */}
                  <div className="col-span-10 md:col-span-4">
                    <div className="flex items-center gap-3">
                      <ProBadge score={company.trust_score} size="sm" />
                      <div className="min-w-0">
                        <p className="font-heading font-semibold text-white truncate">
                          {company.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate mt-0.5 hidden md:block">
                          {company.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Trust Score Bar */}
                  <div className="col-span-6 md:col-span-3 hidden md:block">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-700 rounded-sm overflow-hidden">
                        <div
                          className="h-full bg-electric-500 rounded-sm transition-all"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span className="text-sm font-heading font-semibold text-slate-300 w-8 text-right">
                        {score}
                      </span>
                    </div>
                  </div>

                  {/* Tier Badge */}
                  <div className="col-span-6 md:col-span-2 hidden md:block">
                    <span
                      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${getTierClasses(company.tier)}`}
                    >
                      {getTierLabel(company.tier)}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-6 md:col-span-2 hidden md:block">
                    {company.is_claimed ? (
                      <span className="badge-pro">Verified</span>
                    ) : (
                      <span className="text-xs text-slate-600">Unclaimed</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3 — Specializations Grid */}
      <section className="py-16 md:py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-8">
            Browse by Specialization
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {specializations.map((spec) => (
              <Link
                key={spec.slug}
                href={`/specializations/${spec.slug}`}
                className="card-pro p-5 group"
              >
                <span className="font-mono text-sm text-electric-500 font-semibold tracking-wide">
                  {spec.icon}
                </span>
                <h3 className="mt-2 font-heading font-semibold text-white text-base group-hover:text-electric-400 transition-colors">
                  {spec.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                  {spec.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — CTA Banner */}
      <section className="py-16 md:py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-electric-600 to-electric-500 rounded-lg px-8 py-12 md:py-16 text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">
              Ready to go pro?
            </h2>
            <p className="mt-3 text-electric-100 text-base md:text-lg max-w-xl mx-auto">
              Claim your listing and join the professional network
            </p>
            <Link
              href="/claim/example"
              className="mt-6 inline-block bg-white text-electric-600 hover:bg-slate-100 rounded-lg px-6 py-3 text-sm font-semibold transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
