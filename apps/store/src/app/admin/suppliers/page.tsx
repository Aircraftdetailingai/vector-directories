import type { StoreSupplier } from "@/lib/types";
import { approveSupplier, disableSupplier } from "./actions";

async function fetchSuppliers(): Promise<StoreSupplier[]> {
  try {
    const { createBrowserClient } = await import("@vector/db");
    const { getAllSuppliers } = await import("@/lib/queries/suppliers");
    const client = createBrowserClient();
    return await getAllSuppliers(client);
  } catch {
    return [];
  }
}

export default async function AdminSuppliersPage() {
  const suppliers = await fetchSuppliers();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[#0F172A]">
        Supplier Management
      </h1>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {suppliers.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-gray-500">
            No suppliers found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3">Company</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Commission</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Joined</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {suppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#0F172A]">
                        {supplier.company_name}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {supplier.slug}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {supplier.contact_email}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {(supplier.commission_rate * 100).toFixed(0)}%
                    </td>
                    <td className="px-6 py-4">
                      {supplier.is_approved ? (
                        <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                      {new Date(supplier.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {supplier.is_approved ? (
                          <form action={disableSupplier}>
                            <input
                              type="hidden"
                              name="supplier_id"
                              value={supplier.id}
                            />
                            <button
                              type="submit"
                              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
                            >
                              Disable
                            </button>
                          </form>
                        ) : (
                          <form action={approveSupplier}>
                            <input
                              type="hidden"
                              name="supplier_id"
                              value={supplier.id}
                            />
                            <button
                              type="submit"
                              className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700"
                            >
                              Approve
                            </button>
                          </form>
                        )}
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
