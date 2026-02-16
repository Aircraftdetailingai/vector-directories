import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/header";
import Footer from "../components/footer";
import { SERVICE_CATEGORIES } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Browse by Service | Aviation Detailing Hub",
  description:
    "Find the perfect aircraft detailing service. Browse ceramic coating, interior detailing, paint correction, brightwork polish, and more in our community directory.",
};

export default function ServicesIndexPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Header />

      {/* Hero */}
      <section className="bg-teal-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-white mb-3">
            Browse by Service
          </h1>
          <p className="text-teal-100 font-body text-lg max-w-2xl mx-auto">
            Discover the best aviation detailing professionals organized by
            the services they offer. Find exactly what your aircraft needs.
          </p>
        </div>
      </section>

      {/* Category Grid */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICE_CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/services/${category.slug}`}
              className="group bg-white rounded-2xl border border-teal-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              {/* Emoji icon */}
              <span
                className="text-4xl block mb-3 group-hover:scale-110 transition-transform"
                aria-hidden="true"
              >
                {category.icon}
              </span>

              {/* Name */}
              <h2 className="font-heading font-bold text-lg text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">
                {category.name}
              </h2>

              {/* Description */}
              <p className="text-gray-500 font-body text-sm leading-relaxed">
                {category.description}
              </p>

              {/* Arrow hint */}
              <span className="inline-flex items-center gap-1 mt-4 text-teal-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Browse detailers
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
