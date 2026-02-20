import type { SupabaseClient } from "@supabase/supabase-js";
import type { StoreOrder } from "../types";

export async function getOrderById(
  client: SupabaseClient,
  orderId: string,
): Promise<StoreOrder | null> {
  const { data, error } = await client
    .from("store_orders")
    .select("*, items:store_order_items(*, product:store_products(name, slug, images:store_product_images(*)), variant:store_product_variants(name))")
    .eq("id", orderId)
    .single();

  if (error) return null;
  return data as StoreOrder;
}

export async function getOrdersByEmail(
  client: SupabaseClient,
  email: string,
): Promise<StoreOrder[]> {
  const { data, error } = await client
    .from("store_orders")
    .select("*, items:store_order_items(*, product:store_products(name, slug))")
    .eq("email", email)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as StoreOrder[];
}

export async function getOrdersBySupplierId(
  client: SupabaseClient,
  supplierId: string,
  page = 1,
  perPage = 20,
): Promise<{ orders: StoreOrder[]; total: number }> {
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, error, count } = await client
    .from("store_orders")
    .select("*, items:store_order_items(*, product:store_products(name, slug), variant:store_product_variants(name))", { count: "exact" })
    .eq("supplier_id", supplierId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { orders: (data ?? []) as StoreOrder[], total: count ?? 0 };
}

export async function updateOrderStatus(
  client: SupabaseClient,
  orderId: string,
  status: StoreOrder["status"],
): Promise<void> {
  const { error } = await client
    .from("store_orders")
    .update({ status })
    .eq("id", orderId);

  if (error) throw error;
}

export async function updateOrderTracking(
  client: SupabaseClient,
  orderId: string,
  trackingNumber: string,
  trackingUrl: string | null,
): Promise<void> {
  const { error } = await client
    .from("store_orders")
    .update({ tracking_number: trackingNumber, tracking_url: trackingUrl, status: "shipped" as const })
    .eq("id", orderId);

  if (error) throw error;
}

export async function getAllOrders(
  client: SupabaseClient,
  page = 1,
  perPage = 20,
  statusFilter?: StoreOrder["status"],
): Promise<{ orders: StoreOrder[]; total: number }> {
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let q = client
    .from("store_orders")
    .select("*, items:store_order_items(*, product:store_products(name, slug))", { count: "exact" });

  if (statusFilter) {
    q = q.eq("status", statusFilter);
  }

  const { data, error, count } = await q
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { orders: (data ?? []) as StoreOrder[], total: count ?? 0 };
}
