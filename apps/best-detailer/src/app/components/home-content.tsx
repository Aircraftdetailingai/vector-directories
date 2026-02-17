"use client";

import Link from "next/link";
import type { Company } from "@vector/types";
import { getTrustScoreLabel } from "@vector/utils";
import { COLLECTIONS } from "@/lib/collections";
import EditorsBadge from "@/components/editors-badge";
import TrustScore from "@/components/trust-score";

interface HomeContentProps {
  companies: Company[];
}

/* ═══════════════════════════════════════════════════════════════════════════
   A. Editor's Choice Section
   ═══════════════════════════════════════════════════════════════════════════ */

function EditorsChoiceSection({ companies }: { companies: Company[] }) {
  const editorsChoice = [...companies]
    .filter((c) => (c.trust_score ?? 0) >= 85)
    .sort((a, b) => (b.trust_score ?? 0) - (a.trust_score ?? 0))
    .slice(0, 3);

  if (editorsChoice.length === 0) return null;

  return (
    <section className="bg-ivory-50 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl sm:text-5xl text-noir-900 font-light">
            Editor&rsquo;s Choice
          </h2>
          <div className="gold-divider mx-auto mt-6" />
          <p className="mt-6 text-noir-500 font-body max-w-xl mx-auto leading-relaxed">
            Handpicked by our editorial team for exceptional quality,
            craftsmanship, and client satisfaction.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {editorsChoice.map((company) => (
            <Link
              key={company.id}
              href={`/company/${company.slug}`}
              className="luxury-card group flex flex-col p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <EditorsBadge size="sm" />
                <TrustScore score={company.trust_score} size="sm" />
              </div>

              <h3 className="font-heading text-xl text-noir-900 group-hover:text-gold-700 transition-colors">
                {company.name}
              </h3>

              {company.description && (
                <p className="mt-3 text-sm text-noir-500 leading-relaxed line-clamp-3 flex-1">
                  {company.description}
                </p>
              )}

              <div className="mt-6 pt-6 border-t border-ivory-200 flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-ivory-400 font-body">
                  {getTrustScoreLabel(company.trust_score)}
                </span>
                <span className="text-xs uppercase tracking-widest text-gold-500 font-body group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  View Profile &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   B. Curated Collections Section
   ═══════════════════════════════════════════════════════════════════════════ */

function CollectionsSection() {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl sm:text-5xl text-noir-900 font-light">
            Curated Collections
          </h2>
          <div className="gold-divider mx-auto mt-6" />
          <p className="mt-6 text-noir-500 font-body max-w-xl mx-auto leading-relaxed">
            Expertly curated lists of the finest aircraft detailers,
            organized by specialty and region.
          </p>
        </div>

        {/* Collection cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLLECTIONS.slice(0, 8).map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className="group border border-ivory-200 bg-white p-6 transition-all duration-300 hover:border-gold-300 hover:shadow-lg"
            >
              <h3 className="font-heading text-lg text-noir-900 group-hover:text-gold-700 transition-colors leading-snug">
                {collection.name}
              </h3>
              <p className="mt-3 text-sm text-noir-500 leading-relaxed line-clamp-3">
                {collection.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs uppercase tracking-widest text-gold-500 font-body group-hover:translate-x-1 transition-transform">
                Explore &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   C. Recently Added Section
   ═══════════════════════════════════════════════════════════════════════════ */

function RecentlyAddedSection({ companies }: { companies: Company[] }) {
  const recent = [...companies]
    .filter((c) => (c.trust_score ?? 0) < 85)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 6);

  if (recent.length === 0) return null;

  return (
    <section className="bg-ivory-50 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl sm:text-5xl text-noir-900 font-light">
            Recently Added
          </h2>
          <div className="gold-divider mx-auto mt-6" />
        </div>

        {/* Editorial list */}
        <div className="divide-y divide-ivory-200">
          {recent.map((company) => (
            <Link
              key={company.id}
              href={`/company/${company.slug}`}
              className="group flex items-center gap-6 py-6 transition-colors"
            >
              <div className="flex-shrink-0">
                <TrustScore score={company.trust_score} size="sm" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-lg text-noir-900 group-hover:text-gold-700 transition-colors truncate">
                  {company.name}
                </h3>
                {company.description && (
                  <p className="mt-1 text-sm text-noir-500 line-clamp-1 leading-relaxed">
                    {company.description}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0 hidden sm:block">
                <span className="text-xs uppercase tracking-widest text-ivory-400 font-body">
                  {getTrustScoreLabel(company.trust_score)}
                </span>
              </div>
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
  return (
    <>
      <EditorsChoiceSection companies={companies} />
      <CollectionsSection />
      <RecentlyAddedSection companies={companies} />
    </>
  );
}
