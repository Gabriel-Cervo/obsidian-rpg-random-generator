import { describe, expect, it } from "vitest";
import {
  generateName,
  isPeopleCatalogValid,
  isValidName,
  isValidNamePart,
  PEOPLE,
  SUSPICIOUS_NAME_BLACKLIST,
} from "../src/names";
import { Random } from "../src/random";

const nonWhimsicalTones = ["grim", "heroic", "mysterious"] as const;

describe("nomes culturais", () => {
  it("tem exatamente os 17 povos com IDs distintos e rótulos estáveis", () => {
    expect(PEOPLE).toHaveLength(17);
    expect(new Set(PEOPLE.map((profile) => profile.id)).size).toBe(17);
    expect(PEOPLE.map((profile) => profile.label)).toEqual([
      "Humano", "Elfo", "Anão", "Halfling", "Orc", "Goblin", "Infernis", "Gigante", "Quacho",
      "Símio", "Clank", "Fauno", "Fada", "Fungril", "Firbolg", "Galapa", "Katari",
    ]);
    expect(isPeopleCatalogValid()).toBe(true);
  });

  it.each(PEOPLE.map((profile) => profile.id))("gera um nome válido para %s", (id) => {
    const name = generateName(id, new Random(() => 0.61));

    expect(isValidName(name)).toBe(true);
    expect(name.length).toBeGreaterThanOrEqual(2);
    expect(name.length).toBeLessThanOrEqual(40);
    expect(name).not.toContain("undefined");
    expect(name).not.toMatch(/[0-9]/);
  });

  it("mantém todos os pools curados válidos", () => {
    for (const profile of PEOPLE) {
      for (const pool of [profile.givenNames, profile.familyNames, profile.whimsicalGivenNames, profile.whimsicalFamilyNames]) {
        expect(pool.every((candidate) => isValidNamePart(candidate))).toBe(true);
      }
    }
    expect(PEOPLE.flatMap((profile) => [
      ...profile.givenNames,
      ...profile.familyNames,
      ...profile.whimsicalGivenNames,
      ...profile.whimsicalFamilyNames,
    ])).not.toContain("Boleto");
  });

  it("não deixa nomes brincalhões vazarem para tons normais", () => {
    const whimsical = new Set(PEOPLE.flatMap((profile) => [...profile.whimsicalGivenNames, ...profile.whimsicalFamilyNames]));

    for (const profile of PEOPLE) {
      for (const tone of nonWhimsicalTones) {
        for (let index = 0; index < 24; index += 1) {
          const name = generateName(profile.id, new Random(() => (index + 0.17) / 24), tone);
          expect([...whimsical].some((candidate) => name.includes(candidate)), `${profile.id}/${tone}: ${name}`).toBe(false);
          expect(isValidName(name)).toBe(true);
          expect(name).not.toMatch(/[0-9]/);
          expect(SUSPICIOUS_NAME_BLACKLIST.some((bad) => name.toLocaleLowerCase("pt-BR").includes(bad))).toBe(false);
        }
      }
    }
  });

  it("usa o pool brincalhão somente quando o tom é whimsical", () => {
    const profile = PEOPLE.find((candidate) => candidate.id === "clanks")!;
    const whimsicalNames = new Set(profile.whimsicalGivenNames);
    const whimsical = Array.from({ length: 24 }, (_, index) => generateName("clanks", new Random(() => (index + 0.17) / 24), "whimsical"));

    expect(whimsical.some((name) => [...whimsicalNames].some((candidate) => name.includes(candidate)))).toBe(true);
  });

  it("rejeita saída procedural inválida e retorna um fallback curado", () => {
    const name = generateName("clanks", new Random(() => Number.NaN), "heroic");

    expect(isValidName(name)).toBe(true);
    expect(name).not.toMatch(/[0-9]/);
    expect(name).not.toContain("undefined");
  });

  it("mantém o vocabulário e a consistência dos Clanks", () => {
    const profile = PEOPLE.find((candidate) => candidate.id === "clanks")!;
    const names = Array.from({ length: 32 }, (_, index) => generateName("clanks", new Random(() => index / 32), "mysterious"));

    expect(names.every((name) => isValidName(name))).toBe(true);
    expect(names.every((name) => profile.givenNames.some((given) => name.startsWith(given[0]!)))).toBe(true);
    expect(profile.givenNames.some((name) => /[0-9]/.test(name))).toBe(false);
    expect(profile.familyNames.some((name) => /[0-9]/.test(name))).toBe(false);
  });
});
