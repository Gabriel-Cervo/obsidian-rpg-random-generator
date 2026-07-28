import { describe, expect, it } from "vitest";
import { ENVIRONMENT_WRITING } from "../src/catalogs/pt-BR/environments";
import { VARIATION_BEATS } from "../src/catalogs/pt-BR/variations";
import { generate } from "../src/generators";
import { Random } from "../src/random";
import {
  COMPLEXITY_IDS,
  DUNGEON_ROOM_ROLES,
  ENVIRONMENT_IDS,
  TONE_IDS,
  type GeneratorId,
} from "../src/types";

const EDITORIAL_GENERATORS = [
  "location",
  "quest",
  "encounter",
  "rumor",
  "dungeon",
] as const satisfies readonly GeneratorId[];

const VAGUE_PLACEHOLDERS =
  /\b(?:algo ligado|situação ligada|recurso útil|pessoa interessada|consequência futura|com aspecto)\b/iu;
const LOWERCASE_AFTER_SENTENCE = /[.!?]\s+[a-záéíóúâêôãõç]/u;

function sentences(line: string): string[] {
  return line
    .replace(/^\d+\.\s+/, "")
    .split(/(?<=[.!?])\s+/u)
    .map((sentence) => sentence.trim().toLocaleLowerCase("pt-BR"))
    .filter(Boolean);
}

function wordCount(value: string): number {
  return value.split(/\s+/u).filter(Boolean).length;
}

describe("qualidade editorial pt-BR", () => {
  it("mantém as variações específicas e únicas em cada categoria", () => {
    for (const field of ["location", "quest", "encounter", "rumor", "dungeon"] as const) {
      expect(
        new Set(VARIATION_BEATS.map((beat) => beat[field])).size,
        field,
      ).toBe(VARIATION_BEATS.length);
    }
  });

  it("mantém doze salas autorais por ambiente, sem reciclar descrições", () => {
    const rooms = ENVIRONMENT_IDS.flatMap((environment) =>
      DUNGEON_ROOM_ROLES.map((role) => ENVIRONMENT_WRITING[environment].dungeon.rooms[role])
    );
    expect(rooms).toHaveLength(ENVIRONMENT_IDS.length * DUNGEON_ROOM_ROLES.length);
    expect(new Set(rooms).size).toBe(rooms.length);
  });

  it("revisa todas as 4.800 combinações editoriais", () => {
    let checked = 0;
    for (const id of EDITORIAL_GENERATORS) {
      for (const tone of TONE_IDS) {
        for (const environment of ENVIRONMENT_IDS) {
          for (const complexity of COMPLEXITY_IDS) {
            for (let variation = 0; variation < VARIATION_BEATS.length; variation += 1) {
              const random = new Random(() => (variation + 0.5) / VARIATION_BEATS.length);
              const result = generate(id, random, {
                tone,
                environment,
                complexity,
                ancestry: null,
                dungeonMode: id === "dungeon" ? "story" : null,
                dungeonSize: id === "dungeon" ? 12 : null,
              });
              const context = `${id}/${tone}/${environment}/${complexity}/${variation}`;
              const text = result.content.plainText;

              expect(text, context).not.toMatch(LOWERCASE_AFTER_SENTENCE);
              expect(text, context).not.toMatch(VAGUE_PLACEHOLDERS);
              expect(text, context).not.toMatch(/ {2,}/);

              for (const line of text.split("\n").filter(Boolean)) {
                const lineSentences = sentences(line);
                expect(new Set(lineSentences).size, `${context}: ${line}`).toBe(lineSentences.length);
                for (const sentence of lineSentences) {
                  expect(wordCount(sentence), `${context}: ${sentence}`).toBeLessThanOrEqual(30);
                }
              }
              checked += 1;
            }
          }
        }
      }
    }
    expect(checked).toBe(4_800);
  });
});
