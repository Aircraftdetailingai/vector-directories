"use client";

import { createContext, useContext, type ReactNode } from "react";

const MapTokenContext = createContext<string>("");

export function MapProvider({ children }: { children: ReactNode }) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

  return (
    <MapTokenContext.Provider value={token}>
      {children}
    </MapTokenContext.Provider>
  );
}

export function useMapToken(): string {
  const token = useContext(MapTokenContext);
  if (!token) {
    console.warn(
      "Mapbox token is empty. Set NEXT_PUBLIC_MAPBOX_TOKEN in your environment.",
    );
  }
  return token;
}
