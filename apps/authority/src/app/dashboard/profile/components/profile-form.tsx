"use client";

import { useState } from "react";
import type { Company } from "@vector/types";
import { updateCompanyProfile } from "../actions";
import SectionCard from "../../components/section-card";
import UploadField from "../../components/upload-field";

export default function ProfileForm({
  company,
  socialLinks,
}: {
  company: Company;
  socialLinks: Record<string, string>;
}) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccess(false);
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("companyId", company.id);

    const result = await updateCompanyProfile(formData);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error ?? "Failed to update profile.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="rounded-lg border border-gold-200 bg-gold-50 px-4 py-3 text-sm font-medium text-gold-800">
          Profile updated successfully.
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <SectionCard title="Basic Information">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="profile-name"
              className="block text-sm font-medium text-navy-700 mb-1.5"
            >
              Company Name
            </label>
            <input
              id="profile-name"
              type="text"
              name="name"
              defaultValue={company.name}
              required
              className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-navy-900 placeholder:text-navy-400 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-200 font-body"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="profile-description"
              className="block text-sm font-medium text-navy-700 mb-1.5"
            >
              Description
            </label>
            <textarea
              id="profile-description"
              name="description"
              rows={4}
              defaultValue={company.description ?? ""}
              className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-navy-900 placeholder:text-navy-400 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-200 font-body"
            />
          </div>

          <div>
            <label
              htmlFor="profile-website"
              className="block text-sm font-medium text-navy-700 mb-1.5"
            >
              Website
            </label>
            <input
              id="profile-website"
              type="url"
              name="website"
              defaultValue={company.website ?? ""}
              placeholder="https://example.com"
              className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-navy-900 placeholder:text-navy-400 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-200 font-body"
            />
          </div>

          <div>
            <label
              htmlFor="profile-phone"
              className="block text-sm font-medium text-navy-700 mb-1.5"
            >
              Phone
            </label>
            <input
              id="profile-phone"
              type="tel"
              name="phone"
              defaultValue={company.phone ?? ""}
              placeholder="(555) 000-0000"
              className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-navy-900 placeholder:text-navy-400 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-200 font-body"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="profile-email"
              className="block text-sm font-medium text-navy-700 mb-1.5"
            >
              Contact Email
            </label>
            <input
              id="profile-email"
              type="email"
              name="email"
              defaultValue={company.email ?? ""}
              placeholder="contact@company.com"
              className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-navy-900 placeholder:text-navy-400 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-200 font-body"
            />
          </div>
        </div>
      </SectionCard>

      {/* Logo Upload */}
      <SectionCard title="Company Logo">
        <UploadField
          label="Upload Logo"
          name="logo"
          accept="image/png,image/jpeg,image/webp"
          preview={company.logo_url}
        />
      </SectionCard>

      {/* Social Links */}
      <SectionCard title="Social Links">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {[
            { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/..." },
            { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/..." },
            { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/..." },
            { key: "twitter", label: "X (Twitter)", placeholder: "https://x.com/..." },
            { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@..." },
          ].map((social) => (
            <div key={social.key}>
              <label
                htmlFor={`profile-${social.key}`}
                className="block text-sm font-medium text-navy-700 mb-1.5"
              >
                {social.label}
              </label>
              <input
                id={`profile-${social.key}`}
                type="url"
                name={social.key}
                defaultValue={socialLinks[social.key] ?? ""}
                placeholder={social.placeholder}
                className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-navy-900 placeholder:text-navy-400 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-200 font-body"
              />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-navy-900 px-8 py-3 text-sm font-semibold text-white hover:bg-navy-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
