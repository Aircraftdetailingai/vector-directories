"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { StoreProduct, StoreBrand, StoreCategory } from "@/lib/types";
import { ProductCard } from "../../components/product-card";

interface ShopShellProps {
  products: StoreProduct[];
  brands: StoreBrand[];
  categories: StoreCategory[];
  total: number;
  page: number;
  totalPages: number;
  currentBrand?: string;
  currentCategory?: string;
  currentMinPrice?: number;
  currentMaxPrice?: number;
  currentSort?: string;
  currentQuery?: string;
}

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name A-Z" },
];

export function ShopShell({
  products,
  brands,
  categories,
  total,
  page,
  totalPages,
  currentBrand,
  currentCategory,
  currentMinPrice,
  currentMaxPrice,
  currentSort = "featured",
  currentQuery,
}: ShopShellProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(currentQuery ?? "");
  const [minPriceInput, setMinPriceInput] = useState(
    currentMinPrice?.toString() ?? "",
  );
  const [maxPriceInput, setMaxPriceInput] = useState(
    currentMaxPrice?.toString() ?? "",
  );

  const updateFilters = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      // Reset to page 1 when filters change
      params.delete("page");

      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      router.push(`/shop?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q: searchInput || undefined });
  };

  const handleBrandToggle = (slug: string) => {
    updateFilters({
      brand: currentBrand === slug ? undefined : slug,
    });
  };

  const handleCategoryToggle = (slug: string) => {
    updateFilters({
      category: currentCategory === slug ? undefined : slug,
    });
  };

  const handlePriceApply = () => {
    updateFilters({
      minPrice: minPriceInput || undefined,
      maxPrice: maxPriceInput || undefined,
    });
  };

  const handleSortChange = (value: string) => {
    updateFilters({ sort: value === "featured" ? undefined : value });
  };

  const clearAllFilters = () => {
    setSearchInput("");
    setMinPriceInput("");
    setMaxPriceInput("");
    router.push("/shop");
  };

  const hasActiveFilters =
    currentBrand ||
    currentCategory ||
    currentMinPrice !== undefined ||
    currentMaxPrice !== undefined ||
    currentQuery;

  /* -----------------------------------------------------------------------
     Filter Sidebar Content (shared between desktop and mobile)
     ----------------------------------------------------------------------- */

  function FilterContent() {
    return (
      <div className="space-y-6">
        {/* Search */}
        <div>
          <h3 className="text-sm font-semibold text-navy-900">Search</h3>
          <form onSubmit={handleSearch} className="mt-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-navy-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
              <button
                type="submit"
                className="shrink-0 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* Brand */}
        <div>
          <h3 className="text-sm font-semibold text-navy-900">Brand</h3>
          <div className="mt-2 space-y-2">
            {brands.map((brand) => (
              <label
                key={brand.id}
                className="flex cursor-pointer items-center gap-2"
              >
                <input
                  type="checkbox"
                  checked={currentBrand === brand.slug}
                  onChange={() => handleBrandToggle(brand.slug)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                />
                <span className="text-sm text-gray-700">{brand.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <h3 className="text-sm font-semibold text-navy-900">Category</h3>
          <div className="mt-2 space-y-2">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex cursor-pointer items-center gap-2"
              >
                <input
                  type="checkbox"
                  checked={currentCategory === category.slug}
                  onChange={() => handleCategoryToggle(category.slug)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                />
                <span className="text-sm text-gray-700">{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-sm font-semibold text-navy-900">Price Range</h3>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="number"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              placeholder="Min"
              min={0}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-navy-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              placeholder="Max"
              min={0}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-navy-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <button
            type="button"
            onClick={handlePriceApply}
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-navy-900 transition-colors hover:bg-gray-50"
          >
            Apply Price
          </button>
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="w-full rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Page header */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-navy-900">Shop</h1>
          <p className="mt-2 text-sm text-gray-500">
            {total} {total === 1 ? "product" : "products"} available
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Mobile filter toggle + Sort */}
        <div className="mb-6 flex items-center justify-between lg:justify-end">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-navy-900 transition-colors hover:bg-gray-50 lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={16}
              height={16}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
              />
            </svg>
            Filters
            {hasActiveFilters && (
              <span className="ml-1 rounded-full bg-blue-600 px-1.5 py-0.5 text-xs text-white">
                !
              </span>
            )}
          </button>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="sort-select"
              className="text-sm text-gray-500"
            >
              Sort by:
            </label>
            <select
              id="sort-select"
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-navy-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile filters panel */}
        {mobileFiltersOpen && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 lg:hidden">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-navy-900">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <FilterContent />
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <FilterContent />
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={48}
                  height={48}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                  className="text-gray-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-semibold text-navy-900">
                  No products found
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Try adjusting your filters or search terms.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav className="mt-10 flex items-center justify-center gap-2">
                    {/* Previous */}
                    {page > 1 ? (
                      <Link
                        href={(() => {
                          const params = new URLSearchParams(
                            searchParams.toString(),
                          );
                          params.set("page", String(page - 1));
                          return `/shop?${params.toString()}`;
                        })()}
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-navy-900 transition-colors hover:bg-gray-50"
                      >
                        Previous
                      </Link>
                    ) : (
                      <span className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-300">
                        Previous
                      </span>
                    )}

                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <Link
                          key={pageNum}
                          href={(() => {
                            const params = new URLSearchParams(
                              searchParams.toString(),
                            );
                            params.set("page", String(pageNum));
                            return `/shop?${params.toString()}`;
                          })()}
                          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                            pageNum === page
                              ? "bg-blue-600 text-white"
                              : "border border-gray-300 text-navy-900 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </Link>
                      ),
                    )}

                    {/* Next */}
                    {page < totalPages ? (
                      <Link
                        href={(() => {
                          const params = new URLSearchParams(
                            searchParams.toString(),
                          );
                          params.set("page", String(page + 1));
                          return `/shop?${params.toString()}`;
                        })()}
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-navy-900 transition-colors hover:bg-gray-50"
                      >
                        Next
                      </Link>
                    ) : (
                      <span className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-300">
                        Next
                      </span>
                    )}
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
