import { notFound } from "next/navigation";
import type { StoreOrder } from "@/lib/types";
import { updateOrderStatus } from "../actions";

interface AdminOrderDetailProps {
  params: { id: string };
}

async function fetchOrder(orderId: string): Promise<StoreOrder | null> {
  try {
    const { createBrowserClient } = await import("@vector/db");
    const { getOrderById } = await import("@/lib/queries/orders");
    const client = createBrowserClient();
    return await getOrderById(client, orderId);
  } catch {
    return null;
  }
}

const STATUS_OPTIONS: StoreOrder["status"][] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailProps) {
  const order = await fetchOrder(params.id);

  if (!order) {
    notFound();
  }

  const address = order.shipping_address_json;

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <h1 className="text-2xl font-bold text-[#0F172A]">Order Details</h1>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Order Info */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">
            Order Information
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Order ID</dt>
              <dd className="font-mono text-xs text-[#0F172A]">{order.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Date</dt>
              <dd className="text-[#0F172A]">
                {new Date(order.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Customer Email</dt>
              <dd className="text-[#0F172A]">{order.email}</dd>
            </div>
            {order.stripe_session_id && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Stripe Session</dt>
                <dd className="font-mono text-xs text-gray-600">
                  {order.stripe_session_id.slice(0, 20)}...
                </dd>
              </div>
            )}
            {order.tracking_number && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Tracking</dt>
                <dd className="text-[#0F172A]">
                  {order.tracking_url ? (
                    <a
                      href={order.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2563EB] hover:underline"
                    >
                      {order.tracking_number}
                    </a>
                  ) : (
                    order.tracking_number
                  )}
                </dd>
              </div>
            )}
            <div className="border-t border-gray-100 pt-3">
              <div className="flex justify-between">
                <dt className="text-gray-500">Subtotal</dt>
                <dd className="text-[#0F172A]">${order.subtotal.toFixed(2)}</dd>
              </div>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Tax</dt>
              <dd className="text-[#0F172A]">
                ${order.tax_amount.toFixed(2)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Shipping</dt>
              <dd className="text-[#0F172A]">
                ${order.shipping_amount.toFixed(2)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-3">
              <dt className="font-semibold text-[#0F172A]">Total</dt>
              <dd className="font-semibold text-[#0F172A]">
                ${order.total.toFixed(2)}
              </dd>
            </div>
          </dl>
        </div>

        {/* Shipping & Status Update */}
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">
              Shipping Address
            </h2>
            {order.shipping_name || address ? (
              <div className="text-sm text-gray-600">
                {order.shipping_name && (
                  <p className="font-medium text-[#0F172A]">
                    {order.shipping_name}
                  </p>
                )}
                {address && (
                  <>
                    <p>{address.line1}</p>
                    {address.line2 && <p>{address.line2}</p>}
                    <p>
                      {address.city}, {address.state} {address.postal_code}
                    </p>
                    <p>{address.country}</p>
                  </>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No shipping address provided.
              </p>
            )}
          </div>

          {/* Status Update Form */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">
              Update Status
            </h2>
            <form action={updateOrderStatus} className="flex items-end gap-3">
              <input type="hidden" name="order_id" value={order.id} />
              <div className="flex-1">
                <label
                  htmlFor="status"
                  className="mb-1 block text-sm font-medium text-gray-500"
                >
                  New Status
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue={order.status}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#0F172A] shadow-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="rounded-lg bg-[#F97316] px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-[#0F172A]">Items</h2>
        </div>
        <div className="overflow-x-auto">
          {order.items && order.items.length > 0 ? (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Variant</th>
                  <th className="px-6 py-3">Quantity</th>
                  <th className="px-6 py-3">Unit Price</th>
                  <th className="px-6 py-3">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-[#0F172A]">
                      {item.product?.name ?? item.product_id}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {item.variant?.name ?? "-"}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      ${item.unit_price.toFixed(2)}
                    </td>
                    <td className="px-6 py-3 font-medium text-[#0F172A]">
                      ${item.total_price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="px-6 py-8 text-center text-sm text-gray-500">
              No items found for this order.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: StoreOrder["status"] }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-blue-100 text-blue-800",
    processing: "bg-indigo-100 text-indigo-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? "bg-gray-100 text-gray-800"}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
