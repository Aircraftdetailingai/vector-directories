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

export default function ProfileForm({
  company,
  socialLinks,
}: ProfileFormProps) {
  const [result, setResult] = useState<ActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await updateCompanyProfile(formData);
      setResult(res);
    });
  }

  const inputClasses =
    "mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500";

  return (
    <form action={handleSubmit} className="space-y-6">
      <input type="hidden" name="company_id" value={company.id} />

      {/* Company info */}
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
          Company Information
        </h2>
        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="profile-name"
              className="block text-sm font-medium text-slate-300"
            >
              Company Name
            </label>
            <input
              id="profile-name"
              name="name"
              type="text"
              required
              defaultValue={company.name}
              className={inputClasses}
            />
          </div>

          <div>
            <label
              htmlFor="profile-description"
              className="block text-sm font-medium text-slate-300"
            >
              Description
            </label>
            <textarea
              id="profile-description"
              name="description"
              rows={4}
              defaultValue={company.description ?? ""}
              className={inputClasses}
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
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
          Contact Details
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="profile-website"
              className="block text-sm font-medium text-slate-300"
            >
              Website
            </label>
            <input
              id="profile-website"
              name="website"
              type="url"
              placeholder="https://example.com"
              defaultValue={company.website ?? ""}
              className={inputClasses}
            />
          </div>

          <div>
            <label
              htmlFor="profile-phone"
              className="block text-sm font-medium text-slate-300"
            >
              Phone
            </label>
            <input
              id="profile-phone"
              name="phone"
              type="tel"
              defaultValue={company.phone ?? ""}
              className={inputClasses}
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="profile-email"
              className="block text-sm font-medium text-slate-300"
            >
              Email
            </label>
            <input
              id="profile-email"
              name="email"
              type="email"
              defaultValue={company.email ?? ""}
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      {/* Social links */}
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
          Social Links
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="profile-facebook"
              className="block text-sm font-medium text-slate-300"
            >
              Facebook
            </label>
            <input
              id="profile-facebook"
              name="facebook_url"
              type="url"
              placeholder="https://facebook.com/..."
              defaultValue={socialLinks.facebook_url ?? ""}
              className={inputClasses}
            />
          </div>

          <div>
            <label
              htmlFor="profile-instagram"
              className="block text-sm font-medium text-slate-300"
            >
              Instagram
            </label>
            <input
              id="profile-instagram"
              name="instagram_url"
              type="url"
              placeholder="https://instagram.com/..."
              defaultValue={socialLinks.instagram_url ?? ""}
              className={inputClasses}
            />
          </div>

          <div>
            <label
              htmlFor="profile-linkedin"
              className="block text-sm font-medium text-slate-300"
            >
              LinkedIn
            </label>
            <input
              id="profile-linkedin"
              name="linkedin_url"
              type="url"
              placeholder="https://linkedin.com/company/..."
              defaultValue={socialLinks.linkedin_url ?? ""}
              className={inputClasses}
            />
          </div>

          <div>
            <label
              htmlFor="profile-twitter"
              className="block text-sm font-medium text-slate-300"
            >
              X / Twitter
            </label>
            <input
              id="profile-twitter"
              name="twitter_url"
              type="url"
              placeholder="https://x.com/..."
              defaultValue={socialLinks.twitter_url ?? ""}
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      {/* Result message */}
      {result?.error && (
        <p className="text-sm text-red-400" role="alert">
          {result.error}
        </p>
      )}
      {result?.success && (
        <p className="text-sm text-green-400">Profile updated successfully.</p>
      )}

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-electric-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-electric-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
