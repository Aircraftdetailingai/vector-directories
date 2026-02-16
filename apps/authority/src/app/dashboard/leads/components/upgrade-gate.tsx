import Link from "next/link";
import type { Tier } from "@vector/types";

export default function UpgradeGate({
  currentTier,
}: {
  currentTier: Tier;
}) {
  const tierLabel =
    currentTier === "bundle_all"
      ? "Bundle All"
      : currentTier.charAt(0).toUpperCase() + currentTier.slice(1);

  return (
    <div className="rounded-xl border border-navy-100 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gold-100">
        <svg
          className="h-8 w-8 text-gold-600"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
      </div>

      <h3 className="font-heading text-2xl font-bold text-navy-900 mb-2">
        Unlock Lead Capture
      </h3>
      <p className="text-navy-600 font-body max-w-md mx-auto mb-3">
        Your current <span className="font-semibold">{tierLabel}</span> plan
        does not include lead capture. Upgrade to Premium or higher to receive
        inquiries directly from potential customers who find you on Aircraft
        Detailing Authority.
      </p>

      <ul className="mx-auto mb-6 max-w-sm space-y-2 text-left text-sm text-navy-600 font-body">
        {[
          "Receive customer inquiries via your listing",
          "Get email notifications for new leads",
          "Track and manage all leads in your dashboard",
          "Reply directly from your dashboard",
        ].map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-gold-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href="/dashboard/upgrade"
        className="inline-flex items-center rounded-lg bg-gold-500 px-8 py-3 text-sm font-bold text-navy-900 hover:bg-gold-600 transition-colors shadow-sm"
      >
        Upgrade Your Plan
      </Link>
    </div>
  );
}
