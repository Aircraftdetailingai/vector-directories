"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useMapToken } from "./map-provider";

interface MiniMapProps {
  lat: number;
  lng: number;
  name: string;
}

export default function MiniMap({ lat, lng, name }: MiniMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const token = useMapToken();

  useEffect(() => {
    if (!containerRef.current || !token) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [lng, lat],
      zoom: 12,
      interactive: true,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

    // Emerald pin marker
    const markerEl = document.createElement("div");
    markerEl.style.width = "20px";
    markerEl.style.height = "20px";
    markerEl.style.borderRadius = "50%";
    markerEl.style.backgroundColor = "#10B981";
    markerEl.style.border = "3px solid #ffffff";
    markerEl.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";

    new mapboxgl.Marker({ element: markerEl })
      .setLngLat([lng, lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 12 }).setHTML(
          `<p style="font-weight:600;font-size:13px;margin:0;">${name}</p>`,
        ),
      )
      .addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [token, lat, lng, name]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-lg overflow-hidden"
      style={{ height: "200px" }}
    />
  );
}
