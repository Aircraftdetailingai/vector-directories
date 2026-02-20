import type { Metadata } from "next";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { HomeContent } from "./components/home-content";
import type { StoreProduct, StoreBrand, StoreCategory } from "@/lib/types";
import { SEED_PRODUCTS, SEED_BRANDS, SEED_CATEGORIES } from "@/lib/seed-data";

export const metadata: Metadata = {
  title: "Aircraft Detailing 101 | Professional Detailing Products & Supplies",
  description:
    "Shop professional aircraft detailing products from top brands like Fly Shiny, Autofiber, Nuvite, and SkyGlide. Polishes, ceramic coatings, towels, cleaners, tools, and complete kits.",
};

async function getFeaturedProducts(): Promise<StoreProduct[]> {
  try {
    const { createBrowserClient } = await import("@vector/db");
    const { getFeaturedProducts } = await import("@/lib/queries/products");
    const client = createBrowserClient();
    return await getFeaturedProducts(client, 8);
  } catch {
    return SEED_PRODUCTS.filter((p) => p.is_featured);
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

export default async function HomePage() {
  const [featured, brands, categories] = await Promise.all([
    getFeaturedProducts(),
    getBrands(),
    getCategories(),
  ]);

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex-1">
        <HomeContent
          featured={featured}
          brands={brands}
          categories={categories}
        />
      </main>
      <Footer />
    </div>
  );
}
