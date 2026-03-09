"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { sendMagicLink } from "./actions";

function LoginForm() {
  const searchParams = useSearchParams();
  const sent = searchParams.get("sent") === "true";
  const error = searchParams.get("error");
  const redirectTo = searchParams.get("redirect") ?? "/";

  const [email, setEmail] = useState("");

  return (
    <div className="w-full max-w-md">
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-center text-2xl font-bold text-slate-900">
          Sign In
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email to receive a magic sign-in link.
        </p>

        {sent && (
          <div className="mt-6 rounded-lg bg-green-50 p-4 text-center text-sm text-green-700">
            Check your email for a sign-in link. It may take a minute to
            arrive.
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-center text-sm text-red-700">
            {error === "send_failed"
              ? "Failed to send sign-in link. Please try again."
              : "Something went wrong. Please try again."}
          </div>
        )}

        {!sent && (
          <form action={sendMagicLink} className="mt-8 space-y-6">
            <input type="hidden" name="redirect_to" value={redirectTo} />

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
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
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Send Sign-In Link
            </button>
          </form>
        )}

        {sent && (
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Try a different email
          </button>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-gray-500">
        By signing in, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-gray-700">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-gray-700">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-16">
        <Suspense fallback={<div className="text-gray-400">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
