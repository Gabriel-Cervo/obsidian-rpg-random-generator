import { describe, expect, it } from "vitest";
import { generate } from "../src/generators";
import { PEOPLE } from "../src/names";
import { Random } from "../src/random";
import {
  COMPLEXITY_IDS,
  ENVIRONMENT_IDS,
  GENERATOR_IDS,
  TONE_IDS,
  type ComplexityId,
  type EnvironmentId,
  type GeneratorId,
  type ToneId,
} from "../src/types";

const source = (value: number) => new Random(() => value);
const wordCount = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;
const optionsFor = (tone: ToneId, environment: EnvironmentId, complexity: ComplexityId, id: GeneratorId) => ({
  tone,
  environment,
  complexity,
  ancestry: id === "npc" ? "humanos" as const : null,
});

function assertClean(result: ReturnType<typeof generate>): void {
  expect(result.title.trim()).not.toBe("");
  expect(result.content.plainText.trim()).not.toBe("");
  expect(result.content.markdown.trim()).not.toBe("");
  expect(result.content.plainText).not.toMatch(/undefined|NaN/i);
  expect(result.content.markdown).not.toMatch(/undefined|NaN/i);
  expect(result.content.plainText).not.toMatch(/[.!?]{2}/);
  expect(result.content.markdown).not.toMatch(/[.!?]{2}/);
  expect(result.content.plainText).not.toMatch(/^#+\s/m);
}

function semanticMarkdown(result: ReturnType<typeof generate>): string {
  return result.content.markdown.replace(/\*\*/g, "");
}

const bannedGrammar = [
  /consequência[^.]{0,100}já foi visto/i,
  /pessoas de (viajantes|pastores|comunidades)/i,
  /paisagem de\s+(nas|no|na|em)/i,
  /ignorar a esperança está/i,
  /como a esperança[^.]{0,100}alcançou/i,
  /lista[^.]{0,60}\bencobre\b/i,
  /o cenário mostra (uma|um) .+ (deixou|confundiu|protegeu|revelou)/i,
  /uma presença ligada a uma presença/i,
  /passagem .+ e faz um pedido urgente/i,
  /continuam .+ e oferecem uma consequência/i,
];

describe("motor option-aware de geração", () => {
  it("cobre o contrato e a matriz completa de cada gerador", () => {
    for (const id of GENERATOR_IDS) {
      for (const tone of TONE_IDS) {
        for (const environment of ENVIRONMENT_IDS) {
          for (const complexity of COMPLEXITY_IDS) {
            const result = generate(id, source(0.37), optionsFor(tone, environment, complexity, id));
            assertClean(result);
            expect(result.id).toBe(id);
            expect(result.options.selected).toEqual(optionsFor(tone, environment, complexity, id));
            expect(result.options.resolved).toEqual({ tone, environment, complexity, ancestry: id === "npc" ? "humanos" : null });
            expect(result.content.markdown).not.toBe(result.content.plainText);
            expect(semanticMarkdown(result)).toBe(result.content.plainText);
          }
        }
      }
    }
  });

  it("produz exatamente vinte variações completas em cada célula fixa", () => {
    for (const id of GENERATOR_IDS) {
      for (const tone of TONE_IDS) {
        for (const environment of ENVIRONMENT_IDS) {
          for (const complexity of COMPLEXITY_IDS) {
            const outputs = new Set<string>();
            for (let index = 0; index < 20; index += 1) {
              outputs.add(generate(id, source((index + 0.5) / 20), optionsFor(tone, environment, complexity, id)).content.plainText);
            }
            expect(outputs.size, `${id}/${tone}/${environment}/${complexity}`).toBe(20);
          }
        }
      }
    }
  });

  it("faz cada tom e cada ambiente ter efeito material, com o restante fixo", () => {
    for (const id of GENERATOR_IDS) {
      for (const complexity of COMPLEXITY_IDS) {
        const toneOutputs = TONE_IDS.map((tone) => generate(id, source(0.37), optionsFor(tone, "forest", complexity, id)).content.plainText);
        const environmentOutputs = ENVIRONMENT_IDS.map((environment) => generate(id, source(0.37), optionsFor("heroic", environment, complexity, id)).content.plainText);
        expect(new Set(toneOutputs).size, `${id}/${complexity}/tom`).toBe(TONE_IDS.length);
        expect(new Set(environmentOutputs).size, `${id}/${complexity}/ambiente`).toBe(ENVIRONMENT_IDS.length);
      }
    }
  });

  it("mantém as dezessete ancestralidades explícitas", () => {
    for (const person of PEOPLE) {
      const result = generate("npc", source(0.2), {
        tone: "mysterious", environment: "underground", complexity: "quick", ancestry: person.id,
      });
      expect(result.options.resolved.ancestry).toBe(person.id);
      expect(result.content.plainText).toContain(`Ancestralidade: ${person.label}`);
    }
  });

  it("distingue rápido e detalhado e omite o companheiro quando ausente", () => {
    for (const id of GENERATOR_IDS) {
      const quick = generate(id, source(0.31), optionsFor("grim", "ruins", "quick", id));
      const detailed = generate(id, source(0.31), optionsFor("grim", "ruins", "detailed", id));
      expect(detailed.content.plainText.length).toBeGreaterThan(quick.content.plainText.length);
      expect(detailed.content.markdown).toContain("**");
      if (id === "npc") {
        expect(detailed.content.markdown).toContain("**Segredo:**");
        const absent = generate("npc", source(0.02), { tone: "grim", environment: "ruins", complexity: "detailed", ancestry: "orcs" });
        const present = generate("npc", source(0.07), { tone: "grim", environment: "ruins", complexity: "detailed", ancestry: "orcs" });
        expect(absent.content.plainText).not.toContain("Companheiro compatível:");
        expect(present.content.plainText).toContain("Companheiro compatível:");
      }
      if (id === "location") expect(detailed.content.markdown).toContain("**Oportunidades:**");
      if (id === "quest") expect(detailed.content.markdown).toContain("**Etapas:**");
      if (id === "encounter") expect(detailed.content.markdown).toContain("**Interação com o ambiente:**");
      if (id === "rumor") expect(detailed.content.markdown).toContain("**Pistas:**");
      if (id === "dungeon") expect(detailed.content.markdown).toContain("**Entrada:**");
    }
  });

  it("mantém a verdade do mestre, inclusive no rumor rápido", () => {
    const quick = generate("rumor", source(0.4), { tone: "mysterious", environment: "coast", complexity: "quick", ancestry: null });
    const detailed = generate("rumor", source(0.4), { tone: "mysterious", environment: "coast", complexity: "detailed", ancestry: null });
    const truth = quick.content.plainText.match(/^Verdade para o mestre: (.+)$/m)?.[1];
    expect(truth).toBeTruthy();
    expect(detailed.content.plainText).toContain(`Verdade para o mestre: ${truth}`);
    expect(quick.content.markdown).toContain(`**Verdade para o mestre:** ${truth}`);
    expect(detailed.content.markdown).toContain(`**Verdade para o mestre:** ${truth}`);
  });

  it("mantém a masmorra temporária com exatamente cinco salas narrativas", () => {
    for (const complexity of COMPLEXITY_IDS) {
      const result = generate("dungeon", source(0.2), { tone: "heroic", environment: "wilderness", complexity, ancestry: null });
      const roomLines = result.content.plainText.split("\n").filter((line) => /^\d+\. /.test(line));
      expect(roomLines).toHaveLength(5);
      expect(roomLines.map((line) => line.slice(0, 3))).toEqual(["1. ", "2. ", "3. ", "4. ", "5. "]);
      expect(result.content.plainText).not.toMatch(/mapa|modo|tamanho|topologia|sala secreta extra/i);
    }
  });

  it("preserva metadados selecionados, resolvidos e marcados como aleatórios", () => {
    const result = generate("npc", source(0.99), { tone: "heroic", environment: "forest", complexity: "detailed", ancestry: "fadas" });
    expect(result.options.selected).toEqual({ tone: "heroic", environment: "forest", complexity: "detailed", ancestry: "fadas" });
    expect(result.options.resolved).toEqual({ tone: "heroic", environment: "forest", complexity: "detailed", ancestry: "fadas" });
    const randomResult = generate("location", source(0), { tone: "random", environment: "random", complexity: "random", ancestry: null });
    expect(randomResult.options.selected).toEqual({ tone: "random", environment: "random", complexity: "random", ancestry: null });
    expect(randomResult.options.resolved).toEqual({ tone: "grim", environment: "wilderness", complexity: "quick", ancestry: null });
  });

  it("não produz gramática conhecida como inválida", () => {
    for (const id of GENERATOR_IDS) {
      for (const tone of TONE_IDS) {
        for (const environment of ENVIRONMENT_IDS) {
          for (const complexity of COMPLEXITY_IDS) {
            const result = generate(id, source(0.83), optionsFor(tone, environment, complexity, id));
            for (const pattern of bannedGrammar) {
              expect(result.content.plainText, `${id}/${tone}/${environment}/${complexity}`).not.toMatch(pattern);
              expect(result.content.markdown, `${id}/${tone}/${environment}/${complexity}`).not.toMatch(pattern);
            }
          }
        }
      }
    }
  });

  it("não termina títulos com pontuação de frase", () => {
    for (const id of GENERATOR_IDS) {
      const result = generate(id, source(0.41), optionsFor("mysterious", "underground", "detailed", id));
      expect(result.title).not.toMatch(/[.!?;:]$/);
    }
  });

  it("distingue títulos de encontro por ambiente", () => {
    const titles = ENVIRONMENT_IDS.map((environment) =>
      generate("encounter", source(0.41), optionsFor("mysterious", environment, "quick", "encounter")).title
    );
    expect(new Set(titles).size).toBe(ENVIRONMENT_IDS.length);
  });

  it("fica dentro dos alvos de tamanho", () => {
    for (const id of GENERATOR_IDS) {
      for (const tone of TONE_IDS) {
        for (const environment of ENVIRONMENT_IDS) {
          const quick = generate(id, source(0.17), optionsFor(tone, environment, "quick", id));
          const detailed = generate(id, source(0.17), optionsFor(tone, environment, "detailed", id));
          if (id !== "dungeon") {
            expect(wordCount(quick.content.plainText)).toBeGreaterThanOrEqual(50);
            expect(wordCount(quick.content.plainText)).toBeLessThanOrEqual(100);
            expect(wordCount(detailed.content.plainText)).toBeGreaterThanOrEqual(150);
            expect(wordCount(detailed.content.plainText)).toBeLessThanOrEqual(300);
          } else {
            for (const line of quick.content.plainText.split("\n").filter((value) => /^\d+\. /.test(value))) expect(wordCount(line)).toBeGreaterThanOrEqual(25);
            for (const line of detailed.content.plainText.split("\n").filter((value) => /^\d+\. /.test(value))) expect(wordCount(line)).toBeGreaterThanOrEqual(60);
          }
        }
      }
    }
  });
});
