import Link from "next/link";
import type { StoreProduct } from "@/lib/types";
import { SEED_PRODUCTS } from "@/lib/seed-data";

async function fetchSupplierProducts(): Promise<StoreProduct[]> {
  try {
    const { requireAuth } = await import("@vector/auth");
    const user = await requireAuth();
    const { createBrowserClient } = await import("@vector/db");
    const { getSupplierByUserId, getSupplierProducts } = await import(
      "@/lib/queries/suppliers"
    );
    const client = createBrowserClient();
    const supplier = await getSupplierByUserId(client, user.id);
    if (!supplier) return [];
    const { products } = await getSupplierProducts(client, supplier.id);
    return products;
  } catch {
    return SEED_PRODUCTS;
  }
}

export default async function SupplierProductsPage() {
  const products = await fetchSupplierProducts();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0F172A]">Products</h1>
        <Link
          href="/supplier/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#F97316] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add New Product
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {products.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="mb-4 text-gray-500">
              You have not created any products yet.
            </p>
            <Link
              href="/supplier/products/new"
              className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Create Your First Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3">Product Name</th>
                  <th className="px-6 py-3">Brand</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#0F172A]">
                        {product.name}
                      </p>
                      {product.sku && (
                        <p className="mt-0.5 text-xs text-gray-400">
                          SKU: {product.sku}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {product.brand?.name ?? "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {product.category?.name ?? "-"}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#0F172A]">
                      ${product.base_price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <ProductStatusBadge status={product.status} />
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/supplier/products/${product.id}`}
                        className="text-sm font-medium text-[#2563EB] hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductStatusBadge({
  status,
}: {
  status: StoreProduct["status"];
}) {
  const styles: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    draft: "bg-yellow-100 text-yellow-800",
    archived: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
