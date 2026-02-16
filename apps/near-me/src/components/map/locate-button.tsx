"use client";

import { useState } from "react";

interface LocateButtonProps {
  onLocate: (lat: number, lng: number) => void;
}

export default function LocateButton({ onLocate }: LocateButtonProps) {
  const [pending, setPending] = useState(false);

  function handleClick() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setPending(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPending(false);
        onLocate(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setPending(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("Location permission was denied. Please enable it in your browser settings.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            alert("The request to get your location timed out.");
            break;
          default:
            alert("An unknown error occurred while getting your location.");
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white rounded-full px-4 py-2.5 text-sm font-medium transition-colors w-full justify-center"
    >
      {pending ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Locating...
        </>
      ) : (
        <>
          {/* Crosshair icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.364-5.364l-2.828 2.828M9.464 14.536l-2.828 2.828m11.728 0l-2.828-2.828M9.464 9.464L6.636 6.636"
            />
          </svg>
          Use My Location
        </>
      )}
    </button>
  );
}
