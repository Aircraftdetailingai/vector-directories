import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "../../../components/header";
import { Footer } from "../../../components/footer";
import { ProductCard } from "../../../components/product-card";
import type { StoreBrand, StoreProduct } from "@/lib/types";
import { SEED_BRANDS, SEED_PRODUCTS } from "@/lib/seed-data";

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

async function getBrandBySlug(slug: string): Promise<StoreBrand | null> {
  try {
    const { createBrowserClient } = await import("@vector/db");
    const { getBrandBySlug } = await import("@/lib/queries/brands");
    const client = createBrowserClient();
    return await getBrandBySlug(client, slug);
  } catch {
    return SEED_BRANDS.find((b) => b.slug === slug) ?? null;
  }
}

async function getProductsForBrand(
  brandId: string,
  brandSlug: string,
): Promise<{ products: StoreProduct[]; total: number }> {
  try {
    const { createBrowserClient } = await import("@vector/db");
    const { getProductsByBrand } = await import("@/lib/queries/products");
    const client = createBrowserClient();
    const result = await getProductsByBrand(client, brandId);
    return { products: result.products, total: result.total };
  } catch {
    const products = SEED_PRODUCTS.filter(
      (p) => p.brand?.slug === brandSlug && p.status === "active",
    );
    return { products, total: products.length };
  }
}

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    return { title: "Brand Not Found | Aircraft Detailing 101" };
  }

  return {
    title: `${brand.name} Products | Aircraft Detailing 101`,
    description:
      brand.description ??
      `Shop ${brand.name} aircraft detailing products at Aircraft Detailing 101.`,
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const { products, total } = await getProductsForBrand(brand.id, brand.slug);

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex-1">
        {/* Brand Hero */}
        <section className="border-b border-gray-200 bg-navy-900">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <nav className="mb-4">
              <ol className="flex items-center gap-2 text-sm text-navy-300">
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
                  {brand.name}
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {brand.name}
            </h1>

            {brand.description && (
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-navy-300">
                {brand.description}
              </p>
            )}

            <p className="mt-4 text-sm text-navy-400">
              {total} {total === 1 ? "product" : "products"}
            </p>
          </div>
        </section>

        {/* Products grid */}
        <section className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <h3 className="text-lg font-semibold text-navy-900">
                  No products available
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Check back soon for new {brand.name} products.
                </p>
                <Link
                  href="/shop"
                  className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Back to Shop
                </Link>
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
