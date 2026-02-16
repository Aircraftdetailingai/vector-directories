"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { FilterSidebar } from "./filter-sidebar";
import { SortSelect } from "./sort-select";
import { PaginationBar } from "./pagination-bar";

interface StateListingShellProps {
  stateSlug: string;
  cities: string[];
  categories: string[];
  currentCity: string;
  currentService: string;
  currentSort: string;
  currentPage: number;
  totalPages: number;
  totalCompanies: number;
  children: React.ReactNode;
}

export function StateListingShell({
  stateSlug,
  cities,
  categories,
  currentCity,
  currentService,
  currentSort,
  currentPage,
  totalPages,
  totalCompanies,
  children,
}: StateListingShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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

  const handleCityChange = useCallback(
    (city: string) => updateParams({ city, page: "" }),
    [updateParams],
  );

  const handleServiceChange = useCallback(
    (service: string) => updateParams({ service, page: "" }),
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
    router.push(`/${stateSlug}`, { scroll: false });
  }, [router, stateSlug]);

  const hasActiveFilters = currentCity || currentService;

  return (
    <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-20">
          <FilterSidebar
            cities={cities}
            categories={categories}
            currentCity={currentCity}
            currentService={currentService}
            onCityChange={handleCityChange}
            onServiceChange={handleServiceChange}
            onReset={handleReset}
          />
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
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-forest-800 text-xs text-white">
              {(currentCity ? 1 : 0) + (currentService ? 1 : 0)}
            </span>
          )}
        </button>
        {mobileFiltersOpen && (
          <div className="mt-4">
            <FilterSidebar
              cities={cities}
              categories={categories}
              currentCity={currentCity}
              currentService={currentService}
              onCityChange={handleCityChange}
              onServiceChange={handleServiceChange}
              onReset={handleReset}
            />
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
            {currentCity && (
              <button
                type="button"
                onClick={() => handleCityChange("")}
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
          </div>
          <SortSelect
            currentSort={currentSort}
            onSortChange={handleSortChange}
          />
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
  );
}
