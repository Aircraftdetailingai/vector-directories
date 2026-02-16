import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/header";
import Footer from "../components/footer";
import { REGIONS } from "@/lib/regions";

/* ── Metadata ──────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Browse by Region | Aircraft Detailing Authority",
  description:
    "Explore top-rated aircraft detailing companies organized by U.S. region. Find elite providers in the Northeast, Southeast, Midwest, Southwest, Mountain West, and Pacific.",
};

/* ── Page ───────────────────────────────────────────────────────────────── */

export default function RegionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="bg-navy-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <p className="text-navy-300 text-sm uppercase tracking-widest mb-3 font-body">
            Aircraft Detailing Authority
          </p>
          <h1 className="text-gold-400 font-heading text-4xl sm:text-5xl font-bold mb-4">
            Browse by Region
          </h1>
          <p className="text-navy-200 text-lg max-w-2xl mx-auto font-body leading-relaxed">
            Discover the highest-rated aircraft detailing professionals across
            every corner of the United States, evaluated by our independent
            Authority Score methodology.
          </p>
        </div>
      </section>

      {/* ── Region Cards ─────────────────────────────────── */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {REGIONS.map((region) => (
              <Link
                key={region.slug}
                href={`/regions/${region.slug}`}
                className="group block"
              >
                <article className="h-full rounded-xl border border-navy-100 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* Gold top border */}
                  <div className="h-1 bg-gold-500" />

                  <div className="p-6">
                    {/* Region name */}
                    <h2 className="font-heading text-xl font-bold text-navy-900 mb-2 group-hover:text-gold-600 transition-colors">
                      {region.name}
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-navy-600 leading-relaxed mb-4 font-body">
                      {region.description}
                    </p>

                    {/* State pills */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {region.states.map((code) => (
                        <span
                          key={code}
                          className="inline-flex items-center rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-medium text-navy-600"
                        >
                          {code}
                        </span>
                      ))}
                    </div>

                    {/* State count + CTA */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-navy-400 font-body">
                        {region.states.length} states
                      </span>
                      <span className="text-sm font-medium text-gold-600 group-hover:text-gold-700 transition-colors font-body">
                        Explore Region &rarr;
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
