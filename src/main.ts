import {
  MarkdownView,
  Plugin,
  TFile,
  WorkspaceLeaf,
} from "obsidian";
import { MutableStore } from "./application/readable-store";
import { RpgRandomGeneratorSettingTab } from "./settings-tab";
import { normalizeSettings, type RpgSettings } from "./settings";
import {
  GeneratorView,
  VIEW_TYPE_RPG_GENERATOR,
  type EditableMarkdownTarget,
} from "./view";

export default class RpgRandomGeneratorPlugin extends Plugin {
  private rpgSettings!: RpgSettings;
  private lastEditableTarget: EditableMarkdownTarget | null = null;
  private readonly editableTargetChanges = new MutableStore(0);
  private settingsSaveQueue: Promise<void> = Promise.resolve();

  async onload(): Promise<void> {
    this.rpgSettings = normalizeSettings(await this.loadData());

    this.registerEvent(
      this.app.workspace.on("active-leaf-change", (leaf) => this.captureFromLeaf(leaf)),
    );
    this.registerEvent(
      this.app.workspace.on("layout-change", () => {
        const version = this.editableTargetChanges.get();
        this.captureFromActiveLeaf();
        if (this.editableTargetChanges.get() === version) {
          this.editableTargetChanges.notify();
        }
      }),
    );
    this.registerEvent(
      this.app.workspace.on("file-open", () => this.captureFromActiveLeaf()),
    );
    this.captureFromActiveLeaf();

    this.registerView(
      VIEW_TYPE_RPG_GENERATOR,
      (leaf) =>
        new GeneratorView(leaf, {
          settings: this.rpgSettings,
          getEditableTarget: () => this.getEditableTarget(),
          subscribeEditableTarget: (listener) =>
            this.editableTargetChanges.subscribe(listener),
        }),
    );
    this.addSettingTab(
      new RpgRandomGeneratorSettingTab(this.app, this, {
        settings: this.rpgSettings,
        saveSettings: (settings) => this.saveSettings(settings),
      }),
    );

    this.addRibbonIcon("dice-5", "Abrir Gerador de RPG", () => {
      void this.activateView();
    });

    this.addCommand({
      id: "open-rpg-generator",
      name: "Abrir gerador de RPG",
      callback: () => void this.activateView(),
    });
  }

  private async saveSettings(settings: RpgSettings): Promise<void> {
    const save = this.settingsSaveQueue.catch(() => undefined).then(async () => {
      await this.saveData({ outputFolder: settings.outputFolder });
      this.rpgSettings.outputFolder = settings.outputFolder;
    });
    // Keep the chain usable after a failed write so a later valid change can save.
    this.settingsSaveQueue = save.catch(() => undefined);
    await save;
  }

  private captureFromActiveLeaf(): void {
    this.captureFromLeaf(this.app.workspace.activeLeaf ?? null);
  }

  private captureFromLeaf(leaf: WorkspaceLeaf | null): void {
    if (!leaf || !(leaf.view instanceof MarkdownView)) return;
    this.captureFromMarkdownView(leaf, leaf.view.editor);
  }

  private captureFromMarkdownView(
    leaf: WorkspaceLeaf,
    viewEditor: MarkdownView["editor"],
  ): void {
    const view = leaf.view;
    if (!(view instanceof MarkdownView) || view.getMode() !== "source") return;
    if (!view.file || !viewEditor || view.editor !== viewEditor) return;

    this.lastEditableTarget = {
      editor: view.editor,
      file: view.file,
      leaf,
    };
    this.editableTargetChanges.set(this.editableTargetChanges.get() + 1);
  }

  private getEditableTarget(): EditableMarkdownTarget | null {
    const target = this.lastEditableTarget;
    if (!target) return null;

    const vaultFile = this.app.vault.getAbstractFileByPath(target.file.path);
    if (!(vaultFile instanceof TFile)) return null;
    if (
      !(target.leaf.view instanceof MarkdownView) ||
      target.leaf.view.getMode() !== "source"
    ) return null;

    const viewFile = target.leaf.view.file;
    if (
      viewFile?.path !== target.file.path ||
      target.leaf.view.editor !== target.editor ||
      vaultFile.path !== target.file.path
    ) {
      return null;
    }

    return target;
  }

  private async activateView(): Promise<void> {
    const existingLeaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_RPG_GENERATOR);
    if (existingLeaves.length > 0) {
      this.app.workspace.revealLeaf(existingLeaves[0]);
      return;
    }

    const leaf = this.app.workspace.getRightLeaf(false);
    if (!leaf) return;
    await leaf.setViewState({ type: VIEW_TYPE_RPG_GENERATOR, active: true });
    this.app.workspace.revealLeaf(leaf);
  }
}
