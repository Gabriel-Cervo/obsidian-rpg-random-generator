import { describe, expect, it } from "vitest";
import { validateCatalogCoverage, type TaggedContentEntry } from "../src/content-selection";
import {
  CONTENT_CATALOGS,
  DUNGEON_CONTENT,
  VARIATION_BEATS,
} from "../src/catalogs/pt-BR/generated-content";
import {
  DUNGEON_ROOM_ROLES,
  ENVIRONMENT_IDS,
  TONE_IDS,
} from "../src/types";

function expectFilled(value: unknown): void {
  if (typeof value === "string") {
    expect(value.trim().length).toBeGreaterThan(0);
    return;
  }
  if (Array.isArray(value)) {
    expect(value.length).toBeGreaterThan(0);
    for (const item of value) expectFilled(item);
    return;
  }
  if (typeof value === "boolean") return;
  expect(value).not.toBeNull();
  expect(typeof value).toBe("object");
  for (const item of Object.values(value as Record<string, unknown>)) {
    expectFilled(item);
  }
}

describe("catálogos pt-BR", () => {
  it("têm uma entrada normal por tom/ambiente e um fallback explícito", () => {
    const profiles = TONE_IDS.length * ENVIRONMENT_IDS.length;
    for (const [id, entries] of Object.entries(CONTENT_CATALOGS)) {
      const typed = entries as readonly TaggedContentEntry<unknown>[];
      const coverage = validateCatalogCoverage(typed);
      expect(coverage.valid, id).toBe(true);
      expect(coverage.missing, id).toEqual([]);
      expect(coverage.duplicateIds, id).toEqual([]);
      expect(entries).toHaveLength(profiles + 1);
      expect(new Set(entries.map((entry) => entry.id)).size).toBe(entries.length);
      expect(entries.filter((entry) => entry.fallback === true)).toHaveLength(1);
      expect(entries.filter((entry) => !entry.fallback).every((entry) =>
        entry.tone !== undefined && entry.environment !== undefined && entry.complexity !== undefined,
      )).toBe(true);
      expect(entries.filter((entry) => entry.fallback).every((entry) =>
        entry.tone === undefined && entry.environment === undefined && entry.complexity === undefined,
      )).toBe(true);
    }
  });

  it("não deixa campos obrigatórios vazios em nenhuma célula", () => {
    for (const entries of Object.values(CONTENT_CATALOGS)) {
      for (const entry of entries) {
        const content = entry.content as unknown as Record<string, unknown>;
        for (const value of Object.values(content)) {
          expectFilled(value);
        }
      }
    }
    for (const entry of DUNGEON_CONTENT) {
      expect(Object.keys(entry.content.rooms).sort()).toEqual(
        [...DUNGEON_ROOM_ROLES].sort(),
      );
      expect(Object.keys(entry.content.detailedRooms).sort()).toEqual(
        [...DUNGEON_ROOM_ROLES].sort(),
      );
    }
  });

  it("mantém a coleção compacta e com pelo menos vinte beats estáveis", () => {
    expect(VARIATION_BEATS.length).toBeGreaterThanOrEqual(20);
    expect(new Set(VARIATION_BEATS.map((beat) => beat.id)).size).toBe(VARIATION_BEATS.length);
    for (const beat of VARIATION_BEATS) expectFilled(beat);
  });
});
