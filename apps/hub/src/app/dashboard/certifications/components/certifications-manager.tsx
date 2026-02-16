"use client";

import { useState, useTransition } from "react";
import type { CompanyCertification } from "@vector/types";
import {
  addCertification,
  removeCertification,
  type ActionResult,
} from "../actions";
import { UploadField } from "../../components/upload-field";

const CERT_TYPES = [
  { value: "insurance", label: "Insurance" },
  { value: "permit", label: "Permit" },
  { value: "certification", label: "Certification" },
] as const;

const TYPE_COLORS: Record<string, string> = {
  insurance: "bg-teal-100 text-teal-700",
  permit: "bg-coral-100 text-coral-700",
  certification: "bg-teal-100 text-teal-700",
};

interface CertificationsManagerProps {
  certifications: CompanyCertification[];
  companyId: string;
}

export function CertificationsManager({
  certifications,
  companyId,
}: CertificationsManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAdd(formData: FormData) {
    startTransition(async () => {
      const res = await addCertification(formData);
      setResult(res);
      if (res.success) setShowForm(false);
    });
  }

  function handleRemove(formData: FormData) {
    startTransition(async () => {
      const res = await removeCertification(formData);
      setResult(res);
    });
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 font-body">
          {certifications.length} certification
          {certifications.length !== 1 ? "s" : ""}
        </p>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700 font-body"
        >
          {showForm ? "Cancel" : "Add Certification"}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form
          action={handleAdd}
          className="rounded-2xl border border-teal-100 bg-white p-6"
        >
          <input type="hidden" name="company_id" value={companyId} />
          <h3 className="font-heading text-sm font-semibold text-teal-700">
            New Certification
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="cert-name"
                className="block text-sm font-medium text-gray-700 font-body"
              >
                Name
              </label>
              <input
                id="cert-name"
                name="name"
                type="text"
                required
                placeholder="e.g., General Liability Insurance"
                className="mt-1 w-full rounded-2xl border border-teal-200 px-3 py-2 text-sm text-gray-700 font-body focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <label
                htmlFor="cert-type"
                className="block text-sm font-medium text-gray-700 font-body"
              >
                Type
              </label>
              <select
                id="cert-type"
                name="type"
                required
                className="mt-1 w-full rounded-2xl border border-teal-200 px-3 py-2 text-sm text-gray-700 font-body focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                {CERT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="cert-expires"
                className="block text-sm font-medium text-gray-700 font-body"
              >
                Expiration Date
              </label>
              <input
                id="cert-expires"
                name="expires_at"
                type="date"
                className="mt-1 w-full rounded-2xl border border-teal-200 px-3 py-2 text-sm text-gray-700 font-body focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <UploadField
                name="document"
                accept=".pdf,.png,.jpg,.jpeg"
                label="Document"
                hint="PDF, PNG, or JPG"
              />
            </div>
          </div>

          {result?.error && (
            <p className="mt-3 text-sm text-red-600 font-body" role="alert">
              {result.error}
            </p>
          )}

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-50 font-body"
            >
              {isPending ? "Adding..." : "Add Certification"}
            </button>
          </div>
        </form>
      )}

      {/* Certification list */}
      {certifications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-teal-200 bg-teal-50/50 py-12 text-center">
          <p className="text-sm text-gray-500 font-body">
            No certifications yet. Add your insurance, permits, and
            certifications to build community trust.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="flex items-start justify-between rounded-2xl border border-teal-100 bg-white p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-heading text-sm font-semibold text-gray-900">
                    {cert.name}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${TYPE_COLORS[cert.type] ?? "bg-gray-100 text-gray-600"}`}
                  >
                    {cert.type}
                  </span>
                </div>
                {cert.expires_at && (
                  <p className="mt-1 text-xs text-gray-400 font-body">
                    Expires:{" "}
                    {new Date(cert.expires_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                )}
                {cert.document_url && (
                  <a
                    href={cert.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-xs font-medium text-teal-600 hover:underline font-body"
                  >
                    View document
                  </a>
                )}
              </div>
              <form action={handleRemove}>
                <input type="hidden" name="cert_id" value={cert.id} />
                <input type="hidden" name="company_id" value={companyId} />
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  title="Remove certification"
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

export default CertificationsManager;
