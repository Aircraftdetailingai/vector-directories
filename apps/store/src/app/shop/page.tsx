import { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { ShopShell } from "./components/shop-shell";
import type {
  StoreProduct,
  StoreBrand,
  StoreCategory,
} from "@/lib/types";
import { SEED_CATEGORIES } from "@/lib/seed-data";

export const metadata: Metadata = {
  title: "Shop | Aircraft Detailing 101",
  description:
    "Browse professional aircraft detailing products. Filter by brand, category, and price. Polishes, ceramic coatings, towels, cleaners, tools, and kits.",
};

interface ShopPageProps {
  searchParams: Promise<{
    brand?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
    q?: string;
  }>;
}

async function getFilteredProducts(filters: {
  brandSlug?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  page?: number;
  query?: string;
}): Promise<{
  products: StoreProduct[];
  total: number;
  page: number;
  totalPages: number;
}> {
  try {
    const { createBrowserClient } = await import("@vector/db");
    const { getProducts } = await import("@/lib/queries/products");
    const client = createBrowserClient();
    const result = await getProducts(client, {
      brandSlug: filters.brandSlug,
      categorySlug: filters.categorySlug,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sortBy: filters.sortBy as
        | "featured"
        | "price_asc"
        | "price_desc"
        | "newest"
        | "name"
        | undefined,
      page: filters.page,
      perPage: 12,
      query: filters.query,
    });
    return result;
  } catch {
    return { products: [], total: 0, page: 1, totalPages: 0 };
  }
}

async function getBrands(): Promise<StoreBrand[]> {
  try {
    const { createBrowserClient } = await import("@vector/db");
    const { getBrands } = await import("@/lib/queries/brands");
    const client = createBrowserClient();
    return await getBrands(client);
  } catch {
    return [];
  }
}

async function getCategories(): Promise<StoreCategory[]> {
  try {
    const { createBrowserClient } = await import("@vector/db");
    const { getCategories } = await import("@/lib/queries/categories");
    const client = createBrowserClient();
    return await getCategories(client);
  } catch {
    return SEED_CATEGORIES;
  }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const brandSlug = params.brand ?? undefined;
  const categorySlug = params.category ?? undefined;
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;
  const sortBy = params.sort ?? "featured";
  const page = params.page ? parseInt(params.page, 10) : 1;
  const query = params.q ?? undefined;

  const [productResult, brands, categories] = await Promise.all([
    getFilteredProducts({
      brandSlug,
      categorySlug,
      minPrice,
      maxPrice,
      sortBy,
      page,
      query,
    }),
    getBrands(),
    getCategories(),
  ]);

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex-1">
        <Suspense>
          <ShopShell
            products={productResult.products}
            brands={brands}
            categories={categories}
            total={productResult.total}
            page={productResult.page}
            totalPages={productResult.totalPages}
            currentBrand={brandSlug}
            currentCategory={categorySlug}
            currentMinPrice={minPrice}
            currentMaxPrice={maxPrice}
            currentSort={sortBy}
            currentQuery={query}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
