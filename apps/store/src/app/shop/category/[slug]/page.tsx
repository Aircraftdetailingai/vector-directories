import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "../../../components/header";
import { Footer } from "../../../components/footer";
import { ProductCard } from "../../../components/product-card";
import type { StoreCategory, StoreProduct } from "@/lib/types";
import { SEED_CATEGORIES } from "@/lib/seed-data";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

async function getCategoryBySlug(
  slug: string,
): Promise<StoreCategory | null> {
  try {
    const { createBrowserClient } = await import("@vector/db");
    const { getCategoryBySlug } = await import("@/lib/queries/categories");
    const client = createBrowserClient();
    return await getCategoryBySlug(client, slug);
  } catch {
    return SEED_CATEGORIES.find((c) => c.slug === slug) ?? null;
  }
}

async function getProductsForCategory(
  categoryId: string,
): Promise<{ products: StoreProduct[]; total: number }> {
  try {
    const { createBrowserClient } = await import("@vector/db");
    const { getProductsByCategory } = await import("@/lib/queries/products");
    const client = createBrowserClient();
    const result = await getProductsByCategory(client, categoryId);
    return { products: result.products, total: result.total };
  } catch {
    return { products: [], total: 0 };
  }
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category Not Found | Aircraft Detailing 101" };
  }

  return {
    title: `${category.name} | Aircraft Detailing 101`,
    description:
      category.description ??
      `Shop ${category.name} for aircraft detailing at Aircraft Detailing 101.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const { products, total } = await getProductsForCategory(category.id);

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex-1">
        {/* Category Hero */}
        <section className="border-b border-gray-200 bg-slate-900">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <nav className="mb-4">
              <ol className="flex items-center gap-2 text-sm text-slate-300">
                <li>
                  <Link
                    href="/shop"
                    className="transition-colors hover:text-white"
                  >
                    Shop
                  </Link>
                </li>
                <li>
                  <span className="mx-1">/</span>
                </li>
                <li className="text-white">
                  {category.name}
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {category.name}
            </h1>

            {category.description && (
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-slate-300">
                {category.description}
              </p>
            )}

            <p className="mt-4 text-sm text-slate-400">
              {total} {total === 1 ? "product" : "products"}
            </p>
          </div>
        </section>

        {/* Products grid */}
        <section className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <h3 className="text-lg font-semibold text-slate-900">
                  Products coming soon
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Are you a supplier? Join our marketplace and list your {category.name.toLowerCase()} products.
                </p>
                <div className="mt-4 flex gap-3">
                  <Link
                    href="/supplier/login"
                    className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
                  >
                    Become a Supplier
                  </Link>
                  <Link
                    href="/shop"
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-gray-50"
                  >
                    Back to Shop
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

            {/* Back link */}
            <div className="mt-10 text-center">
              <Link
                href="/shop"
                className="inline-flex items-center text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
              >
                <span className="mr-1">&larr;</span>
                Back to All Products
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
