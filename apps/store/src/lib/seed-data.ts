import type { StoreBrand, StoreCategory, StoreProduct, StoreOrder } from "./types";

export const SEED_BRANDS: StoreBrand[] = [
  { id: "b1", name: "Fly Shiny", slug: "fly-shiny", logo_url: null, description: "Professional aircraft polishing and coating products designed for aviation perfection.", supplier_id: null },
  { id: "b2", name: "Autofiber", slug: "autofiber", logo_url: null, description: "Premium microfiber towels and detailing accessories trusted by professionals worldwide.", supplier_id: null },
  { id: "b3", name: "Nuvite", slug: "nuvite", logo_url: null, description: "Industry-leading aircraft metal polishing and surface care systems since 1978.", supplier_id: null },
  { id: "b4", name: "SkyGlide", slug: "skyglide", logo_url: null, description: "Aviation-grade ceramic coatings and sealants for superior surface protection.", supplier_id: null },
];

export const SEED_CATEGORIES: StoreCategory[] = [
  { id: "c1", name: "Polishes", slug: "polishes", description: "Metal and paint polishing compounds for aircraft surfaces.", parent_id: null, sort_order: 1 },
  { id: "c2", name: "Towels", slug: "towels", description: "Microfiber and specialty towels for aviation detailing.", parent_id: null, sort_order: 2 },
  { id: "c3", name: "Ceramic Coatings", slug: "ceramic-coatings", description: "Long-lasting ceramic protection for aircraft surfaces.", parent_id: null, sort_order: 3 },
  { id: "c4", name: "Cleaners", slug: "cleaners", description: "Degreasers, wash soaps, and surface cleaners for aviation.", parent_id: null, sort_order: 4 },
  { id: "c5", name: "Tools", slug: "tools", description: "Polishers, applicators, and specialty detailing tools.", parent_id: null, sort_order: 5 },
  { id: "c6", name: "Kits", slug: "kits", description: "Complete detailing kits and bundles for every job.", parent_id: null, sort_order: 6 },
];

export const SEED_PRODUCTS: StoreProduct[] = [
  {
    id: "p1", supplier_id: "s1", brand_id: "b3", category_id: "c1",
    name: "NuShine II Grade S Metal Polish", slug: "nuvite-nushine-ii-grade-s",
    description: "Professional-grade aircraft metal polish for achieving a mirror-like finish on aluminum and bare metal surfaces. Grade S is the finest cut, perfect for final finishing and maintenance polishing.",
    short_description: "Fine-cut metal polish for mirror finishes on aircraft aluminum.",
    base_price: 89.99, compare_at_price: null, sku: "NUV-NS2-S-32", status: "active", is_featured: true,
    weight_oz: 32, dimensions_json: null, tags: ["polish", "metal", "aluminum"],
    created_at: "2025-01-15T00:00:00Z", updated_at: "2025-01-15T00:00:00Z",
    brand: SEED_BRANDS[2], category: SEED_CATEGORIES[0],
    images: [{ id: "i1", product_id: "p1", url: "/placeholder-product.jpg", alt_text: "NuShine II Grade S", sort_order: 0, is_primary: true }],
    variants: [
      { id: "v1", product_id: "p1", name: "32 oz", sku: "NUV-NS2-S-32", price: 89.99, compare_at_price: null, stock_quantity: 45, sort_order: 0 },
      { id: "v2", product_id: "p1", name: "1 Gallon", sku: "NUV-NS2-S-128", price: 279.99, compare_at_price: 299.99, stock_quantity: 12, sort_order: 1 },
    ],
  },
  {
    id: "p2", supplier_id: "s1", brand_id: "b1", category_id: "c1",
    name: "Fly Shiny Aircraft Polish Pro", slug: "fly-shiny-aircraft-polish-pro",
    description: "All-in-one aircraft polish that cleans, polishes, and protects painted and gel-coated surfaces. Safe for all aviation paint systems.",
    short_description: "All-in-one polish for painted aircraft surfaces.",
    base_price: 49.99, compare_at_price: 59.99, sku: "FS-APP-16", status: "active", is_featured: true,
    weight_oz: 16, dimensions_json: null, tags: ["polish", "paint", "all-in-one"],
    created_at: "2025-01-20T00:00:00Z", updated_at: "2025-01-20T00:00:00Z",
    brand: SEED_BRANDS[0], category: SEED_CATEGORIES[0],
    images: [{ id: "i2", product_id: "p2", url: "/placeholder-product.jpg", alt_text: "Fly Shiny Aircraft Polish Pro", sort_order: 0, is_primary: true }],
    variants: [
      { id: "v3", product_id: "p2", name: "16 oz", sku: "FS-APP-16", price: 49.99, compare_at_price: 59.99, stock_quantity: 78, sort_order: 0 },
      { id: "v4", product_id: "p2", name: "32 oz", sku: "FS-APP-32", price: 84.99, compare_at_price: 99.99, stock_quantity: 34, sort_order: 1 },
    ],
  },
  {
    id: "p3", supplier_id: "s1", brand_id: "b2", category_id: "c2",
    name: "Autofiber Zeroedge Detailing Towel 10-Pack", slug: "autofiber-zeroedge-towel-10pk",
    description: "Premium edgeless microfiber towels designed for scratch-free detailing. 70/30 blend, 350 GSM, perfect for aircraft paint, windows, and interior surfaces.",
    short_description: "Edgeless microfiber towels for scratch-free detailing.",
    base_price: 34.99, compare_at_price: null, sku: "AF-ZE-10PK", status: "active", is_featured: true,
    weight_oz: 12, dimensions_json: null, tags: ["towel", "microfiber", "edgeless"],
    created_at: "2025-02-01T00:00:00Z", updated_at: "2025-02-01T00:00:00Z",
    brand: SEED_BRANDS[1], category: SEED_CATEGORIES[1],
    images: [{ id: "i3", product_id: "p3", url: "/placeholder-product.jpg", alt_text: "Autofiber Zeroedge Towels", sort_order: 0, is_primary: true }],
    variants: [
      { id: "v5", product_id: "p3", name: "10-Pack", sku: "AF-ZE-10PK", price: 34.99, compare_at_price: null, stock_quantity: 150, sort_order: 0 },
      { id: "v6", product_id: "p3", name: "25-Pack", sku: "AF-ZE-25PK", price: 74.99, compare_at_price: 87.50, stock_quantity: 60, sort_order: 1 },
    ],
  },
  {
    id: "p4", supplier_id: "s1", brand_id: "b4", category_id: "c3",
    name: "SkyGlide AeroShield Ceramic Coating", slug: "skyglide-aeroshield-ceramic",
    description: "Professional-grade 9H ceramic coating engineered specifically for aircraft surfaces. Provides up to 3 years of protection against UV, oxidation, and contamination.",
    short_description: "9H ceramic coating with 3-year aircraft surface protection.",
    base_price: 199.99, compare_at_price: 249.99, sku: "SG-AS-50", status: "active", is_featured: true,
    weight_oz: 3.4, dimensions_json: null, tags: ["ceramic", "coating", "protection"],
    created_at: "2025-02-05T00:00:00Z", updated_at: "2025-02-05T00:00:00Z",
    brand: SEED_BRANDS[3], category: SEED_CATEGORIES[2],
    images: [{ id: "i4", product_id: "p4", url: "/placeholder-product.jpg", alt_text: "SkyGlide AeroShield", sort_order: 0, is_primary: true }],
    variants: [
      { id: "v7", product_id: "p4", name: "50ml", sku: "SG-AS-50", price: 199.99, compare_at_price: 249.99, stock_quantity: 25, sort_order: 0 },
      { id: "v8", product_id: "p4", name: "100ml", sku: "SG-AS-100", price: 349.99, compare_at_price: 449.99, stock_quantity: 10, sort_order: 1 },
    ],
  },
  {
    id: "p5", supplier_id: "s1", brand_id: "b1", category_id: "c4",
    name: "Fly Shiny AeroWash Aircraft Soap", slug: "fly-shiny-aerowash-soap",
    description: "pH-neutral aircraft wash soap that gently removes dirt, bugs, and exhaust residue without stripping wax or ceramic coatings. Concentrated formula.",
    short_description: "pH-neutral wash soap safe for coated aircraft.",
    base_price: 29.99, compare_at_price: null, sku: "FS-AW-32", status: "active", is_featured: false,
    weight_oz: 32, dimensions_json: null, tags: ["soap", "wash", "ph-neutral"],
    created_at: "2025-02-10T00:00:00Z", updated_at: "2025-02-10T00:00:00Z",
    brand: SEED_BRANDS[0], category: SEED_CATEGORIES[3],
    images: [{ id: "i5", product_id: "p5", url: "/placeholder-product.jpg", alt_text: "Fly Shiny AeroWash", sort_order: 0, is_primary: true }],
    variants: [
      { id: "v9", product_id: "p5", name: "32 oz", sku: "FS-AW-32", price: 29.99, compare_at_price: null, stock_quantity: 90, sort_order: 0 },
      { id: "v10", product_id: "p5", name: "1 Gallon", sku: "FS-AW-128", price: 89.99, compare_at_price: null, stock_quantity: 40, sort_order: 1 },
    ],
  },
  {
    id: "p6", supplier_id: "s1", brand_id: "b3", category_id: "c5",
    name: "Nuvite AviationMaster Rotary Polisher", slug: "nuvite-aviationmaster-polisher",
    description: "Variable-speed rotary polisher designed for aircraft detailing. 7-inch backing plate, 1200W motor, 600-3000 RPM. Includes carrying case and spare brushes.",
    short_description: "Professional 7-inch rotary polisher for aircraft detailing.",
    base_price: 349.99, compare_at_price: 399.99, sku: "NUV-AM-POL", status: "active", is_featured: false,
    weight_oz: 96, dimensions_json: { length: 14, width: 8, height: 7 }, tags: ["polisher", "rotary", "tool"],
    created_at: "2025-02-12T00:00:00Z", updated_at: "2025-02-12T00:00:00Z",
    brand: SEED_BRANDS[2], category: SEED_CATEGORIES[4],
    images: [{ id: "i6", product_id: "p6", url: "/placeholder-product.jpg", alt_text: "Nuvite AviationMaster Polisher", sort_order: 0, is_primary: true }],
    variants: [
      { id: "v11", product_id: "p6", name: "Standard Kit", sku: "NUV-AM-POL", price: 349.99, compare_at_price: 399.99, stock_quantity: 15, sort_order: 0 },
    ],
  },
  {
    id: "p7", supplier_id: "s1", brand_id: "b1", category_id: "c6",
    name: "Fly Shiny Complete Aircraft Detailing Kit", slug: "fly-shiny-complete-kit",
    description: "Everything you need to detail an aircraft in one kit: AeroWash soap, Aircraft Polish Pro, Ceramic Quick Detailer, 5 microfiber towels, 2 applicator pads, and a detail spray bottle.",
    short_description: "Complete kit with soap, polish, ceramic detailer, and towels.",
    base_price: 179.99, compare_at_price: 219.99, sku: "FS-CK-01", status: "active", is_featured: true,
    weight_oz: 80, dimensions_json: { length: 16, width: 12, height: 8 }, tags: ["kit", "bundle", "complete"],
    created_at: "2025-02-15T00:00:00Z", updated_at: "2025-02-15T00:00:00Z",
    brand: SEED_BRANDS[0], category: SEED_CATEGORIES[5],
    images: [{ id: "i7", product_id: "p7", url: "/placeholder-product.jpg", alt_text: "Fly Shiny Complete Kit", sort_order: 0, is_primary: true }],
    variants: [
      { id: "v12", product_id: "p7", name: "Standard Kit", sku: "FS-CK-01", price: 179.99, compare_at_price: 219.99, stock_quantity: 30, sort_order: 0 },
      { id: "v13", product_id: "p7", name: "Pro Kit (2x everything)", sku: "FS-CK-02", price: 319.99, compare_at_price: 399.99, stock_quantity: 12, sort_order: 1 },
    ],
  },
  {
    id: "p8", supplier_id: "s1", brand_id: "b4", category_id: "c4",
    name: "SkyGlide AeroPrep Surface Degreaser", slug: "skyglide-aeroprep-degreaser",
    description: "Aviation-safe surface degreaser and prep solution. Removes oils, silicones, and contaminants before polishing or coating application.",
    short_description: "Surface prep degreaser for pre-polish and pre-coating.",
    base_price: 39.99, compare_at_price: null, sku: "SG-AP-32", status: "active", is_featured: false,
    weight_oz: 32, dimensions_json: null, tags: ["degreaser", "prep", "cleaner"],
    created_at: "2025-02-18T00:00:00Z", updated_at: "2025-02-18T00:00:00Z",
    brand: SEED_BRANDS[3], category: SEED_CATEGORIES[3],
    images: [{ id: "i8", product_id: "p8", url: "/placeholder-product.jpg", alt_text: "SkyGlide AeroPrep", sort_order: 0, is_primary: true }],
    variants: [
      { id: "v14", product_id: "p8", name: "32 oz", sku: "SG-AP-32", price: 39.99, compare_at_price: null, stock_quantity: 65, sort_order: 0 },
    ],
  },
];

export const SEED_ORDERS: StoreOrder[] = [];
