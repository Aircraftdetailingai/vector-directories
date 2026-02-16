import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/header";
import Footer from "../components/footer";
import { getAllAirports } from "@/lib/city-airports";
import { getStateByCode } from "@/lib/us-states";

export const metadata: Metadata = {
  title: "Find Detailers by Airport | Aircraft Detailer Near Me",
  description:
    "Browse aircraft detailing services by airport. Find and compare detailers near any US airport and request quotes instantly.",
};

export default function AirportsPage() {
  const airports = getAllAirports();

  // Group airports by their first city's state
  const grouped: Record<string, typeof airports> = {};
  for (const airport of airports) {
    const stateCode = airport.cities[0]?.state ?? "Other";
    const stateInfo = getStateByCode(stateCode);
    const stateName = stateInfo?.name ?? stateCode;
    if (!grouped[stateName]) {
      grouped[stateName] = [];
    }
    grouped[stateName].push(airport);
  }

  const sortedStates = Object.keys(grouped).sort();

  return (
    <div className="flex min-h-screen flex-col bg-cream-50">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-brand-500 px-6 py-10 text-white sm:px-10 sm:py-14">
            <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
              Find Detailers by Airport
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-white/80">
              Select an airport to find nearby aircraft detailing professionals.
              Compare services, trust scores, and request quotes all in one
              place.
            </p>
          </div>
        </section>

        {/* Airport Grid */}
        <section className="py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {sortedStates.map((stateName) => (
                <div key={stateName}>
                  <h2 className="font-heading text-xl font-semibold text-brown-500">
                    {stateName}
                  </h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {grouped[stateName].map((airport) => {
                      const cityLabels = airport.cities
                        .map((c) => `${c.city}, ${c.state}`)
                        .join(" / ");

                      return (
                        <div
                          key={airport.code}
                          className="group rounded-xl border border-brand-100 bg-white p-5 transition-all hover:border-brand-300 hover:shadow-md"
                        >
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                              <span className="font-heading text-2xl font-bold text-brand-500">
                                {airport.code}
                              </span>
                              <h3 className="mt-1 font-heading text-base font-semibold text-brown-500 group-hover:text-brand-500">
                                {airport.name}
                              </h3>
                              <p className="mt-1 text-sm text-gray-500">
                                {cityLabels}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <Link
                              href={`/airports/${airport.code}`}
                              className="inline-flex items-center rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
                            >
                              Find &amp; Quote
                              <svg
                                className="ml-1.5 h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
