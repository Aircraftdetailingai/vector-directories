import type { Metadata } from "next";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { ShopShell } from "./components/shop-shell";
import type {
  StoreProduct,
  StoreBrand,
  StoreCategory,
} from "@/lib/types";
import { SEED_PRODUCTS, SEED_BRANDS, SEED_CATEGORIES } from "@/lib/seed-data";

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
    // Fallback: apply filters to seed data
    let filtered = SEED_PRODUCTS.filter((p) => p.status === "active");

    if (filters.query) {
      const q = filters.query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q),
      );
    }
    if (filters.brandSlug) {
      filtered = filtered.filter(
        (p) => p.brand?.slug === filters.brandSlug,
      );
    }
    if (filters.categorySlug) {
      filtered = filtered.filter(
        (p) => p.category?.slug === filters.categorySlug,
      );
    }
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.base_price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.base_price <= filters.maxPrice!);
    }

    // Sort
    switch (filters.sortBy) {
      case "price_asc":
        filtered.sort((a, b) => a.base_price - b.base_price);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.base_price - a.base_price);
        break;
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime(),
        );
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        filtered.sort((a, b) => {
          if (a.is_featured !== b.is_featured)
            return a.is_featured ? -1 : 1;
          return (
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
          );
        });
    }

    const perPage = 12;
    const page = filters.page ?? 1;
    const total = filtered.length;
    const totalPages = Math.ceil(total / perPage);
    const start = (page - 1) * perPage;
    const paged = filtered.slice(start, start + perPage);

    return { products: paged, total, page, totalPages };
  }
}

async function getBrands(): Promise<StoreBrand[]> {
  try {
    const { createBrowserClient } = await import("@vector/db");
    const { getBrands } = await import("@/lib/queries/brands");
    const client = createBrowserClient();
    return await getBrands(client);
  } catch {
    return SEED_BRANDS;
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
      </main>
      <Footer />
    </div>
  );
}
