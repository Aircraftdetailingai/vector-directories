-- Seed 25 realistic aircraft detailing companies
-- Spread across US states/cities near major airports
-- Mix of tiers: 3 featured, 5 premium, 7 enhanced, 10 basic

INSERT INTO directory_companies (
  name, slug, description, website, phone, email,
  state, city, category, status, tier,
  insurance_amount, insurance_verified,
  service_quality_score, certification_score, insurance_compliance_score,
  customer_review_score, experience_score, responsiveness_score,
  years_in_business, airport_count, certification_count, location_count, photo_count
) VALUES

-- ============================================================
-- FEATURED TIER (3)
-- ============================================================
(
  'Aero Shine Detailing',
  'aero-shine-detailing',
  'Premier aircraft detailing company serving the Scottsdale and Phoenix metro area. Specializing in full exterior paint correction, ceramic coatings, and interior restoration for turboprops, jets, and helicopters. FAA-compliant products and processes with over two decades of experience.',
  'https://www.aeroshinedetailing.com',
  '(480) 555-0173',
  'info@aeroshinedetailing.com',
  'Arizona', 'Scottsdale', 'Aircraft Detailing', 'published', 'featured',
  5000000, true,
  96, 95, 98, 97, 96, 94,
  22, 6, 12, 3, 48
),
(
  'SkyClean Aviation Services',
  'skyclean-aviation-services',
  'Industry-leading aircraft detailing and appearance management based at Teterboro Airport. We provide white-glove detailing for corporate fleets, private jets, and charter operators throughout the New York tri-state area. Certified by NATA and multiple OEM programs.',
  'https://www.skycleanaviation.com',
  '(201) 555-0289',
  'service@skycleanaviation.com',
  'New Jersey', 'Teterboro', 'Aircraft Detailing', 'published', 'featured',
  5000000, true,
  97, 98, 97, 96, 98, 95,
  25, 8, 11, 4, 62
),
(
  'Platinum Air Wash',
  'platinum-air-wash',
  'Southern California''s top-rated aircraft detailing provider operating out of Van Nuys Airport. Full-service exterior wash, brightwork polishing, leather conditioning, and long-term ceramic protection packages. Trusted by celebrity clients and Fortune 500 flight departments.',
  'https://www.platinumairwash.com',
  '(818) 555-0341',
  'bookings@platinumairwash.com',
  'California', 'Van Nuys', 'Aircraft Detailing', 'published', 'featured',
  5000000, true,
  95, 96, 96, 98, 95, 97,
  20, 7, 10, 3, 55
),

-- ============================================================
-- PREMIUM TIER (5)
-- ============================================================
(
  'JetBright Detailing Co.',
  'jetbright-detailing-co',
  'Full-service aircraft detailing at Addison Airport serving the Dallas-Fort Worth metroplex. Specialties include paint sealant application, exhaust soot removal, and cockpit deep cleaning. We work with Part 91 and Part 135 operators of all sizes.',
  'https://www.jetbrightdetailing.com',
  '(972) 555-0412',
  'hello@jetbrightdetailing.com',
  'Texas', 'Addison', 'Aircraft Detailing', 'published', 'premium',
  3000000, true,
  92, 90, 94, 91, 89, 93,
  15, 5, 9, 2, 38
),
(
  'Eagle Aviation Appearance',
  'eagle-aviation-appearance',
  'Providing meticulous aircraft detailing services at Centennial Airport south of Denver. Our team is trained in composite-safe washing techniques, de-ice fluid removal, and high-altitude UV protection coatings. Serving front-range operators since 2010.',
  'https://www.eagleaviationappearance.com',
  '(303) 555-0567',
  'contact@eagleaviationappearance.com',
  'Colorado', 'Englewood', 'Aircraft Detailing', 'published', 'premium',
  3000000, true,
  90, 88, 92, 93, 87, 91,
  16, 4, 8, 2, 34
),
(
  'TarmacGlow Aircraft Care',
  'tarmacglow-aircraft-care',
  'Atlanta-based aircraft appearance specialists operating out of DeKalb-Peachtree Airport. We offer comprehensive detailing packages including belly wash, leading edge treatment, landing gear cleaning, and interior sanitization. Bonded and fully insured.',
  'https://www.tarmacglow.com',
  '(404) 555-0623',
  'ops@tarmacglow.com',
  'Georgia', 'Atlanta', 'Aircraft Detailing', 'published', 'premium',
  4000000, true,
  91, 89, 93, 90, 91, 88,
  12, 5, 7, 2, 30
),
(
  'Clearcoat Aviation Detailing',
  'clearcoat-aviation-detailing',
  'Naperville-area aircraft detailing team operating from DuPage Airport. We specialize in paint restoration, ceramic nano-coatings, and recurring maintenance wash programs for corporate flight departments in the greater Chicago region.',
  'https://www.clearcoataviation.com',
  '(630) 555-0198',
  'info@clearcoataviation.com',
  'Illinois', 'West Chicago', 'Aircraft Detailing', 'published', 'premium',
  2000000, true,
  89, 91, 90, 88, 90, 92,
  14, 4, 8, 2, 27
),
(
  'Pacific Aero Detail',
  'pacific-aero-detail',
  'Boeing Field-based aircraft detailing experts providing premium services across the Puget Sound region. Our environmentally compliant wash process uses biodegradable products and water reclamation systems. Specialists in seaplane and floatplane detailing.',
  'https://www.pacificaerodetail.com',
  '(206) 555-0745',
  'service@pacificaerodetail.com',
  'Washington', 'Seattle', 'Aircraft Detailing', 'published', 'premium',
  3000000, true,
  93, 87, 91, 92, 88, 90,
  18, 5, 9, 2, 32
),

-- ============================================================
-- ENHANCED TIER (7)
-- ============================================================
(
  'Wingshine Mobile Detailing',
  'wingshine-mobile-detailing',
  'Mobile aircraft detailing service covering South Florida from Boca Raton to Fort Lauderdale Executive Airport. We bring our equipment to your hangar for on-site exterior wash, interior detailing, and brightwork polishing. Flexible scheduling for transient aircraft.',
  'https://www.wingshinemobile.com',
  '(954) 555-0832',
  'book@wingshinemobile.com',
  'Florida', 'Fort Lauderdale', 'Aircraft Detailing', 'published', 'enhanced',
  2000000, true,
  85, 82, 88, 86, 80, 87,
  8, 4, 5, 1, 22
),
(
  'Altitude Appearance Group',
  'altitude-appearance-group',
  'Professional aircraft detailing company based at Centennial Airport serving Colorado Springs and the greater Denver area. Interior deep-clean specialists with expertise in leather repair, carpet shampooing, and avionics panel cleaning for King Air and Citation platforms.',
  'https://www.altitudeappearancegroup.com',
  '(719) 555-0154',
  'info@altitudeappearancegroup.com',
  'Colorado', 'Colorado Springs', 'Aircraft Detailing', 'published', 'enhanced',
  2000000, true,
  83, 80, 86, 84, 78, 85,
  6, 3, 5, 1, 18
),
(
  'Hangar Fresh Detailing',
  'hangar-fresh-detailing',
  'Nashville-based aircraft detailing operating from John C. Tune Airport. Offering wash, wax, and interior cleaning packages for single-engine piston aircraft through mid-size jets. We also provide post-maintenance detail services and pre-purchase cosmetic inspections.',
  'https://www.hangarfreshdetailing.com',
  '(615) 555-0276',
  'team@hangarfreshdetailing.com',
  'Tennessee', 'Nashville', 'Aircraft Detailing', 'published', 'enhanced',
  1500000, true,
  84, 79, 85, 87, 76, 83,
  7, 3, 4, 1, 20
),
(
  'Flightline Polishing Pros',
  'flightline-polishing-pros',
  'Expert aircraft polishing and detailing at Hooks Memorial Airport north of Houston. We specialize in bare metal polishing for warbirds and vintage aircraft, as well as modern paint sealant treatments. Our team has restored award-winning show aircraft.',
  'https://www.flightlinepolishingpros.com',
  '(281) 555-0493',
  'contact@flightlinepolishingpros.com',
  'Texas', 'Spring', 'Aircraft Detailing', 'published', 'enhanced',
  2000000, true,
  86, 84, 82, 85, 83, 80,
  10, 3, 6, 1, 25
),
(
  'Tango Sierra Aviation Wash',
  'tango-sierra-aviation-wash',
  'Aircraft wash and detailing service at Montgomery-Gibbs Executive Airport in San Diego. We provide quick-turn wash services for transient jets, scheduled maintenance washes for based aircraft, and full cosmetic restoration packages.',
  'https://www.tangosierrawash.com',
  '(858) 555-0618',
  'dispatch@tangosierrawash.com',
  'California', 'San Diego', 'Aircraft Detailing', 'published', 'enhanced',
  2000000, true,
  82, 81, 87, 83, 79, 86,
  9, 3, 5, 1, 19
),
(
  'Blue Yonder Aircraft Care',
  'blue-yonder-aircraft-care',
  'Serving the Charlotte-Douglas area with reliable aircraft detailing from Wilson Air Center. Our trained technicians handle everything from light piston singles to Gulfstream-class aircraft. We offer volume discounts for fleet operators and FBOs.',
  'https://www.blueyonderaircraftcare.com',
  '(704) 555-0387',
  'service@blueyonderaircraftcare.com',
  'North Carolina', 'Charlotte', 'Aircraft Detailing', 'published', 'enhanced',
  1500000, true,
  81, 78, 84, 82, 77, 84,
  5, 2, 4, 1, 16
),
(
  'Stratus Shine Detailing',
  'stratus-shine-detailing',
  'Minneapolis-based aircraft detailing company at Flying Cloud Airport. Winter de-ice residue removal specialists with heated hangar wash capabilities. We keep your aircraft looking sharp through harsh Midwest winters and beyond.',
  'https://www.stratusshinedetailing.com',
  '(952) 555-0729',
  'info@stratusshinedetailing.com',
  'Minnesota', 'Eden Prairie', 'Aircraft Detailing', 'published', 'enhanced',
  2000000, true,
  80, 77, 86, 81, 75, 82,
  7, 2, 4, 1, 14
),

-- ============================================================
-- BASIC TIER (10)
-- ============================================================
(
  'Prop Wash Professionals',
  'prop-wash-professionals',
  'Affordable aircraft wash and basic detailing services at Aurora State Airport in Oregon. We focus on exterior wash and dry for general aviation aircraft. Quick turnaround times and competitive pricing for local pilots and flying clubs.',
  'https://www.propwashpros.com',
  '(503) 555-0841',
  'info@propwashpros.com',
  'Oregon', 'Aurora', 'Aircraft Detailing', 'published', 'basic',
  1000000, false,
  72, 65, 74, 75, 62, 70,
  3, 1, 2, 1, 8
),
(
  'Taxiway Detail Services',
  'taxiway-detail-services',
  'Aircraft cleaning and appearance services at Morristown Municipal Airport. We offer basic wash packages, interior vacuuming, and window cleaning for light jets and turboprops. Growing team with a passion for aviation.',
  'https://www.taxiwaydetail.com',
  '(973) 555-0156',
  'hello@taxiwaydetail.com',
  'New Jersey', 'Morristown', 'Aircraft Detailing', 'published', 'basic',
  1000000, false,
  70, 63, 72, 71, 60, 68,
  2, 1, 1, 1, 6
),
(
  'Runway Ready Cleaning',
  'runway-ready-cleaning',
  'Basic aircraft wash and interior cleaning at Chandler Municipal Airport. We serve the East Valley with no-frills, reliable wash services for piston singles and light twins. Walk-in availability most weekdays.',
  'https://www.runwayreadycleaning.com',
  '(480) 555-0934',
  'wash@runwayreadycleaning.com',
  'Arizona', 'Chandler', 'Aircraft Detailing', 'published', 'basic',
  1000000, true,
  74, 68, 76, 73, 65, 72,
  4, 2, 3, 1, 10
),
(
  'CloudNine Aircraft Wash',
  'cloudnine-aircraft-wash',
  'Friendly aircraft wash crew at Peter O. Knight Airport in Tampa. Exterior hand wash, belly degreasing, and basic interior wipe-down services. We are a veteran-owned small business dedicated to keeping Tampa Bay aircraft clean.',
  'https://www.cloudninewash.com',
  '(813) 555-0267',
  'team@cloudninewash.com',
  'Florida', 'Tampa', 'Aircraft Detailing', 'published', 'basic',
  1000000, true,
  73, 66, 75, 76, 64, 71,
  3, 2, 2, 1, 9
),
(
  'Tailwind Detailing LLC',
  'tailwind-detailing-llc',
  'Startup aircraft detailing service operating at McKinney National Airport north of Dallas. We offer mobile wash and wax services with eco-friendly products. Building our reputation one aircraft at a time.',
  'https://www.tailwinddetailing.com',
  '(469) 555-0512',
  'info@tailwinddetailing.com',
  'Texas', 'McKinney', 'Aircraft Detailing', 'published', 'basic',
  1000000, false,
  68, 60, 70, 72, 58, 66,
  2, 1, 1, 1, 5
),
(
  'FBO Shine Co.',
  'fbo-shine-co',
  'Aircraft detailing services at Manassas Regional Airport serving the Washington DC metro area. We partner with local FBOs to provide on-demand wash services for transient and based aircraft. Convenient scheduling through our online portal.',
  'https://www.fboshineco.com',
  '(703) 555-0648',
  'contact@fboshineco.com',
  'Virginia', 'Manassas', 'Aircraft Detailing', 'published', 'basic',
  1500000, true,
  76, 70, 78, 74, 68, 75,
  5, 2, 3, 1, 12
),
(
  'AirGleam Solutions',
  'airgleam-solutions',
  'General aviation aircraft cleaning company at Gwinnett County Airport near Atlanta. Providing basic through mid-level detailing for single-engine and light multi-engine aircraft. Saturday availability for weekend flyers.',
  'https://www.airgleamsolutions.com',
  '(678) 555-0395',
  'service@airgleamsolutions.com',
  'Georgia', 'Lawrenceville', 'Aircraft Detailing', 'published', 'basic',
  1000000, false,
  71, 64, 73, 70, 61, 69,
  3, 1, 2, 1, 7
),
(
  'Summit Aviation Wash',
  'summit-aviation-wash',
  'Aircraft detailing at Rocky Mountain Metropolitan Airport in Broomfield. We provide hand wash services and basic interior cleaning for piston and turboprop aircraft. Seasonal availability due to weather; primarily operate spring through fall.',
  'https://www.summitaviationwash.com',
  '(303) 555-0873',
  'info@summitaviationwash.com',
  'Colorado', 'Broomfield', 'Aircraft Detailing', 'published', 'basic',
  1000000, false,
  69, 62, 71, 68, 59, 67,
  2, 1, 1, 1, 4
),
(
  'Bayou Aviation Detailing',
  'bayou-aviation-detailing',
  'New Orleans Lakefront Airport-based aircraft wash and detailing crew. Specializing in corrosion-prone coastal environment care including salt residue removal, exhaust trail cleaning, and protective wax coatings. Humidity and heat are no match for our team.',
  'https://www.bayouaviationdetailing.com',
  '(504) 555-0731',
  'dispatch@bayouaviationdetailing.com',
  'Louisiana', 'New Orleans', 'Aircraft Detailing', 'published', 'basic',
  1500000, true,
  75, 69, 77, 74, 67, 73,
  4, 2, 3, 1, 11
),
(
  'Great Lakes Aero Wash',
  'great-lakes-aero-wash',
  'Aircraft washing and basic detailing at Oakland County International Airport in Waterford, Michigan. Serving the Detroit metro aviation community with reliable wash services, bug and oil removal, and windshield polishing. Open year-round with heated hangar access.',
  'https://www.greatlakesaerowash.com',
  '(248) 555-0462',
  'info@greatlakesaerowash.com',
  'Michigan', 'Waterford', 'Aircraft Detailing', 'published', 'basic',
  1000000, true,
  73, 67, 74, 72, 63, 70,
  3, 2, 2, 1, 8
);
