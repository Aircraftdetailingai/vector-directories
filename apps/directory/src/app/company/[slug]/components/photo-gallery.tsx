import type { Tier } from "@vector/types";
import { hasTierFeature } from "@vector/utils";

interface PhotoGalleryProps {
  photos: string[];
  tier: Tier;
  companyName: string;
}

export function PhotoGallery({
  photos,
  tier,
  companyName,
}: PhotoGalleryProps) {
  const hasAccess = hasTierFeature(tier, "photoGallery");

  if (!hasAccess) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <svg
          className="mx-auto h-10 w-10 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
          />
        </svg>
        <p className="mt-3 text-sm font-medium text-gray-500">
          Photo gallery available on Pro and Enterprise plans
        </p>
      </div>
    );
  }

  if (photos.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-forest-800">
        Photo Gallery
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((url, i) => (
          <div
            key={url}
            className="aspect-[4/3] overflow-hidden rounded-lg border border-gray-100"
          >
            <img
              src={url}
              alt={`${companyName} work photo ${i + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
