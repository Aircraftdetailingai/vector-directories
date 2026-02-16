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
      <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-green-400"
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
        <h3 className="mt-4 font-heading text-lg font-semibold text-green-400">
          Profile Claimed!
        </h3>
        <p className="mt-2 text-sm text-green-400/80">
          You are now the verified owner of {companyName}. Redirecting to your
          dashboard...
        </p>
      </div>
    );
  }

  if (step === "verify") {
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 sm:p-8">
        <h2 className="font-heading text-lg font-semibold text-white">
          Enter Verification Code
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-slate-300">{email}</span>
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
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-center font-heading text-2xl font-bold tracking-[0.3em] text-white placeholder:text-slate-500 focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500"
            />
          </div>

          {result?.error && (
            <p className="text-sm text-red-400" role="alert">
              {result.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-electric-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-electric-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Verifying..." : "Verify & Claim Profile"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setStep("email");
            setResult(null);
          }}
          className="mt-4 text-sm text-slate-500 transition-colors hover:text-electric-400"
        >
          Use a different email
        </button>
      </div>
    );
  }

  // Step: email
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 sm:p-8">
      <h2 className="font-heading text-lg font-semibold text-white">
        Verify Your Identity
      </h2>
      <p className="mt-2 text-sm text-slate-400">
        Enter the business email associated with{" "}
        <span className="font-medium text-slate-300">{companyName}</span>.
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
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500"
          />
        </div>

        {result?.error && (
          <p className="text-sm text-red-400" role="alert">
            {result.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-electric-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-electric-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Sending..." : "Send Verification Code"}
        </button>
      </form>
    </div>
  );
}

export { ClaimForm };
