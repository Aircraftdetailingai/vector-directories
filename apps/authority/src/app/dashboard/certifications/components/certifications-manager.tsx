"use client";

import { useState } from "react";
import type { CompanyCertification } from "@vector/types";
import { addCertification, removeCertification } from "../actions";
import SectionCard from "../../components/section-card";

const TYPE_BADGES: Record<string, { label: string; className: string }> = {
  insurance: {
    label: "Insurance",
    className: "bg-navy-100 text-navy-700",
  },
  permit: {
    label: "Permit",
    className: "bg-gold-100 text-gold-800",
  },
  certification: {
    label: "Certification",
    className: "bg-navy-50 text-navy-600 border border-navy-200",
  },
};

export default function CertificationsManager({
  initialCertifications,
  companyId,
}: {
  initialCertifications: CompanyCertification[];
  companyId: string;
}) {
  const [certifications, setCertifications] = useState(initialCertifications);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("companyId", companyId);

    const result = await addCertification(formData);

    if (result.success) {
      setSuccess("Certification added successfully.");
      setShowAddForm(false);
      const newCert: CompanyCertification = {
        id: `temp-${Date.now()}`,
        company_id: companyId,
        name: formData.get("name") as string,
        type: formData.get("type") as "insurance" | "permit" | "certification",
        document_url: null,
        expires_at: (formData.get("expires_at") as string) || null,
        created_at: new Date().toISOString(),
      };
      setCertifications((prev) => [...prev, newCert]);
    } else {
      setError(result.error ?? "Failed to add certification.");
    }
    setLoading(false);
  }

  async function handleRemove(certId: string) {
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.set("certificationId", certId);

    const result = await removeCertification(formData);

    if (result.success) {
      setCertifications((prev) => prev.filter((c) => c.id !== certId));
      setSuccess("Certification removed.");
    } else {
      setError(result.error ?? "Failed to remove certification.");
    }
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return "No expiry";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function isExpiringSoon(dateStr: string | null) {
    if (!dateStr) return false;
    const diff = new Date(dateStr).getTime() - Date.now();
    return diff > 0 && diff < 90 * 24 * 60 * 60 * 1000; // 90 days
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

      {/* Certification Cards */}
      {certifications.map((cert) => {
        const badge = TYPE_BADGES[cert.type] ?? TYPE_BADGES.certification;
        return (
          <SectionCard key={cert.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-heading text-base font-semibold text-navy-900">
                    {cert.name}
                  </h3>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-3 text-sm text-navy-500 font-body">
                  <span>
                    Expires: {formatDate(cert.expires_at)}
                  </span>
                  {isExpiringSoon(cert.expires_at) && (
                    <span className="inline-flex items-center rounded-full bg-gold-100 px-2 py-0.5 text-xs font-medium text-gold-800">
                      Expiring Soon
                    </span>
                  )}
                </div>
                {cert.document_url && (
                  <a
                    href={cert.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-sm text-navy-600 hover:text-navy-800 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    View Document
                  </a>
                )}
              </div>
              <button
                onClick={() => handleRemove(cert.id)}
                className="shrink-0 rounded-lg border border-navy-200 px-3 py-1.5 text-xs font-medium text-navy-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </SectionCard>
        );
      })}

      {/* Empty State */}
      {certifications.length === 0 && (
        <SectionCard>
          <div className="py-8 text-center">
            <svg
              className="mx-auto h-10 w-10 text-navy-300 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
            </svg>
            <p className="text-sm text-navy-500 font-body">
              No certifications added yet. Add your credentials to boost your
              Authority Score.
            </p>
          </div>
        </SectionCard>
      )}

      {/* Add Form */}
      {showAddForm ? (
        <SectionCard title="Add Certification">
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="cert-name" className="block text-sm font-medium text-navy-700 mb-1.5">
                  Certification Name
                </label>
                <input
                  id="cert-name"
                  type="text"
                  name="name"
                  required
                  placeholder="e.g., General Liability Insurance"
                  className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-navy-900 placeholder:text-navy-400 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-200 font-body"
                />
              </div>
              <div>
                <label htmlFor="cert-type" className="block text-sm font-medium text-navy-700 mb-1.5">
                  Type
                </label>
                <select
                  id="cert-type"
                  name="type"
                  required
                  className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-navy-900 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-200 font-body bg-white"
                >
                  <option value="insurance">Insurance</option>
                  <option value="permit">Permit</option>
                  <option value="certification">Certification</option>
                </select>
              </div>
              <div>
                <label htmlFor="cert-expires" className="block text-sm font-medium text-navy-700 mb-1.5">
                  Expiration Date
                </label>
                <input
                  id="cert-expires"
                  type="date"
                  name="expires_at"
                  className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-navy-900 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-200 font-body"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-navy-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 transition-colors disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Certification"}
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
          + Add Certification
        </button>
      )}
    </div>
  );
}
