import { notFound } from "next/navigation";
import type { StoreOrder } from "@/lib/types";
import { TrackingForm } from "./components/tracking-form";

interface OrderDetailPageProps {
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

export default async function SupplierOrderDetailPage({
  params,
}: OrderDetailPageProps) {
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
                })}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Customer Email</dt>
              <dd className="text-[#0F172A]">{order.email}</dd>
            </div>
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

        {/* Shipping Address */}
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

          {/* Tracking Info */}
          <div className="mt-6 border-t border-gray-100 pt-6">
            <h3 className="mb-3 text-sm font-semibold text-[#0F172A]">
              Tracking
            </h3>
            {order.tracking_number ? (
              <div className="text-sm">
                <p className="text-gray-600">
                  Tracking Number:{" "}
                  <span className="font-medium text-[#0F172A]">
                    {order.tracking_number}
                  </span>
                </p>
                {order.tracking_url && (
                  <a
                    href={order.tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-[#2563EB] hover:underline"
                  >
                    Track Package
                  </a>
                )}
              </div>
            ) : (
              <TrackingForm
                orderId={order.id}
                currentTrackingNumber={order.tracking_number ?? ""}
                currentTrackingUrl={order.tracking_url ?? ""}
              />
            )}
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
