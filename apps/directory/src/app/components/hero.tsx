"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface HeroProps {
  totalCompanies: number;
  totalStates: number;
  totalAirports: number;
}

export function Hero({ totalCompanies, totalStates, totalAirports }: HeroProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const stats = [
    { label: "Detailing Companies", value: totalCompanies.toLocaleString() },
    { label: "States Covered", value: totalStates.toString() },
    { label: "Airport Service Areas", value: totalAirports.toLocaleString() },
  ];

  return (
    <section className="relative overflow-hidden bg-forest-800">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Find Trusted Aircraft
            <span className="block text-forest-100">Detailing Professionals</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-forest-200">
            The most comprehensive directory of aircraft detailing companies
            across the United States. Search by location, airport, or browse our
            verified listings.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="mx-auto mt-10 max-w-2xl">
            <div className="flex rounded-xl bg-white shadow-2xl shadow-forest-900/20">
              <div className="relative flex-1">
                <svg
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by company name, city, or airport code..."
                  className="w-full rounded-l-xl border-0 py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-forest-500"
                  aria-label="Search detailers"
                />
              </div>
              <button
                type="submit"
                className="rounded-r-xl bg-forest-800 px-6 font-heading text-sm font-semibold text-white transition-colors hover:bg-forest-700 sm:px-8"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-heading text-3xl font-bold text-white sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-forest-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
