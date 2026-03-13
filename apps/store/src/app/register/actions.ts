"use server";

import { redirect } from "next/navigation";

export async function registerCustomer(formData: FormData): Promise<void> {
  const fullName = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password || !fullName) return;

  try {
    const { createBrowserClient } = await import("@vector/db");
    const supabase = createBrowserClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      console.error("Registration error:", error);
      const msg = encodeURIComponent(error.message);
      redirect(`/register?error=${msg}`);
    }

    redirect("/register?success=true");
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      "digest" in err &&
      typeof (err as any).digest === "string" &&
      (err as any).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw err;
    }
    console.error("Registration error:", err);
    redirect("/register?error=Something+went+wrong.+Please+try+again.");
  }
}
