"use client";

import Link from "next/link";
import type { StoreProduct, StoreBrand, StoreCategory } from "@/lib/types";
import { ProductCard } from "./product-card";

interface HomeContentProps {
  featured: StoreProduct[];
  brands: StoreBrand[];
  categories: StoreCategory[];
}

/* ---------------------------------------------------------------------------
   A. Hero Section
   --------------------------------------------------------------------------- */

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-navy-900">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-900 to-blue-900/40" />

      <div className="relative mx-auto max-w-4xl px-4 py-20 sm:py-28 text-center">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          Professional Aircraft
          <br />
          Detailing Products
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-navy-300 sm:text-xl">
          Top-quality polishes, ceramic coatings, towels, and tools trusted by
          professional aircraft detailers worldwide.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/shop"
            className="inline-flex items-center rounded-lg bg-orange-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-colors hover:bg-orange-600"
          >
            Shop Now
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center rounded-lg border-2 border-white/30 px-8 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
          >
            Browse Brands
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   B. Featured Products
   --------------------------------------------------------------------------- */

function FeaturedProductsSection({
  products,
}: {
  products: StoreProduct[];
}) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-navy-900 sm:text-4xl">
            Featured Products
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            Hand-picked products from the best brands in aircraft detailing.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            View All Products
            <span className="ml-1">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   C. Shop by Brand
   --------------------------------------------------------------------------- */

function BrandSection({ brands }: { brands: StoreBrand[] }) {
  const displayBrands = brands.slice(0, 4);

  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-navy-900 sm:text-4xl">
            Shop by Brand
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            Explore products from industry-leading aviation detailing brands.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayBrands.map((brand) => (
            <Link
              key={brand.id}
              href={`/shop/brand/${brand.slug}`}
              className="group rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-navy-900 group-hover:text-blue-600 transition-colors">
                {brand.name}
              </h3>
              {brand.description && (
                <p className="mt-2 text-sm leading-relaxed text-gray-500 line-clamp-3">
                  {brand.description}
                </p>
              )}
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600">
                Shop Brand
                <span className="ml-1 transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   D. Shop by Category
   --------------------------------------------------------------------------- */

const CATEGORY_COLORS = [
  "bg-blue-100 text-blue-600",
  "bg-orange-100 text-orange-600",
  "bg-emerald-100 text-emerald-600",
  "bg-purple-100 text-purple-600",
  "bg-rose-100 text-rose-600",
  "bg-amber-100 text-amber-600",
];

function CategorySection({ categories }: { categories: StoreCategory[] }) {
  const displayCategories = categories.slice(0, 6);

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-navy-900 sm:text-4xl">
            Shop by Category
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            Find exactly what you need for your next detailing project.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayCategories.map((category, index) => {
            const colorClass =
              CATEGORY_COLORS[index % CATEGORY_COLORS.length];

            return (
              <Link
                key={category.id}
                href={`/shop/category/${category.slug}`}
                className="group flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
              >
                {/* Icon placeholder */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${colorClass}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 6h.008v.008H6V6Z"
                    />
                  </svg>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-navy-900 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   E. Training CTA
   --------------------------------------------------------------------------- */

function TrainingCTASection() {
  return (
    <section className="bg-blue-600">
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-20">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Level Up Your Skills
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-blue-100">
          Access professional training courses, tutorials, and certifications
          designed for aircraft detailing professionals at every level.
        </p>
        <Link
          href="/training"
          className="mt-8 inline-flex items-center rounded-lg bg-orange-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-colors hover:bg-orange-600"
        >
          Explore Training
        </Link>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   F. Directories Section
   --------------------------------------------------------------------------- */

const DIRECTORIES = [
  {
    name: "Aircraft Detailing Directory",
    description:
      "The comprehensive directory of aircraft detailing companies across the United States.",
    url: "https://aircraftdetailingdirectory.com",
  },
  {
    name: "Aircraft Detailing Near Me",
    description:
      "Find aircraft detailing services near your location with map-based search.",
    url: "https://aircraftdetailingnearme.com",
  },
  {
    name: "Aircraft Detailing Authority",
    description:
      "Expert rankings and authority scores for top aircraft detailing professionals.",
    url: "https://aircraftdetailingauthority.com",
  },
  {
    name: "Aviation Detailing Hub",
    description:
      "Central hub for aviation detailing resources, services, and industry connections.",
    url: "https://aviationdetailinghub.com",
  },
  {
    name: "Aircraft Detailer Pro",
    description:
      "Professional-grade listings and resources for certified aircraft detailers.",
    url: "https://aircraftdetailerpro.com",
  },
  {
    name: "Aircraft Detailer Near Me",
    description:
      "Quickly locate aircraft detailers in your area with reviews and ratings.",
    url: "https://aircraftdetailernearme.com",
  },
  {
    name: "Best Aircraft Detailer",
    description:
      "Curated collections and awards recognizing the best in aircraft detailing.",
    url: "https://bestaircraftdetailer.com",
  },
];

function DirectoriesSection() {
  return (
    <section className="bg-navy-900 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Find Detailers Near You
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-300">
            Explore our network of aircraft detailing directories to find trusted
            professionals in your area.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {DIRECTORIES.map((directory) => (
            <a
              key={directory.name}
              href={directory.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-lg bg-navy-800 p-5 transition-colors hover:bg-navy-700"
            >
              <h3 className="text-base font-semibold text-white group-hover:text-blue-300 transition-colors">
                {directory.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-300">
                {directory.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   Main HomeContent Component
   --------------------------------------------------------------------------- */

export function HomeContent({
  featured,
  brands,
  categories,
}: HomeContentProps) {
  return (
    <>
      <HeroSection />
      <FeaturedProductsSection products={featured} />
      <BrandSection brands={brands} />
      <CategorySection categories={categories} />
      <TrainingCTASection />
      <DirectoriesSection />
    </>
  );
}
