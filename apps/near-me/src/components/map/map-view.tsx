"use client";

import { useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useMapToken } from "./map-provider";

export interface MapLocation {
  id: string;
  name: string;
  slug: string;
  lat: number;
  lng: number;
  trust_score: number | null;
}

interface MapViewProps {
  locations: MapLocation[];
  userLocation?: { lat: number; lng: number };
  selectedId?: string;
  onSelect?: (id: string) => void;
}

const US_CENTER: [number, number] = [-98.5, 39.8];
const DEFAULT_ZOOM = 4;

// Sky-500 #0EA5E9, Emerald-500 #10B981
const CLUSTER_COLOR = "#0EA5E9";
const PIN_COLOR = "#10B981";
const SELECTED_COLOR = "#0369A1"; // sky-700

export default function MapView({
  locations,
  userLocation,
  selectedId,
  onSelect,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const token = useMapToken();

  const buildGeoJSON = useCallback((): GeoJSON.FeatureCollection => {
    return {
      type: "FeatureCollection",
      features: locations.map((loc) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [loc.lng, loc.lat],
        },
        properties: {
          id: loc.id,
          name: loc.name,
          slug: loc.slug,
          trust_score: loc.trust_score,
        },
      })),
    };
  }, [locations]);

  // Initialize the map
  useEffect(() => {
    if (!containerRef.current || !token) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: US_CENTER,
      zoom: DEFAULT_ZOOM,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      // GeoJSON source with clustering
      map.addSource("companies", {
        type: "geojson",
        data: buildGeoJSON(),
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      // Cluster circles
      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "companies",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": CLUSTER_COLOR,
          "circle-radius": [
            "step",
            ["get", "point_count"],
            18,
            10,
            24,
            30,
            32,
          ],
          "circle-opacity": 0.85,
        },
      });

      // Cluster count labels
      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "companies",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 13,
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      // Individual pin layer
      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "companies",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": [
            "case",
            ["==", ["get", "id"], selectedId ?? ""],
            SELECTED_COLOR,
            PIN_COLOR,
          ],
          "circle-radius": 8,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      // Click on cluster to zoom
      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        if (!features.length) return;
        const clusterId = features[0].properties?.cluster_id;
        const source = map.getSource("companies") as mapboxgl.GeoJSONSource;
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;
          const geometry = features[0].geometry;
          if (geometry.type === "Point") {
            map.easeTo({
              center: geometry.coordinates as [number, number],
              zoom: zoom ?? 10,
            });
          }
        });
      });

      // Click on individual pin
      map.on("click", "unclustered-point", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["unclustered-point"],
        });
        if (!features.length) return;

        const props = features[0].properties;
        const geometry = features[0].geometry;
        if (!props || geometry.type !== "Point") return;

        const coordinates = geometry.coordinates.slice() as [number, number];
        const name = props.name ?? "Unknown";
        const slug = props.slug ?? "";
        const trustScore = props.trust_score;
        const scoreDisplay =
          trustScore !== null && trustScore !== undefined
            ? `<span style="background:#10B981;color:white;padding:2px 8px;border-radius:9999px;font-size:12px;font-weight:600;">${trustScore}/100</span>`
            : "";

        // Close any existing popup
        if (popupRef.current) {
          popupRef.current.remove();
        }

        const popup = new mapboxgl.Popup({ offset: 15, closeButton: true })
          .setLngLat(coordinates)
          .setHTML(
            `<div style="font-family:var(--font-roboto),system-ui,sans-serif;">
              <p style="font-weight:600;font-size:14px;margin:0 0 4px;">${name}</p>
              <div style="margin-bottom:6px;">${scoreDisplay}</div>
              <a href="/company/${slug}" style="color:#0EA5E9;font-size:13px;font-weight:500;text-decoration:none;">View Details &rarr;</a>
            </div>`,
          )
          .addTo(map);

        popupRef.current = popup;

        if (onSelect) {
          onSelect(props.id);
        }
      });

      // Cursor style
      map.on("mouseenter", "clusters", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = "";
      });
      map.on("mouseenter", "unclustered-point", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "unclustered-point", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    mapRef.current = map;

    return () => {
      if (popupRef.current) {
        popupRef.current.remove();
      }
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Update GeoJSON data when locations change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const source = map.getSource("companies") as mapboxgl.GeoJSONSource | undefined;
    if (source) {
      source.setData(buildGeoJSON());
    }
  }, [locations, buildGeoJSON]);

  // Fly to user location
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLocation) return;

    map.flyTo({
      center: [userLocation.lng, userLocation.lat],
      zoom: 10,
      duration: 1500,
    });
  }, [userLocation]);

  // Highlight selected pin
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const layer = map.getLayer("unclustered-point");
    if (!layer) return;

    map.setPaintProperty("unclustered-point", "circle-color", [
      "case",
      ["==", ["get", "id"], selectedId ?? ""],
      SELECTED_COLOR,
      PIN_COLOR,
    ]);
  }, [selectedId]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: "300px" }}
    />
  );
}
