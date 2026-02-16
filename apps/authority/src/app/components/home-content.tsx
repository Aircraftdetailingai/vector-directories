"use client";

import Link from "next/link";
import type { Company } from "@vector/types";
import AuthorityBadge from "@/components/authority-badge";
import {
  getAuthorityLabel,
  getAuthorityTier,
  getAuthorityBreakdown,
} from "@/lib/authority-score";
import { REGIONS } from "@/lib/regions";

interface HomeContentProps {
  companies: Company[];
}

/* ═══════════════════════════════════════════════════════════════════════════
   A. Hero Section
   ═══════════════════════════════════════════════════════════════════════════ */

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-navy-900">
      {/* Subtle background pattern — diagonal crosshatch via CSS */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 20px, #D4A843 20px, #D4A843 21px), repeating-linear-gradient(-45deg, transparent, transparent 20px, #D4A843 20px, #D4A843 21px)",
        }}
      />
      {/* Gold gradient overlay at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gold-500/5 to-transparent" />

      <div className="relative mx-auto max-w-4xl px-4 py-20 sm:py-28 lg:py-32 text-center">
        {/* Decorative gold rule */}
        <div className="mx-auto mb-6 w-16 h-0.5 bg-gold-500" />

        <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
          The Definitive Authority
          <br />
          <span className="text-gold-400">on Aircraft Detailing</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-navy-200 max-w-2xl mx-auto leading-relaxed font-body">
          Expert rankings, in-depth analysis, and industry insights for
          aviation&rsquo;s most discerning professionals.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="#rankings"
            className="inline-flex items-center rounded px-7 py-3 text-sm font-semibold bg-gold-500 hover:bg-gold-600 text-navy-900 transition-colors shadow-lg shadow-gold-500/20"
          >
            View Rankings
          </Link>
          <Link
            href="/claim"
            className="inline-flex items-center rounded px-7 py-3 text-sm font-semibold border-2 border-navy-400 text-navy-100 hover:border-gold-400 hover:text-gold-400 transition-colors"
          >
            Submit Your Business
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   B. Authority Score Leaderboard
   ═══════════════════════════════════════════════════════════════════════════ */

function LeaderboardSection({ companies }: { companies: Company[] }) {
  const ranked = [...companies]
    .sort((a, b) => (b.trust_score ?? 0) - (a.trust_score ?? 0))
    .slice(0, 10);

  return (
    <section id="rankings" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-navy-900">
            Top-Ranked Aircraft Detailers
          </h2>
          <div className="mx-auto mt-3 w-24 h-0.5 bg-gold-500" />
          <p className="mt-4 text-navy-600 max-w-xl mx-auto">
            Our Authority Score combines service quality, certifications,
            customer reviews, and industry experience into a single,
            comprehensive rating.
          </p>
        </div>

        {/* Leaderboard cards */}
        <div className="space-y-4">
          {ranked.map((company, index) => {
            const rank = index + 1;
            const isTopThree = rank <= 3;
            const tier = getAuthorityTier(company.trust_score);
            const label = getAuthorityLabel(company.trust_score);

            return (
              <Link
                key={company.id}
                href={`/company/${company.slug}`}
                className={`group block rounded-lg border transition-all hover:shadow-md ${
                  isTopThree
                    ? "border-gold-300 bg-gradient-to-r from-gold-50/60 to-white shadow-sm"
                    : "border-gray-200 bg-white hover:border-navy-200"
                }`}
              >
                <div className="flex items-center gap-4 sm:gap-6 p-4 sm:p-5">
                  {/* Rank number */}
                  <div
                    className={`flex-shrink-0 w-10 sm:w-12 text-center font-heading font-bold text-2xl sm:text-3xl ${
                      isTopThree ? "text-gold-500" : "text-navy-300"
                    }`}
                  >
                    {rank}
                  </div>

                  {/* Company info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-lg sm:text-xl text-navy-900 group-hover:text-gold-700 transition-colors truncate">
                      {company.name}
                    </h3>
                    {company.description && (
                      <p className="mt-1 text-sm text-navy-500 line-clamp-2 leading-relaxed">
                        {company.description}
                      </p>
                    )}
                    {/* Tier label */}
                    <span
                      className={`mt-2 inline-block text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        tier === "elite"
                          ? "bg-gold-100 text-gold-700"
                          : tier === "expert"
                            ? "bg-navy-100 text-navy-700"
                            : tier === "professional"
                              ? "bg-navy-50 text-navy-500"
                              : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {label}
                    </span>
                  </div>

                  {/* Authority Score Badge */}
                  <div className="flex-shrink-0">
                    <AuthorityBadge
                      score={company.trust_score}
                      size={isTopThree ? "md" : "sm"}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   C. Featured Spotlight
   ═══════════════════════════════════════════════════════════════════════════ */

function SpotlightSection({ company }: { company: Company }) {
  const breakdown = getAuthorityBreakdown(company.trust_score);

  return (
    <section className="bg-navy-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-gold-300" />
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-navy-900 shrink-0">
            Detailer Spotlight
          </h2>
          <div className="h-px flex-1 bg-gold-300" />
        </div>

        <div className="rounded-xl bg-white border border-gold-200 shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-5 gap-0">
            {/* Left — Editorial Content (3 cols) */}
            <div className="lg:col-span-3 p-6 sm:p-8 lg:p-10">
              <span className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-2 block">
                No. 1 Ranked
              </span>
              <h3 className="font-heading font-bold text-2xl sm:text-3xl text-navy-900 leading-tight">
                {company.name}
              </h3>

              {company.description && (
                <blockquote className="mt-6 border-l-4 border-gold-500 pl-5 italic text-navy-700 font-heading text-lg leading-relaxed">
                  &ldquo;{company.description}&rdquo;
                </blockquote>
              )}

              <div className="mt-6 flex items-center gap-3">
                <AuthorityBadge score={company.trust_score} size="sm" />
                <div>
                  <p className="text-sm font-semibold text-navy-800">
                    Authority Score: {company.trust_score ?? "--"}
                  </p>
                  <p className="text-xs text-navy-500">
                    {breakdown.label} &middot; Top percentile nationwide
                  </p>
                </div>
              </div>

              <Link
                href={`/company/${company.slug}`}
                className="mt-8 inline-flex items-center text-sm font-semibold text-gold-700 hover:text-gold-600 transition-colors group"
              >
                Read Full Profile
                <span className="ml-1 transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </Link>
            </div>

            {/* Right — Score Breakdown (2 cols) */}
            <div className="lg:col-span-2 bg-navy-900 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
              <h4 className="font-heading font-semibold text-gold-400 text-sm uppercase tracking-wider mb-6">
                Authority Score Breakdown
              </h4>
              <div className="space-y-4">
                {breakdown.factors.map((factor) => {
                  const percent = Math.round(
                    (factor.score / factor.maxScore) * 100,
                  );
                  return (
                    <div key={factor.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-navy-200 font-medium">
                          {factor.name}
                        </span>
                        <span className="text-xs font-semibold text-gold-400">
                          {factor.score}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-navy-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gold-500 transition-all duration-700"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   D. Industry Insights
   ═══════════════════════════════════════════════════════════════════════════ */

const INSIGHTS = [
  {
    title: "What Makes an Elite Aircraft Detailer?",
    excerpt:
      "Beyond surface-level shine, elite detailers combine FAA-compliant materials, meticulous paint correction techniques, and an obsessive attention to detail that separates the professionals from the amateurs.",
    href: "#",
  },
  {
    title: "The Authority Score Methodology",
    excerpt:
      "Our proprietary Authority Score evaluates six critical dimensions — from service quality and certifications to customer reviews and responsiveness — providing the industry's most comprehensive trust metric.",
    href: "#",
  },
  {
    title: "2025 Industry Trends in Aviation Detailing",
    excerpt:
      "Ceramic nano-coatings, eco-friendly waterless wash solutions, and AI-powered quality inspection are reshaping how the world's leading FBOs approach aircraft appearance management.",
    href: "#",
  },
];

function InsightsSection() {
  return (
    <section id="insights" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-navy-900">
            Industry Insights
          </h2>
          <div className="mx-auto mt-3 w-24 h-0.5 bg-gold-500" />
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {INSIGHTS.map((article) => (
            <article
              key={article.title}
              className="group flex flex-col border-t-4 border-gold-500 bg-white rounded-b-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-heading font-semibold text-lg text-navy-900 leading-snug group-hover:text-gold-700 transition-colors">
                  {article.title}
                </h3>
                <p className="mt-3 text-sm text-navy-500 leading-relaxed flex-1">
                  {article.excerpt}
                </p>
                <Link
                  href={article.href}
                  className="mt-5 inline-flex items-center text-sm font-semibold text-gold-700 hover:text-gold-600 transition-colors group/link"
                >
                  Read More
                  <span className="ml-1 transition-transform group-hover/link:translate-x-1">
                    &rarr;
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   E. Browse by Region
   ═══════════════════════════════════════════════════════════════════════════ */

function RegionsSection() {
  return (
    <section className="bg-navy-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-navy-900">
            Browse by Region
          </h2>
          <div className="mx-auto mt-3 w-24 h-0.5 bg-gold-500" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {REGIONS.map((region) => (
            <Link
              key={region.slug}
              href={`/regions/${region.slug}`}
              className="group rounded-lg bg-navy-900 hover:bg-navy-800 transition-colors p-6 shadow-sm"
            >
              <h3 className="font-heading font-semibold text-lg text-gold-400 group-hover:text-gold-300 transition-colors">
                {region.name}
              </h3>
              <p className="mt-2 text-xs text-navy-300 tracking-wide">
                {region.states.length} states &middot;{" "}
                {region.states.join(", ")}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main HomeContent Component
   ═══════════════════════════════════════════════════════════════════════════ */

export default function HomeContent({ companies }: HomeContentProps) {
  const topCompany = [...companies].sort(
    (a, b) => (b.trust_score ?? 0) - (a.trust_score ?? 0),
  )[0];

  return (
    <>
      <HeroSection />
      <LeaderboardSection companies={companies} />
      {topCompany && <SpotlightSection company={topCompany} />}
      <InsightsSection />
      <RegionsSection />
    </>
  );
}
