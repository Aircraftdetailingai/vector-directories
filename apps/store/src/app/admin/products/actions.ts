"use server";

import { revalidatePath } from "next/cache";

export async function approveProduct(formData: FormData): Promise<void> {
  const productId = formData.get("product_id") as string;
  if (!productId) return;

  try {
    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();
    await client
      .from("store_products")
      .update({ status: "active", updated_at: new Date().toISOString() })
      .eq("id", productId);
  } catch (err) {
    console.error("approveProduct error:", err);
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/supplier/products");
}

export async function rejectProduct(formData: FormData): Promise<void> {
  const productId = formData.get("product_id") as string;
  if (!productId) return;

  try {
    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();
    await client
      .from("store_products")
      .update({ status: "archived", updated_at: new Date().toISOString() })
      .eq("id", productId);
  } catch (err) {
    console.error("rejectProduct error:", err);
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/supplier/products");
}
