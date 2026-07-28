import { describe, expect, it } from "vitest";
import {
  createMarkdownOutput,
  ensureOutputFolder,
  findAvailableMarkdownPath,
  OutputFolderConflictError,
  OutputService,
  sanitizeMarkdownTitle,
  type OutputEntry,
  type OutputVault,
} from "../src/output";

class FakeVault implements OutputVault {
  readonly entries = new Map<string, OutputEntry>();
  readonly folderCreations: string[] = [];
  readonly fileCreations: Array<{ path: string; content: string }> = [];
  failCreateFolder: Error | undefined;
  failCreateFile: Error | undefined;
  occupyFirstFileDuringCreate = false;

  getEntry(path: string): OutputEntry | null {
    return this.entries.get(path) ?? null;
  }

  async createFolder(path: string): Promise<void> {
    if (this.failCreateFolder) throw this.failCreateFolder;
    this.folderCreations.push(path);
    this.entries.set(path, { type: "folder", path });
  }

  async createFile(path: string, content: string): Promise<void> {
    if (this.occupyFirstFileDuringCreate) {
      this.occupyFirstFileDuringCreate = false;
      this.entries.set(path, { type: "file", path });
      throw new Error("colisão concorrente");
    }
    if (this.failCreateFile) throw this.failCreateFile;
    this.fileCreations.push({ path, content });
    this.entries.set(path, { type: "file", path });
  }
}

describe("serviço puro de saída", () => {
  it("não cria pasta para a raiz", async () => {
    const vault = new FakeVault();

    await ensureOutputFolder(vault, "");

    expect(vault.folderCreations).toEqual([]);
  });

  it("cria pastas aninhadas uma por vez e na ordem", async () => {
    const vault = new FakeVault();

    await ensureOutputFolder(vault, "Notas/RPG/Geradas");

    expect(vault.folderCreations).toEqual(["Notas", "Notas/RPG", "Notas/RPG/Geradas"]);
  });

  it("detecta arquivo ocupando qualquer segmento da pasta", async () => {
    const vault = new FakeVault();
    vault.entries.set("Notas/RPG", { type: "file", path: "Notas/RPG" });

    await expect(ensureOutputFolder(vault, "Notas/RPG/Geradas")).rejects.toBeInstanceOf(
      OutputFolderConflictError,
    );
    expect(vault.folderCreations).toEqual(["Notas"]);
  });

  it("sanitiza títulos para stems Markdown não vazios", () => {
    expect(sanitizeMarkdownTitle("Título: NPC/chefe? *final*"))
      .toBe("Título- NPC-chefe- -final");
    expect(sanitizeMarkdownTitle("..///")).toBe("Sem título");
    expect(sanitizeMarkdownTitle("\n\t")).toBe("Sem título");
    expect(sanitizeMarkdownTitle("  Título.  ")).toBe("Título");
    expect(sanitizeMarkdownTitle("CON")).toBe("_CON");
    expect(sanitizeMarkdownTitle("lpt9.txt")).toBe("_lpt9.txt");
    expect(new TextEncoder().encode(sanitizeMarkdownTitle("á".repeat(300))).length)
      .toBeLessThanOrEqual(220);
  });

  it("encontra a primeira colisão livre e trata pasta como ocupação", async () => {
    const vault = new FakeVault();
    vault.entries.set("Título.md", { type: "file" });
    vault.entries.set("Título - 2.md", { type: "folder" });

    await expect(findAvailableMarkdownPath(vault, "", "Título")).resolves.toEqual({
      path: "Título - 3.md",
      filename: "Título - 3.md",
    });
  });

  it("cria no root e nunca sobrescreve arquivo existente", async () => {
    const vault = new FakeVault();
    vault.entries.set("Título.md", { type: "file" });

    const result = await createMarkdownOutput(vault, {
      outputFolder: "",
      title: "Título",
      content: "# conteúdo",
    });

    expect(result.path).toBe("Título - 2.md");
    expect(vault.fileCreations).toEqual([{ path: "Título - 2.md", content: "# conteúdo" }]);
  });

  it("propaga conflito de criação de pasta, inclusive uma corrida", async () => {
    const vault = new FakeVault();
    vault.failCreateFolder = new Error("corrida");

    await expect(ensureOutputFolder(vault, "Notas")).rejects.toThrow("corrida");
  });

  it("propaga falha de criação do arquivo, inclusive uma corrida", async () => {
    const vault = new FakeVault();
    vault.failCreateFile = new Error("corrida");

    await expect(
      createMarkdownOutput(vault, {
        outputFolder: "",
        title: "Título",
        content: "conteúdo",
      }),
    ).rejects.toThrow("corrida");
  });

  it("repete com um novo sufixo quando outra criação ocupa o caminho", async () => {
    const vault = new FakeVault();
    vault.occupyFirstFileDuringCreate = true;

    await expect(createMarkdownOutput(vault, {
      outputFolder: "",
      title: "Título",
      content: "conteúdo",
    })).resolves.toEqual({
      path: "Título - 2.md",
      filename: "Título - 2.md",
    });
  });

  it("não faz fallback silencioso para uma pasta inválida", async () => {
    const vault = new FakeVault();

    await expect(
      new OutputService(vault).createMarkdown({
        outputFolder: "../fora",
        title: "Título",
        content: "conteúdo",
      }),
    ).rejects.toThrow("não pode conter '.' ou '..'");
    expect(vault.fileCreations).toEqual([]);
  });
});
