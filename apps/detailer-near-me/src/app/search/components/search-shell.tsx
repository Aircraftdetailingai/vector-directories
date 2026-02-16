"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Company } from "@vector/types";
import { DETAIL_SERVICES } from "@/lib/services";
import TrustBar from "@/components/trust-bar";

/* ──────────────────────────────────────────────────────────────────────────
   Constants
   ────────────────────────────────────────────────────────────────────────── */

const SORT_OPTIONS = [
  { value: "trust_score", label: "Trust Score" },
  { value: "name", label: "Name A-Z" },
  { value: "created_at", label: "Newest" },
] as const;

/* ──────────────────────────────────────────────────────────────────────────
   Props
   ────────────────────────────────────────────────────────────────────────── */

interface SearchShellProps {
  companies: Company[];
  states: { code: string; name: string }[];
  total: number;
  page: number;
  totalPages: number;
  initialQuery: string;
  initialState: string;
  initialService: string;
  initialSort: string;
}

/* ──────────────────────────────────────────────────────────────────────────
   Component
   ────────────────────────────────────────────────────────────────────────── */

export default function SearchShell({
  companies,
  states,
  total,
  page,
  totalPages,
  initialQuery,
  initialState,
  initialService,
  initialSort,
}: SearchShellProps) {
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const [stateFilter, setStateFilter] = useState(initialState);
  const [serviceFilter, setServiceFilter] = useState(initialService);
  const [sort, setSort] = useState(initialSort);

  const buildUrl = useCallback(
    (overrides: Record<string, string | undefined> = {}) => {
      const params = new URLSearchParams();

      const q = overrides.q ?? query;
      const s = overrides.state ?? stateFilter;
      const svc = overrides.service ?? serviceFilter;
      const srt = overrides.sort ?? sort;
      const p = overrides.page ?? undefined;

      if (q) params.set("q", q);
      if (s) params.set("state", s);
      if (svc) params.set("service", svc);
      if (srt && srt !== "trust_score") params.set("sort", srt);
      if (p && p !== "1") params.set("page", p);

      const qs = params.toString();
      return qs ? `/search?${qs}` : "/search";
    },
    [query, stateFilter, serviceFilter, sort],
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(buildUrl({ page: "1" }));
  }

  function handleStateChange(newState: string) {
    setStateFilter(newState);
    router.push(buildUrl({ state: newState, page: "1" }));
  }

  function handleServiceChange(newService: string) {
    setServiceFilter(newService);
    router.push(buildUrl({ service: newService, page: "1" }));
  }

  function handleSortChange(newSort: string) {
    setSort(newSort);
    router.push(buildUrl({ sort: newSort, page: "1" }));
  }

  function handlePageChange(newPage: number) {
    router.push(buildUrl({ page: String(newPage) }));
  }

  return (
    <div>
      {/* Search bar */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <svg
              className="h-5 w-5 text-gray-400"
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
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by company name or keyword..."
            className="block w-full rounded-xl border border-brand-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          Search
        </button>
      </form>

      {/* Filters row */}
      <div className="mt-6 flex flex-wrap items-end gap-4">
        {/* State */}
        <div className="w-48">
          <label
            htmlFor="state-filter"
            className="block text-xs font-medium text-gray-600"
          >
            State
          </label>
          <select
            id="state-filter"
            value={stateFilter}
            onChange={(e) => handleStateChange(e.target.value)}
            className="mt-1 block w-full rounded-xl border border-brand-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="">All States</option>
            {states.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Service type */}
        <div className="w-56">
          <label
            htmlFor="service-filter"
            className="block text-xs font-medium text-gray-600"
          >
            Service Type
          </label>
          <select
            id="service-filter"
            value={serviceFilter}
            onChange={(e) => handleServiceChange(e.target.value)}
            className="mt-1 block w-full rounded-xl border border-brand-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="">All Services</option>
            {DETAIL_SERVICES.map((svc) => (
              <option key={svc.id} value={svc.id}>
                {svc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="w-44">
          <label
            htmlFor="sort-filter"
            className="block text-xs font-medium text-gray-600"
          >
            Sort by
          </label>
          <select
            id="sort-filter"
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="mt-1 block w-full rounded-xl border border-brand-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 mt-8">
        <p className="text-sm text-gray-500">
          {total > 0
            ? `Showing ${companies.length} of ${total} result${total !== 1 ? "s" : ""}`
            : ""}
        </p>
      </div>

      {/* Results grid */}
      {companies.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {companies.map((company) => (
            <div
              key={company.id}
              className="quote-card group"
            >
              <div className="flex items-start justify-between">
                <Link
                  href={`/company/${company.slug}`}
                  className="min-w-0 flex-1"
                >
                  <h3 className="font-heading text-base font-semibold text-brown-500 group-hover:text-brand-500">
                    {company.name}
                  </h3>
                </Link>
                {company.is_claimed && (
                  <span className="ml-2 inline-flex shrink-0 items-center gap-1 text-xs text-brand-500">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verified
                  </span>
                )}
              </div>

              <div className="mt-2">
                <TrustBar score={company.trust_score} size="sm" />
              </div>

              {company.description && (
                <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                  {company.description}
                </p>
              )}

              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center rounded-xl bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600">
                  {company.tier === "premium" || company.tier === "featured"
                    ? company.tier.charAt(0).toUpperCase() +
                      company.tier.slice(1)
                    : "Listed"}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <Link
                  href={`/company/${company.slug}`}
                  className="text-sm font-medium text-brand-500 transition-colors hover:text-brand-600"
                >
                  View Profile
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center rounded-xl bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-600"
                >
                  Get Quote
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-brand-100 bg-white px-8 py-16 text-center">
          <svg
            className="mx-auto h-12 w-12 text-brand-200"
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
          <h3 className="mt-4 font-heading text-lg font-semibold text-brown-500">
            No results found
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Try adjusting your search or filters to find what you&apos;re
            looking for. Or use our{" "}
            <Link href="/" className="text-brand-500 underline">
              matchmaker wizard
            </Link>{" "}
            to get started.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="mt-8 flex items-center justify-center gap-2"
        >
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
            className="rounded-xl border border-brand-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => handlePageChange(pageNum)}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                  pageNum === page
                    ? "bg-brand-500 text-white"
                    : "border border-brand-200 bg-white text-gray-700 hover:bg-brand-50"
                }`}
              >
                {pageNum}
              </button>
            ),
          )}

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
            className="rounded-xl border border-brand-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}
