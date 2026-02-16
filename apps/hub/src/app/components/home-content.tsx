"use client";

import Link from "next/link";
import type { Company } from "@vector/types";
import { SERVICE_CATEGORIES } from "@/lib/categories";
import TrustBadge from "@/components/trust-badge";

/* ──────────────────────────────────────────────────────────────────────────
   Props
   ────────────────────────────────────────────────────────────────────────── */

interface HomeContentProps {
  companies: Company[];
}

/* ──────────────────────────────────────────────────────────────────────────
   Community stories — static editorial data
   ────────────────────────────────────────────────────────────────────────── */

const COMMUNITY_STORIES = [
  {
    title: "Why Regular Detailing Matters",
    excerpt:
      "Keeping your aircraft clean is about more than looks. Regular detailing protects paint, prevents corrosion, and maintains your investment for years to come. Here are the top reasons to schedule routine care.",
    href: "/community/regular-detailing",
    tag: "Care Tips",
  },
  {
    title: "Spotlight: The Art of Ceramic Coating",
    excerpt:
      "Ceramic coating has transformed how we protect aircraft surfaces. Learn about the process, benefits, and what to look for when choosing a ceramic coating professional.",
    href: "/community/ceramic-coating-art",
    tag: "Techniques",
  },
  {
    title: "Community Picks: Best New Detailers of 2025",
    excerpt:
      "Our community has spoken! These up-and-coming detailers are making waves with outstanding service, innovative techniques, and genuine care for their clients.",
    href: "/community/best-new-detailers-2025",
    tag: "Community Picks",
  },
];

/* ──────────────────────────────────────────────────────────────────────────
   Tier label helper
   ────────────────────────────────────────────────────────────────────────── */

function tierLabel(tier: string): string {
  const labels: Record<string, string> = {
    basic: "Community",
    enhanced: "Pro",
    premium: "Premium",
    featured: "Featured",
    bundle_all: "All-Access",
  };
  return labels[tier] ?? tier;
}

/* ──────────────────────────────────────────────────────────────────────────
   Component
   ────────────────────────────────────────────────────────────────────────── */

export default function HomeContent({ companies }: HomeContentProps) {
  // Find the company with the highest trust score for the spotlight
  const spotlightCompany = companies.reduce<Company | null>((best, c) => {
    if (c.trust_score === null) return best;
    if (best === null || (best.trust_score ?? 0) < c.trust_score) return c;
    return best;
  }, null);

  return (
    <>
      {/* ─── A. Hero Section ──────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-teal-600 to-teal-500 overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 1px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.15) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-32 sm:pt-28 sm:pb-40 text-center">
          <h1 className="font-heading font-extrabold text-white text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Welcome to the Hub{" "}
            <span className="inline-block animate-bounce" aria-hidden="true">
              👋
            </span>
          </h1>
          <p className="text-teal-50 text-lg sm:text-xl max-w-2xl mx-auto mb-10 font-body leading-relaxed">
            The friendliest place to find aircraft detailing services. Browse by
            service, discover amazing detailers, and join our growing community.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-white text-teal-700 font-heading font-bold px-8 py-3.5 rounded-full hover:bg-cream-50 transition-colors shadow-lg text-base"
            >
              Browse Services
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/claim"
              className="inline-flex items-center gap-2 bg-coral-400 hover:bg-coral-500 text-white font-heading font-bold px-8 py-3.5 rounded-full transition-colors shadow-lg text-base"
            >
              Claim Your Listing
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Cream wave SVG at the bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto block"
            preserveAspectRatio="none"
          >
            <path
              d="M0 40C240 70 480 80 720 60C960 40 1200 10 1440 30V80H0V40Z"
              fill="#FFFBEB"
            />
          </svg>
        </div>
      </section>

      {/* ─── B. Service Category Cards ─────────────────────────────── */}
      <section className="bg-cream-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section heading */}
          <div className="text-center mb-14">
            <h2 className="font-heading font-extrabold text-teal-800 text-3xl sm:text-4xl mb-3">
              Browse by Service
            </h2>
            <div className="mx-auto w-16 h-1 rounded-full bg-teal-400 mb-4" />
            <p className="text-gray-500 font-body max-w-lg mx-auto">
              Find the right specialist for your aircraft. From ceramic coatings
              to full details, we have you covered.
            </p>
          </div>

          {/* Category grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICE_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/services/${cat.slug}`}
                className="group bg-white rounded-2xl border border-teal-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className="text-4xl mb-4" aria-hidden="true">
                  {cat.icon}
                </div>
                <h3 className="text-teal-700 font-heading font-bold text-lg mb-2">
                  {cat.name}
                </h3>
                <p className="text-gray-500 font-body text-sm leading-relaxed mb-4 line-clamp-2">
                  {cat.description}
                </p>
                <span className="text-coral-400 font-heading font-semibold text-sm group-hover:text-coral-500 transition-colors inline-flex items-center gap-1">
                  Explore
                  <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── C. Detailer of the Month Spotlight ────────────────────── */}
      {spotlightCompany && (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section heading */}
            <div className="text-center mb-14">
              <h2 className="font-heading font-extrabold text-teal-800 text-3xl sm:text-4xl mb-3">
                Detailer of the Month{" "}
                <span aria-hidden="true">⭐</span>
              </h2>
              <div className="mx-auto w-16 h-1 rounded-full bg-coral-400 mb-4" />
              <p className="text-gray-500 font-body max-w-lg mx-auto">
                Each month we celebrate a standout member of our community who
                goes above and beyond.
              </p>
            </div>

            {/* Spotlight card */}
            <div className="relative mx-auto max-w-3xl bg-white rounded-2xl border-l-4 border-teal-500 shadow-lg overflow-hidden">
              {/* Decorative dots */}
              <div className="absolute top-4 right-4 flex gap-1.5" aria-hidden="true">
                <span className="w-2 h-2 rounded-full bg-coral-200" />
                <span className="w-2.5 h-2.5 rounded-full bg-teal-200" />
                <span className="w-2 h-2 rounded-full bg-coral-300" />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-300" />
                <span className="w-2 h-2 rounded-full bg-coral-200" />
              </div>

              <div className="p-8 sm:p-10">
                <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                  {/* Avatar placeholder */}
                  <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-100 to-teal-50 flex items-center justify-center">
                    <span className="text-3xl" aria-hidden="true">
                      ✈️
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="font-heading font-extrabold text-teal-800 text-2xl">
                        {spotlightCompany.name}
                      </h3>
                      <TrustBadge
                        score={spotlightCompany.trust_score}
                        size="md"
                      />
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-heading font-bold bg-teal-100 text-teal-700">
                        {tierLabel(spotlightCompany.tier)}
                      </span>
                    </div>

                    <p className="text-gray-600 font-body leading-relaxed mb-5">
                      {spotlightCompany.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                      <Link
                        href={`/company/${spotlightCompany.slug}`}
                        className="inline-flex items-center gap-1.5 text-coral-400 hover:text-coral-500 font-heading font-semibold text-sm transition-colors"
                      >
                        Meet This Detailer
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </div>

                    <div className="mt-5 pt-5 border-t border-teal-100">
                      <p className="text-teal-600 font-heading font-semibold text-sm">
                        🎉 Congratulations on being our top-rated community
                        member this month!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── D. Community Stories ───────────────────────────────────── */}
      <section className="bg-cream-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section heading */}
          <div className="text-center mb-14">
            <h2 className="font-heading font-extrabold text-teal-800 text-3xl sm:text-4xl mb-3">
              From Our Community
            </h2>
            <div className="mx-auto w-16 h-1 rounded-full bg-teal-400 mb-4" />
            <p className="text-gray-500 font-body max-w-lg mx-auto">
              Tips, stories, and insights from the aviation detailing world.
            </p>
          </div>

          {/* Stories grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COMMUNITY_STORIES.map((story) => (
              <article
                key={story.title}
                className="bg-cream-50 border border-teal-100 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Coral top accent */}
                <div className="h-1.5 bg-coral-400" />

                <div className="p-6">
                  <span className="inline-block text-xs font-heading font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full mb-3">
                    {story.tag}
                  </span>
                  <h3 className="font-heading font-bold text-teal-800 text-lg mb-3 leading-snug">
                    {story.title}
                  </h3>
                  <p className="text-gray-500 font-body text-sm leading-relaxed mb-4 line-clamp-3">
                    {story.excerpt}
                  </p>
                  <Link
                    href={story.href}
                    className="inline-flex items-center gap-1 text-coral-400 hover:text-coral-500 font-heading font-semibold text-sm transition-colors"
                  >
                    Read More
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── E. Community CTA Banner ───────────────────────────────── */}
      <section className="bg-coral-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="font-heading font-extrabold text-white text-3xl sm:text-4xl mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-white/90 font-body text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Whether you&apos;re looking for a detailer or you are one, there&apos;s a
            place for you here.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 bg-white text-coral-500 font-heading font-bold px-8 py-3.5 rounded-full hover:bg-cream-50 transition-colors shadow-lg text-base"
            >
              Find a Detailer
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link
              href="/claim"
              className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-heading font-bold px-8 py-3.5 rounded-full transition-colors shadow-lg text-base"
            >
              List Your Business
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
