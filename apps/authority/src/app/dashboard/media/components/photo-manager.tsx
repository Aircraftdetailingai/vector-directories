"use client";

import { useState } from "react";
import Link from "next/link";
import type { CompanyPhoto, Tier } from "@vector/types";
import { uploadPhoto, deletePhoto } from "../actions";
import SectionCard from "../../components/section-card";

export default function PhotoManager({
  initialPhotos,
  tier,
  maxPhotos,
  companyId,
}: {
  initialPhotos: CompanyPhoto[];
  tier: Tier;
  maxPhotos: number;
  companyId: string;
}) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const canUpload = maxPhotos > 0;
  const atLimit = maxPhotos !== Infinity && photos.length >= maxPhotos;

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("companyId", companyId);
    formData.set("tier", tier);

    const result = await uploadPhoto(formData);

    if (result.success) {
      setSuccess("Photo uploaded successfully.");
      setShowUploadForm(false);
      // Optimistic: add placeholder
      const altText = formData.get("alt_text") as string;
      const newPhoto: CompanyPhoto = {
        id: `temp-${Date.now()}`,
        company_id: companyId,
        url: "https://placehold.co/600x400/1E3A5F/D4A843?text=Uploading...",
        alt_text: altText || null,
        sort_order: photos.length,
        created_at: new Date().toISOString(),
      };
      setPhotos((prev) => [...prev, newPhoto]);
    } else {
      setError(result.error ?? "Failed to upload photo.");
    }
    setLoading(false);
  }

  async function handleDelete(photoId: string) {
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.set("photoId", photoId);

    const result = await deletePhoto(formData);

    if (result.success) {
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      setSuccess("Photo deleted.");
    } else {
      setError(result.error ?? "Failed to delete photo.");
    }
  }

  // Basic plan — upsell
  if (!canUpload) {
    return (
      <SectionCard>
        <div className="py-10 text-center">
          <svg
            className="mx-auto h-12 w-12 text-navy-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M2.25 18a2.25 2.25 0 0 1 2.25-2.25h15A2.25 2.25 0 0 1 21.75 18v.75a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V18ZM6.75 12a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
          </svg>
          <h3 className="font-heading text-lg font-semibold text-navy-900 mb-2">
            Photo Gallery Unavailable
          </h3>
          <p className="text-sm text-navy-500 font-body mb-5 max-w-md mx-auto">
            Photo uploads are not included in the Basic plan. Upgrade to
            Enhanced or higher to showcase your work with a photo gallery.
          </p>
          <Link
            href="/dashboard/upgrade"
            className="inline-flex items-center rounded-lg bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-900 hover:bg-gold-600 transition-colors"
          >
            Upgrade to Unlock Photos
          </Link>
        </div>
      </SectionCard>
    );
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

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative overflow-hidden rounded-xl border border-navy-100 bg-white shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.alt_text ?? "Company photo"}
                className="aspect-[3/2] w-full object-cover"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-navy-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex w-full items-center justify-between p-3">
                  <span className="text-xs text-white font-body truncate">
                    {photo.alt_text ?? "Photo"}
                  </span>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="shrink-0 rounded bg-white/20 px-2 py-1 text-xs text-white hover:bg-red-500 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {photos.length === 0 && (
        <SectionCard>
          <div className="py-8 text-center">
            <svg
              className="mx-auto h-10 w-10 text-navy-300 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M2.25 18a2.25 2.25 0 0 1 2.25-2.25h15A2.25 2.25 0 0 1 21.75 18v.75a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V18ZM6.75 12a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
            </svg>
            <p className="text-sm text-navy-500 font-body">
              No photos uploaded yet. Add photos to showcase your work.
            </p>
          </div>
        </SectionCard>
      )}

      {/* Upload Section */}
      {atLimit ? (
        <div className="rounded-xl border border-gold-200 bg-gold-50 p-5 text-center">
          <p className="text-sm text-navy-700 font-body mb-3">
            You have reached the maximum of {maxPhotos} photos on your{" "}
            <span className="font-semibold">{tier}</span> plan.
          </p>
          <Link
            href="/dashboard/upgrade"
            className="inline-flex items-center rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-900 hover:bg-gold-600 transition-colors"
          >
            Upgrade for More Photos
          </Link>
        </div>
      ) : showUploadForm ? (
        <SectionCard title="Upload Photo">
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label htmlFor="photo-file" className="block text-sm font-medium text-navy-700 mb-1.5">
                Photo
              </label>
              <input
                id="photo-file"
                type="file"
                name="photo"
                accept="image/png,image/jpeg,image/webp"
                required
                className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-navy-900 font-body file:mr-4 file:rounded file:border-0 file:bg-navy-100 file:px-3 file:py-1 file:text-sm file:font-medium file:text-navy-700"
              />
            </div>
            <div>
              <label htmlFor="photo-alt" className="block text-sm font-medium text-navy-700 mb-1.5">
                Alt Text (optional)
              </label>
              <input
                id="photo-alt"
                type="text"
                name="alt_text"
                placeholder="Describe this photo"
                className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-navy-900 placeholder:text-navy-400 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-200 font-body"
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-navy-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 transition-colors disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Upload Photo"}
              </button>
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="rounded-lg border border-navy-200 px-6 py-2.5 text-sm font-medium text-navy-600 hover:bg-navy-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </SectionCard>
      ) : (
        <button
          onClick={() => setShowUploadForm(true)}
          className="w-full rounded-xl border-2 border-dashed border-navy-200 py-4 text-sm font-medium text-navy-500 hover:border-navy-400 hover:text-navy-700 transition-colors"
        >
          + Upload Photo ({photos.length}/
          {maxPhotos === Infinity ? "\u221E" : maxPhotos})
        </button>
      )}
    </div>
  );
}
