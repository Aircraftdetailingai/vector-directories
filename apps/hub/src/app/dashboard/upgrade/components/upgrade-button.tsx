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
      <span className="inline-block rounded-full border border-coral-300 bg-coral-50 px-4 py-2 text-sm font-semibold text-coral-700 font-body">
        Current Plan
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-50 font-body"
    >
      {isPending ? "Redirecting..." : "Select Plan"}
    </button>
  );
}

export default UpgradeButton;
