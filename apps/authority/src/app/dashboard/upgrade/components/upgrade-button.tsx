"use client";

import { useState } from "react";
import type { Tier } from "@vector/types";
import { startCheckout } from "../actions";

export default function UpgradeButton({
  tier,
  isCurrent,
}: {
  tier: Tier;
  isCurrent: boolean;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const formData = new FormData();
    formData.set("tier", tier);
    await startCheckout(formData);
    setLoading(false);
  }

  if (isCurrent) {
    return (
      <button
        disabled
        className="w-full rounded-lg border-2 border-gold-400 px-4 py-2.5 text-sm font-semibold text-gold-700 cursor-default"
      >
        Current Plan
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Processing..." : "Select Plan"}
    </button>
  );
}
