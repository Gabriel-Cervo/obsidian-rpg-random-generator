import { describe, expect, it } from "vitest";
import {
  compileContentCatalog,
  ContentSelectionError,
  selectCompatibleContent,
  validateCatalogCoverage,
  type TaggedContentEntry,
} from "../src/content-selection";
import { Random } from "../src/random";
import { COMPLEXITY_IDS, ENVIRONMENT_IDS, TONE_IDS } from "../src/types";

const cell = { tone: "grim" as const, environment: "forest" as const, complexity: "quick" as const };

describe("seleção de conteúdo compatível", () => {
  it("prefere entradas normais às de fallback", () => {
    const entries: TaggedContentEntry<string>[] = [
      { id: "fallback", content: "fallback", fallback: true },
      { id: "normal", content: "normal", ...cell },
    ];
    expect(selectCompatibleContent(entries, cell, new Random(() => 0)).id).toBe("normal");
  });

  it("usa fallback explícito e falha claramente quando não há cobertura", () => {
    const fallback: TaggedContentEntry<string>[] = [{ id: "fallback", content: "fallback", fallback: true }];
    expect(selectCompatibleContent(fallback, cell).content).toBe("fallback");
    expect(() => selectCompatibleContent([], cell)).toThrow(ContentSelectionError);
  });

  it("compila as células mantendo a precedência de conteúdo normal", () => {
    const compiled = compileContentCatalog([
      { id: "fallback", content: "fallback", fallback: true },
      { id: "normal", content: "normal", ...cell },
    ]);

    expect(compiled.select(cell, new Random(() => 0)).id).toBe("normal");
    expect(compiled.entries).toHaveLength(2);
  });

  it("valida a matriz completa e diagnostica células ausentes e IDs", () => {
    const entries: TaggedContentEntry<string>[] = [];
    for (const tone of TONE_IDS) {
      for (const environment of ENVIRONMENT_IDS) {
        for (const complexity of COMPLEXITY_IDS) {
          entries.push({ id: `${tone}-${environment}-${complexity}`, content: "ok", tone, environment, complexity });
        }
      }
    }
    expect(validateCatalogCoverage(entries).valid).toBe(true);
    const incomplete = validateCatalogCoverage([...entries.slice(1), { ...entries[1], id: entries[2].id }]);
    expect(incomplete.valid).toBe(false);
    expect(incomplete.missing).toHaveLength(1);
    expect(incomplete.duplicateIds).toContain(entries[2].id);
  });
});
