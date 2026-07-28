import { PluginSettingTab, Setting, type App, type Plugin } from "obsidian";
import {
  DEFAULT_SETTINGS,
  validateOutputFolder,
  type RpgSettings,
  type OutputFolderValidation,
} from "./settings";

export interface SettingsTabDependencies {
  settings: RpgSettings;
  saveSettings: (settings: RpgSettings) => Promise<void>;
}

const DESCRIPTION =
  "Pasta relativa ao vault onde as notas geradas serão salvas. Deixe vazio para usar a raiz.";

/**
 * Standard Obsidian settings tab. The plugin is deliberately received only as
 * the base Obsidian Plugin type; persistence is injected to avoid a concrete
 * plugin/settings circular dependency.
 */
export class RpgRandomGeneratorSettingTab extends PluginSettingTab {
  private readonly settings: RpgSettings;
  private readonly saveSettings: SettingsTabDependencies["saveSettings"];
  private pendingSaveTimer: number | null = null;
  private pendingSave: { setting: Setting; settings: RpgSettings } | null = null;

  constructor(
    app: App,
    plugin: Plugin,
    dependencies: SettingsTabDependencies,
  ) {
    super(app, plugin);
    this.settings = dependencies.settings;
    this.saveSettings = dependencies.saveSettings;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl).setName("Gerador de RPG").setHeading();

    const folderSetting = new Setting(containerEl)
      .setName("Pasta de saída")
      .setDesc(DESCRIPTION);

    folderSetting.addText((text) => {
      text
        .setPlaceholder("Raiz do vault")
        .setValue(this.settings.outputFolder || DEFAULT_SETTINGS.outputFolder)
        .onChange((value) => {
          void this.handleOutputFolderChange(folderSetting, value);
        });
    });
  }

  hide(): void {
    this.flushPendingSave();
  }

  private handleOutputFolderChange(
    setting: Setting,
    input: string,
  ): void {
    const validation = validateOutputFolder(input);
    if (!validation.valid) {
      this.showValidationError(setting, validation);
      return;
    }

    this.pendingSave = {
      setting,
      settings: { outputFolder: validation.value },
    };
    if (this.pendingSaveTimer !== null) window.clearTimeout(this.pendingSaveTimer);
    this.pendingSaveTimer = window.setTimeout(() => this.flushPendingSave(), 250);
  }

  private flushPendingSave(): void {
    if (this.pendingSaveTimer !== null) {
      window.clearTimeout(this.pendingSaveTimer);
      this.pendingSaveTimer = null;
    }
    const pending = this.pendingSave;
    this.pendingSave = null;
    if (!pending) return;
    void this.persistSettings(pending.setting, pending.settings);
  }

  private async persistSettings(setting: Setting, settings: RpgSettings): Promise<void> {
    try {
      await this.saveSettings(settings);
      setting.setDesc(DESCRIPTION);
    } catch {
      setting.setDesc("A pasta de saída não pôde ser salva. Tente novamente.");
    }
  }

  private showValidationError(
    setting: Setting,
    validation: Exclude<OutputFolderValidation, { valid: true }>,
  ): void {
    setting.setDesc(`Pasta inválida: ${validation.reason}`);
  }
}

/** Short alias for consumers that do not use the plugin name in imports. */
export const SettingsTab = RpgRandomGeneratorSettingTab;
