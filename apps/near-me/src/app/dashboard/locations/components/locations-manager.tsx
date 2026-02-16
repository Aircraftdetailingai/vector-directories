"use client";

import { useState, useTransition } from "react";
import type { Location, Tier } from "@vector/types";
import { TIER_FEATURES } from "@vector/utils";
import { formatAddress } from "@vector/utils";
import { addLocation, removeLocation, type ActionResult } from "../actions";

interface LocationsManagerProps {
  locations: Location[];
  companyId: string;
  tier: Tier;
}

export function LocationsManager({
  locations,
  companyId,
  tier,
}: LocationsManagerProps) {
  const maxLocations = TIER_FEATURES[tier].maxLocations;
  const atLimit =
    maxLocations !== Infinity && locations.length >= maxLocations;

  const [showForm, setShowForm] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAdd(formData: FormData) {
    startTransition(async () => {
      const res = await addLocation(formData);
      setResult(res);
      if (res.success) setShowForm(false);
    });
  }

  function handleRemove(formData: FormData) {
    startTransition(async () => {
      const res = await removeLocation(formData);
      setResult(res);
    });
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {locations.length} /{" "}
          {maxLocations === Infinity ? "Unlimited" : maxLocations} locations
        </p>
        <button
          type="button"
          disabled={atLimit}
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {showForm ? "Cancel" : "Add Location"}
        </button>
      </div>

      {atLimit && (
        <p className="text-sm text-amber-600">
          You&apos;ve reached your plan limit.{" "}
          <a
            href="/dashboard/upgrade"
            className="font-semibold underline"
          >
            Upgrade
          </a>{" "}
          to add more locations.
        </p>
      )}

      {/* Add form */}
      {showForm && (
        <form
          action={handleAdd}
          className="rounded-xl border border-gray-200 bg-white p-6"
        >
          <input type="hidden" name="company_id" value={companyId} />
          <h3 className="font-heading text-sm font-semibold text-sky-700">
            New Location
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="loc-name"
                className="block text-sm font-medium text-gray-700"
              >
                Location Name
              </label>
              <input
                id="loc-name"
                name="name"
                type="text"
                required
                placeholder="e.g., Main Hangar"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="loc-addr1"
                className="block text-sm font-medium text-gray-700"
              >
                Address Line 1
              </label>
              <input
                id="loc-addr1"
                name="address_line1"
                type="text"
                required
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="loc-addr2"
                className="block text-sm font-medium text-gray-700"
              >
                Address Line 2
              </label>
              <input
                id="loc-addr2"
                name="address_line2"
                type="text"
                placeholder="Suite, Hangar #, etc."
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label
                htmlFor="loc-city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <input
                id="loc-city"
                name="city"
                type="text"
                required
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="loc-state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <input
                  id="loc-state"
                  name="state"
                  type="text"
                  required
                  maxLength={2}
                  placeholder="FL"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div>
                <label
                  htmlFor="loc-zip"
                  className="block text-sm font-medium text-gray-700"
                >
                  ZIP
                </label>
                <input
                  id="loc-zip"
                  name="zip"
                  type="text"
                  required
                  maxLength={10}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="loc-phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <input
                id="loc-phone"
                name="phone"
                type="tel"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center gap-2 self-end">
              <input
                id="loc-hq"
                name="is_headquarters"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
              />
              <label
                htmlFor="loc-hq"
                className="text-sm font-medium text-gray-700"
              >
                Headquarters
              </label>
            </div>
          </div>

          {result?.error && (
            <p className="mt-3 text-sm text-red-600" role="alert">
              {result.error}
            </p>
          )}

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-600 disabled:opacity-50"
            >
              {isPending ? "Adding..." : "Add Location"}
            </button>
          </div>
        </form>
      )}

      {/* Location list */}
      {locations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-12 text-center">
          <p className="text-sm text-gray-500">
            No locations yet. Add your first location above.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="flex items-start justify-between rounded-xl border border-gray-200 bg-white p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-heading text-sm font-semibold text-gray-900">
                    {loc.name}
                  </p>
                  {loc.is_headquarters && (
                    <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
                      HQ
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {formatAddress({
                    address_line1: loc.address_line1,
                    city: loc.city,
                    state: loc.state,
                    zip: loc.zip,
                  })}
                </p>
                {loc.phone && (
                  <p className="mt-0.5 text-sm text-gray-400">{loc.phone}</p>
                )}
              </div>
              <form action={handleRemove}>
                <input type="hidden" name="location_id" value={loc.id} />
                <input type="hidden" name="company_id" value={companyId} />
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  title="Remove location"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
