import { describe, expect, it } from "vitest";
import { toMarkdown, toPlainText } from "../src/formatters";
import type { GenerationResult } from "../src/types";

const title = "Resultado de teste";
const result: GenerationResult = {
  id: "npc",
  label: "NPCs",
  title,
  content: {
    plainText: "Texto puro do resultado.",
    markdown: "**Texto Markdown do resultado.**",
  },
  options: {
    selected: { tone: "grim", environment: "forest", complexity: "quick", ancestry: null, dungeonMode: null, dungeonSize: null },
    resolved: { tone: "grim", environment: "forest", complexity: "quick", ancestry: null, dungeonMode: null, dungeonSize: null },
  },
};

describe("formatadores de resultados", () => {
  it("formata Markdown autônomo com H1", () => {
    expect(toMarkdown(result, 1)).toBe(
      `# ${title}\n\n> [!info] Parâmetros\n> Tom: Sombrio\n> Ambiente: Florestas\n> Complexidade: Rápido\n\n${result.content.markdown}`,
    );
  });

  it("formata Markdown inserido com H2", () => {
    expect(toMarkdown(result, 2)).toBe(
      `## ${title}\n\n> [!info] Parâmetros\n> Tom: Sombrio\n> Ambiente: Florestas\n> Complexidade: Rápido\n\n${result.content.markdown}`,
    );
  });

  it("formata a pré-visualização com H3", () => {
    expect(toMarkdown(result, 3)).toMatch(`### ${title}`);
  });

  it("formata texto puro sem heading Markdown", () => {
    const formatted = toPlainText(result);

    expect(formatted).toBe(
      `${title}\n\nParâmetros\nTom: Sombrio\nAmbiente: Florestas\nComplexidade: Rápido\n\n${result.content.plainText}`,
    );
    expect(formatted).not.toMatch(/^#+\s/m);
  });

  it("inclui o título exatamente uma vez em cada representação", () => {
    for (const formatted of [toMarkdown(result, 1), toMarkdown(result, 2), toPlainText(result)]) {
      expect(formatted.split(title)).toHaveLength(2);
    }
  });

  it("normaliza bordas e quebras de linha sem alterar listas numeradas", () => {
    const borderedResult: GenerationResult = {
      ...result,
      title: `  ${title}\n`,
      content: {
        plainText: `\r\n${result.content.plainText}\r\n`,
        markdown: `\r\nTema: uma torre.\r\n\r\n1. Entrada preservada.\r\n2. Desafio preservado.\r\n`,
      },
    };

    expect(toMarkdown(borderedResult, 1)).toBe(
      `# ${title}\n\n> [!info] Parâmetros\n> Tom: Sombrio\n> Ambiente: Florestas\n> Complexidade: Rápido\n\nTema: uma torre.\n\n1. Entrada preservada.\n2. Desafio preservado.`,
    );
  });
});
