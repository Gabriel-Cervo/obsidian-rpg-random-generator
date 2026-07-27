import { ItemView, Notice, TFolder, ViewStateResult, WorkspaceLeaf } from "obsidian";
import { generate, GENERATORS } from "./generators";
import { toMarkdown, toPlainText } from "./formatters";
import { Random } from "./random";
import type { GeneratorId, GenerationResult } from "./types";

export const VIEW_TYPE_RPG_GENERATOR = "rpg-random-generator-view";

interface ViewState extends Record<string, unknown> {
  category?: GeneratorId;
}

function isGeneratorId(value: unknown): value is GeneratorId {
  return typeof value === "string" && GENERATORS.some((definition) => definition.id === value);
}

function sanitizeFileName(value: string): string {
  return value
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[. ]+$/g, "") || "Resultado de RPG";
}

export class GeneratorView extends ItemView {
  private selectedId: GeneratorId = "npc";
  private currentResult: GenerationResult | null = null;
  private resultKey = 0;
  private noteCreatedForKey: number | null = null;
  private primaryButton: HTMLButtonElement | null = null;
  private resultHeader: HTMLElement | null = null;
  private resultText: HTMLElement | null = null;
  private liveStatus: HTMLElement | null = null;
  private copyButton: HTMLButtonElement | null = null;
  private noteButton: HTMLButtonElement | null = null;
  private clearButton: HTMLButtonElement | null = null;
  private categoryButtons = new Map<GeneratorId, HTMLButtonElement>();

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType(): string {
    return VIEW_TYPE_RPG_GENERATOR;
  }

  getDisplayText(): string {
    return "Gerador de RPG";
  }

  getIcon(): string {
    return "dice-5";
  }

  async onOpen(): Promise<void> {
    this.renderView();
  }

  async onClose(): Promise<void> {
    this.contentEl.empty();
  }

  getState(): ViewState {
    return { category: this.selectedId };
  }

  async setState(state: unknown, result: ViewStateResult): Promise<void> {
    const nextState = state && typeof state === "object" ? state as ViewState : {};
    if (isGeneratorId(nextState.category)) {
      this.selectedId = nextState.category;
    }
    await super.setState(state, result);
    this.renderView();
  }

  private renderView(): void {
    this.contentEl.empty();
    this.contentEl.addClass("rpg-generator-view");
    this.categoryButtons.clear();

    const question = this.contentEl.createEl("p", {
      cls: "rpg-generator-question",
      text: "O que você quer gerar?",
    });
    question.setAttr("id", "rpg-generator-question");

    const categories = this.contentEl.createDiv({ cls: "rpg-generator-categories" });
    categories.setAttr("role", "radiogroup");
    categories.setAttr("aria-labelledby", "rpg-generator-question");

    for (const definition of GENERATORS) {
      const button = categories.createEl("button", {
        cls: "rpg-generator-category",
        attr: {
          type: "button",
          role: "radio",
          "aria-pressed": String(definition.id === this.selectedId),
          "aria-label": definition.id === "dungeon" ? "Masmorra de cinco salas" : definition.label,
        },
      });
      button.createSpan({ cls: "rpg-generator-category-label", text: definition.label });
      button.addEventListener("click", () => this.selectCategory(definition.id));
      this.categoryButtons.set(definition.id, button);
    }

    this.primaryButton = this.contentEl.createEl("button", {
      cls: ["mod-cta", "rpg-generator-primary"],
      attr: { type: "button" },
    });
    this.primaryButton.addEventListener("click", () => this.generateResult());

    const resultSection = this.contentEl.createDiv({ cls: "rpg-generator-result-section" });
    this.resultHeader = resultSection.createEl("h2", {
      cls: "rpg-generator-result-heading",
      text: "Resultado",
    });
    this.resultText = resultSection.createDiv({ cls: "rpg-generator-result-text" });
    this.resultText.setAttr("tabindex", "0");
    this.liveStatus = resultSection.createEl("p", {
      cls: "rpg-generator-live-status",
      attr: { "aria-live": "polite" },
    });

    const actions = resultSection.createDiv({ cls: "rpg-generator-actions" });
    this.copyButton = actions.createEl("button", {
      cls: "rpg-generator-secondary",
      attr: { type: "button" },
      text: "Copiar",
    });
    this.copyButton.addEventListener("click", () => void this.copyResult());

    this.noteButton = actions.createEl("button", {
      cls: "rpg-generator-secondary",
      attr: { type: "button" },
      text: "Criar nota",
    });
    this.noteButton.addEventListener("click", () => void this.createNote());

    this.clearButton = resultSection.createEl("button", {
      cls: "rpg-generator-clear",
      attr: { type: "button" },
      text: "Limpar resultado",
    });
    this.clearButton.addEventListener("click", () => this.clearResult());

    this.updateControls();
    this.updateResultText();
  }

  private selectCategory(id: GeneratorId): void {
    this.selectedId = id;
    for (const [categoryId, button] of this.categoryButtons.entries()) {
      const selected = categoryId === id;
      button.setAttr("aria-pressed", String(selected));
      button.toggleClass("is-selected", selected);
    }
    this.updateControls();
  }

  private generateResult(): void {
    this.currentResult = generate(this.selectedId, new Random());
    this.resultKey += 1;
    this.noteCreatedForKey = null;
    this.updateControls();
    this.updateResultText();
    this.liveStatus?.setText(`Novo resultado de ${this.currentResult.label} gerado`);
  }

  private clearResult(): void {
    this.currentResult = null;
    this.noteCreatedForKey = null;
    this.updateControls();
    this.updateResultText();
    this.liveStatus?.setText("Resultado limpo");
  }

  private updateControls(): void {
    if (this.primaryButton) {
      const label = this.currentResult?.id === this.selectedId ? "Rerrolar" : "Gerar";
      this.primaryButton.setText(label);
    }

    const hasResult = this.currentResult !== null;
    const noteAlreadyCreated = this.noteCreatedForKey === this.resultKey;

    if (this.copyButton) this.copyButton.disabled = !hasResult;
    if (this.noteButton) {
      this.noteButton.disabled = !hasResult || noteAlreadyCreated;
      this.noteButton.setText(noteAlreadyCreated ? "Nota criada" : "Criar nota");
    }
    if (this.clearButton) this.clearButton.disabled = !hasResult;
  }

  private updateResultText(): void {
    if (!this.resultText || !this.resultHeader) return;

    if (!this.currentResult) {
      this.resultHeader.setText("Resultado");
      this.resultText.setText("Escolha um gerador e clique em “Gerar”.");
      this.resultText.addClass("is-empty");
      this.resultText.setAttr("aria-label", "Nenhum resultado gerado");
      return;
    }

    this.resultHeader.setText(this.currentResult.label);
    this.resultText.setText(toPlainText(this.currentResult));
    this.resultText.removeClass("is-empty");
    this.resultText.setAttr("aria-label", `Resultado: ${this.currentResult.label}`);
  }

  private async copyResult(): Promise<void> {
    if (!this.currentResult) return;

    try {
      await navigator.clipboard.writeText(toPlainText(this.currentResult));
      new Notice("Texto copiado");
    } catch {
      new Notice("Não foi possível copiar o texto");
    }
  }

  private async createNote(): Promise<void> {
    if (!this.currentResult || this.noteCreatedForKey === this.resultKey) return;

    const folderPath = "Gerados";
    const existingFolder = this.app.vault.getAbstractFileByPath(folderPath);
    if (existingFolder && !(existingFolder instanceof TFolder)) {
      new Notice("Não foi possível criar a nota: Gerados já é um arquivo");
      return;
    }

    try {
      if (!existingFolder) await this.app.vault.createFolder(folderPath);

      const baseName = sanitizeFileName(this.currentResult.title);
      let path = `${folderPath}/${baseName}.md`;
      let suffix = 2;
      while (this.app.vault.getAbstractFileByPath(path)) {
        path = `${folderPath}/${baseName} - ${suffix}.md`;
        suffix += 1;
      }

      const file = await this.app.vault.create(path, toMarkdown(this.currentResult, 1));
      await this.app.workspace.getLeaf("tab").openFile(file);
      this.noteCreatedForKey = this.resultKey;
      this.updateControls();
      new Notice("Nota criada em Gerados");
    } catch {
      new Notice("Não foi possível criar a nota");
    }
  }
}
