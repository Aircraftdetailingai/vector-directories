"use client";

import { useState, useRef } from "react";

export default function UploadField({
  label,
  name,
  accept = "image/*",
  preview: initialPreview,
}: {
  label: string;
  name: string;
  accept?: string;
  preview?: string | null;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialPreview ?? null
  );
  const [uploaded, setUploaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setUploaded(true);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-navy-700 mb-1.5">
        {label}
      </label>
      <div
        className={`relative rounded-lg border-2 border-dashed p-4 text-center transition-colors ${
          uploaded
            ? "border-gold-400 bg-gold-50"
            : "border-navy-200 hover:border-navy-400"
        }`}
      >
        {previewUrl && (
          <div className="mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Preview"
              className="mx-auto h-24 w-24 rounded-lg object-cover"
            />
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 cursor-pointer opacity-0"
        />

        <div className="text-sm text-navy-500 font-body">
          {uploaded ? (
            <span className="text-gold-700 font-medium">
              File selected — ready to upload
            </span>
          ) : (
            <>
              <span className="font-medium text-navy-700">
                Click to upload
              </span>{" "}
              or drag and drop
            </>
          )}
        </div>
        <p className="mt-1 text-xs text-navy-400">PNG, JPG up to 5MB</p>
      </div>
    </div>
  );
}
