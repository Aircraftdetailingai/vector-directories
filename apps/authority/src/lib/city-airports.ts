export interface Airport {
  code: string;
  name: string;
}

export interface AirportDetail {
  code: string;
  name: string;
  cities: { state: string; city: string }[];
}

/**
 * Convert IATA code to ICAO code for continental US airports.
 * Prepends "K" to the 3-letter IATA code: MIA → KMIA, LAX → KLAX.
 */
export function toICAO(iataCode: string): string {
  return `K${iataCode.toUpperCase()}`;
}

/**
 * Seed mapping of major US cities to nearby airports.
 * Keys are "StateCode:CityName" for unique lookup (e.g., "FL:Miami").
 * Replace with a database query when an airports table is available.
 */
const CITY_AIRPORTS: Record<string, Airport[]> = {
  // Florida
  "FL:Miami": [
    { code: "MIA", name: "Miami International Airport" },
    { code: "OPF", name: "Miami-Opa Locka Executive Airport" },
    { code: "FLL", name: "Fort Lauderdale-Hollywood International" },
    { code: "TMB", name: "Miami Executive Airport" },
  ],
  "FL:Orlando": [
    { code: "MCO", name: "Orlando International Airport" },
    { code: "SFB", name: "Orlando Sanford International" },
    { code: "ORL", name: "Orlando Executive Airport" },
  ],
  "FL:Tampa": [
    { code: "TPA", name: "Tampa International Airport" },
    { code: "PIE", name: "St. Pete-Clearwater International" },
  ],
  "FL:Jacksonville": [
    { code: "JAX", name: "Jacksonville International Airport" },
    { code: "CRG", name: "Jacksonville Executive at Craig Airport" },
  ],
  "FL:Fort Lauderdale": [
    { code: "FLL", name: "Fort Lauderdale-Hollywood International" },
    { code: "FXE", name: "Fort Lauderdale Executive Airport" },
  ],
  "FL:Naples": [
    { code: "APF", name: "Naples Municipal Airport" },
    { code: "RSW", name: "Southwest Florida International" },
  ],

  // California
  "CA:Los Angeles": [
    { code: "LAX", name: "Los Angeles International Airport" },
    { code: "VNY", name: "Van Nuys Airport" },
    { code: "BUR", name: "Hollywood Burbank Airport" },
    { code: "SNA", name: "John Wayne Airport" },
    { code: "SMO", name: "Santa Monica Airport" },
  ],
  "CA:San Francisco": [
    { code: "SFO", name: "San Francisco International Airport" },
    { code: "OAK", name: "Oakland International Airport" },
    { code: "SJC", name: "San Jose International Airport" },
  ],
  "CA:San Diego": [
    { code: "SAN", name: "San Diego International Airport" },
    { code: "CRQ", name: "McClellan-Palomar Airport" },
  ],
  "CA:San Jose": [
    { code: "SJC", name: "San Jose International Airport" },
    { code: "RHV", name: "Reid-Hillview Airport" },
  ],
  "CA:Sacramento": [
    { code: "SMF", name: "Sacramento International Airport" },
    { code: "MHR", name: "Mather Airport" },
  ],

  // Texas
  "TX:Dallas": [
    { code: "DFW", name: "Dallas/Fort Worth International" },
    { code: "DAL", name: "Dallas Love Field" },
    { code: "ADS", name: "Addison Airport" },
  ],
  "TX:Houston": [
    { code: "IAH", name: "George Bush Intercontinental" },
    { code: "HOU", name: "William P. Hobby Airport" },
    { code: "SGR", name: "Sugar Land Regional Airport" },
  ],
  "TX:Austin": [
    { code: "AUS", name: "Austin-Bergstrom International" },
  ],
  "TX:San Antonio": [
    { code: "SAT", name: "San Antonio International Airport" },
  ],

  // New York
  "NY:New York": [
    { code: "JFK", name: "John F. Kennedy International" },
    { code: "LGA", name: "LaGuardia Airport" },
    { code: "EWR", name: "Newark Liberty International" },
    { code: "TEB", name: "Teterboro Airport" },
    { code: "HPN", name: "Westchester County Airport" },
  ],

  // Arizona
  "AZ:Phoenix": [
    { code: "PHX", name: "Phoenix Sky Harbor International" },
    { code: "SDL", name: "Scottsdale Airport" },
    { code: "DVT", name: "Phoenix Deer Valley Airport" },
  ],
  "AZ:Scottsdale": [
    { code: "SDL", name: "Scottsdale Airport" },
    { code: "PHX", name: "Phoenix Sky Harbor International" },
  ],
  "AZ:Tucson": [
    { code: "TUS", name: "Tucson International Airport" },
  ],

  // Illinois
  "IL:Chicago": [
    { code: "ORD", name: "O'Hare International Airport" },
    { code: "MDW", name: "Chicago Midway International" },
    { code: "PWK", name: "Chicago Executive Airport" },
    { code: "DPA", name: "DuPage Airport" },
  ],

  // Georgia
  "GA:Atlanta": [
    { code: "ATL", name: "Hartsfield-Jackson Atlanta International" },
    { code: "PDK", name: "DeKalb-Peachtree Airport" },
    { code: "FTY", name: "Fulton County Airport" },
  ],

  // Colorado
  "CO:Denver": [
    { code: "DEN", name: "Denver International Airport" },
    { code: "APA", name: "Centennial Airport" },
    { code: "BJC", name: "Rocky Mountain Metropolitan Airport" },
  ],

  // Nevada
  "NV:Las Vegas": [
    { code: "LAS", name: "Harry Reid International Airport" },
    { code: "HND", name: "Henderson Executive Airport" },
    { code: "VGT", name: "North Las Vegas Airport" },
  ],

  // Washington
  "WA:Seattle": [
    { code: "SEA", name: "Seattle-Tacoma International Airport" },
    { code: "BFI", name: "Boeing Field/King County International" },
    { code: "PAE", name: "Paine Field" },
  ],

  // New Jersey
  "NJ:Teterboro": [
    { code: "TEB", name: "Teterboro Airport" },
    { code: "EWR", name: "Newark Liberty International" },
  ],

  // Connecticut
  "CT:Hartford": [
    { code: "BDL", name: "Bradley International Airport" },
  ],

  // Massachusetts
  "MA:Boston": [
    { code: "BOS", name: "Boston Logan International Airport" },
    { code: "BED", name: "Laurence G. Hanscom Field" },
  ],

  // Pennsylvania
  "PA:Philadelphia": [
    { code: "PHL", name: "Philadelphia International Airport" },
    { code: "PNE", name: "Northeast Philadelphia Airport" },
  ],

  // North Carolina
  "NC:Charlotte": [
    { code: "CLT", name: "Charlotte Douglas International" },
  ],

  // Ohio
  "OH:Columbus": [
    { code: "CMH", name: "John Glenn Columbus International" },
  ],

  // Michigan
  "MI:Detroit": [
    { code: "DTW", name: "Detroit Metropolitan Wayne County" },
    { code: "YIP", name: "Willow Run Airport" },
  ],

  // Tennessee
  "TN:Nashville": [
    { code: "BNA", name: "Nashville International Airport" },
    { code: "JWN", name: "John C. Tune Airport" },
  ],

  // Oregon
  "OR:Portland": [
    { code: "PDX", name: "Portland International Airport" },
    { code: "HIO", name: "Portland-Hillsboro Airport" },
  ],

  // Missouri
  "MO:St. Louis": [
    { code: "STL", name: "St. Louis Lambert International" },
    { code: "SUS", name: "Spirit of St. Louis Airport" },
  ],
};

export function getAirportsForCity(
  stateCode: string,
  cityName: string,
): Airport[] {
  return CITY_AIRPORTS[`${stateCode}:${cityName}`] ?? [];
}

/* ──────────────────────────────────────────────────────────────────────────
   Reverse lookups — airport code → details / cities
   ────────────────────────────────────────────────────────────────────────── */

let _reverseMap: Map<string, AirportDetail> | null = null;

function getReverseMap(): Map<string, AirportDetail> {
  if (_reverseMap) return _reverseMap;

  const map = new Map<string, AirportDetail>();

  for (const [key, airports] of Object.entries(CITY_AIRPORTS)) {
    const [state, city] = key.split(":");
    for (const airport of airports) {
      const existing = map.get(airport.code);
      if (existing) {
        // Avoid duplicate city entries
        const alreadyHasCity = existing.cities.some(
          (c) => c.state === state && c.city === city,
        );
        if (!alreadyHasCity) {
          existing.cities.push({ state, city });
        }
      } else {
        map.set(airport.code, {
          code: airport.code,
          name: airport.name,
          cities: [{ state, city }],
        });
      }
    }
  }

  _reverseMap = map;
  return map;
}

/** Returns all unique airports with their associated cities, sorted by code. */
export function getAllAirports(): AirportDetail[] {
  return [...getReverseMap().values()].sort((a, b) =>
    a.code.localeCompare(b.code),
  );
}

/** Returns a single airport's details by IATA code (case-insensitive). */
export function getAirportByCode(code: string): AirportDetail | undefined {
  return getReverseMap().get(code.toUpperCase());
}

/** Returns cities served by an airport (for company queries). */
export function getCitiesForAirport(
  code: string,
): { state: string; city: string }[] {
  return getAirportByCode(code)?.cities ?? [];
}
