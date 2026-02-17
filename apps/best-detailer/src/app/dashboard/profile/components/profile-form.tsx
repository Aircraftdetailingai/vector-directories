"use client";

import { useState, useTransition } from "react";
import { updateProfile, type ActionResult } from "../actions";
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
      const res = await updateProfile(formData);
      setResult(res);
    });
  }

  const inputClass =
    "mt-1 w-full border border-ivory-200 bg-white px-3 py-2 text-sm text-noir-900 placeholder-ivory-400 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 rounded-sm";

  return (
    <form action={handleSubmit} className="space-y-6">
      <input type="hidden" name="company_id" value={company.id} />

      {/* Company info */}
      <div className="border border-ivory-200 bg-white p-6 rounded-sm">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-noir-900">
          Company Information
        </h2>
        <div className="mt-1 h-px w-10 bg-gold-500" />
        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="profile-name"
              className="block text-sm font-medium text-noir-900"
            >
              Company Name
            </label>
            <input
              id="profile-name"
              name="name"
              type="text"
              required
              defaultValue={company.name}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="profile-description"
              className="block text-sm font-medium text-noir-900"
            >
              Description
            </label>
            <textarea
              id="profile-description"
              name="description"
              rows={4}
              defaultValue={company.description ?? ""}
              className={inputClass}
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
      <div className="border border-ivory-200 bg-white p-6 rounded-sm">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-noir-900">
          Contact Details
        </h2>
        <div className="mt-1 h-px w-10 bg-gold-500" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="profile-website"
              className="block text-sm font-medium text-noir-900"
            >
              Website
            </label>
            <input
              id="profile-website"
              name="website"
              type="url"
              placeholder="https://example.com"
              defaultValue={company.website ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="profile-phone"
              className="block text-sm font-medium text-noir-900"
            >
              Phone
            </label>
            <input
              id="profile-phone"
              name="phone"
              type="tel"
              defaultValue={company.phone ?? ""}
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="profile-email"
              className="block text-sm font-medium text-noir-900"
            >
              Email
            </label>
            <input
              id="profile-email"
              name="email"
              type="email"
              defaultValue={company.email ?? ""}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Social links */}
      <div className="border border-ivory-200 bg-white p-6 rounded-sm">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-noir-900">
          Social Links
        </h2>
        <div className="mt-1 h-px w-10 bg-gold-500" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="profile-facebook"
              className="block text-sm font-medium text-noir-900"
            >
              Facebook
            </label>
            <input
              id="profile-facebook"
              name="facebook_url"
              type="url"
              placeholder="https://facebook.com/..."
              defaultValue={socialLinks.facebook_url ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="profile-instagram"
              className="block text-sm font-medium text-noir-900"
            >
              Instagram
            </label>
            <input
              id="profile-instagram"
              name="instagram_url"
              type="url"
              placeholder="https://instagram.com/..."
              defaultValue={socialLinks.instagram_url ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="profile-linkedin"
              className="block text-sm font-medium text-noir-900"
            >
              LinkedIn
            </label>
            <input
              id="profile-linkedin"
              name="linkedin_url"
              type="url"
              placeholder="https://linkedin.com/company/..."
              defaultValue={socialLinks.linkedin_url ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="profile-twitter"
              className="block text-sm font-medium text-noir-900"
            >
              X / Twitter
            </label>
            <input
              id="profile-twitter"
              name="twitter_url"
              type="url"
              placeholder="https://x.com/..."
              defaultValue={socialLinks.twitter_url ?? ""}
              className={inputClass}
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
        <p className="text-sm text-gold-600">Profile updated successfully.</p>
      )}

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="bg-noir-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-noir-800 disabled:cursor-not-allowed disabled:opacity-50 rounded-sm"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
