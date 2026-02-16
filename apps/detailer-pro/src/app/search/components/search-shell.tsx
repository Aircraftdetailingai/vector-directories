"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Company } from "@vector/types";
import ProBadge from "@/components/pro-badge";

/* ──────────────────────────────────────────────────────────────────────────
   Constants
   ────────────────────────────────────────────────────────────────────────── */

const SORT_OPTIONS = [
  { value: "trust_score", label: "Trust Score" },
  { value: "name", label: "Name A-Z" },
  { value: "created_at", label: "Newest" },
] as const;

const tierConfig: Record<string, { label: string; color: string }> = {
  featured: { label: "Featured", color: "bg-electric-500 text-white" },
  premium: {
    label: "Premium",
    color: "bg-electric-400/20 text-electric-400 border border-electric-400/30",
  },
  enhanced: {
    label: "Enhanced",
    color: "bg-slate-400/20 text-slate-400 border border-slate-400/30",
  },
  basic: {
    label: "Basic",
    color: "bg-slate-600/20 text-slate-500 border border-slate-600/30",
  },
  bundle_all: { label: "All Access", color: "bg-electric-500 text-white" },
};

/* ──────────────────────────────────────────────────────────────────────────
   Props
   ────────────────────────────────────────────────────────────────────────── */

interface SearchShellProps {
  companies: Company[];
  states: { code: string; name: string }[];
  specializations: { slug: string; name: string }[];
  total: number;
  page: number;
  totalPages: number;
  initialQuery: string;
  initialSpecialization: string;
  initialState: string;
  initialSort: string;
}

/* ──────────────────────────────────────────────────────────────────────────
   Component
   ────────────────────────────────────────────────────────────────────────── */

export default function SearchShell({
  companies,
  states,
  specializations,
  total,
  page,
  totalPages,
  initialQuery,
  initialSpecialization,
  initialState,
  initialSort,
}: SearchShellProps) {
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const [specialization, setSpecialization] = useState(initialSpecialization);
  const [stateFilter, setStateFilter] = useState(initialState);
  const [sort, setSort] = useState(initialSort);

  const buildUrl = useCallback(
    (overrides: Record<string, string | undefined> = {}) => {
      const params = new URLSearchParams();

      const q = overrides.q ?? query;
      const spec = overrides.specialization ?? specialization;
      const s = overrides.state ?? stateFilter;
      const srt = overrides.sort ?? sort;
      const p = overrides.page ?? undefined;

      if (q) params.set("q", q);
      if (spec) params.set("specialization", spec);
      if (s) params.set("state", s);
      if (srt && srt !== "trust_score") params.set("sort", srt);
      if (p && p !== "1") params.set("page", p);

      const qs = params.toString();
      return qs ? `/search?${qs}` : "/search";
    },
    [query, specialization, stateFilter, sort],
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(buildUrl({ page: "1" }));
  }

  function handleSortChange(newSort: string) {
    setSort(newSort);
    router.push(buildUrl({ sort: newSort, page: "1" }));
  }

  function handleSpecializationChange(newSpec: string) {
    setSpecialization(newSpec);
    router.push(buildUrl({ specialization: newSpec, page: "1" }));
  }

  function handleStateChange(newState: string) {
    setStateFilter(newState);
    router.push(buildUrl({ state: newState, page: "1" }));
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
              className="h-5 w-5 text-slate-500"
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
            className="block w-full rounded-lg border border-slate-700 bg-slate-800 py-3 pl-11 pr-4 text-sm text-white shadow-sm placeholder:text-slate-500 focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-electric-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-electric-600 focus:outline-none focus:ring-2 focus:ring-electric-500 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          Search
        </button>
      </form>

      {/* Filters row */}
      <div className="mt-6 flex flex-wrap items-end gap-4">
        {/* Specialization */}
        <div className="w-48">
          <label
            htmlFor="spec-filter"
            className="block text-xs font-medium text-slate-500"
          >
            Specialization
          </label>
          <select
            id="spec-filter"
            value={specialization}
            onChange={(e) => handleSpecializationChange(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-3 pr-8 text-sm text-white focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500"
          >
            <option value="">All Specializations</option>
            {specializations.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* State */}
        <div className="w-48">
          <label
            htmlFor="state-filter"
            className="block text-xs font-medium text-slate-500"
          >
            State
          </label>
          <select
            id="state-filter"
            value={stateFilter}
            onChange={(e) => handleStateChange(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-3 pr-8 text-sm text-white focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500"
          >
            <option value="">All States</option>
            {states.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="w-44">
          <label
            htmlFor="sort-filter"
            className="block text-xs font-medium text-slate-500"
          >
            Sort by
          </label>
          <select
            id="sort-filter"
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-3 pr-8 text-sm text-white focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500"
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
      <div className="mt-8 mb-4">
        <p className="text-sm text-slate-500">
          {total > 0
            ? `Showing ${companies.length} of ${total} result${total !== 1 ? "s" : ""}`
            : ""}
        </p>
      </div>

      {/* Results */}
      {companies.length > 0 ? (
        <div className="space-y-2">
          {companies.map((company) => {
            const tier = tierConfig[company.tier] ?? tierConfig.basic;
            return (
              <Link
                key={company.id}
                href={`/company/${company.slug}`}
                className="group flex items-center gap-4 bg-slate-800 rounded-lg border border-slate-700 px-4 py-4 transition-colors hover:border-electric-500/50"
              >
                <ProBadge score={company.trust_score} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-heading text-sm font-semibold text-white group-hover:text-electric-400 transition-colors">
                      {company.name}
                    </h3>
                    <span
                      className={`shrink-0 rounded-lg px-2 py-0.5 text-xs font-semibold ${tier.color}`}
                    >
                      {tier.label}
                    </span>
                  </div>
                  {company.description && (
                    <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                      {company.description}
                    </p>
                  )}
                </div>
                <span className="shrink-0 rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors group-hover:border-electric-500 group-hover:text-electric-400">
                  View Profile
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-700 bg-slate-800 px-8 py-16 text-center">
          <svg
            className="mx-auto h-12 w-12 text-slate-600"
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
          <h3 className="mt-4 font-heading text-lg font-semibold text-white">
            No results found
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            Try adjusting your search terms or filters to find professionals in
            the network.
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
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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
                    ? "bg-electric-500 text-white"
                    : "border border-slate-700 bg-slate-800 text-slate-400 hover:text-white"
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
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}
