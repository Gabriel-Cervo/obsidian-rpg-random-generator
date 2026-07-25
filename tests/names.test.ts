import { describe, expect, it } from "vitest";
import { generateName, PEOPLE } from "../src/names";
import { Random } from "../src/random";

describe("nomes culturais", () => {
  it("tem um perfil para cada povo do MVP", () => {
    expect(PEOPLE).toHaveLength(17);
    expect(new Set(PEOPLE.map((profile) => profile.id)).size).toBe(17);
  });

  it.each(PEOPLE.map((profile) => profile.id))("gera um nome válido para %s", (id) => {
    const name = generateName(id, new Random(() => 0.61));

    expect(name.length).toBeGreaterThanOrEqual(2);
    expect(name.length).toBeLessThanOrEqual(40);
    expect(name).not.toContain("undefined");
    expect(name).not.toMatch(/[0-9]/);
  });

  it("mantém nomes de clank com vocabulário próprio", () => {
    const name = generateName("clanks", new Random(() => 0.2));
    expect(name.length).toBeGreaterThan(1);
  });
});

