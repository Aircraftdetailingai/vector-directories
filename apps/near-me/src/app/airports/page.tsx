import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/header";
import Footer from "../components/footer";
import { getAllAirports } from "@/lib/city-airports";
import { getStateByCode } from "@/lib/us-states";
import { AirportSearch } from "./airport-search";

export const metadata: Metadata = {
  title: "Browse by Airport | Aircraft Detailing Near Me",
  description:
    "Find aircraft detailing services near any airport in the United States. Browse our directory by airport to find nearby detailers.",
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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-sky-600 text-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <h1 className="font-heading text-3xl font-bold sm:text-4xl">
              Browse by Airport
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-sky-100">
              Find aircraft detailing services near any US airport. Select an
              airport to see local detailers.
            </p>
          </div>
        </section>

        {/* Search + Grid */}
        <section className="bg-gray-50 py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AirportSearch />

            <div className="mt-10 space-y-12">
              {sortedStates.map((stateName) => (
                <div key={stateName}>
                  <h2 className="font-heading text-xl font-semibold text-gray-900">
                    {stateName}
                  </h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {grouped[stateName].map((airport) => {
                      const primaryCity = airport.cities[0];
                      return (
                        <Link
                          key={airport.code}
                          href={`/airports/${airport.code}`}
                          data-airport-card
                          className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-sky-300 hover:shadow-md"
                        >
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-heading text-base font-semibold text-gray-900 group-hover:text-sky-600">
                                {airport.name}
                              </h3>
                              {primaryCity && (
                                <p className="mt-1 text-sm text-gray-500">
                                  {primaryCity.city}, {primaryCity.state}
                                </p>
                              )}
                            </div>
                            <span className="ml-3 inline-flex shrink-0 items-center rounded-md bg-sky-50 px-2.5 py-1 text-sm font-semibold text-sky-700">
                              {airport.code}
                            </span>
                          </div>
                        </Link>
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
