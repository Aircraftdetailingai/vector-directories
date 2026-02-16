"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendVerificationCode, verifyCodeAndClaim } from "../actions";

type Step = "email" | "verify" | "done";

export default function ClaimForm({
  companyId,
  companySlug,
}: {
  companyId: string;
  companySlug: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Suppress unused variable warning — slug kept for potential future use
  void companySlug;

  async function handleSendCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.set("email", email);

    const result = await sendVerificationCode(formData);

    if (result.success) {
      setStep("verify");
    } else {
      setError(result.error ?? "Something went wrong.");
    }
    setLoading(false);
  }

  async function handleVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.set("email", email);
    formData.set("code", code);
    formData.set("companyId", companyId);

    const result = await verifyCodeAndClaim(formData);

    if (result.success) {
      setStep("done");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } else {
      setError(result.error ?? "Verification failed.");
    }
    setLoading(false);
  }

  if (step === "done") {
    return (
      <div className="rounded-xl border border-gold-200 bg-gold-50 p-8 text-center">
        <svg
          className="mx-auto h-14 w-14 text-gold-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        <h3 className="font-heading text-2xl font-bold text-navy-900 mb-2">
          Listing Claimed Successfully
        </h3>
        <p className="text-navy-600 font-body">
          Redirecting you to your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-navy-100 bg-white p-8 shadow-sm">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
            step === "email"
              ? "bg-navy-900 text-white"
              : "bg-gold-500 text-navy-900"
          }`}
        >
          {step === "verify" ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          ) : (
            "1"
          )}
        </div>
        <div className="h-px w-8 bg-navy-200" />
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
            step === "verify"
              ? "bg-navy-900 text-white"
              : "bg-navy-100 text-navy-400"
          }`}
        >
          2
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {step === "email" && (
        <form onSubmit={handleSendCode}>
          <h3 className="font-heading text-xl font-semibold text-navy-900 mb-2">
            Verify Your Email
          </h3>
          <p className="text-sm text-navy-600 font-body mb-6">
            Enter the email address associated with your business. We will send
            you a verification code.
          </p>
          <div className="mb-6">
            <label
              htmlFor="claim-email"
              className="block text-sm font-medium text-navy-700 mb-1.5"
            >
              Business Email
            </label>
            <input
              id="claim-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-navy-900 placeholder:text-navy-400 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-200 font-body"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-navy-900 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Verification Code"}
          </button>
        </form>
      )}

      {step === "verify" && (
        <form onSubmit={handleVerify}>
          <h3 className="font-heading text-xl font-semibold text-navy-900 mb-2">
            Enter Verification Code
          </h3>
          <p className="text-sm text-navy-600 font-body mb-6">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-navy-800">{email}</span>. Enter it
            below to verify your ownership.
          </p>
          <div className="mb-6">
            <label
              htmlFor="claim-code"
              className="block text-sm font-medium text-navy-700 mb-1.5"
            >
              Verification Code
            </label>
            <input
              id="claim-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              required
              className="w-full rounded-lg border border-navy-200 px-4 py-3 text-center text-2xl tracking-[0.3em] text-navy-900 placeholder:text-navy-300 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-200 font-body"
            />
          </div>
          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full rounded-lg bg-navy-900 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify & Claim"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setCode("");
              setError("");
            }}
            className="mt-3 w-full text-center text-sm text-navy-500 hover:text-navy-700 transition-colors"
          >
            Use a different email
          </button>
        </form>
      )}
    </div>
  );
}
