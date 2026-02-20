"use server";

import { revalidatePath } from "next/cache";

export async function approveSupplier(formData: FormData): Promise<void> {
  const supplierId = formData.get("supplier_id") as string;
  if (!supplierId) return;

  try {
    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();
    await client
      .from("store_suppliers")
      .update({ is_approved: true, updated_at: new Date().toISOString() })
      .eq("id", supplierId);
  } catch (err) {
    console.error("approveSupplier error:", err);
  }

  revalidatePath("/admin/suppliers");
}

export async function disableSupplier(formData: FormData): Promise<void> {
  const supplierId = formData.get("supplier_id") as string;
  if (!supplierId) return;

  try {
    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();
    await client
      .from("store_suppliers")
      .update({ is_approved: false, updated_at: new Date().toISOString() })
      .eq("id", supplierId);
  } catch (err) {
    console.error("disableSupplier error:", err);
  }

  revalidatePath("/admin/suppliers");
}
