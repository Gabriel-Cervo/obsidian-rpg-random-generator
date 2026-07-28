import { generate } from "../generators";
import { DEFAULT_GENERATION_OPTIONS } from "../options";
import { Random } from "../random";
import type {
  GeneratorId,
  GenerationOptions,
  GenerationOptionsInput,
  GenerationResult,
} from "../types";

export interface GenerationSessionState {
  selectedId: GeneratorId;
  options: GenerationOptions;
  currentResult: GenerationResult | null;
  creatingNote: boolean;
}

export type GenerationFunction = (
  id: GeneratorId,
  random: Random,
  options: GenerationOptionsInput,
) => GenerationResult;

export type GenerationAttempt =
  | { ok: true; result: GenerationResult }
  | { ok: false; error: unknown };

/** Owns ephemeral generator state without depending on Obsidian or the DOM. */
export class GenerationSessionController {
  private state: GenerationSessionState = this.initialState();

  constructor(private readonly generateResult: GenerationFunction = generate) {}

  get snapshot(): Readonly<GenerationSessionState> {
    return this.state;
  }

  reset(): void {
    this.state = this.initialState();
  }

  selectGenerator(id: GeneratorId): boolean {
    if (id === this.state.selectedId) return false;
    this.state = { ...this.state, selectedId: id, currentResult: null };
    return true;
  }

  updateOption<K extends keyof GenerationOptions>(
    key: K,
    value: GenerationOptions[K],
  ): void {
    this.state = {
      ...this.state,
      options: { ...this.state.options, [key]: value },
      currentResult: null,
    };
  }

  clearResult(): void {
    if (this.state.currentResult === null) return;
    this.state = { ...this.state, currentResult: null };
  }

  generate(random: Random = new Random()): GenerationAttempt {
    try {
      const result = this.generateResult(
        this.state.selectedId,
        random,
        this.state.options,
      );
      this.state = { ...this.state, currentResult: result };
      return { ok: true, result };
    } catch (error) {
      // A failed attempt intentionally preserves the last valid result.
      return { ok: false, error };
    }
  }

  setCreatingNote(creatingNote: boolean): void {
    this.state = { ...this.state, creatingNote };
  }

  private initialState(): GenerationSessionState {
    return {
      selectedId: "npc",
      options: { ...DEFAULT_GENERATION_OPTIONS },
      currentResult: null,
      creatingNote: false,
    };
  }
}
