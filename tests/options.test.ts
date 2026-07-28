import { describe, expect, it } from "vitest";
import { Random } from "../src/random";
import {
  DEFAULT_GENERATION_OPTIONS,
  RANDOM_ANCESTRY_LABEL,
  getComplexityLabel,
  getEnvironmentLabel,
  getOptionLabel,
  getToneLabel,
  normalizeGenerationOptions,
  resolveGenerationOptions,
} from "../src/options";
import { PEOPLE } from "../src/names";

const explicit = {
  tone: "grim" as const,
  environment: "coast" as const,
  complexity: "detailed" as const,
  ancestry: "elfos" as const,
};

describe("contrato de opções de geração", () => {
  it("normaliza valores desconhecidos para os padrões", () => {
    expect(normalizeGenerationOptions({ tone: "bad", environment: 3, complexity: null, ancestry: "bad" }, "npc"))
      .toEqual(DEFAULT_GENERATION_OPTIONS);
    expect(normalizeGenerationOptions({ ancestry: "elfos" }, "location").ancestry).toBeNull();
  });

  it("resolve escolhas explícitas sem consumir aleatoriedade", () => {
    expect(resolveGenerationOptions(explicit, new Random(() => 0), "npc")).toEqual(explicit);
  });

  it("resolve escolhas aleatórias de modo determinístico e inclui cada perfil possível", () => {
    const resolved = resolveGenerationOptions(DEFAULT_GENERATION_OPTIONS, new Random(() => 0.999), "npc");
    expect(resolved.tone).toBe("mysterious");
    expect(resolved.environment).toBe("underground");
    expect(resolved.complexity).toBe("detailed");
    expect(resolved.ancestry).toBe(PEOPLE[PEOPLE.length - 1].id);
  });

  it("expõe os rótulos pt-BR, inclusive aleatório", () => {
    expect(getToneLabel("grim")).toBe("Sombrio");
    expect(getToneLabel("random")).toBe("Aleatório");
    expect(getEnvironmentLabel("forest")).toBe("Florestas");
    expect(getComplexityLabel("quick")).toBe("Rápido");
    expect(getOptionLabel("ancestry", "humanos")).toBe("Humano");
    expect(RANDOM_ANCESTRY_LABEL).toBe("Aleatória");
  });
});
