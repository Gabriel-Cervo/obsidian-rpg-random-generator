import { describe, expect, it } from "vitest";
import { calculateInsertionBoundaries, insertionText } from "../src/insertion-boundary";

describe("limites de inserção Markdown", () => {
  it("insere em documento vazio sem adicionar quebras", () => {
    expect(insertionText("", "", "# resultado")).toBe("# resultado");
    expect(calculateInsertionBoundaries("", "")).toEqual({ prefix: "", suffix: "" });
  });

  it("separa um cursor inline como um bloco", () => {
    expect(insertionText("texto antes", "texto depois", "# resultado")).toBe(
      "\n\n# resultado\n\n",
    );
  });

  it("separa uma seleção inline como um bloco", () => {
    expect(insertionText("texto antes ", " depois", "# resultado")).toBe(
      "\n\n# resultado\n\n",
    );
  });

  it("mantém limites corretos para seleção de linha inteira e multilinha", () => {
    expect(insertionText("linha anterior\n", "\nlinha seguinte", "# resultado")).toBe(
      "\n# resultado\n",
    );
    expect(insertionText("antes\n", "\ndepois", "# resultado")).toBe(
      "\n# resultado\n",
    );
  });

  it("não duplica linhas em branco já existentes", () => {
    expect(insertionText("linha anterior\n\n", "linha seguinte", "# resultado")).toBe(
      "# resultado\n\n",
    );
    expect(insertionText("linha anterior", "\n\nlinha seguinte", "# resultado")).toBe(
      "\n\n# resultado",
    );
  });
});
