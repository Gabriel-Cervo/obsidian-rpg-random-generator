import { DEFAULT_GENERATION_OPTIONS } from "./options";
import { Random } from "./random";
import { DUNGEON_GENERATOR } from "./generators/dungeon";
import { ENCOUNTER_GENERATOR } from "./generators/encounter";
import { LOCATION_GENERATOR } from "./generators/location";
import { NPC_GENERATOR } from "./generators/npc";
import { QUEST_GENERATOR } from "./generators/quest";
import { RUMOR_GENERATOR } from "./generators/rumor";
import type {
  GeneratorDefinition,
  GeneratorId,
  GenerationOptionsInput,
  GenerationResult,
} from "./types";

/** Strategy registry. Each generator owns its fields and domain-specific behavior. */
export const GENERATORS: readonly GeneratorDefinition[] = [
  NPC_GENERATOR,
  LOCATION_GENERATOR,
  QUEST_GENERATOR,
  ENCOUNTER_GENERATOR,
  RUMOR_GENERATOR,
  DUNGEON_GENERATOR,
];

const generatorMap = new Map(GENERATORS.map((definition) => [definition.id, definition]));

export function getGenerator(id: GeneratorId): GeneratorDefinition {
  const definition = generatorMap.get(id);
  if (!definition) throw new Error(`Unknown generator: ${id}`);
  return definition;
}

export function generate(
  id: GeneratorId,
  random: Random = new Random(),
  options: GenerationOptionsInput = DEFAULT_GENERATION_OPTIONS,
): GenerationResult {
  return getGenerator(id).generate(random, options);
}
