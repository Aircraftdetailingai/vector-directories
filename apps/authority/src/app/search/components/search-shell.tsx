"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuthorityLabel, getAuthorityTier } from "@/lib/authority-score";
import { REGIONS } from "@/lib/regions";
import { US_STATES } from "@/lib/us-states";

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

interface SearchShellProps {
  companies: Company[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  initialQuery: string;
  initialRegion: string;
  initialState: string;
  initialSort: string;
}

/* ── Sort Options ──────────────────────────────────────────────────────── */

const SORT_OPTIONS = [
  { value: "authority_score", label: "Authority Score" },
  { value: "name", label: "Name A-Z" },
  { value: "newest", label: "Newest" },
];

/* ── Mini Score Ring ───────────────────────────────────────────────────── */

function MiniScoreRing({ score }: { score: number | null }) {
  const s = score ?? 0;
  const tier = getAuthorityTier(score);
  const isTop = tier === "elite" || tier === "expert";

  const size = 48;
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const progress = (s / 100) * circumference;

  const strokeColor = isTop ? "#D4A843" : "#1E3A5F";
  const trackColor = isTop ? "rgba(212,168,67,0.2)" : "rgba(30,58,95,0.15)";

  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={3}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
        />
      </svg>
      <span
        className={`absolute text-xs font-bold font-heading ${
          isTop ? "text-gold-700" : "text-navy-700"
        }`}
      >
        {s}
      </span>
    </div>
  );
}

/* ── Component ─────────────────────────────────────────────────────────── */

export default function SearchShell({
  companies,
  total,
  page,
  perPage,
  totalPages,
  initialQuery,
  initialRegion,
  initialState,
  initialSort,
}: SearchShellProps) {
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const [region, setRegion] = useState(initialRegion);
  const [state, setState] = useState(initialState);
  const [sort, setSort] = useState(initialSort);

  /* ── Navigate on filter change ─────────────────────── */
  const buildUrl = useCallback(
    (overrides: Record<string, string>) => {
      const p: Record<string, string> = {
        q: query,
        region,
        state,
        sort,
        ...overrides,
      };

      // Reset page when filters change (unless page is explicitly set)
      if (!("page" in overrides)) {
        delete p.page;
      }

      const sp = new URLSearchParams();
      for (const [k, v] of Object.entries(p)) {
        if (v) sp.set(k, v);
      }

      return `/search${sp.toString() ? `?${sp.toString()}` : ""}`;
    },
    [query, region, state, sort],
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(buildUrl({}));
  }

  function handleRegionChange(newRegion: string) {
    setRegion(newRegion);
    // Clear state filter when region changes
    setState("");
    router.push(buildUrl({ region: newRegion, state: "" }));
  }

  function handleStateChange(newState: string) {
    setState(newState);
    router.push(buildUrl({ state: newState }));
  }

  function handleSortChange(newSort: string) {
    setSort(newSort);
    router.push(buildUrl({ sort: newSort }));
  }

  /* ── Get states for selected region ────────────────── */
  const selectedRegion = REGIONS.find((r) => r.slug === region);
  const availableStates = selectedRegion
    ? US_STATES.filter((s) => selectedRegion.states.includes(s.code))
    : US_STATES;

  return (
    <div>
      {/* ── Search Header ──────────────────────────────── */}
      <section className="bg-navy-900">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-navy-300 text-sm uppercase tracking-widest mb-2 font-body">
            Aircraft Detailing Authority
          </p>
          <h1 className="text-gold-400 font-heading text-3xl sm:text-4xl font-bold mb-6">
            Search Rankings
          </h1>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search companies..."
                className="w-full rounded-lg border border-navy-200 bg-white pl-10 pr-4 py-2.5 text-sm text-navy-900 placeholder:text-navy-400 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20 font-body"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-900 hover:bg-gold-600 transition-colors shadow-sm font-body"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ── Filters & Sort ─────────────────────────────── */}
      <section className="border-b border-navy-100 bg-navy-50/50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Filter dropdowns */}
            <div className="flex flex-wrap gap-3">
              {/* Region */}
              <select
                value={region}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-700 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20 font-body"
              >
                <option value="">All Regions</option>
                {REGIONS.map((r) => (
                  <option key={r.slug} value={r.slug}>
                    {r.name}
                  </option>
                ))}
              </select>

              {/* State */}
              <select
                value={state}
                onChange={(e) => handleStateChange(e.target.value)}
                className="rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-700 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20 font-body"
              >
                <option value="">All States</option>
                {availableStates.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-navy-400 font-body uppercase tracking-wider">
                Sort by:
              </span>
              <div className="flex rounded-lg border border-navy-200 bg-white overflow-hidden">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSortChange(option.value)}
                    className={`px-3 py-1.5 text-sm font-medium transition-colors font-body ${
                      sort === option.value
                        ? option.value === "authority_score"
                          ? "bg-gold-500 text-navy-900 shadow-sm"
                          : "bg-navy-900 text-white"
                        : "text-navy-600 hover:bg-navy-50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Results ────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Results count */}
        <p className="text-sm text-navy-500 mb-6 font-body">
          {total === 0
            ? "No results found"
            : `Showing ${(page - 1) * perPage + 1}–${Math.min(
                page * perPage,
                total,
              )} of ${total} companies`}
        </p>

        {companies.length === 0 ? (
          /* ── Empty State ───────────────────────────── */
          <div className="text-center py-20">
            <svg
              className="mx-auto h-16 w-16 text-gold-400 mb-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <h2 className="font-heading text-xl font-bold text-navy-900 mb-2">
              No Companies Found
            </h2>
            <p className="text-navy-500 font-body max-w-md mx-auto">
              Try adjusting your search terms or filters to find aircraft
              detailing providers.
            </p>
          </div>
        ) : (
          /* ── Result Cards ──────────────────────────── */
          <div className="space-y-4">
            {companies.map((company) => {
              const label = getAuthorityLabel(company.trust_score);
              const tier = getAuthorityTier(company.trust_score);
              const isTop = tier === "elite" || tier === "expert";

              return (
                <Link
                  key={company.id}
                  href={`/company/${company.slug}`}
                  className="group block"
                >
                  <article className="flex items-center gap-5 rounded-xl border border-navy-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-navy-200 transition-all">
                    {/* Score ring */}
                    <MiniScoreRing score={company.trust_score} />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="font-heading text-lg font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                          {company.name}
                        </h3>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            isTop
                              ? "bg-gold-50 text-gold-700 border border-gold-200"
                              : "bg-navy-50 text-navy-600 border border-navy-200"
                          }`}
                        >
                          {label}
                        </span>
                      </div>
                      {company.description && (
                        <p className="mt-1 text-sm text-navy-500 font-body line-clamp-2">
                          {company.description}
                        </p>
                      )}
                    </div>

                    {/* Arrow */}
                    <svg
                      className="h-5 w-5 shrink-0 text-navy-300 group-hover:text-gold-500 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </article>
                </Link>
              );
            })}
          </div>
        )}

        {/* ── Pagination ─────────────────────────────── */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            {page > 1 ? (
              <Link
                href={buildUrl({ page: String(page - 1) })}
                className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-4 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50 transition-colors font-body"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
                Previous
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-navy-100 bg-navy-50 px-4 py-2 text-sm font-medium text-navy-300 cursor-not-allowed font-body">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
                Previous
              </span>
            )}

            <span className="text-sm text-navy-500 font-body">
              Page {page} of {totalPages}
            </span>

            {page < totalPages ? (
              <Link
                href={buildUrl({ page: String(page + 1) })}
                className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-4 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50 transition-colors font-body"
              >
                Next
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-navy-100 bg-navy-50 px-4 py-2 text-sm font-medium text-navy-300 cursor-not-allowed font-body">
                Next
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </span>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
