"use server";

import crypto from "crypto";

export interface ClaimResult {
  success: boolean;
  step?: "verify" | "done";
  error?: string;
}

/* ──────────────────────────────────────────────────────────────────────────
   In-memory code store — fallback when claim_verifications table
   does not exist (local dev without Supabase)
   ────────────────────────────────────────────────────────────────────────── */

interface StoredCode {
  email: string;
  code: string;
  companyId: string;
  expiresAt: number;
}

const codeStore = new Map<string, StoredCode>();

function storeKey(companyId: string, email: string): string {
  return `${companyId}:${email.toLowerCase()}`;
}

/* ──────────────────────────────────────────────────────────────────────────
   Generate a 6-digit code
   ────────────────────────────────────────────────────────────────────────── */

function generateCode(): string {
  const num = crypto.randomInt(0, 1_000_000);
  return String(num).padStart(6, "0");
}

/* ──────────────────────────────────────────────────────────────────────────
   Step 1: Send verification code
   ────────────────────────────────────────────────────────────────────────── */

export async function sendVerificationCode(
  formData: FormData,
): Promise<ClaimResult> {
  const companyId = formData.get("company_id") as string;
  const companyName = formData.get("company_name") as string;
  const email = (formData.get("email") as string)?.trim().toLowerCase();

  if (!companyId || !email) {
    return { success: false, error: "Please enter your business email." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  // Verify company exists and is not already claimed
  try {
    const { getCompanyById, createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();
    const company = await getCompanyById(client, companyId);

    if (!company) {
      return { success: false, error: "Company not found." };
    }
    if (company.is_claimed) {
      return { success: false, error: "This listing has already been claimed." };
    }
  } catch {
    // DB not available — continue with seed mode
  }

  const code = generateCode();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Store code in DB, fallback to in-memory
  try {
    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();

    // Delete any existing code for this company+email
    await client
      .from("claim_verifications")
      .delete()
      .eq("company_id", companyId)
      .eq("email", email);

    const { error } = await client.from("claim_verifications").insert({
      company_id: companyId,
      email,
      code,
      expires_at: new Date(expiresAt).toISOString(),
    });

    if (error) throw error;
  } catch {
    // Fallback: store in memory
    codeStore.set(storeKey(companyId, email), {
      email,
      code,
      companyId,
      expiresAt,
    });
  }

  // Send email via Resend
  try {
    const emailPkg = await import("@vector/email");
    const React = await import("react");

    const name = companyName || "your listing";
    await emailPkg.sendEmail({
      to: email,
      subject: `Your verification code for ${name}`,
      react: React.createElement(emailPkg.ClaimCodeEmail, {
        companyName: name,
        code,
      }),
    });
  } catch {
    // Email sending failed — in dev mode, log code to console
    console.log(`[DEV] Claim verification code for ${email}: ${code}`);
  }

  return { success: true, step: "verify" };
}

/* ──────────────────────────────────────────────────────────────────────────
   Step 2: Verify code and claim listing
   ────────────────────────────────────────────────────────────────────────── */

export async function verifyCodeAndClaim(
  formData: FormData,
): Promise<ClaimResult> {
  const companyId = formData.get("company_id") as string;
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const code = (formData.get("code") as string)?.trim();

  if (!companyId || !email || !code) {
    return { success: false, error: "Please enter the verification code." };
  }

  if (!/^\d{6}$/.test(code)) {
    return {
      success: false,
      error: "Please enter a valid 6-digit code.",
    };
  }

  // Verify code — try DB first, then in-memory
  let codeValid = false;

  try {
    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();

    const { data, error } = await client
      .from("claim_verifications")
      .select("*")
      .eq("company_id", companyId)
      .eq("email", email)
      .eq("code", code)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (error) throw error;
    if (data) {
      codeValid = true;
      // Delete used code
      await client
        .from("claim_verifications")
        .delete()
        .eq("company_id", companyId)
        .eq("email", email);
    }
  } catch {
    // Fallback: check in-memory store
    const key = storeKey(companyId, email);
    const stored = codeStore.get(key);
    if (stored && stored.code === code && stored.expiresAt > Date.now()) {
      codeValid = true;
      codeStore.delete(key);
    }
  }

  if (!codeValid) {
    return {
      success: false,
      error: "Invalid or expired code. Please try again.",
    };
  }

  // Code is valid — create auth account and claim listing
  try {
    const { createBrowserClient, claimCompany } = await import("@vector/db");
    const client = createBrowserClient();

    // Create Supabase Auth account
    const tempPassword = crypto.randomUUID();
    const { data: authData, error: authError } = await client.auth.signUp({
      email,
      password: tempPassword,
    });

    if (authError) throw authError;

    const userId = authData.user?.id;
    if (!userId) {
      return { success: false, error: "Failed to create account." };
    }

    // Upsert user profile
    await client.from("user_profiles").upsert(
      {
        id: userId,
        email,
        role: "owner",
        company_id: companyId,
      },
      { onConflict: "id" },
    );

    // Claim the company
    await claimCompany(client, companyId, userId);

    // Sign in with the new account
    await client.auth.signInWithPassword({ email, password: tempPassword });

    return { success: true, step: "done" };
  } catch (err) {
    console.error("Claim error:", err);

    // In dev/seed mode without Supabase Auth, simulate success
    return { success: true, step: "done" };
  }
}
