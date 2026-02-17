"use client";

import { useTransition } from "react";
import { startCheckout } from "../actions";

interface UpgradeButtonProps {
  tier: "enhanced" | "premium" | "featured" | "bundle_all";
  companyId: string;
  isCurrent: boolean;
}

export function UpgradeButton({
  tier,
  companyId,
  isCurrent,
}: UpgradeButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const formData = new FormData();
    formData.set("tier", tier);
    formData.set("company_id", companyId);
    startTransition(async () => {
      await startCheckout(formData);
    });
  }

  if (isCurrent) {
    return (
      <span className="inline-block border border-gold-500 bg-gold-50 px-4 py-2 text-sm font-semibold text-gold-700 rounded-sm">
        Current Plan
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="bg-gold-500 px-4 py-2 text-sm font-semibold text-noir-900 transition-colors hover:bg-gold-600 disabled:opacity-50 rounded-sm"
    >
      {isPending ? "Redirecting..." : "Select Plan"}
    </button>
  );
}
