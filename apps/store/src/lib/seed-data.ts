import type { StoreCategory } from "./types";

export const SEED_CATEGORIES: StoreCategory[] = [
  { id: "c1", name: "Polishes", slug: "polishes", description: "Metal and paint polishing compounds for aircraft surfaces.", parent_id: null, sort_order: 1 },
  { id: "c2", name: "Towels", slug: "towels", description: "Microfiber and specialty towels for aviation detailing.", parent_id: null, sort_order: 2 },
  { id: "c3", name: "Ceramic Coatings", slug: "ceramic-coatings", description: "Long-lasting ceramic protection for aircraft surfaces.", parent_id: null, sort_order: 3 },
  { id: "c4", name: "Cleaners", slug: "cleaners", description: "Degreasers, wash soaps, and surface cleaners for aviation.", parent_id: null, sort_order: 4 },
  { id: "c5", name: "Tools", slug: "tools", description: "Polishers, applicators, and specialty detailing tools.", parent_id: null, sort_order: 5 },
  { id: "c6", name: "Kits", slug: "kits", description: "Complete detailing kits and bundles for every job.", parent_id: null, sort_order: 6 },
];
