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
      <span className="inline-block rounded-lg border border-forest-300 bg-forest-50 px-4 py-2 text-sm font-semibold text-forest-700">
        Current Plan
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="rounded-lg bg-forest-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest-700 disabled:opacity-50"
    >
      {isPending ? "Redirecting..." : "Select Plan"}
    </button>
  );
}
