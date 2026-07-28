import { describe, expect, it } from "vitest";
import { renderFields } from "../src/structured-output";

describe("renderizador estrutural", () => {
  it("renderiza o mesmo modelo ordenado em texto e Markdown", () => {
    const result = renderFields([
      { label: "Boato", value: "A ponte se move." },
      { label: "Verdade para o mestre", value: "A ponte foi deslocada." },
      { label: "Entrada", value: "Uma porta aguarda.", number: 1 },
    ]);
    expect(result.plainText).toBe("Boato: A ponte se move.\nVerdade para o mestre: A ponte foi deslocada.\n1. Entrada: Uma porta aguarda.");
    expect(result.markdown.replace(/\*\*/g, "")).toBe(result.plainText);
  });
});
