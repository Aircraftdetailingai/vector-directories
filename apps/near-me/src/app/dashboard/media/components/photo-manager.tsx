"use client";

import { useState, useTransition } from "react";
import type { CompanyPhoto, Tier } from "@vector/types";
import { TIER_FEATURES } from "@vector/utils";
import { uploadPhoto, deletePhoto, type ActionResult } from "../actions";
import { UploadField } from "../../components/upload-field";

interface PhotoManagerProps {
  photos: CompanyPhoto[];
  companyId: string;
  tier: Tier;
}

export function PhotoManager({ photos, companyId, tier }: PhotoManagerProps) {
  const maxPhotos = TIER_FEATURES[tier].maxPhotos;
  const atLimit = maxPhotos !== Infinity && photos.length >= maxPhotos;

  const [result, setResult] = useState<ActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleUpload(formData: FormData) {
    startTransition(async () => {
      const res = await uploadPhoto(formData);
      setResult(res);
    });
  }

  function handleDelete(formData: FormData) {
    startTransition(async () => {
      const res = await deletePhoto(formData);
      setResult(res);
    });
  }

  // Basic tier (maxPhotos=0) — show upsell
  if (maxPhotos === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
          />
        </svg>
        <h3 className="mt-4 font-heading text-sm font-semibold text-gray-700">
          Photo Gallery
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Upgrade to Enhanced or above to showcase photos of your work.
        </p>
        <a
          href="/dashboard/upgrade"
          className="mt-4 inline-block rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-600"
        >
          View Plans
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with counter */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {photos.length} /{" "}
          {maxPhotos === Infinity ? "Unlimited" : maxPhotos} photos
        </p>
      </div>

      {/* Upload form */}
      {!atLimit && (
        <form
          action={handleUpload}
          className="rounded-xl border border-gray-200 bg-white p-6"
        >
          <input type="hidden" name="company_id" value={companyId} />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <UploadField
                name="photo"
                accept="image/*"
                label="Upload Photo"
                hint="JPG or PNG, max 5 MB"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="photo-alt"
                className="block text-sm font-medium text-gray-700"
              >
                Alt Text
              </label>
              <input
                id="photo-alt"
                name="alt_text"
                type="text"
                placeholder="Describe the photo"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="flex-shrink-0 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-600 disabled:opacity-50"
            >
              {isPending ? "Uploading..." : "Upload"}
            </button>
          </div>
          {result?.error && (
            <p className="mt-3 text-sm text-red-600" role="alert">
              {result.error}
            </p>
          )}
        </form>
      )}

      {atLimit && (
        <p className="text-sm text-amber-600">
          You&apos;ve reached your plan limit.{" "}
          <a
            href="/dashboard/upgrade"
            className="font-semibold underline"
          >
            Upgrade
          </a>{" "}
          to upload more photos.
        </p>
      )}

      {/* Photo grid */}
      {photos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-12 text-center">
          <p className="text-sm text-gray-500">
            No photos yet. Upload your first photo above.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.alt_text ?? "Company photo"}
                className="aspect-[4/3] w-full object-cover"
              />
              <form
                action={handleDelete}
                className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <input type="hidden" name="photo_id" value={photo.id} />
                <input type="hidden" name="company_id" value={companyId} />
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-lg bg-white/90 p-1.5 text-red-600 shadow-sm transition-colors hover:bg-red-50"
                  title="Delete photo"
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
              {photo.alt_text && (
                <p className="px-3 py-2 text-xs text-gray-500">
                  {photo.alt_text}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
