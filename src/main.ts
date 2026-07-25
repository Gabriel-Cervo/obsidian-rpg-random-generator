import { Plugin } from "obsidian";
import { GeneratorView, VIEW_TYPE_RPG_GENERATOR } from "./view";

export default class RpgRandomGeneratorPlugin extends Plugin {
  async onload(): Promise<void> {
    this.registerView(VIEW_TYPE_RPG_GENERATOR, (leaf) => new GeneratorView(leaf));

    this.addRibbonIcon("dice-5", "Abrir Gerador de RPG", () => {
      void this.activateView();
    });

    this.addCommand({
      id: "open-rpg-generator",
      name: "Abrir gerador de RPG",
      callback: () => void this.activateView(),
    });
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
