"use server";

import { revalidatePath } from "next/cache";
import type { StoreOrder } from "@/lib/types";

export async function updateOrderStatus(formData: FormData): Promise<void> {
  const orderId = formData.get("order_id") as string;
  const status = formData.get("status") as StoreOrder["status"];

  if (!orderId || !status) return;

  const validStatuses: StoreOrder["status"][] = [
    "pending",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ];

  if (!validStatuses.includes(status)) return;

  try {
    const { createBrowserClient } = await import("@vector/db");
    const { updateOrderStatus: updateStatus } = await import(
      "@/lib/queries/orders"
    );
    const client = createBrowserClient();
    await updateStatus(client, orderId, status);
  } catch (err) {
    console.error("updateOrderStatus error:", err);
  }

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  revalidatePath("/supplier/orders");
}
