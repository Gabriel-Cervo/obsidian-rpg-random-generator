import {
  Component,
  Editor,
  ItemView,
  MarkdownRenderer,
  Notice,
  TFile,
  TFolder,
  ViewStateResult,
  WorkspaceLeaf,
} from "obsidian";
import { generate, GENERATORS } from "./generators";
import { toMarkdown, toPlainText } from "./formatters";
import { OutputService, type OutputVault } from "./output";
import { Random } from "./random";
import { insertionText } from "./insertion-boundary";
import type { RpgSettings } from "./settings";
import type { GeneratorId, GenerationResult } from "./types";

export const VIEW_TYPE_RPG_GENERATOR = "rpg-random-generator-view";

export interface EditableMarkdownTarget {
  editor: Editor;
  file: TFile;
  leaf: WorkspaceLeaf;
}

export interface GeneratorViewDependencies {
  settings: RpgSettings;
  getEditableTarget: () => EditableMarkdownTarget | null;
}

export class GeneratorView extends ItemView {
  private selectedId: GeneratorId = "npc";
  private currentResult: GenerationResult | null = null;
  private resultKey = 0;
  private renderVersion = 0;
  private primaryButton: HTMLButtonElement | null = null;
  private resultHeader: HTMLElement | null = null;
  private resultText: HTMLElement | null = null;
  private liveStatus: HTMLElement | null = null;
  private copyTextButton: HTMLButtonElement | null = null;
  private copyMarkdownButton: HTMLButtonElement | null = null;
  private insertButton: HTMLButtonElement | null = null;
  private createButton: HTMLButtonElement | null = null;
  private insertDestination: HTMLElement | null = null;
  private insertHelp: HTMLElement | null = null;
  private categoryButtons = new Map<GeneratorId, HTMLButtonElement>();
  private renderComponent: Component | null = null;
  private creatingNote = false;

  constructor(
    leaf: WorkspaceLeaf,
    private readonly dependencies: GeneratorViewDependencies,
  ) {
    super(leaf);
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", () => this.updateInsertionTarget()),
    );
    this.registerEvent(
      this.app.workspace.on("layout-change", () => this.updateInsertionTarget()),
    );
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
    this.resetEphemeralState();
    this.renderView();
  }

  async onClose(): Promise<void> {
    this.renderVersion += 1;
    this.removeRenderComponent();
    this.contentEl.empty();
  }

  getState(): Record<string, unknown> {
    // Generator state is intentionally ephemeral and is never serialized.
    return {};
  }

  async setState(_state: unknown, result: ViewStateResult): Promise<void> {
    await super.setState(_state, result);
    this.resetEphemeralState();
    this.renderView();
  }

  private resetEphemeralState(): void {
    this.selectedId = "npc";
    this.currentResult = null;
    this.resultKey += 1;
    this.renderVersion += 1;
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
      const selected = definition.id === this.selectedId;
      const button = categories.createEl("button", {
        cls: ["rpg-generator-category", ...(selected ? ["is-selected"] : [])],
        attr: {
          type: "button",
          role: "radio",
          "aria-checked": String(selected),
          tabindex: selected ? "0" : "-1",
          "aria-label": definition.id === "dungeon" ? "Masmorra de cinco salas" : definition.label,
        },
      });
      button.createSpan({ cls: "rpg-generator-category-label", text: definition.label });
      button.addEventListener("click", () => this.selectCategory(definition.id));
      button.addEventListener("keydown", (event) =>
        this.handleCategoryKeydown(event, definition.id),
      );
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
    this.resultText.setAttr("aria-label", "Nenhum resultado gerado");
    this.liveStatus = resultSection.createEl("p", {
      cls: "rpg-generator-live-status",
      attr: { "aria-live": "polite" },
    });

    const actions = resultSection.createDiv({ cls: "rpg-generator-actions" });
    this.copyTextButton = this.createActionButton(actions, "Copiar texto");
    this.copyTextButton.addEventListener("click", () => void this.copyResult("text"));

    this.copyMarkdownButton = this.createActionButton(actions, "Copiar Markdown");
    this.copyMarkdownButton.addEventListener("click", () => void this.copyResult("markdown"));

    const insertAction = actions.createDiv({ cls: "rpg-generator-insert-action" });
    this.insertButton = this.createActionButton(insertAction, "Inserir na nota");
    this.insertButton.addEventListener("click", () => this.insertResult());
    this.insertDestination = insertAction.createSpan({ cls: "rpg-generator-insert-destination" });

    this.createButton = this.createActionButton(actions, "Criar nota");
    this.createButton.addEventListener("click", () => void this.createNote());

    this.insertHelp = resultSection.createEl("p", {
      cls: "rpg-generator-insert-help",
      text: "Abra uma nota Markdown em modo de edição para inserir o resultado.",
    });

    this.updateControls();
    this.updateResultText();
  }

  private createActionButton(parent: HTMLElement, text: string): HTMLButtonElement {
    return parent.createEl("button", {
      cls: "rpg-generator-secondary",
      attr: { type: "button" },
      text,
    });
  }

  private selectCategory(id: GeneratorId): void {
    if (id === this.selectedId) return;

    this.selectedId = id;
    this.currentResult = null;
    this.resultKey += 1;
    this.renderVersion += 1;

    for (const [categoryId, button] of this.categoryButtons.entries()) {
      const selected = categoryId === id;
      button.setAttr("aria-checked", String(selected));
      button.setAttr("tabindex", selected ? "0" : "-1");
      button.toggleClass("is-selected", selected);
    }
    this.updateControls();
    this.updateResultText();
    this.liveStatus?.setText("Resultado limpo ao trocar de categoria");
  }

  private handleCategoryKeydown(event: KeyboardEvent, id: GeneratorId): void {
    const ids = GENERATORS.map((definition) => definition.id);
    const currentIndex = ids.indexOf(id);
    if (currentIndex < 0) return;

    let nextIndex: number | null = null;
    switch (event.key) {
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = (currentIndex - 1 + ids.length) % ids.length;
        break;
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (currentIndex + 1) % ids.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = ids.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextId = ids[nextIndex];
    this.selectCategory(nextId);
    this.categoryButtons.get(nextId)?.focus();
  }

  private generateResult(): void {
    try {
      const result = generate(this.selectedId, new Random());
      this.currentResult = result;
      this.resultKey += 1;
      this.updateControls();
      this.updateResultText();
      this.liveStatus?.setText(`Novo resultado de ${result.label} gerado`);
    } catch {
      new Notice("Não foi possível gerar o resultado");
    }
  }

  private updateControls(): void {
    if (this.primaryButton) {
      const label = this.currentResult?.id === this.selectedId ? "Rerrolar" : "Gerar";
      this.primaryButton.setText(label);
    }

    const hasResult = this.currentResult !== null;
    const target = this.dependencies.getEditableTarget();
    if (this.copyTextButton) this.copyTextButton.disabled = !hasResult;
    if (this.copyMarkdownButton) this.copyMarkdownButton.disabled = !hasResult;
    if (this.createButton) this.createButton.disabled = !hasResult || this.creatingNote;
    if (this.insertButton) this.insertButton.disabled = !hasResult || target === null;
    this.setInsertionTarget(target);
  }

  private updateInsertionTarget(): void {
    const target = this.dependencies.getEditableTarget();
    this.setInsertionTarget(target);
    if (this.insertButton) {
      this.insertButton.disabled = this.currentResult === null || target === null;
    }
  }

  private setInsertionTarget(target: EditableMarkdownTarget | null): void {
    if (this.insertDestination) {
      this.insertDestination.setText(target ? `Destino: ${target.file.name}` : "");
    }
    if (this.insertHelp) this.insertHelp.hidden = target !== null;
  }

  private updateResultText(): void {
    if (!this.resultText || !this.resultHeader) return;

    this.removeRenderComponent();
    const result = this.currentResult;
    const renderVersion = ++this.renderVersion;
    this.resultText.empty();

    if (!result) {
      this.resultHeader.setText("Resultado");
      this.resultText.setText("Escolha um gerador e clique em “Gerar”.");
      this.resultText.addClass("is-empty");
      this.resultText.setAttr("aria-label", "Nenhum resultado gerado");
      return;
    }

    this.resultHeader.setText("Resultado");
    this.resultText.removeClass("is-empty");
    this.resultText.setAttr("aria-label", `Resultado: ${result.label}`);

    const rendered = document.createElement("div");
    const renderComponent = this.addChild(new Component());
    this.renderComponent = renderComponent;
    try {
      void MarkdownRenderer.render(this.app, toMarkdown(result, 1), rendered, "", renderComponent)
        .then(() => {
          if (
            renderVersion !== this.renderVersion ||
            this.renderComponent !== renderComponent ||
            !this.resultText
          ) return;
          this.resultText.empty();
          while (rendered.firstChild) this.resultText.appendChild(rendered.firstChild);
        })
        .catch(() => {
          if (
            renderVersion !== this.renderVersion ||
            this.renderComponent !== renderComponent ||
            !this.resultText
          ) return;
          this.resultText.setText("Não foi possível renderizar o resultado.");
          this.liveStatus?.setText("Não foi possível renderizar o resultado");
        });
    } catch {
      if (
        renderVersion === this.renderVersion &&
        this.renderComponent === renderComponent
      ) {
        this.removeRenderComponent();
        this.resultText.setText("Não foi possível renderizar o resultado.");
      }
    }
  }

  private removeRenderComponent(): void {
    if (!this.renderComponent) return;
    this.removeChild(this.renderComponent);
    this.renderComponent = null;
  }

  private async copyResult(format: "text" | "markdown"): Promise<void> {
    const result = this.currentResult;
    if (!result) return;

    const content = format === "text" ? toPlainText(result) : toMarkdown(result, 1);
    try {
      await navigator.clipboard.writeText(content);
      new Notice(format === "text" ? "Texto copiado" : "Markdown copiado");
    } catch {
      new Notice("Não foi possível copiar o conteúdo");
    }
  }

  private insertResult(): void {
    const result = this.currentResult;
    if (!result) return;

    const target = this.dependencies.getEditableTarget();
    this.setInsertionTarget(target);
    if (!target) {
      this.updateInsertionTarget();
      new Notice("Não há uma nota Markdown editável selecionada");
      return;
    }

    try {
      const markdown = toMarkdown(result, 2);
      const replacement = this.insertionText(target.editor, markdown);
      target.editor.replaceSelection(replacement);
      target.editor.focus();
      this.liveStatus?.setText(`Resultado inserido em ${target.file.name}`);
      new Notice(`Resultado inserido em ${target.file.name}`);
    } catch {
      new Notice("Não foi possível inserir o resultado");
    }
  }

  private insertionText(editor: Editor, markdown: string): string {
    const from = editor.getCursor("from");
    const to = editor.getCursor("to");
    const start = { line: 0, ch: 0 };
    const end = { line: editor.lastLine(), ch: editor.getLine(editor.lastLine()).length };
    const before = editor.getRange(start, from);
    const after = editor.getRange(to, end);
    return insertionText(before, after, markdown);
  }

  private async createNote(): Promise<void> {
    const result = this.currentResult;
    if (!result || this.creatingNote) return;

    this.creatingNote = true;
    this.updateControls();
    try {
      const vaultAdapter: OutputVault = {
        getEntry: (path) => {
          const entry = this.app.vault.getAbstractFileByPath(path);
          if (entry instanceof TFile) return { type: "file", path: entry.path };
          if (entry instanceof TFolder) return { type: "folder", path: entry.path };
          return null;
        },
        createFolder: async (path) => {
          await this.app.vault.createFolder(path);
        },
        createFile: async (path, content) => {
          await this.app.vault.create(path, content);
        },
      };
      const created = await new OutputService(vaultAdapter).createMarkdown({
        outputFolder: this.dependencies.settings.outputFolder,
        title: result.title,
        content: toMarkdown(result, 1),
      });
      let file: TFile;
      try {
        const abstractFile = this.app.vault.getAbstractFileByPath(created.path);
        if (!(abstractFile instanceof TFile)) throw new Error("arquivo não localizado");
        file = abstractFile;
        await this.app.workspace.getLeaf("tab").openFile(file);
      } catch (error) {
        const detail = error instanceof Error && error.message ? `: ${error.message}` : "";
        new Notice(`Nota criada, mas não foi possível abri-la${detail}`);
        return;
      }
      new Notice(`Nota criada: ${created.filename}`);
    } catch (error) {
      const detail = error instanceof Error && error.message ? `: ${error.message}` : "";
      new Notice(`Não foi possível criar a nota${detail}`);
    } finally {
      this.creatingNote = false;
      this.updateControls();
    }
  }
}
