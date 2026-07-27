import { describe, expect, it } from "vitest";
import {
  DEFAULT_SETTINGS,
  OUTPUT_FOLDER_VALIDATION_REASONS,
  normalizeOutputFolder,
  normalizeSettings,
  validateOutputFolder,
} from "../src/settings";

describe("configuração da pasta de saída", () => {
  it("usa a raiz como padrão e preserva somente a configuração conhecida", () => {
    expect(DEFAULT_SETTINGS.outputFolder).toBe("");
    expect(normalizeSettings({ outputFolder: "  notas\\rpg///", other: true })).toEqual({
      outputFolder: "notas/rpg",
    });
  });

  it("aceita pastas relativas aninhadas e remove separadores finais", () => {
    expect(validateOutputFolder("  Notas\\RPG/geradas/// ")).toEqual({
      valid: true,
      value: "Notas/RPG/geradas",
    });
  });

  it("rejeita caminhos absolutos com o motivo em português", () => {
    for (const value of ["/notas", "\\notas", "C:/notas", "C:\\notas", "//servidor/notas"]) {
      expect(validateOutputFolder(value)).toEqual({
        valid: false,
        code: "absolute",
        reason: OUTPUT_FOLDER_VALIDATION_REASONS.absolute,
      });
    }
  });

  it("rejeita traversal e segmentos vazios internos", () => {
    expect(validateOutputFolder("notas/./rpg")).toMatchObject({
      valid: false,
      code: "traversal",
    });
    expect(validateOutputFolder("notas/../rpg")).toMatchObject({
      valid: false,
      code: "traversal",
    });
    expect(validateOutputFolder("notas//rpg")).toMatchObject({
      valid: false,
      code: "emptySegment",
    });
    expect(validateOutputFolder("notas/   /rpg")).toMatchObject({
      valid: false,
      code: "emptySegment",
    });
  });

  it("rejeita caracteres inválidos do Windows com motivo específico", () => {
    for (const value of ["notas<rpg", "notas:rpg", "notas|rpg", "notas?rpg", "notas*rpg"]) {
      expect(validateOutputFolder(value)).toEqual({
        valid: false,
        code: "invalidCharacter",
        reason: OUTPUT_FOLDER_VALIDATION_REASONS.invalidCharacter,
      });
    }
  });

  it("rejeita segmentos terminados em ponto ou espaço", () => {
    expect(validateOutputFolder("notas/geradas.")).toMatchObject({
      valid: false,
      code: "trailingDotSpace",
    });
    expect(validateOutputFolder("notas/geradas ")).toMatchObject({
      valid: false,
      code: "trailingDotSpace",
    });
  });

  it("rejeita nomes de dispositivos reservados, inclusive com extensão", () => {
    for (const value of ["CON", "prn.md", "aux.txt", "notas/NUL", "rpg/Com1.log", "LPT9.backup"]) {
      expect(validateOutputFolder(value)).toMatchObject({
        valid: false,
        code: "reservedDeviceName",
      });
    }
  });

  it("mantém raiz e caminhos relativos acentuados válidos", () => {
    expect(validateOutputFolder("")).toEqual({ valid: true, value: "" });
    expect(validateOutputFolder("Notas/História/geradas")).toEqual({
      valid: true,
      value: "Notas/História/geradas",
    });
  });

  it("normaliza dados legados inválidos para a raiz sem esconder o erro interativo", () => {
    expect(normalizeOutputFolder("../fora-do-vault")).toBe("");
    expect(normalizeOutputFolder(42)).toBe("");
    expect(validateOutputFolder("../fora-do-vault")).toMatchObject({ valid: false });
  });
});
