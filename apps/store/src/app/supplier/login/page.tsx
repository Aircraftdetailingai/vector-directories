"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { sendMagicLink } from "../../login/actions";

function SupplierLoginForm() {
  const searchParams = useSearchParams();
  const sent = searchParams.get("sent") === "true";
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");

  return (
    <div className="w-full max-w-md">
      <div className="rounded-lg border border-white/10 bg-[#1E293B] p-8 shadow-lg">
        <p className="text-center text-xs font-medium uppercase tracking-wider text-gray-400">
          Supplier Portal
        </p>
        <h1 className="mt-2 text-center text-2xl font-bold text-white">
          Supplier Sign In
        </h1>
        <p className="mt-2 text-center text-sm text-gray-400">
          Enter your email to access the supplier dashboard.
        </p>

        {sent && (
          <div className="mt-6 rounded-lg bg-green-900/30 p-4 text-center text-sm text-green-300">
            Check your email for a sign-in link. It may take a minute to
            arrive.
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-lg bg-red-900/30 p-4 text-center text-sm text-red-300">
            {error === "send_failed"
              ? "Failed to send sign-in link. Please try again."
              : "Something went wrong. Please try again."}
          </div>
        )}

        {!sent && (
          <form action={sendMagicLink} className="mt-8 space-y-6">
            <input type="hidden" name="redirect_to" value="/supplier" />

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="mt-1 block w-full rounded-lg border border-white/10 bg-[#0F172A] px-3 py-2.5 text-sm text-white placeholder-gray-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
            >
              Send Sign-In Link
            </button>
          </form>
        )}

        {sent && (
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full rounded-lg border border-white/10 px-4 py-3 text-sm font-semibold text-gray-300 transition-colors hover:bg-white/5"
          >
            Try a different email
          </button>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-gray-500">
        <Link href="/" className="underline hover:text-gray-300">
          Back to Store
        </Link>
        {" · "}
        <Link href="/login" className="underline hover:text-gray-300">
          Customer Sign In
        </Link>
      </p>
    </div>
  );
}

export default function SupplierLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F172A] px-4">
      <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
        <SupplierLoginForm />
      </Suspense>
    </div>
  );
}
