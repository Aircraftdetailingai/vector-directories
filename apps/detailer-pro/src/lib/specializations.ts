export interface Specialization {
  name: string;
  slug: string;
  description: string;
  icon: string; // short label for dark UI
}

export const SPECIALIZATIONS: Specialization[] = [
  {
    name: "Private Jets",
    slug: "private-jets",
    description:
      "Detailing services for business jets and private aircraft — Gulfstream, Bombardier, Cessna Citation, Dassault Falcon, and more.",
    icon: "JET",
  },
  {
    name: "Turboprops",
    slug: "turboprops",
    description:
      "Specialized care for turboprop aircraft — King Air, Pilatus PC-12, TBM, Daher, and regional turboprops.",
    icon: "TBP",
  },
  {
    name: "Helicopters",
    slug: "helicopters",
    description:
      "Rotorcraft detailing for helicopters of all sizes — Robinson, Bell, Airbus, Sikorsky, and Leonardo.",
    icon: "HEL",
  },
  {
    name: "Commercial Aircraft",
    slug: "commercial",
    description:
      "Large-scale detailing for airlines and commercial operators — Boeing, Airbus, regional jets, and freighters.",
    icon: "COM",
  },
  {
    name: "Piston Singles",
    slug: "piston-singles",
    description:
      "Detailing for single-engine piston aircraft — Cessna 172, Piper Cherokee, Cirrus SR22, Beechcraft Bonanza.",
    icon: "PSN",
  },
  {
    name: "Piston Twins",
    slug: "piston-twins",
    description:
      "Multi-engine piston aircraft care — Baron, Seneca, Twin Comanche, Cessna 310, and similar platforms.",
    icon: "PTW",
  },
  {
    name: "Vintage & Warbirds",
    slug: "vintage-warbirds",
    description:
      "Preservation detailing for vintage, classic, and warbird aircraft requiring specialized techniques.",
    icon: "VTG",
  },
  {
    name: "Light Sport",
    slug: "light-sport",
    description:
      "Detailing for LSA and ultralight aircraft — Icon A5, Flight Design, Pipistrel, and experimental builds.",
    icon: "LSA",
  },
];

export function getSpecializationBySlug(
  slug: string,
): Specialization | undefined {
  return SPECIALIZATIONS.find((s) => s.slug === slug);
}

export function getAllSpecializations(): Specialization[] {
  return SPECIALIZATIONS;
}
