"use server";

import { redirect } from "next/navigation";

export async function sendMagicLink(formData: FormData): Promise<void> {
  const email = formData.get("email") as string;
  const redirectTo = (formData.get("redirect_to") as string) || "/";

  if (!email) return;

  try {
    const { createBrowserClient } = await import("@vector/db");
    const supabase = createBrowserClient();

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${baseUrl}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
      },
    });

    if (error) {
      console.error("Magic link error:", error);
      redirect(`/login?error=send_failed&redirect=${encodeURIComponent(redirectTo)}`);
    }

    redirect(`/login?sent=true&redirect=${encodeURIComponent(redirectTo)}`);
  } catch (err: unknown) {
    // Next.js redirect throws a special error — let it propagate
    if (
      err instanceof Error &&
      "digest" in err &&
      typeof (err as any).digest === "string" &&
      (err as any).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw err;
    }
    console.error("Login error:", err);
    redirect(`/login?error=unknown&redirect=${encodeURIComponent(redirectTo)}`);
  }
}
