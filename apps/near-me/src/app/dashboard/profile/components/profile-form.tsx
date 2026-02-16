"use client";

import { useState, useTransition } from "react";
import { updateCompanyProfile, type ActionResult } from "../actions";
import { UploadField } from "../../components/upload-field";
import type { Company } from "@vector/types";

interface SocialLinks {
  facebook_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
}

interface ProfileFormProps {
  company: Company;
  socialLinks: SocialLinks;
}

export function ProfileForm({ company, socialLinks }: ProfileFormProps) {
  const [result, setResult] = useState<ActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await updateCompanyProfile(formData);
      setResult(res);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <input type="hidden" name="company_id" value={company.id} />

      {/* Company info */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-sky-700">
          Company Information
        </h2>
        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="profile-name"
              className="block text-sm font-medium text-gray-700"
            >
              Company Name
            </label>
            <input
              id="profile-name"
              name="name"
              type="text"
              required
              defaultValue={company.name}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <label
              htmlFor="profile-description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="profile-description"
              name="description"
              rows={4}
              defaultValue={company.description ?? ""}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <UploadField
            name="logo"
            accept="image/*"
            label="Company Logo"
            hint="PNG or JPG, max 2 MB"
            currentUrl={company.logo_url}
          />
        </div>
      </div>

      {/* Contact info */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-sky-700">
          Contact Details
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="profile-website"
              className="block text-sm font-medium text-gray-700"
            >
              Website
            </label>
            <input
              id="profile-website"
              name="website"
              type="url"
              placeholder="https://example.com"
              defaultValue={company.website ?? ""}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <label
              htmlFor="profile-phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              id="profile-phone"
              name="phone"
              type="tel"
              defaultValue={company.phone ?? ""}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="profile-email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="profile-email"
              name="email"
              type="email"
              defaultValue={company.email ?? ""}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Social links */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-sky-700">
          Social Links
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="profile-facebook"
              className="block text-sm font-medium text-gray-700"
            >
              Facebook
            </label>
            <input
              id="profile-facebook"
              name="facebook_url"
              type="url"
              placeholder="https://facebook.com/..."
              defaultValue={socialLinks.facebook_url ?? ""}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <label
              htmlFor="profile-instagram"
              className="block text-sm font-medium text-gray-700"
            >
              Instagram
            </label>
            <input
              id="profile-instagram"
              name="instagram_url"
              type="url"
              placeholder="https://instagram.com/..."
              defaultValue={socialLinks.instagram_url ?? ""}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <label
              htmlFor="profile-linkedin"
              className="block text-sm font-medium text-gray-700"
            >
              LinkedIn
            </label>
            <input
              id="profile-linkedin"
              name="linkedin_url"
              type="url"
              placeholder="https://linkedin.com/company/..."
              defaultValue={socialLinks.linkedin_url ?? ""}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <label
              htmlFor="profile-twitter"
              className="block text-sm font-medium text-gray-700"
            >
              X / Twitter
            </label>
            <input
              id="profile-twitter"
              name="twitter_url"
              type="url"
              placeholder="https://x.com/..."
              defaultValue={socialLinks.twitter_url ?? ""}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Result message */}
      {result?.error && (
        <p className="text-sm text-red-600" role="alert">
          {result.error}
        </p>
      )}
      {result?.success && (
        <p className="text-sm text-emerald-600">Profile updated successfully.</p>
      )}

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
