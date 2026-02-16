const EARTH_RADIUS_MILES = 3958.8;

/** Haversine distance between two lat/lng pairs, in miles. */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_MILES * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface CompanyWithDistance {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  trust_score: number | null;
  tier: string;
  is_claimed: boolean;
  lat: number;
  lng: number;
  city?: string;
  state?: string;
  distance?: number;
}

/** Sort companies by distance from a point. */
export function sortByDistance(
  companies: CompanyWithDistance[],
  userLat: number,
  userLng: number,
): CompanyWithDistance[] {
  return companies
    .map((c) => ({
      ...c,
      distance: haversineDistance(userLat, userLng, c.lat, c.lng),
    }))
    .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
}

/** Filter companies within a radius (miles) from a point. */
export function filterByRadius(
  companies: CompanyWithDistance[],
  userLat: number,
  userLng: number,
  radiusMiles: number,
): CompanyWithDistance[] {
  return sortByDistance(companies, userLat, userLng).filter(
    (c) => (c.distance ?? Infinity) <= radiusMiles,
  );
}
