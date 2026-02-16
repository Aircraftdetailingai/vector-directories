/**
 * Seed script — imports companies from a CSV file into Supabase.
 *
 * Usage:
 *   SUPABASE_URL=xxx SUPABASE_SERVICE_ROLE_KEY=xxx pnpm seed path/to/companies.csv
 *
 * CSV columns:
 *   name, email, phone, website, city, state, airports, insurance_estimate, services
 *
 * "airports" is a comma-separated list of IATA codes (e.g. "MIA,OPF,FLL").
 */

import { readFileSync } from "fs";
import { parse } from "csv-parse/sync";
import { createClient } from "@supabase/supabase-js";
import {
  getAirportByCode,
} from "../apps/directory/src/lib/city-airports";

/* ──────────────────────────────────────────────────────────────────────────
   Configuration
   ────────────────────────────────────────────────────────────────────────── */

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/* ──────────────────────────────────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────────────────────────────────── */

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface CsvRow {
  name: string;
  email: string;
  phone: string;
  website: string;
  city: string;
  state: string;
  airports: string;
  insurance_estimate: string;
  services: string;
}

/* ──────────────────────────────────────────────────────────────────────────
   Main
   ────────────────────────────────────────────────────────────────────────── */

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error("Usage: pnpm seed <path-to-csv>");
    process.exit(1);
  }

  const raw = readFileSync(csvPath, "utf-8");
  const rows: CsvRow[] = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`Found ${rows.length} rows in CSV\n`);

  let companiesInserted = 0;
  let locationsInserted = 0;
  let errors = 0;

  for (const row of rows) {
    if (!row.name?.trim()) {
      console.warn("  Skipping row with empty name");
      errors++;
      continue;
    }

    // ── Generate a unique slug ────────────────────────────────────────────
    let slug = slugify(row.name);
    let attempt = 0;

    while (true) {
      const candidateSlug = attempt === 0 ? slug : `${slug}-${attempt + 1}`;
      const { data: existing } = await supabase
        .from("companies")
        .select("id")
        .eq("slug", candidateSlug)
        .maybeSingle();

      if (!existing) {
        slug = candidateSlug;
        break;
      }
      attempt++;
      if (attempt > 20) {
        console.error(`  Could not generate unique slug for "${row.name}"`);
        errors++;
        break;
      }
    }

    if (attempt > 20) continue;

    // ── Insert company ────────────────────────────────────────────────────
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .insert({
        name: row.name.trim(),
        slug,
        email: row.email?.trim() || null,
        phone: row.phone?.trim() || null,
        website: row.website?.trim() || null,
        city: row.city?.trim() || null,
        state: row.state?.trim().toUpperCase() || null,
        description: null,
        logo_url: null,
        trust_score: 50,
        is_claimed: false,
        claimed_by: null,
        tier: "basic",
      })
      .select("id")
      .single();

    if (companyError) {
      console.error(`  Error inserting "${row.name}":`, companyError.message);
      errors++;
      continue;
    }

    companiesInserted++;
    console.log(`  [+] ${row.name} (${slug})`);

    // ── Insert locations from airport codes ───────────────────────────────
    const airportCodes = (row.airports ?? "")
      .split(",")
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean);

    for (let i = 0; i < airportCodes.length; i++) {
      const code = airportCodes[i];
      const airport = getAirportByCode(code);

      if (!airport) {
        console.warn(`    Warning: Unknown airport code "${code}" — skipping`);
        continue;
      }

      const loc = airport.cities[0] ?? { state: row.state, city: row.city };

      const { error: locError } = await supabase.from("locations").insert({
        company_id: company.id,
        name: airport.name,
        address_line1: airport.name,
        city: loc.city,
        state: loc.state.toUpperCase(),
        zip: "00000",
        is_headquarters: i === 0,
      });

      if (locError) {
        console.error(
          `    Error inserting location "${code}":`,
          locError.message,
        );
        errors++;
      } else {
        locationsInserted++;
        console.log(`      [loc] ${airport.name} (${code})`);
      }
    }
  }

  console.log("\n── Summary ──────────────────────────────────────────────");
  console.log(`  Companies inserted: ${companiesInserted}`);
  console.log(`  Locations inserted: ${locationsInserted}`);
  console.log(`  Errors:             ${errors}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
