import { describe, expect, it } from "vitest";
import { GenerationSessionController } from "../src/application/generation-session";
import { generate } from "../src/generators";
import { Random } from "../src/random";

describe("controller da sessão de geração", () => {
  it("começa e reinicia com estado efêmero padrão", () => {
    const controller = new GenerationSessionController();
    controller.selectGenerator("quest");
    controller.updateOption("tone", "grim");
    controller.generate(new Random(() => 0.2));

    controller.reset();

    expect(controller.snapshot.selectedId).toBe("npc");
    expect(controller.snapshot.options).toEqual({
      tone: "random",
      environment: "random",
      complexity: "random",
      ancestry: "random",
      dungeonMode: null,
      dungeonSize: null,
    });
    expect(controller.snapshot.currentResult).toBeNull();
  });

  it("limpa o resultado ao mudar gerador ou opção", () => {
    const controller = new GenerationSessionController();
    controller.generate(new Random(() => 0.2));
    expect(controller.snapshot.currentResult).not.toBeNull();

    controller.updateOption("environment", "forest");
    expect(controller.snapshot.currentResult).toBeNull();

    controller.generate(new Random(() => 0.2));
    controller.selectGenerator("location");
    expect(controller.snapshot.currentResult).toBeNull();
  });

  it("preserva o último resultado válido quando uma geração falha", () => {
    let shouldFail = false;
    const controller = new GenerationSessionController((id, random, options) => {
      if (shouldFail) throw new Error("falha controlada");
      return generate(id, random, options);
    });
    const first = controller.generate(new Random(() => 0.2));
    expect(first.ok).toBe(true);
    const previous = controller.snapshot.currentResult;

    shouldFail = true;
    const failed = controller.generate(new Random(() => 0.4));

    expect(failed.ok).toBe(false);
    expect(controller.snapshot.currentResult).toBe(previous);
  });
});
