import { describe, expect, it } from "vitest";
import { validateCatalogCoverage, type TaggedContentEntry } from "../src/content-selection";
import { CONTENT_CATALOGS, VARIATION_BEATS } from "../src/catalogs/pt-BR/generated-content";
import { COMPLEXITY_IDS, ENVIRONMENT_IDS, TONE_IDS } from "../src/types";

describe("catálogos pt-BR", () => {
  it("têm uma entrada normal e um fallback exatamente marcado por célula", () => {
    const cells = TONE_IDS.length * ENVIRONMENT_IDS.length * COMPLEXITY_IDS.length;
    for (const [id, entries] of Object.entries(CONTENT_CATALOGS)) {
      const typed = entries as readonly TaggedContentEntry<unknown>[];
      const coverage = validateCatalogCoverage(typed);
      expect(coverage.valid, id).toBe(true);
      expect(coverage.missing, id).toEqual([]);
      expect(coverage.duplicateIds, id).toEqual([]);
      expect(entries).toHaveLength(cells * 2);
      expect(new Set(entries.map((entry) => entry.id)).size).toBe(entries.length);
      expect(entries.filter((entry) => entry.fallback === true)).toHaveLength(cells);
      expect(entries.filter((entry) => !entry.fallback).every((entry) =>
        entry.tone !== undefined && entry.environment !== undefined && entry.complexity !== undefined,
      )).toBe(true);
      expect(entries.filter((entry) => entry.fallback).every((entry) =>
        entry.tone !== undefined && entry.environment !== undefined && entry.complexity !== undefined,
      )).toBe(true);
    }
  });

  it("não deixa campos obrigatórios vazios em nenhuma célula", () => {
    for (const entries of Object.values(CONTENT_CATALOGS)) {
      for (const entry of entries) {
        const content = entry.content as unknown as Record<string, unknown>;
        for (const value of Object.values(content)) {
          if (Array.isArray(value)) {
            expect(value).toHaveLength(5);
            expect(value.every((part) => typeof part === "string" && part.trim().length > 0)).toBe(true);
          } else {
            expect(typeof value).toBe("string");
            expect(String(value).trim().length).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  it("mantém a coleção compacta e com pelo menos vinte beats estáveis", () => {
    expect(VARIATION_BEATS.length).toBeGreaterThanOrEqual(20);
    expect(new Set(VARIATION_BEATS.map((beat) => beat.id)).size).toBe(VARIATION_BEATS.length);
  });
});
