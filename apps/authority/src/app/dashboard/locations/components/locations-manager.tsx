"use client";

import { useState } from "react";
import Link from "next/link";
import type { Location, Tier } from "@vector/types";
import { addLocation, removeLocation } from "../actions";
import SectionCard from "../../components/section-card";

export default function LocationsManager({
  initialLocations,
  tier,
  maxLocations,
}: {
  initialLocations: Location[];
  tier: Tier;
  maxLocations: number;
}) {
  const [locations, setLocations] = useState(initialLocations);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const atLimit =
    maxLocations !== Infinity && locations.length >= maxLocations;

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("companyId", locations[0]?.company_id ?? "seed-company-001");
    formData.set("tier", tier);

    const result = await addLocation(formData);

    if (result.success) {
      setSuccess("Location added successfully.");
      setShowAddForm(false);
      // Optimistic: add placeholder
      const newLoc: Location = {
        id: `temp-${Date.now()}`,
        company_id: locations[0]?.company_id ?? "seed-company-001",
        name: formData.get("name") as string,
        address_line1: formData.get("address") as string,
        address_line2: null,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        zip: formData.get("zip") as string,
        country: "US",
        lat: null,
        lng: null,
        phone: (formData.get("phone") as string) || null,
        is_headquarters: formData.get("is_headquarters") === "true",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setLocations((prev) => [...prev, newLoc]);
    } else {
      setError(result.error ?? "Failed to add location.");
    }
    setLoading(false);
  }

  async function handleRemove(locationId: string) {
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.set("locationId", locationId);

    const result = await removeLocation(formData);

    if (result.success) {
      setLocations((prev) => prev.filter((l) => l.id !== locationId));
      setSuccess("Location removed.");
    } else {
      setError(result.error ?? "Failed to remove location.");
    }
  }

  return (
    <div className="space-y-4">
      {success && (
        <div className="rounded-lg border border-gold-200 bg-gold-50 px-4 py-3 text-sm font-medium text-gold-800">
          {success}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Location Cards */}
      {locations.map((location) => (
        <SectionCard key={location.id}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-base font-semibold text-navy-900">
                  {location.name}
                </h3>
                {location.is_headquarters && (
                  <span className="inline-flex items-center rounded-full bg-gold-100 px-2 py-0.5 text-xs font-medium text-gold-800">
                    HQ
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-navy-600 font-body">
                {location.address_line1}
                {location.address_line2 && `, ${location.address_line2}`}
              </p>
              <p className="text-sm text-navy-600 font-body">
                {location.city}, {location.state} {location.zip}
              </p>
              {location.phone && (
                <p className="mt-1 text-sm text-navy-500 font-body">
                  {location.phone}
                </p>
              )}
            </div>
            <button
              onClick={() => handleRemove(location.id)}
              className="shrink-0 rounded-lg border border-navy-200 px-3 py-1.5 text-xs font-medium text-navy-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              Remove
            </button>
          </div>
        </SectionCard>
      ))}

      {/* Empty State */}
      {locations.length === 0 && (
        <SectionCard>
          <div className="py-8 text-center">
            <svg
              className="mx-auto h-10 w-10 text-navy-300 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            <p className="text-sm text-navy-500 font-body">
              No locations added yet. Add your first service location.
            </p>
          </div>
        </SectionCard>
      )}

      {/* Add Location */}
      {atLimit ? (
        <div className="rounded-xl border border-gold-200 bg-gold-50 p-5 text-center">
          <p className="text-sm text-navy-700 font-body mb-3">
            You have reached the maximum of {maxLocations} locations on your{" "}
            <span className="font-semibold">{tier}</span> plan.
          </p>
          <Link
            href="/dashboard/upgrade"
            className="inline-flex items-center rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-900 hover:bg-gold-600 transition-colors"
          >
            Upgrade for More Locations
          </Link>
        </div>
      ) : showAddForm ? (
        <SectionCard title="Add New Location">
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="loc-name" className="block text-sm font-medium text-navy-700 mb-1.5">
                  Location Name
                </label>
                <input
                  id="loc-name"
                  type="text"
                  name="name"
                  required
                  placeholder="e.g., Main Hangar — Teterboro"
                  className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-navy-900 placeholder:text-navy-400 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-200 font-body"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="loc-address" className="block text-sm font-medium text-navy-700 mb-1.5">
                  Street Address
                </label>
                <input
                  id="loc-address"
                  type="text"
                  name="address"
                  required
                  placeholder="100 Industrial Ave"
                  className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-navy-900 placeholder:text-navy-400 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-200 font-body"
                />
              </div>
              <div>
                <label htmlFor="loc-city" className="block text-sm font-medium text-navy-700 mb-1.5">
                  City
                </label>
                <input
                  id="loc-city"
                  type="text"
                  name="city"
                  required
                  className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-navy-900 placeholder:text-navy-400 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-200 font-body"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="loc-state" className="block text-sm font-medium text-navy-700 mb-1.5">
                    State
                  </label>
                  <input
                    id="loc-state"
                    type="text"
                    name="state"
                    required
                    maxLength={2}
                    placeholder="NJ"
                    className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-navy-900 placeholder:text-navy-400 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-200 font-body"
                  />
                </div>
                <div>
                  <label htmlFor="loc-zip" className="block text-sm font-medium text-navy-700 mb-1.5">
                    ZIP
                  </label>
                  <input
                    id="loc-zip"
                    type="text"
                    name="zip"
                    required
                    maxLength={10}
                    placeholder="07608"
                    className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-navy-900 placeholder:text-navy-400 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-200 font-body"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="loc-phone" className="block text-sm font-medium text-navy-700 mb-1.5">
                  Phone (optional)
                </label>
                <input
                  id="loc-phone"
                  type="tel"
                  name="phone"
                  placeholder="(555) 000-0000"
                  className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-navy-900 placeholder:text-navy-400 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-200 font-body"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 text-sm text-navy-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_headquarters"
                    value="true"
                    className="h-4 w-4 rounded border-navy-300 text-navy-900 focus:ring-navy-200"
                  />
                  This is our headquarters
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-navy-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 transition-colors disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Location"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-lg border border-navy-200 px-6 py-2.5 text-sm font-medium text-navy-600 hover:bg-navy-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </SectionCard>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full rounded-xl border-2 border-dashed border-navy-200 py-4 text-sm font-medium text-navy-500 hover:border-navy-400 hover:text-navy-700 transition-colors"
        >
          + Add Location ({locations.length}/
          {maxLocations === Infinity ? "\u221E" : maxLocations})
        </button>
      )}
    </div>
  );
}
