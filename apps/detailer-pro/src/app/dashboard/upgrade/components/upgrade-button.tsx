"use client";

import { useTransition } from "react";
import { startCheckout } from "../actions";

interface UpgradeButtonProps {
  tier: "enhanced" | "premium" | "featured" | "bundle_all";
  companyId: string;
  isCurrent: boolean;
}

export default function UpgradeButton({
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
      <span className="inline-block rounded-lg border border-electric-500/30 bg-electric-500/10 px-4 py-2 text-sm font-semibold text-electric-400">
        Current Plan
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="rounded-lg bg-electric-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-electric-600 disabled:opacity-50"
    >
      {isPending ? "Redirecting..." : "Select Plan"}
    </button>
  );
}
