import type { StoreProduct } from "@/lib/types";
import { approveProduct, rejectProduct } from "./actions";

async function fetchPendingProducts(): Promise<StoreProduct[]> {
  try {
    const { createBrowserClient } = await import("@vector/db");
    const { getPendingProducts } = await import("@/lib/queries/suppliers");
    const client = createBrowserClient();
    return await getPendingProducts(client);
  } catch {
    return [];
  }
}

export default async function AdminProductsPage() {
  const products = await fetchPendingProducts();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[#0F172A]">
        Product Approval Queue
      </h1>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {products.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-gray-500">
            No products pending approval. All caught up.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Supplier</th>
                  <th className="px-6 py-3">Brand</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Date Submitted</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <a
                        href={`/admin/products/${product.id}`}
                        className="font-medium text-[#2563EB] hover:underline"
                      >
                        {product.name}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {product.supplier_id}
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
                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                      {new Date(product.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <form action={approveProduct}>
                          <input
                            type="hidden"
                            name="product_id"
                            value={product.id}
                          />
                          <button
                            type="submit"
                            className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700"
                          >
                            Approve
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
                            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </form>
                      </div>
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
