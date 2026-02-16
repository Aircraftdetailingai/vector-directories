"use client";

import dynamic from "next/dynamic";
import type { Location } from "@vector/types";

const MiniMap = dynamic(() => import("@/components/map/mini-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[200px] w-full items-center justify-center rounded-lg bg-gray-100">
      <p className="text-sm text-gray-400">Loading map...</p>
    </div>
  ),
});

interface CompanyMapProps {
  location: Location | null;
  companyName: string;
}

export function CompanyMap({ location, companyName }: CompanyMapProps) {
  const lat = location?.lat;
  const lng = location?.lng;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="px-6 pt-6 pb-3">
        <h2 className="font-heading text-lg font-semibold text-gray-900">
          Location
        </h2>
      </div>
      <div className="px-3 pb-3">
        {lat != null && lng != null ? (
          <MiniMap lat={lat} lng={lng} name={companyName} />
        ) : (
          <div className="flex h-[200px] w-full items-center justify-center rounded-lg bg-gray-50">
            <div className="text-center">
              <svg
                className="mx-auto h-8 w-8 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-400">Map unavailable</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
