export interface Region {
  name: string;
  slug: string;
  states: string[];
  description: string;
}

export const REGIONS: Region[] = [
  {
    name: "Northeast",
    slug: "northeast",
    states: ["CT", "DE", "ME", "MD", "MA", "NH", "NJ", "NY", "PA", "RI", "VT"],
    description:
      "From Boston Logan to Teterboro, the Northeast corridor is home to some of the nation's busiest private aviation hubs and most discerning aircraft owners.",
  },
  {
    name: "Southeast",
    slug: "southeast",
    states: [
      "AL", "AR", "FL", "GA", "KY", "LA", "MS", "NC", "SC", "TN", "VA", "WV",
    ],
    description:
      "Year-round flying weather and major hubs like Opa-Locka, DeKalb-Peachtree, and Charlotte make the Southeast a thriving market for aircraft detailing.",
  },
  {
    name: "Midwest",
    slug: "midwest",
    states: [
      "IL", "IN", "IA", "KS", "MI", "MN", "MO", "NE", "ND", "OH", "SD", "WI",
    ],
    description:
      "The heartland's corporate aviation centers in Chicago, Minneapolis, and Columbus support a robust aircraft detailing industry.",
  },
  {
    name: "Southwest",
    slug: "southwest",
    states: ["AZ", "NM", "OK", "TX"],
    description:
      "Sun-baked hangars in Dallas, Phoenix, and Houston demand specialized detailing expertise to combat UV damage and desert conditions.",
  },
  {
    name: "Mountain West",
    slug: "mountain-west",
    states: ["CO", "ID", "MT", "NV", "UT", "WY"],
    description:
      "High-altitude airports from Aspen to Sun Valley serve an elite clientele that expects premium detailing services.",
  },
  {
    name: "Pacific",
    slug: "pacific",
    states: ["AK", "CA", "HI", "OR", "WA"],
    description:
      "From Van Nuys to Boeing Field, the Pacific region combines Hollywood glamour with tech-industry precision in its approach to aircraft care.",
  },
];

export function getRegionBySlug(slug: string): Region | undefined {
  return REGIONS.find((r) => r.slug === slug);
}

export function getRegionForState(stateCode: string): Region | undefined {
  return REGIONS.find((r) => r.states.includes(stateCode));
}

export function getStatesInRegion(slug: string): string[] {
  return getRegionBySlug(slug)?.states ?? [];
}
