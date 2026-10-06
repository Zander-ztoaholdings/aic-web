import { describe, it, expect } from "vitest";
import { regulatoryData } from "@/app/data/regulatory-data";
import { requirements } from "@/app/data/requirements-data";
import { HOME_TRACKED, TRACKED, INTERNATIONAL, trackedFor } from "@/app/data/jurisdiction-frameworks";

const codes = new Set(requirements.map((r) => r.code));

describe("regulatory map: how AIC's frameworks meet each jurisdiction", () => {
  it("pairs every recorded obligation, index for index, with real requirement codes", () => {
    for (const j of Object.values(regulatoryData)) {
      const d = j.detail;
      if (!d?.coverage) continue;
      expect(d.coverage.length, j.name).toBe(d.obligations.length);
      for (const c of d.coverage) {
        if (!c) continue;
        expect(c.codes.length).toBeGreaterThan(0);
        for (const code of c.codes) expect(codes.has(code), `${j.name} ${code}`).toBe(true);
      }
    }
  });

  it("only names tracked frameworks that exist, for jurisdictions that are on the map", () => {
    for (const [id, home] of Object.entries(HOME_TRACKED)) {
      expect(regulatoryData[id], id).toBeDefined();
      for (const k of home.keys) expect(TRACKED[k], k).toBeDefined();
    }
    for (const k of INTERNATIONAL) expect(TRACKED[k]).toBeDefined();
  });

  it("every jurisdiction gets at least the international frameworks", () => {
    for (const j of Object.values(regulatoryData)) expect(trackedFor(j.id).international.length).toBe(INTERNATIONAL.length);
  });
});
