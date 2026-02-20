import { notFound } from "next/navigation";
import { ProductForm } from "../new/components/product-form";
import { SEED_BRANDS, SEED_CATEGORIES, SEED_PRODUCTS } from "@/lib/seed-data";
import type { StoreBrand, StoreCategory, StoreProduct } from "@/lib/types";

interface EditProductPageProps {
  params: { id: string };
}

async function fetchProductData(productId: string): Promise<{
  product: StoreProduct | null;
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

    const { data: product } = await client
      .from("store_products")
      .select(
        "*, brand:store_brands(*), category:store_categories(*), images:store_product_images(*), variants:store_product_variants(*)",
      )
      .eq("id", productId)
      .single();

    return {
      product: product as StoreProduct | null,
      brands,
      categories,
      supplierId: supplier?.id ?? "s1",
    };
  } catch {
    const product =
      SEED_PRODUCTS.find((p) => p.id === productId) ?? null;
    return {
      product,
      brands: SEED_BRANDS,
      categories: SEED_CATEGORIES,
      supplierId: "s1",
    };
  }
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { product, brands, categories, supplierId } =
    await fetchProductData(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[#0F172A]">Edit Product</h1>
      <ProductForm
        brands={brands}
        categories={categories}
        supplierId={supplierId}
        product={product}
      />
    </div>
  );
}
