"use client";

import { useState, useMemo } from "react";
import type { CompanyWithDistance } from "@/lib/geo";
import { sortByDistance, filterByRadius, haversineDistance } from "@/lib/geo";
import { getAllAirports, type AirportDetail } from "@/lib/city-airports";
import { MapProvider } from "@/components/map/map-provider";
import MapView from "@/components/map/map-view";
import LocateButton from "@/components/map/locate-button";
import CompanyCard from "./company-card";

interface HomeShellProps {
  companies: CompanyWithDistance[];
}

/**
 * Approximate lat/lng for major airport codes.
 * Used for distance filtering when an airport is selected.
 */
const AIRPORT_COORDS: Record<string, { lat: number; lng: number }> = {
  MIA: { lat: 25.7959, lng: -80.287 },
  OPF: { lat: 25.907, lng: -80.2784 },
  FLL: { lat: 26.0726, lng: -80.1527 },
  TMB: { lat: 25.6479, lng: -80.4328 },
  MCO: { lat: 28.4312, lng: -81.308 },
  SFB: { lat: 28.7776, lng: -81.2375 },
  ORL: { lat: 28.5455, lng: -81.3329 },
  TPA: { lat: 27.9755, lng: -82.5332 },
  PIE: { lat: 27.9115, lng: -82.6874 },
  JAX: { lat: 30.4941, lng: -81.6879 },
  CRG: { lat: 30.3363, lng: -81.5144 },
  APF: { lat: 26.1526, lng: -81.7753 },
  RSW: { lat: 26.5362, lng: -81.7552 },
  LAX: { lat: 33.9425, lng: -118.408 },
  VNY: { lat: 34.2098, lng: -118.49 },
  BUR: { lat: 34.2007, lng: -118.3585 },
  SNA: { lat: 33.6757, lng: -117.8682 },
  SMO: { lat: 34.0158, lng: -118.4513 },
  SFO: { lat: 37.6213, lng: -122.379 },
  OAK: { lat: 37.7213, lng: -122.2208 },
  SJC: { lat: 37.3626, lng: -121.929 },
  SAN: { lat: 32.7338, lng: -117.1933 },
  CRQ: { lat: 33.1283, lng: -117.2803 },
  RHV: { lat: 37.3326, lng: -121.8197 },
  SMF: { lat: 38.6954, lng: -121.5908 },
  MHR: { lat: 38.5539, lng: -121.2978 },
  DFW: { lat: 32.8998, lng: -97.0403 },
  DAL: { lat: 32.8471, lng: -96.8518 },
  ADS: { lat: 32.9686, lng: -96.8364 },
  IAH: { lat: 29.9844, lng: -95.3414 },
  HOU: { lat: 29.6454, lng: -95.2789 },
  SGR: { lat: 29.6224, lng: -95.6565 },
  AUS: { lat: 30.1975, lng: -97.6664 },
  SAT: { lat: 29.5337, lng: -98.4698 },
  JFK: { lat: 40.6413, lng: -73.7781 },
  LGA: { lat: 40.7769, lng: -73.874 },
  EWR: { lat: 40.6895, lng: -74.1745 },
  TEB: { lat: 40.8501, lng: -74.0608 },
  HPN: { lat: 41.0668, lng: -73.7076 },
  PHX: { lat: 33.4373, lng: -112.0078 },
  SDL: { lat: 33.6229, lng: -111.9106 },
  DVT: { lat: 33.6883, lng: -112.0833 },
  TUS: { lat: 32.1161, lng: -110.9411 },
  ORD: { lat: 41.9742, lng: -87.9073 },
  MDW: { lat: 41.786, lng: -87.7524 },
  PWK: { lat: 42.1142, lng: -87.9015 },
  DPA: { lat: 41.9078, lng: -88.2487 },
  ATL: { lat: 33.6407, lng: -84.4277 },
  PDK: { lat: 33.8756, lng: -84.302 },
  FTY: { lat: 33.7791, lng: -84.5214 },
  DEN: { lat: 39.8561, lng: -104.6737 },
  APA: { lat: 39.5701, lng: -104.8493 },
  BJC: { lat: 39.9088, lng: -105.1172 },
  LAS: { lat: 36.08, lng: -115.1522 },
  HND: { lat: 35.9728, lng: -115.1344 },
  VGT: { lat: 36.2107, lng: -115.1944 },
  SEA: { lat: 47.4502, lng: -122.3088 },
  BFI: { lat: 47.53, lng: -122.302 },
  PAE: { lat: 47.9063, lng: -122.2815 },
  BDL: { lat: 41.9389, lng: -72.6832 },
  BOS: { lat: 42.3656, lng: -71.0096 },
  BED: { lat: 42.4699, lng: -71.289 },
  PHL: { lat: 39.8721, lng: -75.2411 },
  PNE: { lat: 40.0819, lng: -75.0105 },
  CLT: { lat: 35.214, lng: -80.9431 },
  CMH: { lat: 39.998, lng: -82.8919 },
  DTW: { lat: 42.2124, lng: -83.3534 },
  YIP: { lat: 42.2379, lng: -83.5304 },
  BNA: { lat: 36.1264, lng: -86.6774 },
  JWN: { lat: 36.1824, lng: -86.8867 },
  PDX: { lat: 45.5898, lng: -122.5951 },
  HIO: { lat: 45.5405, lng: -122.9498 },
  STL: { lat: 38.7487, lng: -90.37 },
  SUS: { lat: 38.6621, lng: -90.6524 },
};

export default function HomeShell({ companies }: HomeShellProps) {
  const [userLocation, setUserLocation] = useState<
    { lat: number; lng: number } | undefined
  >(undefined);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [airportFilter, setAirportFilter] = useState<string>("");
  const [radius, setRadius] = useState<number>(50);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const allAirports = useMemo<AirportDetail[]>(() => getAllAirports(), []);

  // Filter and sort companies
  const filteredCompanies = useMemo(() => {
    let result = [...companies];

    // Text search filter
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q));
    }

    // Airport proximity filter
    if (airportFilter) {
      const coords = AIRPORT_COORDS[airportFilter];
      if (coords) {
        result = filterByRadius(result, coords.lat, coords.lng, radius);
      }
    }

    // Sort by distance from user location
    if (userLocation && !airportFilter) {
      result = sortByDistance(result, userLocation.lat, userLocation.lng);
    }

    // If airport filter is active but user also has location, add user distance
    if (userLocation && airportFilter) {
      result = result.map((c) => ({
        ...c,
        distance: haversineDistance(userLocation.lat, userLocation.lng, c.lat, c.lng),
      }));
    }

    return result;
  }, [companies, searchQuery, airportFilter, radius, userLocation]);

  // Map locations data
  const mapLocations = useMemo(
    () =>
      filteredCompanies.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        lat: c.lat,
        lng: c.lng,
        trust_score: c.trust_score,
      })),
    [filteredCompanies],
  );

  function handleLocate(lat: number, lng: number) {
    setUserLocation({ lat, lng });
  }

  function handleMapSelect(id: string) {
    setSelectedId(id);
    // Scroll to the card in the sidebar
    const el = document.getElementById(`company-card-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function handleCardClick(id: string) {
    setSelectedId(id);
  }

  return (
    <MapProvider>
      {/* Desktop layout: side by side. Mobile: stacked */}
      <div className="flex flex-col md:flex-row">
        {/* Map */}
        <div className="w-full md:w-[60%] h-[40vh] md:h-[calc(100vh-64px)] md:sticky md:top-16">
          <MapView
            locations={mapLocations}
            userLocation={userLocation}
            selectedId={selectedId}
            onSelect={handleMapSelect}
          />
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-[40%] md:h-[calc(100vh-64px)] md:overflow-y-auto bg-gray-50">
          <div className="p-4 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            {/* Locate Button */}
            <LocateButton onLocate={handleLocate} />

            {/* Airport Filter */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
              <h3 className="font-heading font-semibold text-gray-900 text-sm">
                Filter by Airport
              </h3>

              <select
                value={airportFilter}
                onChange={(e) => setAirportFilter(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="">All Locations</option>
                {allAirports.map((airport) => (
                  <option key={airport.code} value={airport.code}>
                    {airport.code} - {airport.name}
                  </option>
                ))}
              </select>

              {airportFilter && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-500">Radius</label>
                    <span className="text-xs font-semibold text-sky-600">
                      {radius} mi
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={100}
                    step={5}
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>5 mi</span>
                    <span>100 mi</span>
                  </div>
                </div>
              )}
            </div>

            {/* Result Count */}
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-900">
                {filteredCompanies.length}
              </span>{" "}
              detailer{filteredCompanies.length !== 1 ? "s" : ""} found
            </p>

            {/* Company List */}
            <div className="space-y-2">
              {filteredCompanies.map((company) => (
                <div key={company.id} id={`company-card-${company.id}`}>
                  <CompanyCard
                    company={company}
                    selected={selectedId === company.id}
                    onClick={() => handleCardClick(company.id)}
                  />
                </div>
              ))}

              {filteredCompanies.length === 0 && (
                <div className="text-center py-12">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-12 h-12 text-gray-300 mx-auto mb-3"
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
                  <p className="text-gray-500 text-sm">
                    No detailers found matching your criteria.
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Try adjusting your search or expanding the radius.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MapProvider>
  );
}
