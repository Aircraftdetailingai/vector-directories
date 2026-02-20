"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateTracking } from "../actions";

interface TrackingFormProps {
  orderId: string;
  currentTrackingNumber: string;
  currentTrackingUrl: string;
}

export function TrackingForm({
  orderId,
  currentTrackingNumber,
  currentTrackingUrl,
}: TrackingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState(currentTrackingNumber);
  const [trackingUrl, setTrackingUrl] = useState(currentTrackingUrl);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!trackingNumber.trim()) {
      setError("Tracking number is required.");
      return;
    }

    const formData = new FormData();
    formData.set("order_id", orderId);
    formData.set("tracking_number", trackingNumber.trim());
    formData.set("tracking_url", trackingUrl.trim());

    startTransition(async () => {
      const result = await updateTracking(formData);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error ?? "Failed to update tracking.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <p className="text-xs font-medium text-red-600">{error}</p>
      )}
      <div>
        <label
          htmlFor="tracking_number"
          className="mb-1 block text-xs font-medium text-gray-500"
        >
          Tracking Number *
        </label>
        <input
          id="tracking_number"
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#0F172A] shadow-sm placeholder:text-gray-400 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
          placeholder="e.g. 1Z999AA10123456784"
          required
        />
      </div>
      <div>
        <label
          htmlFor="tracking_url"
          className="mb-1 block text-xs font-medium text-gray-500"
        >
          Tracking URL
        </label>
        <input
          id="tracking_url"
          type="url"
          value={trackingUrl}
          onChange={(e) => setTrackingUrl(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#0F172A] shadow-sm placeholder:text-gray-400 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
          placeholder="https://..."
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center rounded-lg bg-[#F97316] px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Add Tracking"}
      </button>
    </form>
  );
}
