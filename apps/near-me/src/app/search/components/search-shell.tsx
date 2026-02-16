"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Company } from "@vector/types";
import { formatTrustScore, getTrustScoreLabel } from "@vector/utils";

/* ──────────────────────────────────────────────────────────────────────────
   Constants
   ────────────────────────────────────────────────────────────────────────── */

const SERVICES = [
  "Exterior Wash",
  "Interior Detailing",
  "Paint Correction",
  "Ceramic Coating",
  "Brightwork",
  "Full Detail",
] as const;

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
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
  initialCity: string;
  initialService: string;
  initialSort: string;
}

/* ──────────────────────────────────────────────────────────────────────────
   Component
   ────────────────────────────────────────────────────────────────────────── */

export function SearchShell({
  companies,
  states,
  total,
  page,
  totalPages,
  initialQuery,
  initialState,
  initialCity,
  initialService,
  initialSort,
}: SearchShellProps) {
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const [stateFilter, setStateFilter] = useState(initialState);
  const [city, setCity] = useState(initialCity);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    () => new Set(initialService ? initialService.split(",") : []),
  );
  const [sort, setSort] = useState(initialSort);

  const buildUrl = useCallback(
    (overrides: Record<string, string | undefined> = {}) => {
      const params = new URLSearchParams();

      const q = overrides.q ?? query;
      const s = overrides.state ?? stateFilter;
      const c = overrides.city ?? city;
      const svc =
        overrides.service ??
        (selectedServices.size > 0
          ? Array.from(selectedServices).join(",")
          : "");
      const srt = overrides.sort ?? sort;
      const p = overrides.page ?? undefined;

      if (q) params.set("q", q);
      if (s) params.set("state", s);
      if (c) params.set("city", c);
      if (svc) params.set("service", svc);
      if (srt && srt !== "relevance") params.set("sort", srt);
      if (p && p !== "1") params.set("page", p);

      const qs = params.toString();
      return qs ? `/search?${qs}` : "/search";
    },
    [query, stateFilter, city, selectedServices, sort],
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(buildUrl({ page: "1" }));
  }

  function handleServiceToggle(service: string) {
    const next = new Set(selectedServices);
    if (next.has(service)) {
      next.delete(service);
    } else {
      next.add(service);
    }
    setSelectedServices(next);
    const svc = next.size > 0 ? Array.from(next).join(",") : "";
    router.push(buildUrl({ service: svc, page: "1" }));
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
            className="block w-full rounded-lg border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
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
            onChange={(e) => {
              setStateFilter(e.target.value);
              router.push(buildUrl({ state: e.target.value, page: "1" }));
            }}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="">All States</option>
            {states.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div className="w-48">
          <label
            htmlFor="city-filter"
            className="block text-xs font-medium text-gray-600"
          >
            City
          </label>
          <input
            id="city-filter"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onBlur={() => {
              if (city !== initialCity) {
                router.push(buildUrl({ page: "1" }));
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                router.push(buildUrl({ page: "1" }));
              }
            }}
            placeholder="Enter city..."
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
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
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Service checkboxes */}
      <div className="mt-5">
        <p className="text-xs font-medium text-gray-600">Services</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {SERVICES.map((service) => {
            const active = selectedServices.has(service);
            return (
              <button
                key={service}
                type="button"
                onClick={() => handleServiceToggle(service)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sky-500 text-white"
                    : "bg-white text-gray-600 border border-gray-300 hover:border-sky-300 hover:text-sky-600"
                }`}
              >
                {service}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      <div className="mt-8 mb-4">
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
            <Link
              key={company.id}
              href={`/company/${company.slug}`}
              className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-sky-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-heading text-base font-semibold text-gray-900 group-hover:text-sky-600">
                  {company.name}
                </h3>
                {company.trust_score !== null && (
                  <span className="ml-2 inline-flex shrink-0 items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    {formatTrustScore(company.trust_score)}
                  </span>
                )}
              </div>
              {company.trust_score !== null && (
                <p className="mt-0.5 text-xs text-emerald-600">
                  {getTrustScoreLabel(company.trust_score)}
                </p>
              )}
              {company.description && (
                <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                  {company.description}
                </p>
              )}
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  {company.tier === "premium" || company.tier === "featured"
                    ? company.tier.charAt(0).toUpperCase() +
                      company.tier.slice(1)
                    : "Listed"}
                </span>
                {company.is_claimed && (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
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
                    Claimed
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white px-8 py-16 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-300"
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
          <h3 className="mt-4 font-heading text-lg font-semibold text-gray-900">
            No results found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Try adjusting your search or filters to find what you&apos;re
            looking for.
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
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => handlePageChange(pageNum)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pageNum === page
                    ? "bg-sky-500 text-white"
                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
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
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}
