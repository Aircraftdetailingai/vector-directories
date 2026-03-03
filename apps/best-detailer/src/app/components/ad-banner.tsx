"use client";

import { useEffect, useState } from "react";

interface Ad {
  id: string;
  title: string;
  description: string | null;
  destination_url: string;
  image_url: string | null;
  company_name: string;
}

export function AdBanner({ placement }: { placement: string }) {
  const [ad, setAd] = useState<Ad | null>(null);

  useEffect(() => {
    fetch(`/api/ads/active?placement=${placement}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.ads?.length > 0) {
          // Pick a random ad from active ones
          const picked = data.ads[Math.floor(Math.random() * data.ads.length)];
          setAd(picked);
          // Track impression
          fetch("/api/ads/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ adId: picked.id, type: "impression" }),
          }).catch(() => {});
        }
      })
      .catch(() => {});
  }, [placement]);

  if (!ad) return null;

  const handleClick = () => {
    fetch("/api/ads/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adId: ad.id, type: "click" }),
    }).catch(() => {});
  };

  return (
    <div className="w-full border border-gray-200 bg-gray-50 rounded-lg overflow-hidden">
      <a
        href={ad.destination_url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={handleClick}
        className="block"
      >
        {ad.image_url ? (
          <img src={ad.image_url} alt={ad.title} className="w-full h-auto" />
        ) : (
          <div className="px-4 py-3 text-center">
            <p className="text-sm font-semibold text-gray-800">{ad.title}</p>
            {ad.description && (
              <p className="text-xs text-gray-500 mt-1">{ad.description}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">by {ad.company_name}</p>
          </div>
        )}
      </a>
      <div className="px-2 py-1 text-center">
        <span className="text-[10px] text-gray-400 uppercase tracking-wider">Sponsored</span>
      </div>
    </div>
  );
}
