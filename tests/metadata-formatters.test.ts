import { describe, expect, it } from "vitest";
import { toMarkdown, toPlainText } from "../src/formatters";
import type { GenerationResult } from "../src/types";

const result: GenerationResult = {
  id: "npc",
  label: "NPCs",
  title: "NPC de teste",
  content: { plainText: "Corpo.", markdown: "Corpo." },
  options: {
    selected: { tone: "random", environment: "forest", complexity: "random", ancestry: "random" },
    resolved: { tone: "grim", environment: "forest", complexity: "detailed", ancestry: "elfos" },
  },
};

describe("metadados de geração", () => {
  it("coloca o callout depois do H1 e mostra o resolvido", () => {
    const formatted = toMarkdown(result, 1);
    expect(formatted).toContain("# NPC de teste\n\n> [!info] Parâmetros");
    expect(formatted).toContain("> Tom: Sombrio (aleatório)");
    expect(formatted).toContain("> Ambiente: Florestas");
    expect(formatted).toContain("> Complexidade: Detalhado (aleatório)");
    expect(formatted).toContain("> Ancestralidade: Elfo (aleatório)");
    expect(formatted).not.toContain("---");
  });

  it("funciona com H2 e plain sem sintaxe Markdown", () => {
    expect(toMarkdown(result, 2)).toMatch(/^## NPC de teste\n\n> \[!info\]/);
    const plain = toPlainText(result);
    expect(plain).toContain("NPC de teste\n\nParâmetros");
    expect(plain).not.toMatch(/^#+\s/m);
    expect(plain).not.toContain("> [!");
  });

  it("não mostra ancestralidade quando ela é inaplicável", () => {
    const location: GenerationResult = {
      ...result,
      id: "location",
      options: {
        selected: { ...result.options.selected, ancestry: null },
        resolved: { ...result.options.resolved, ancestry: null },
      },
    };
    expect(toMarkdown(location, 1)).not.toContain("Ancestralidade");
  });
});
