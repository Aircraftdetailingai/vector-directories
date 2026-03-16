import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { ProductCard } from "@/app/components/product-card";
import type { StoreProduct } from "@/lib/types";

export const metadata: Metadata = {
  title: "Training & Courses | Aircraft Detailing 101",
  description:
    "Professional aircraft detailing training courses. Learn polishing, ceramic coating application, and how to build your detailing business.",
};

async function getTrainingProducts(): Promise<StoreProduct[]> {
  try {
    const { createBrowserClient } = await import("@vector/db");
    const { getCategoryBySlug } = await import("@/lib/queries/categories");
    const { getProductsByCategory } = await import("@/lib/queries/products");
    const client = createBrowserClient();

    const category = await getCategoryBySlug(client, "training");
    if (!category) return [];

    const result = await getProductsByCategory(client, category.id);
    return result.products;
  } catch {
    return [];
  }
}

export default async function TrainingPage() {
  const products = await getTrainingProducts();

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-blue-600 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Training & Courses
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Professional aircraft detailing courses taught by industry experts.
              Master polishing, ceramic coatings, and grow your detailing
              business.
            </p>
          </div>
        </section>

        {/* Courses Section */}
        <section className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <h3 className="text-lg font-semibold text-slate-900">
                  Training courses coming soon
                </h3>
                <p className="mt-2 max-w-md text-sm text-gray-500">
                  Are you an instructor? Become a supplier to list your courses
                  on Aircraft Detailing 101.
                </p>
                <div className="mt-4 flex gap-3">
                  <Link
                    href="/vendor/register"
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    Become a Supplier
                  </Link>
                  <Link
                    href="/shop"
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-gray-50"
                  >
                    Browse Products
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
