"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { US_STATES } from "@/lib/us-states";
import { COLLECTIONS } from "@/lib/collections";
import TrustScore from "@/components/trust-score";
import EditorsBadge from "@/components/editors-badge";

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
  initialState: string;
  initialCollection: string;
  initialSort: string;
}

/* ── Sort Options ──────────────────────────────────────────────────────── */

const SORT_OPTIONS = [
  { value: "trust_score", label: "Trust Score" },
  { value: "name", label: "Name" },
  { value: "newest", label: "Newest" },
];

/* ── Component ─────────────────────────────────────────────────────────── */

export default function SearchShell({
  companies,
  total,
  page,
  perPage,
  totalPages,
  initialQuery,
  initialState,
  initialCollection,
  initialSort,
}: SearchShellProps) {
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const [stateFilter, setStateFilter] = useState(initialState);
  const [collectionFilter, setCollectionFilter] = useState(initialCollection);
  const [sort, setSort] = useState(initialSort);

  /* ── Navigate on filter change ─────────────────────── */
  const buildUrl = useCallback(
    (overrides: Record<string, string>) => {
      const p: Record<string, string> = {
        q: query,
        state: stateFilter,
        collection: collectionFilter,
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
    [query, stateFilter, collectionFilter, sort],
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(buildUrl({}));
  }

  function handleStateChange(newState: string) {
    setStateFilter(newState);
    router.push(buildUrl({ state: newState }));
  }

  function handleCollectionChange(newCollection: string) {
    setCollectionFilter(newCollection);
    router.push(buildUrl({ collection: newCollection }));
  }

  function handleSortChange(newSort: string) {
    setSort(newSort);
    router.push(buildUrl({ sort: newSort }));
  }

  return (
    <div>
      {/* ── Search Hero ──────────────────────────────────── */}
      <section className="bg-noir-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-gold-500 text-xs uppercase tracking-[0.2em] font-body mb-4 text-center">
            Best Aircraft Detailer
          </p>
          <h1 className="font-heading text-3xl md:text-4xl text-ivory-50 font-light tracking-wide text-center mb-8">
            Search Our Directory
          </h1>
          <div className="mx-auto h-px w-16 bg-gold-500 mb-8" />

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="mx-auto max-w-2xl flex gap-3"
          >
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-noir-400"
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
                className="w-full border border-ivory-200 bg-white pl-10 pr-4 py-3 text-sm text-noir-900 placeholder:text-noir-400 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 rounded-sm font-body"
              />
            </div>
            <button
              type="submit"
              className="bg-gold-500 hover:bg-gold-600 text-noir-900 px-6 py-3 text-xs font-semibold tracking-widest uppercase transition-colors rounded-sm font-body"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ── Filters & Sort ─────────────────────────────── */}
      <section className="border-b border-ivory-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Filter dropdowns */}
            <div className="flex flex-wrap gap-3">
              {/* State */}
              <select
                value={stateFilter}
                onChange={(e) => handleStateChange(e.target.value)}
                className="border border-ivory-200 bg-white px-3 py-2 text-sm text-noir-700 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 rounded-sm font-body"
              >
                <option value="">All States</option>
                {US_STATES.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>

              {/* Collection */}
              <select
                value={collectionFilter}
                onChange={(e) => handleCollectionChange(e.target.value)}
                className="border border-ivory-200 bg-white px-3 py-2 text-sm text-noir-700 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 rounded-sm font-body"
              >
                <option value="">All Collections</option>
                {COLLECTIONS.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-noir-500 font-body uppercase tracking-widest">
                Sort:
              </span>
              <div className="flex border border-ivory-200 bg-white overflow-hidden rounded-sm">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSortChange(option.value)}
                    className={`px-3 py-1.5 text-xs font-medium tracking-wider uppercase transition-colors font-body ${
                      sort === option.value
                        ? "bg-noir-900 text-white"
                        : "text-noir-600 hover:bg-ivory-50"
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
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Results count */}
        <p className="text-sm text-noir-500 mb-8 font-body">
          {total === 0
            ? "No results found"
            : `Showing ${(page - 1) * perPage + 1}\u2013${Math.min(
                page * perPage,
                total,
              )} of ${total} companies`}
        </p>

        {companies.length === 0 ? (
          /* ── Empty State ───────────────────────────── */
          <div className="text-center py-20">
            <div className="mx-auto h-px w-16 bg-gold-500 mb-8" />
            <h2 className="font-heading text-2xl text-noir-900 font-light mb-3">
              No Companies Found
            </h2>
            <p className="text-noir-500 font-body max-w-md mx-auto">
              Try adjusting your search terms or filters to discover exceptional
              aircraft detailing professionals.
            </p>
          </div>
        ) : (
          /* ── Result Cards ──────────────────────────── */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <article
                key={company.id}
                className="luxury-card bg-white border border-ivory-200 rounded-sm p-6 flex flex-col"
              >
                {/* Editor's Choice Badge */}
                {company.tier === "featured" && (
                  <div className="mb-4">
                    <EditorsBadge size="sm" />
                  </div>
                )}

                {/* Company Name */}
                <h3 className="font-heading text-lg text-noir-900 font-medium mb-3">
                  {company.name}
                </h3>

                {/* Trust Score */}
                <div className="mb-4">
                  <TrustScore score={company.trust_score} size="sm" />
                </div>

                {/* Description */}
                {company.description && (
                  <p className="font-body text-sm text-noir-600 leading-relaxed mb-6 flex-1 line-clamp-2">
                    {company.description}
                  </p>
                )}

                {/* View Profile Link */}
                <Link
                  href={`/company/${company.slug}`}
                  className="mt-auto inline-flex items-center justify-center bg-noir-900 hover:bg-noir-800 text-white py-2.5 text-xs tracking-widest uppercase font-body transition-colors rounded-sm"
                >
                  View Profile
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* ── Pagination ─────────────────────────────── */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            {page > 1 ? (
              <Link
                href={buildUrl({ page: String(page - 1) })}
                className="inline-flex items-center gap-1.5 border border-ivory-200 bg-white px-4 py-2 text-sm font-medium text-noir-700 hover:bg-ivory-50 transition-colors rounded-sm font-body"
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
              <span className="inline-flex items-center gap-1.5 border border-ivory-100 bg-ivory-50 px-4 py-2 text-sm font-medium text-noir-300 cursor-not-allowed rounded-sm font-body">
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

            <span className="text-sm text-noir-500 font-body">
              Page {page} of {totalPages}
            </span>

            {page < totalPages ? (
              <Link
                href={buildUrl({ page: String(page + 1) })}
                className="inline-flex items-center gap-1.5 border border-ivory-200 bg-white px-4 py-2 text-sm font-medium text-noir-700 hover:bg-ivory-50 transition-colors rounded-sm font-body"
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
              <span className="inline-flex items-center gap-1.5 border border-ivory-100 bg-ivory-50 px-4 py-2 text-sm font-medium text-noir-300 cursor-not-allowed rounded-sm font-body">
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
