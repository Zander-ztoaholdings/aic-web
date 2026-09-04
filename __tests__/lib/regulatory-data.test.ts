import { describe, it, expect } from "vitest";
import {
  regulatoryData,
  countriesForJurisdictions,
  oldestVerification,
  newestVerification,
  stalerThan,
  JURISDICTION_COUNTRIES,
} from "@/app/data/regulatory-data";

describe("verification dates", () => {
  it("gives every jurisdiction its own verification date", () => {
    const missing = Object.values(regulatoryData).filter((c) => !c.verifiedAt);
    expect(missing).toEqual([]);
  });

  it("uses ISO dates so string comparison is chronological", () => {
    for (const c of Object.values(regulatoryData)) {
      expect(c.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  // The public claim is "everything checked since X". If that reported the
  // newest date, one fresh row would vouch for every stale one — the exact
  // overclaim the per-entry dates exist to prevent.
  it("reports the OLDEST date as the dataset-wide guarantee", () => {
    const all = Object.values(regulatoryData).map((c) => c.verifiedAt).sort();
    expect(oldestVerification()).toBe(all[0]);
    expect(newestVerification()).toBe(all[all.length - 1]);
  });

  it("lists entries due for review", () => {
    expect(stalerThan("1900-01-01")).toEqual([]);
    expect(stalerThan("2999-01-01").length).toBe(
      Object.keys(regulatoryData).length
    );
  });
});

describe("jurisdiction to country mapping", () => {
  it("expands the EU to every mapped member state", () => {
    const eu = countriesForJurisdictions(["European Union"]);
    expect(eu).toContain("250"); // France
    expect(eu).toContain("276"); // Germany
    expect(eu).not.toContain("826"); // UK is not in the EU
    expect(eu).not.toContain("578"); // Norway is EEA, not EU
  });

  it("does not attach EU updates to South Africa", () => {
    expect(countriesForJurisdictions(["European Union"])).not.toContain("710");
    expect(countriesForJurisdictions(["South Africa"])).toEqual(["710"]);
  });

  it("de-duplicates when labels overlap", () => {
    const codes = countriesForJurisdictions(["European Union", "Global"]);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("ignores an unknown label instead of throwing", () => {
    expect(countriesForJurisdictions(["Atlantis"])).toEqual([]);
    expect(countriesForJurisdictions(["Atlantis", "Canada"])).toEqual(["124"]);
  });

  // A label pointing at a country absent from the map would render a link to
  // nothing. Every code in the table must exist in the dataset.
  it("only maps to countries that exist on the map", () => {
    for (const [label, codes] of Object.entries(JURISDICTION_COUNTRIES)) {
      for (const code of codes) {
        expect(regulatoryData[code], `${label} -> ${code}`).toBeDefined();
      }
    }
  });
});
