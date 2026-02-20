import type { StoreProduct } from "@/lib/types";
import { ProductCard } from "@/app/components/product-card";

interface RelatedProductsProps {
  products: StoreProduct[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold text-[#0F172A]">
        You May Also Like
      </h2>
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
