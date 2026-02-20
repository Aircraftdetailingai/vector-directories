import { ProductForm } from "./components/product-form";
import { SEED_BRANDS, SEED_CATEGORIES } from "@/lib/seed-data";
import type { StoreBrand, StoreCategory } from "@/lib/types";

async function fetchFormData(): Promise<{
  brands: StoreBrand[];
  categories: StoreCategory[];
  supplierId: string;
}> {
  try {
    const { requireAuth } = await import("@vector/auth");
    const user = await requireAuth();
    const { createBrowserClient } = await import("@vector/db");
    const { getSupplierByUserId } = await import("@/lib/queries/suppliers");
    const { getBrands } = await import("@/lib/queries/brands");
    const { getCategories } = await import("@/lib/queries/categories");
    const client = createBrowserClient();

    const [supplier, brands, categories] = await Promise.all([
      getSupplierByUserId(client, user.id),
      getBrands(client),
      getCategories(client),
    ]);

    return {
      brands,
      categories,
      supplierId: supplier?.id ?? "s1",
    };
  } catch {
    return {
      brands: SEED_BRANDS,
      categories: SEED_CATEGORIES,
      supplierId: "s1",
    };
  }
}

export default async function NewProductPage() {
  const { brands, categories, supplierId } = await fetchFormData();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[#0F172A]">
        Add New Product
      </h1>
      <ProductForm
        brands={brands}
        categories={categories}
        supplierId={supplierId}
      />
    </div>
  );
}
