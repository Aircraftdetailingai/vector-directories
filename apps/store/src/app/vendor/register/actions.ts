"use server";

import { redirect } from "next/navigation";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export async function registerSupplier(formData: FormData): Promise<void> {
  const companyName = formData.get("company_name") as string;
  const contactName = formData.get("contact_name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phone = (formData.get("phone") as string) || null;
  const website = (formData.get("website") as string) || null;

  if (!companyName || !contactName || !email || !password) return;

  try {
    const { createBrowserClient, createServiceRoleClient } = await import(
      "@vector/db"
    );
    const supabase = createBrowserClient();

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: contactName },
      },
    });

    if (authError) {
      console.error("Supplier registration auth error:", authError);
      const msg = encodeURIComponent(authError.message);
      redirect(`/vendor/register?error=${msg}`);
    }

    const userId = authData.user?.id;

    // 2. Create supplier record (service role bypasses RLS since user has no session yet)
    if (userId) {
      const admin = createServiceRoleClient();
      const slug = slugify(companyName);

      const { error: insertError } = await admin
        .from("store_suppliers")
        .insert({
          user_id: userId,
          company_name: companyName,
          slug,
          contact_email: email,
          phone,
          description: website ? `Website: ${website}` : null,
          is_approved: false,
        });

      if (insertError) {
        console.error("Supplier record insert error:", insertError);
      }
    }

    redirect("/vendor/register?success=true");
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      "digest" in err &&
      typeof (err as any).digest === "string" &&
      (err as any).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw err;
    }
    console.error("Supplier registration error:", err);
    redirect(
      "/vendor/register?error=Something+went+wrong.+Please+try+again.",
    );
  }
}
