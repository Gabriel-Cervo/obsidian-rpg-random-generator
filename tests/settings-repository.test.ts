import { describe, expect, it } from "vitest";
import { SettingsRepository } from "../src/application/settings-repository";

describe("repositório de configurações", () => {
  it("serializa escritas e publica o valor somente após persistir", async () => {
    const current = { outputFolder: "" };
    const persisted: string[] = [];
    let releaseFirst: (() => void) | undefined;
    const firstGate = new Promise<void>((resolve) => {
      releaseFirst = resolve;
    });
    let calls = 0;
    const repository = new SettingsRepository(current, async (settings) => {
      calls += 1;
      if (calls === 1) await firstGate;
      persisted.push(settings.outputFolder);
    });

    const first = repository.save({ outputFolder: "A" });
    const second = repository.save({ outputFolder: "B" });
    expect(current.outputFolder).toBe("");

    releaseFirst?.();
    await Promise.all([first, second]);

    expect(persisted).toEqual(["A", "B"]);
    expect(current.outputFolder).toBe("B");
  });

  it("continua utilizável depois de uma falha", async () => {
    const current = { outputFolder: "" };
    let fail = true;
    const repository = new SettingsRepository(current, async () => {
      if (fail) throw new Error("falha");
    });

    await expect(repository.save({ outputFolder: "A" })).rejects.toThrow("falha");
    fail = false;
    await expect(repository.save({ outputFolder: "B" })).resolves.toBeUndefined();
    expect(current.outputFolder).toBe("B");
  });
});
