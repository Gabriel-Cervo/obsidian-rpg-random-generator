import { describe, expect, it } from "vitest";
import { generate } from "../src/generators";
import { Random } from "../src/random";
import { GENERATOR_IDS } from "../src/types";

describe("geradores de RPG", () => {
  it.each(GENERATOR_IDS)("gera um resultado completo para %s", (id) => {
    const generated = generate(id, new Random(() => 0.37));

    expect(generated.id).toBe(id);
    expect(generated.label.length).toBeGreaterThan(0);
    expect(generated.title.length).toBeGreaterThan(0);
    expect(generated.text.length).toBeGreaterThan(40);
    expect(generated.text).not.toContain("undefined");
    expect(generated.text).not.toContain("NaN");
  });

  it("mantém a estrutura de cinco salas", () => {
    const generated = generate("dungeon", new Random(() => 0.2));
    const roomLines = generated.text.split("\n").filter((line) => /^\d+\. /.test(line));

    expect(roomLines).toHaveLength(5);
    expect(roomLines[0]).toMatch(/^1\. /);
    expect(roomLines[4]).toMatch(/^5\. /);
  });

  it("inclui a informação reservada ao mestre nos rumores", () => {
    const generated = generate("rumor", new Random(() => 0.4));
    expect(generated.text).toContain("Para o mestre:");
  });

  it("menciona o nome do NPC apenas na abertura", () => {
    const generated = generate("npc", new Random(() => 0.37));
    const name = generated.title.replace(/^NPC - /, "");
    const occurrences = generated.text.split(name).length - 1;

    expect(occurrences).toBe(1);
    expect(generated.text).not.toContain(`${name}. ${name}`);
  });
});
