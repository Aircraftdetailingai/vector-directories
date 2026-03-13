"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { registerSupplier } from "./actions";

function SupplierRegisterForm() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "true";
  const error = searchParams.get("error");

  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");

  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-white/10 bg-[#1E293B] p-8 shadow-lg">
          <p className="text-center text-xs font-medium uppercase tracking-wider text-gray-400">
            Supplier Portal
          </p>
          <h1 className="mt-2 text-center text-2xl font-bold text-white">
            Registration Submitted
          </h1>
          <p className="mt-4 text-center text-sm text-gray-400">
            Thank you for registering as a supplier. We will review your
            application and notify you by email once approved. This typically
            takes 1-2 business days.
          </p>
          <p className="mt-4 text-center text-sm text-gray-400">
            Please check your email for a confirmation link to verify your
            account.
          </p>
          <Link
            href="/supplier/login"
            className="mt-6 block w-full rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-500"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-lg border border-white/10 bg-[#1E293B] p-8 shadow-lg">
        <p className="text-center text-xs font-medium uppercase tracking-wider text-gray-400">
          Supplier Portal
        </p>
        <h1 className="mt-2 text-center text-2xl font-bold text-white">
          Become a Supplier
        </h1>
        <p className="mt-2 text-center text-sm text-gray-400">
          Register to sell your products on Aircraft Detailing 101.
        </p>

        {error && (
          <div className="mt-6 rounded-lg bg-red-900/30 p-4 text-center text-sm text-red-300">
            {decodeURIComponent(error)}
          </div>
        )}

        <form action={registerSupplier} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="company_name"
              className="block text-sm font-medium text-gray-300"
            >
              Company Name
            </label>
            <input
              id="company_name"
              name="company_name"
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Detailing Supplies"
              className="mt-1 block w-full rounded-lg border border-white/10 bg-[#0F172A] px-3 py-2.5 text-sm text-white placeholder-gray-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="contact_name"
              className="block text-sm font-medium text-gray-300"
            >
              Contact Name
            </label>
            <input
              id="contact_name"
              name="contact_name"
              type="text"
              required
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="John Smith"
              className="mt-1 block w-full rounded-lg border border-white/10 bg-[#0F172A] px-3 py-2.5 text-sm text-white placeholder-gray-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

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

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="mt-1 block w-full rounded-lg border border-white/10 bg-[#0F172A] px-3 py-2.5 text-sm text-white placeholder-gray-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-300"
            >
              Phone <span className="text-gray-500">(optional)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="mt-1 block w-full rounded-lg border border-white/10 bg-[#0F172A] px-3 py-2.5 text-sm text-white placeholder-gray-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="website"
              className="block text-sm font-medium text-gray-300"
            >
              Website <span className="text-gray-500">(optional)</span>
            </label>
            <input
              id="website"
              name="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourcompany.com"
              className="mt-1 block w-full rounded-lg border border-white/10 bg-[#0F172A] px-3 py-2.5 text-sm text-white placeholder-gray-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
          >
            Register as Supplier
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/supplier/login"
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            Sign in
          </Link>
        </p>
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

export default function VendorRegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F172A] px-4 py-8">
      <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
        <SupplierRegisterForm />
      </Suspense>
    </div>
  );
}
