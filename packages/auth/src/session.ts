import { createServerClient } from "@vector/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getCookieMethods() {
  const cookieStore = await cookies();
  return {
    getAll() {
      return cookieStore.getAll();
    },
    setAll(
      cookiesToSet: { name: string; value: string; options?: object }[],
    ) {
      cookiesToSet.forEach(({ name, value, options }) =>
        cookieStore.set(name, value, options ?? {}),
      );
    },
  };
}

export async function getSession() {
  const cookieMethods = await getCookieMethods();
  const supabase = createServerClient(cookieMethods);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function getUser() {
  const cookieMethods = await getCookieMethods();
  const supabase = createServerClient(cookieMethods);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireAuth() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
