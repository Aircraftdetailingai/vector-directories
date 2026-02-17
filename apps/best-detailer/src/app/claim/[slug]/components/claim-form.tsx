"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  sendVerificationCode,
  verifyCodeAndClaim,
  type ClaimResult,
} from "../actions";

interface ClaimFormProps {
  companyId: string;
  companyName: string;
}

export default function ClaimForm({ companyId, companyName }: ClaimFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "verify" | "done">("email");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<ClaimResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSendCode(formData: FormData) {
    startTransition(async () => {
      const res = await sendVerificationCode(formData);
      setResult(res);
      if (res.success && res.step === "verify") {
        setEmail(
          (formData.get("email") as string)?.trim().toLowerCase() ?? "",
        );
        setStep("verify");
      }
    });
  }

  function handleVerify(formData: FormData) {
    startTransition(async () => {
      const res = await verifyCodeAndClaim(formData);
      setResult(res);
      if (res.success && res.step === "done") {
        setStep("done");
        router.push("/dashboard");
      }
    });
  }

  if (step === "done") {
    return (
      <div className="border border-gold-200 bg-gold-50 p-8 text-center rounded-sm">
        <svg
          className="mx-auto h-12 w-12 text-gold-500"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clipRule="evenodd"
          />
        </svg>
        <h3 className="mt-4 font-heading text-lg font-semibold text-gold-800">
          Listing Claimed!
        </h3>
        <p className="mt-2 text-sm text-gold-600">
          You are now the verified owner of {companyName}. Redirecting to your
          dashboard...
        </p>
      </div>
    );
  }

  if (step === "verify") {
    return (
      <div className="border border-ivory-200 bg-white p-6 sm:p-8 rounded-sm">
        <h2 className="font-heading text-lg font-semibold text-noir-900">
          Enter Verification Code
        </h2>
        <p className="mt-2 text-sm text-ivory-500 font-body">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-noir-900">{email}</span>
        </p>

        <form action={handleVerify} className="mt-6 space-y-4">
          <input type="hidden" name="company_id" value={companyId} />
          <input type="hidden" name="email" value={email} />

          <div>
            <label htmlFor="claim-code" className="sr-only">
              Verification Code
            </label>
            <input
              id="claim-code"
              name="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              required
              placeholder="000000"
              autoComplete="one-time-code"
              className="w-full border border-ivory-200 bg-white px-4 py-3 text-center font-heading text-2xl font-bold tracking-[0.3em] text-noir-900 placeholder:text-ivory-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500 rounded-sm"
            />
          </div>

          {result?.error && (
            <p className="text-sm text-red-600" role="alert">
              {result.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-noir-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-noir-800 disabled:cursor-not-allowed disabled:opacity-50 rounded-sm"
          >
            {isPending ? "Verifying..." : "Verify & Claim Listing"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setStep("email");
            setResult(null);
          }}
          className="mt-4 text-sm text-ivory-500 transition-colors hover:text-gold-500"
        >
          Use a different email
        </button>
      </div>
    );
  }

  // Step: email
  return (
    <div className="border border-ivory-200 bg-white p-6 sm:p-8 rounded-sm">
      <h2 className="font-heading text-lg font-semibold text-noir-900">
        Verify Your Identity
      </h2>
      <p className="mt-2 text-sm text-ivory-500 font-body">
        Enter the business email associated with{" "}
        <span className="font-medium text-noir-900">{companyName}</span>.
        We&apos;ll send you a 6-digit verification code.
      </p>

      <form action={handleSendCode} className="mt-6 space-y-4">
        <input type="hidden" name="company_id" value={companyId} />
        <input type="hidden" name="company_name" value={companyName} />

        <div>
          <label htmlFor="claim-email" className="sr-only">
            Business Email
          </label>
          <input
            id="claim-email"
            name="email"
            type="email"
            required
            placeholder="you@yourcompany.com"
            className="w-full border border-ivory-200 bg-white px-4 py-3 text-sm text-noir-900 placeholder:text-ivory-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500 rounded-sm"
          />
        </div>

        {result?.error && (
          <p className="text-sm text-red-600" role="alert">
            {result.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-noir-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-noir-800 disabled:cursor-not-allowed disabled:opacity-50 rounded-sm"
        >
          {isPending ? "Sending..." : "Send Verification Code"}
        </button>
      </form>
    </div>
  );
}
