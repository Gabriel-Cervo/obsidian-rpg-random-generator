import type { CompiledContentCatalog } from "../content-selection";
import {
  DEFAULT_GENERATION_OPTIONS,
  normalizeGenerationOptions,
  resolveGenerationOptions,
} from "../options";
import { Random } from "../random";
import { renderFields, type StructuredField } from "../structured-output";
import {
  VARIATION_BEATS,
  type VariationBeat,
} from "../catalogs/pt-BR/generated-content";
import type {
  GeneratorId,
  GenerationOptionsInput,
  GenerationResult,
  ResolvedGenerationOptions,
} from "../types";

export const GENERATOR_LABELS: Record<GeneratorId, string> = {
  npc: "NPCs",
  location: "Locais",
  quest: "Missões",
  encounter: "Encontros",
  rumor: "Rumores",
  dungeon: "Masmorra",
};

export type GenerationMetadata = GenerationResult["options"];

export function finish(
  id: GeneratorId,
  title: string,
  fields: readonly StructuredField[],
  metadata: GenerationMetadata,
): GenerationResult {
  return {
    id,
    label: GENERATOR_LABELS[id],
    title,
    content: renderFields(fields),
    options: metadata,
  };
}

export function begin(
  id: GeneratorId,
  random: Random,
  options: GenerationOptionsInput = DEFAULT_GENERATION_OPTIONS,
): GenerationMetadata {
  const selected = normalizeGenerationOptions(options, id);
  const resolved = resolveGenerationOptions(selected, random, id);
  return { selected, resolved };
}

export function selectProfile<T>(
  catalog: CompiledContentCatalog<T>,
  resolved: ResolvedGenerationOptions,
  random: Random,
): T {
  return catalog.select(resolved, random).content;
}

export function selectVariation(random: Random): VariationBeat {
  return random.pick(VARIATION_BEATS);
}
