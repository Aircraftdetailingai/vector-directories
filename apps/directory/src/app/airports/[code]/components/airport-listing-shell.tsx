"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { SortSelect } from "../../../[state]/components/sort-select";
import { PaginationBar } from "../../../[state]/components/pagination-bar";

interface AirportListingShellProps {
  currentSort: string;
  currentPage: number;
  totalPages: number;
  totalCompanies: number;
  children: React.ReactNode;
}

export function AirportListingShell({
  currentSort,
  currentPage,
  totalPages,
  totalCompanies,
  children,
}: AirportListingShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  const handleSortChange = useCallback(
    (sort: string) => updateParams({ sort, page: "" }),
    [updateParams],
  );

  const handlePageChange = useCallback(
    (page: number) => updateParams({ page: String(page) }),
    [updateParams],
  );

  return (
    <div>
      {/* Sort bar + result count */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm text-gray-500">
          {totalCompanies} {totalCompanies === 1 ? "company" : "companies"}{" "}
          found
        </span>
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
            No companies found near this airport yet.
          </p>
        </div>
      )}

      {/* Pagination */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
