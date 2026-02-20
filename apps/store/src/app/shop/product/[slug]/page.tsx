import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { ProductDetail } from "./components/product-detail";
import { RelatedProducts } from "./components/related-products";
import type { StoreProduct } from "@/lib/types";
import { SEED_PRODUCTS } from "@/lib/seed-data";

interface ProductPageProps {
  params: { slug: string };
}

async function fetchProduct(slug: string): Promise<StoreProduct | null> {
  try {
    const { createBrowserClient } = await import("@vector/db");
    const { getProductBySlug } = await import("@/lib/queries/products");
    const client = createBrowserClient();
    return await getProductBySlug(client, slug);
  } catch {
    return SEED_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
}

async function fetchRelatedProducts(
  productId: string,
  categoryId: string | null,
): Promise<StoreProduct[]> {
  try {
    const { createBrowserClient } = await import("@vector/db");
    const { getRelatedProducts } = await import("@/lib/queries/products");
    const client = createBrowserClient();
    return await getRelatedProducts(client, productId, categoryId, 4);
  } catch {
    return SEED_PRODUCTS.filter(
      (p) => p.id !== productId && p.category_id === categoryId,
    ).slice(0, 4);
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await fetchProduct(params.slug);

  if (!product) {
    return {
      title: "Product Not Found | Aircraft Detailing 101",
      description: "The requested product could not be found.",
    };
  }

  return {
    title: `${product.name} | Aircraft Detailing 101`,
    description:
      product.short_description ??
      product.description ??
      `Shop ${product.name} at Aircraft Detailing 101.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await fetchProduct(params.slug);

  if (!product) {
    notFound();
  }

  const related = await fetchRelatedProducts(
    product.id,
    product.category_id,
  );

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <ProductDetail product={product} />
        </div>

        {related.length > 0 && (
          <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
            <RelatedProducts products={related} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
