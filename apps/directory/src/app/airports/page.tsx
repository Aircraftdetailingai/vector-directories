import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { getStateByCode } from "@/lib/us-states";
import { getAllAirports, toICAO } from "@/lib/city-airports";

/* ──────────────────────────────────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Browse by Airport | Aircraft Detailing Directory",
  description:
    "Find aircraft detailing services by airport. Browse all major US airports and discover trusted detailing companies near you.",
  openGraph: {
    title: "Browse by Airport | Aircraft Detailing Directory",
    description:
      "Find aircraft detailing services by airport. Browse all major US airports and discover trusted detailing companies near you.",
    type: "website",
  },
};

/* ──────────────────────────────────────────────────────────────────────────
   Page component
   ────────────────────────────────────────────────────────────────────────── */

export default function AirportsIndexPage() {
  const allAirports = getAllAirports();

  // Group airports by state (use first city's state code)
  const byState = new Map<string, { code: string; name: string; stateName: string }[]>();

  for (const airport of allAirports) {
    const stateCode = airport.cities[0]?.state;
    if (!stateCode) continue;

    const stateInfo = getStateByCode(stateCode);
    const stateName = stateInfo?.name ?? stateCode;

    const group = byState.get(stateName) ?? [];
    group.push({
      code: airport.code,
      name: airport.name,
      stateName,
    });
    byState.set(stateName, group);
  }

  // Sort states alphabetically
  const sortedStates = [...byState.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="border-b border-gray-100 bg-white"
        >
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <a
                  href="/"
                  className="text-gray-500 transition-colors hover:text-forest-700"
                >
                  Home
                </a>
              </li>
              <li aria-hidden="true" className="text-gray-300">
                /
              </li>
              <li>
                <span
                  className="font-medium text-forest-800"
                  aria-current="page"
                >
                  Airports
                </span>
              </li>
            </ol>
          </div>
        </nav>

        {/* Hero */}
        <section className="bg-forest-800 py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Browse by Airport
            </h1>
            <p className="mt-3 text-lg text-forest-200">
              {allAirports.length} airports across the United States
            </p>
          </div>
        </section>

        {/* Airport groups by state */}
        <section className="py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-10">
              {sortedStates.map(([stateName, airports]) => (
                <div key={stateName}>
                  <h2 className="font-heading text-xl font-bold text-forest-800">
                    {stateName}
                  </h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {airports
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((airport) => (
                        <Link
                          key={airport.code}
                          href={`/airports/${airport.code.toLowerCase()}`}
                          className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-forest-300 hover:shadow-lg hover:shadow-forest-100/50"
                        >
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-forest-100">
                            <svg
                              className="h-5 w-5 text-forest-700"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.5}
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                              />
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-heading text-sm font-bold text-forest-800 group-hover:text-forest-600">
                                {airport.code}
                              </span>
                              <span className="text-xs text-gray-400">
                                {toICAO(airport.code)}
                              </span>
                            </div>
                            <p className="truncate text-sm text-gray-500">
                              {airport.name}
                            </p>
                          </div>
                          <svg
                            className="h-4 w-4 flex-shrink-0 text-gray-300 transition-colors group-hover:text-forest-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      ))}
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
