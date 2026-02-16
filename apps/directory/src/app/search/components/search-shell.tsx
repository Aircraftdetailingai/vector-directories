"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useRef } from "react";
import { PaginationBar } from "../../[state]/components/pagination-bar";

const SERVICE_CATEGORIES = [
  "Exterior Wash",
  "Interior Detailing",
  "Paint Correction",
  "Ceramic Coating",
  "Brightwork",
  "Full Detail",
];

const TIER_OPTIONS = [
  { value: "", label: "All Tiers" },
  { value: "bundle_all", label: "Bundle All" },
  { value: "featured", label: "Featured" },
  { value: "premium", label: "Premium" },
  { value: "enhanced", label: "Enhanced" },
  { value: "basic", label: "Basic" },
];

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "trust_score", label: "Trust Score" },
  { value: "name", label: "Name (A-Z)" },
  { value: "newest", label: "Newest First" },
];

interface SearchShellProps {
  states: { code: string; name: string }[];
  currentQuery: string;
  currentState: string;
  currentCity: string;
  currentService: string;
  currentTier: string;
  currentVerified: boolean;
  currentSort: string;
  currentPage: number;
  totalPages: number;
  totalCompanies: number;
  children: React.ReactNode;
}

export function SearchShell({
  states,
  currentQuery,
  currentState,
  currentCity,
  currentService,
  currentTier,
  currentVerified,
  currentSort,
  currentPage,
  totalPages,
  totalCompanies,
  children,
}: SearchShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = searchInputRef.current?.value.trim() ?? "";
      updateParams({ q, page: "" });
    },
    [updateParams],
  );

  const handleStateChange = useCallback(
    (state: string) => updateParams({ state, page: "" }),
    [updateParams],
  );

  const handleCityChange = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const input = form.elements.namedItem("city-input") as HTMLInputElement;
      updateParams({ city: input.value.trim(), page: "" });
    },
    [updateParams],
  );

  const handleServiceChange = useCallback(
    (service: string) => updateParams({ service, page: "" }),
    [updateParams],
  );

  const handleTierChange = useCallback(
    (tier: string) => updateParams({ tier, page: "" }),
    [updateParams],
  );

  const handleVerifiedChange = useCallback(
    (verified: boolean) =>
      updateParams({ verified: verified ? "1" : "", page: "" }),
    [updateParams],
  );

  const handleSortChange = useCallback(
    (sort: string) => updateParams({ sort, page: "" }),
    [updateParams],
  );

  const handlePageChange = useCallback(
    (page: number) => updateParams({ page: String(page) }),
    [updateParams],
  );

  const handleReset = useCallback(() => {
    router.push("/search", { scroll: false });
  }, [router]);

  const activeFilterCount =
    (currentState ? 1 : 0) +
    (currentCity ? 1 : 0) +
    (currentService ? 1 : 0) +
    (currentTier ? 1 : 0) +
    (currentVerified ? 1 : 0);

  const hasActiveFilters = currentQuery || activeFilterCount > 0;

  /* ── Filter sidebar content (shared between desktop/mobile) ── */

  const filterContent = (
    <div className="space-y-5">
      {/* State dropdown */}
      <fieldset>
        <legend className="text-sm font-medium text-gray-700">State</legend>
        <select
          value={currentState}
          onChange={(e) => handleStateChange(e.target.value)}
          aria-label="Filter by state"
          className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500"
        >
          <option value="">All States</option>
          {states.map((s) => (
            <option key={s.code} value={s.code}>
              {s.name}
            </option>
          ))}
        </select>
      </fieldset>

      {/* City input */}
      <fieldset>
        <legend className="text-sm font-medium text-gray-700">City</legend>
        <form onSubmit={handleCityChange} className="mt-2 flex gap-2">
          <input
            name="city-input"
            type="text"
            defaultValue={currentCity}
            placeholder="Enter city name"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500"
          />
          <button
            type="submit"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            Go
          </button>
        </form>
      </fieldset>

      {/* Service type */}
      <fieldset>
        <legend className="text-sm font-medium text-gray-700">
          Service Type
        </legend>
        <div className="mt-2 space-y-2">
          {SERVICE_CATEGORIES.map((cat) => (
            <label
              key={cat}
              className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={currentService === cat}
                onChange={() =>
                  handleServiceChange(currentService === cat ? "" : cat)
                }
                className="h-4 w-4 rounded border-gray-300 text-forest-700 focus:ring-forest-500"
              />
              {cat}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Tier dropdown */}
      <fieldset>
        <legend className="text-sm font-medium text-gray-700">
          Badge Tier
        </legend>
        <select
          value={currentTier}
          onChange={(e) => handleTierChange(e.target.value)}
          aria-label="Filter by tier"
          className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500"
        >
          {TIER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </fieldset>

      {/* Verified-only toggle */}
      <fieldset>
        <label className="flex cursor-pointer items-center gap-3 rounded-md px-1 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-50">
          <div className="relative">
            <input
              type="checkbox"
              checked={currentVerified}
              onChange={(e) => handleVerifiedChange(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`h-6 w-11 rounded-full transition-colors ${
                currentVerified ? "bg-forest-600" : "bg-gray-200"
              }`}
            />
            <div
              className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                currentVerified ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
          <span className="font-medium">Verified Only</span>
        </label>
      </fieldset>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={handleReset}
          className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          Reset All
        </button>
      )}
    </div>
  );

  return (
    <div>
      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
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
              ref={searchInputRef}
              type="text"
              name="q"
              defaultValue={currentQuery}
              placeholder="Search by company name, description..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-forest-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-700"
          >
            Search
          </button>
        </div>
      </form>

      {/* Two-column layout */}
      <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-forest-800">
              Filters
            </h3>
            <div className="mt-5">{filterContent}</div>
          </div>
        </aside>

        {/* Mobile filter toggle + panel */}
        <div className="mb-6 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            aria-expanded={mobileFiltersOpen}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-forest-800 text-xs text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
          {mobileFiltersOpen && (
            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5">
              {filterContent}
            </div>
          )}
        </div>

        {/* Main content */}
        <div>
          {/* Sort bar + result count + active filters */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">
                {totalCompanies}{" "}
                {totalCompanies === 1 ? "company" : "companies"} found
              </span>
              {currentQuery && (
                <button
                  type="button"
                  onClick={() => {
                    if (searchInputRef.current)
                      searchInputRef.current.value = "";
                    updateParams({ q: "", page: "" });
                  }}
                  className="inline-flex items-center gap-1 rounded-full bg-forest-100 px-3 py-1 text-xs font-medium text-forest-800 transition-colors hover:bg-forest-200"
                >
                  &ldquo;{currentQuery}&rdquo;
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
              {currentState && (
                <button
                  type="button"
                  onClick={() => handleStateChange("")}
                  className="inline-flex items-center gap-1 rounded-full bg-forest-100 px-3 py-1 text-xs font-medium text-forest-800 transition-colors hover:bg-forest-200"
                >
                  {states.find((s) => s.code === currentState)?.name ??
                    currentState}
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
              {currentCity && (
                <button
                  type="button"
                  onClick={() => updateParams({ city: "", page: "" })}
                  className="inline-flex items-center gap-1 rounded-full bg-forest-100 px-3 py-1 text-xs font-medium text-forest-800 transition-colors hover:bg-forest-200"
                >
                  {currentCity}
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
              {currentService && (
                <button
                  type="button"
                  onClick={() => handleServiceChange("")}
                  className="inline-flex items-center gap-1 rounded-full bg-forest-100 px-3 py-1 text-xs font-medium text-forest-800 transition-colors hover:bg-forest-200"
                >
                  {currentService}
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
              {currentTier && (
                <button
                  type="button"
                  onClick={() => handleTierChange("")}
                  className="inline-flex items-center gap-1 rounded-full bg-forest-100 px-3 py-1 text-xs font-medium text-forest-800 transition-colors hover:bg-forest-200"
                >
                  {currentTier}
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
              {currentVerified && (
                <button
                  type="button"
                  onClick={() => handleVerifiedChange(false)}
                  className="inline-flex items-center gap-1 rounded-full bg-forest-100 px-3 py-1 text-xs font-medium text-forest-800 transition-colors hover:bg-forest-200"
                >
                  Verified
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <label htmlFor="search-sort" className="text-sm text-gray-500">
                Sort by:
              </label>
              <select
                id="search-sort"
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results grid */}
          {totalCompanies > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">{children}</div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="mt-4 text-gray-500">
                No companies found matching your criteria.
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-4 text-sm font-semibold text-forest-700 transition-colors hover:text-forest-600"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          <PaginationBar
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
