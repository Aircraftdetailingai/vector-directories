"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Company } from "@vector/types";
import { SERVICE_CATEGORIES } from "@/lib/categories";
import { US_STATES } from "@/lib/us-states";

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function getTrustLabel(score: number | null): { label: string; emoji: string; className: string } {
  if (score === null) return { label: "New", emoji: "\uD83C\uDD95", className: "bg-gray-100 text-gray-600" };
  if (score >= 90) return { label: "Community Favorite", emoji: "\uD83C\uDF1F", className: "bg-coral-100 text-coral-700" };
  if (score >= 80) return { label: "Highly Recommended", emoji: "\uD83D\uDC4F", className: "bg-teal-100 text-teal-700" };
  if (score >= 70) return { label: "Trusted Pro", emoji: "\uD83D\uDC4D", className: "bg-teal-50 text-teal-600" };
  if (score >= 60) return { label: "Growing", emoji: "\uD83C\uDF31", className: "bg-teal-50 text-teal-500" };
  return { label: "New to Hub", emoji: "\uD83C\uDD95", className: "bg-gray-100 text-gray-600" };
}

/* ── Props ────────────────────────────────────────────────────────────────── */

interface SearchShellProps {
  initialCompanies: Company[];
  initialQuery: string;
  initialCategory: string;
  initialState: string;
  initialSort: string;
  initialPage: number;
  total: number;
  totalPages: number;
}

/* ── Component ───────────────────────────────────────────────────────────── */

export default function SearchShell({
  initialCompanies,
  initialQuery,
  initialCategory,
  initialState,
  initialSort,
  initialPage,
  total,
  totalPages,
}: SearchShellProps) {
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [state, setState] = useState(initialState);
  const [sort, setSort] = useState(initialSort);

  const buildUrl = useCallback(
    (overrides: Record<string, string | number> = {}) => {
      const params = new URLSearchParams();
      const q = (overrides.q as string) ?? query;
      const cat = (overrides.category as string) ?? category;
      const st = (overrides.state as string) ?? state;
      const s = (overrides.sort as string) ?? sort;
      const p = (overrides.page as number) ?? 1;

      if (q) params.set("q", q);
      if (cat) params.set("category", cat);
      if (st) params.set("state", st);
      if (s && s !== "trust_score") params.set("sort", s);
      if (p > 1) params.set("page", String(p));

      const qs = params.toString();
      return qs ? `/search?${qs}` : "/search";
    },
    [query, category, state, sort],
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(buildUrl({ page: 1 }));
  }

  function handleFilterChange(key: string, value: string) {
    if (key === "category") setCategory(value);
    if (key === "state") setState(value);
    if (key === "sort") setSort(value);
    router.push(buildUrl({ [key]: value, page: 1 }));
  }

  return (
    <div>
      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search detailers by name, service, or keyword..."
            className="flex-1 rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-colors"
          />
          <button
            type="submit"
            className="bg-coral-400 hover:bg-coral-500 text-white text-sm font-semibold rounded-full px-6 py-3 transition-colors shadow-sm whitespace-nowrap"
          >
            Search
          </button>
        </div>
      </form>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        {/* Category filter */}
        <select
          value={category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="rounded-xl border border-teal-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-colors"
        >
          <option value="">All Categories</option>
          {SERVICE_CATEGORIES.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>

        {/* State filter */}
        <select
          value={state}
          onChange={(e) => handleFilterChange("state", e.target.value)}
          className="rounded-xl border border-teal-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-colors"
        >
          <option value="">All States</option>
          {US_STATES.map((st) => (
            <option key={st.code} value={st.code}>
              {st.name}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => handleFilterChange("sort", e.target.value)}
          className="rounded-xl border border-teal-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-colors"
        >
          <option value="trust_score">Community Rating</option>
          <option value="name">Name A-Z</option>
          <option value="created_at">Newest</option>
        </select>
      </div>

      {/* Results count */}
      <p className="text-gray-500 font-body text-sm mb-4">
        {total === 0
          ? "No results found"
          : `Showing ${initialCompanies.length} of ${total} detailer${total !== 1 ? "s" : ""}`}
      </p>

      {/* Results */}
      {initialCompanies.length === 0 ? (
        <div className="bg-white rounded-2xl border border-teal-100 p-12 text-center">
          <p className="text-4xl mb-3" aria-hidden="true">
            &#128269;
          </p>
          <h2 className="font-heading font-bold text-xl text-gray-700 mb-2">
            No detailers found
          </h2>
          <p className="text-gray-500 font-body text-sm max-w-md mx-auto">
            We couldn&apos;t find any matches for your search. Try broadening
            your filters or searching with different keywords.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {initialCompanies.map((company) => {
            const trust = getTrustLabel(company.trust_score);

            return (
              <Link
                key={company.id}
                href={`/company/${company.slug}`}
                className="block bg-white rounded-2xl border border-teal-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="space-y-2 flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-lg text-gray-800">
                      {company.name}
                    </h3>

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${trust.className}`}>
                        {trust.emoji} {trust.label}
                      </span>
                      {company.trust_score !== null && (
                        <span className="text-xs text-gray-400 font-body">
                          Score: {company.trust_score}/100
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {company.description && (
                      <p className="text-gray-500 font-body text-sm line-clamp-2">
                        {company.description}
                      </p>
                    )}
                  </div>

                  {/* Arrow */}
                  <span className="text-teal-500 shrink-0 self-center">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
          {/* Previous */}
          {initialPage > 1 ? (
            <Link
              href={buildUrl({ page: initialPage - 1 })}
              className="inline-flex items-center rounded-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 transition-colors"
            >
              Previous
            </Link>
          ) : (
            <span className="inline-flex items-center rounded-full bg-gray-200 text-gray-400 text-sm font-medium px-4 py-2 cursor-not-allowed">
              Previous
            </span>
          )}

          {/* Page indicator */}
          <span className="text-sm text-gray-500 font-body px-3">
            Page {initialPage} of {totalPages}
          </span>

          {/* Next */}
          {initialPage < totalPages ? (
            <Link
              href={buildUrl({ page: initialPage + 1 })}
              className="inline-flex items-center rounded-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 transition-colors"
            >
              Next
            </Link>
          ) : (
            <span className="inline-flex items-center rounded-full bg-gray-200 text-gray-400 text-sm font-medium px-4 py-2 cursor-not-allowed">
              Next
            </span>
          )}
        </nav>
      )}
    </div>
  );
}
