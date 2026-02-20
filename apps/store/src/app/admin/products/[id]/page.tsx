import { notFound } from "next/navigation";
import type { StoreProduct } from "@/lib/types";
import { approveProduct, rejectProduct } from "../actions";

interface AdminProductDetailProps {
  params: { id: string };
}

async function fetchProduct(productId: string): Promise<StoreProduct | null> {
  try {
    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();
    const { data } = await client
      .from("store_products")
      .select(
        "*, brand:store_brands(*), category:store_categories(*), images:store_product_images(*), variants:store_product_variants(*)",
      )
      .eq("id", productId)
      .single();

    return data as StoreProduct | null;
  } catch {
    return null;
  }
}

export default async function AdminProductDetailPage({
  params,
}: AdminProductDetailProps) {
  const product = await fetchProduct(params.id);

  if (!product) {
    notFound();
  }

  const statusStyles: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    draft: "bg-yellow-100 text-yellow-800",
    archived: "bg-gray-100 text-gray-600",
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-[#0F172A]">{product.name}</h1>
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[product.status] ?? "bg-gray-100 text-gray-600"}`}
          >
            {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
          </span>
        </div>
        {product.status === "draft" && (
          <div className="flex items-center gap-3">
            <form action={approveProduct}>
              <input
                type="hidden"
                name="product_id"
                value={product.id}
              />
              <button
                type="submit"
                className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                Approve Product
              </button>
            </form>
            <form action={rejectProduct}>
              <input
                type="hidden"
                name="product_id"
                value={product.id}
              />
              <button
                type="submit"
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Reject Product
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Product Info */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">
            Product Details
          </h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="font-medium text-gray-500">Slug</dt>
              <dd className="mt-0.5 font-mono text-xs text-[#0F172A]">
                {product.slug}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Short Description</dt>
              <dd className="mt-0.5 text-[#0F172A]">
                {product.short_description ?? "Not provided"}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Full Description</dt>
              <dd className="mt-0.5 text-[#0F172A]">
                {product.description ?? "Not provided"}
              </dd>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-3">
              <div>
                <dt className="font-medium text-gray-500">Brand</dt>
                <dd className="mt-0.5 text-[#0F172A]">
                  {product.brand?.name ?? "-"}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Category</dt>
                <dd className="mt-0.5 text-[#0F172A]">
                  {product.category?.name ?? "-"}
                </dd>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-3">
              <div>
                <dt className="font-medium text-gray-500">Base Price</dt>
                <dd className="mt-0.5 text-lg font-semibold text-[#0F172A]">
                  ${product.base_price.toFixed(2)}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Compare At Price</dt>
                <dd className="mt-0.5 text-[#0F172A]">
                  {product.compare_at_price
                    ? `$${product.compare_at_price.toFixed(2)}`
                    : "-"}
                </dd>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-3">
              <div>
                <dt className="font-medium text-gray-500">SKU</dt>
                <dd className="mt-0.5 font-mono text-xs text-[#0F172A]">
                  {product.sku ?? "-"}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Weight</dt>
                <dd className="mt-0.5 text-[#0F172A]">
                  {product.weight_oz ? `${product.weight_oz} oz` : "-"}
                </dd>
              </div>
            </div>
            {product.tags.length > 0 && (
              <div className="border-t border-gray-100 pt-3">
                <dt className="mb-1 font-medium text-gray-500">Tags</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Images */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">Images</h2>
          {product.images && product.images.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {product.images.map((image) => (
                <div
                  key={image.id}
                  className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.alt_text ?? product.name}
                    className="aspect-square w-full object-cover"
                  />
                  {image.is_primary && (
                    <span className="absolute left-2 top-2 rounded-full bg-[#2563EB] px-2 py-0.5 text-[10px] font-semibold text-white">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No images uploaded.</p>
          )}
        </div>
      </div>

      {/* Variants */}
      {product.variants && product.variants.length > 0 && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-[#0F172A]">Variants</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">SKU</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {product.variants.map((variant) => (
                  <tr key={variant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-[#0F172A]">
                      {variant.name}
                    </td>
                    <td className="px-6 py-3 font-mono text-xs text-gray-600">
                      {variant.sku ?? "-"}
                    </td>
                    <td className="px-6 py-3 text-[#0F172A]">
                      ${variant.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {variant.stock_quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
