import { describe, expect, it } from "vitest";
import { Random } from "../src/random";

describe("Random", () => {
  it("escolhe valores dentro dos limites", () => {
    const random = new Random(() => 0.9999);
    expect(random.int(4)).toBe(3);
    expect(random.pick(["a", "b", "c"])).toBe("c");
  });

  it("permite controlar o resultado nos testes", () => {
    const random = new Random(() => 0.1);
    expect(random.chance(0.2)).toBe(true);
    expect(random.chance(0.05)).toBe(false);
  });

  it("rejeita tabelas vazias", () => {
    const random = new Random();
    expect(() => random.pick([])).toThrow("empty table");
  });
});

