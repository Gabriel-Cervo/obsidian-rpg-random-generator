import { describe, expect, it } from "vitest";
import { generate } from "../src/generators";
import { RUMOR_PREMISES } from "../src/tables";
import { Random } from "../src/random";
import { GENERATOR_IDS } from "../src/types";

describe("geradores de RPG", () => {
  it.each(GENERATOR_IDS)("retorna o contrato completo para %s", (id) => {
    const generated = generate(id, new Random(() => 0.37));

    expect(generated.id).toBe(id);
    expect(generated.label.length).toBeGreaterThan(0);
    expect(generated.title.length).toBeGreaterThan(0);
    expect(generated.content.plainText.length).toBeGreaterThan(40);
    expect(generated.content.markdown.length).toBeGreaterThan(40);
    expect(generated.content.plainText).not.toContain("undefined");
    expect(generated.content.plainText).not.toContain("NaN");
    expect(generated).not.toHaveProperty("text");
    expect(generated.content.markdown).toBe(generated.content.plainText);
    expect(generated.options.selected).toEqual({
      tone: "random",
      environment: "random",
      complexity: "random",
      ancestry: id === "npc" ? "random" : null,
    });
    expect(generated).not.toHaveProperty("metadata");
    expect(generated).not.toHaveProperty("selectedOptions");
    expect(generated).not.toHaveProperty("resolvedOptions");
    expect(generated.content.plainText).not.toContain(`${generated.title}\n\n`);
    expect(generated.content.plainText).not.toMatch(/^#+\s/m);
  });

  it("mantém a estrutura de cinco salas", () => {
    const generated = generate("dungeon", new Random(() => 0.2));
    const roomLines = generated.content.plainText.split("\n").filter((line) => /^\d+\. /.test(line));

    expect(roomLines).toHaveLength(5);
    expect(roomLines[0]).toMatch(/^1\. /);
    expect(roomLines[4]).toMatch(/^5\. /);
  });

  it("inclui a informação reservada ao mestre nos rumores", () => {
    const generated = generate("rumor", new Random(() => 0.4));
    expect(generated.content.plainText).toContain("Para o mestre:");
  });

  it("não duplica a pontuação final dos locais", () => {
    const generated = generate("location", new Random(() => 0));
    const body = generated.content.plainText;

    expect(body).not.toContain("..");
    expect(body).toMatch(/\.$/);
  });

  it("usa uma preposição natural para a localização da missão", () => {
    const generated = generate("quest", new Random(() => 0));
    const body = generated.content.plainText;

    expect(body).toContain(" em Ponte dos Sinos.");
    expect(body).not.toContain("na região de");
  });

  it("mantém sujeito e afirmação coerentes nos rumores", () => {
    for (const [index, premise] of RUMOR_PREMISES.entries()) {
      const generated = generate("rumor", new Random(() => (index + 0.1) / RUMOR_PREMISES.length));

      expect(generated.content.plainText).toContain(`${premise.subject} ${premise.claim}`);
    }
  });

  it("não duplica o prefixo reservado do NPC", () => {
    const generated = generate("npc", new Random(() => 0));

    expect(generated.content.plainText).toContain("Em segredo, mantém");
    expect(generated.content.plainText).not.toContain("Em segredo, em segredo");
  });

  it("menciona o nome do NPC apenas na abertura do conteúdo", () => {
    const generated = generate("npc", new Random(() => 0.37));
    const name = generated.title.replace(/^NPC - /, "");
    const body = generated.content.plainText;
    const occurrences = body.split(name).length - 1;

    expect(occurrences).toBe(1);
    expect(body).not.toContain(`${name}. ${name}`);
  });
});
