import { PEOPLE, type PeopleId } from "./names";
import { Random } from "./random";
import {
  COMPLEXITY_IDS,
  DUNGEON_MODE_IDS,
  DUNGEON_SIZES,
  ENVIRONMENT_IDS,
  GENERATOR_IDS,
  TONE_IDS,
  type ComplexityId,
  type ComplexitySelection,
  type DungeonModeId,
  type DungeonSize,
  type EnvironmentId,
  type EnvironmentSelection,
  type GeneratorId,
  type GenerationOptions,
  type ResolvedGenerationOptions,
  type ToneId,
  type ToneSelection,
} from "./types";

export const TONE_LABELS: Readonly<Record<ToneId, string>> = {
  grim: "Sombrio",
  whimsical: "Extravagante",
  heroic: "Heroico",
  mysterious: "Misterioso",
};

export const ENVIRONMENT_LABELS: Readonly<Record<EnvironmentId, string>> = {
  wilderness: "Terras selvagens",
  forest: "Florestas",
  city: "Cidade",
  coast: "Litoral",
  ruins: "Ruínas",
  underground: "Subterrâneo",
};

export const COMPLEXITY_LABELS: Readonly<Record<ComplexityId, string>> = {
  quick: "Rápido",
  detailed: "Detalhado",
};

export const DUNGEON_MODE_LABELS: Readonly<Record<DungeonModeId, string>> = {
  story: "Narrativa",
  mapped: "Mapeada",
};

export const DUNGEON_SIZE_LABELS: Readonly<Record<DungeonSize, string>> = {
  5: "5 salas",
  8: "8 salas",
  12: "12 salas",
};

export const RANDOM_LABEL = "Aleatório";
/** Label used only by the Ancestralidade select; other controls keep Aleatório. */
export const RANDOM_ANCESTRY_LABEL = "Aleatória";

export const TONES = TONE_IDS;
export const ENVIRONMENTS = ENVIRONMENT_IDS;
export const COMPLEXITIES = COMPLEXITY_IDS;
export const DUNGEON_MODES = DUNGEON_MODE_IDS;
export const DUNGEON_ROOM_COUNTS = DUNGEON_SIZES;

/** Defaults are selections, not resolved values: every applicable choice rerolls. */
export const DEFAULT_GENERATION_OPTIONS: Readonly<GenerationOptions> = Object.freeze({
  tone: "random",
  environment: "random",
  complexity: "random",
  ancestry: "random",
  dungeonMode: null,
  dungeonSize: null,
});

const toneSet = new Set<string>(TONE_IDS);
const environmentSet = new Set<string>(ENVIRONMENT_IDS);
const complexitySet = new Set<string>(COMPLEXITY_IDS);
const peopleSet = new Set<string>(PEOPLE.map((person) => person.id));
const dungeonModeSet = new Set<string>(DUNGEON_MODE_IDS);
const dungeonSizeSet = new Set<number>(DUNGEON_SIZES);
const generatorSet = new Set<string>(GENERATOR_IDS);

function validSelection<T extends string>(
  value: unknown,
  values: Set<string>,
  fallback: T | "random",
): T | "random" {
  return value === "random" || (typeof value === "string" && values.has(value))
    ? (value as T | "random")
    : fallback;
}

function isNpc(generatorId: GeneratorId | string | undefined): boolean {
  return generatorId === "npc";
}

function isDungeon(generatorId: GeneratorId | string | undefined): boolean {
  return generatorId === "dungeon";
}

/**
 * Converts untrusted persisted/UI data to the closed options vocabulary.
 * Unknown fields and values are ignored, and non-NPC ancestry is always null.
 */
export function normalizeGenerationOptions(
  input: unknown = {},
  generatorId?: GeneratorId | string,
): GenerationOptions {
  const value = typeof input === "object" && input !== null ? input as Record<string, unknown> : {};
  const ancestry = isNpc(generatorId)
    ? validSelection<PeopleId>(value.ancestry, peopleSet, "random")
    : generatorId === undefined
      ? validSelection<PeopleId>(value.ancestry, peopleSet, "random")
      : null;

  return {
    tone: validSelection<ToneId>(value.tone, toneSet, "random") as ToneSelection,
    environment: validSelection<EnvironmentId>(value.environment, environmentSet, "random") as EnvironmentSelection,
    complexity: validSelection<ComplexityId>(value.complexity, complexitySet, "random") as ComplexitySelection,
    ancestry,
    dungeonMode: isDungeon(generatorId)
      ? typeof value.dungeonMode === "string" && dungeonModeSet.has(value.dungeonMode)
        ? value.dungeonMode as DungeonModeId
        : "story"
      : generatorId === undefined
        ? typeof value.dungeonMode === "string" && dungeonModeSet.has(value.dungeonMode)
          ? value.dungeonMode as DungeonModeId
          : null
        : null,
    dungeonSize: isDungeon(generatorId)
      ? typeof value.dungeonSize === "number" && dungeonSizeSet.has(value.dungeonSize)
        ? value.dungeonSize as DungeonSize
        : 5
      : generatorId === undefined
        ? typeof value.dungeonSize === "number" && dungeonSizeSet.has(value.dungeonSize)
          ? value.dungeonSize as DungeonSize
          : null
        : null,
  };
}

export interface GenerationOptionsValidation {
  valid: boolean;
  value: GenerationOptions;
  errors: readonly string[];
}

/** Reports invalid input without throwing; callers can use value as a safe fallback. */
export function validateGenerationOptions(
  input: unknown = {},
  generatorId?: GeneratorId | string,
): GenerationOptionsValidation {
  const raw = typeof input === "object" && input !== null ? input as Record<string, unknown> : {};
  const errors: string[] = [];
  if (raw.tone !== undefined && !((raw.tone === "random") || (typeof raw.tone === "string" && toneSet.has(raw.tone)))) errors.push("tone");
  if (raw.environment !== undefined && !((raw.environment === "random") || (typeof raw.environment === "string" && environmentSet.has(raw.environment)))) errors.push("environment");
  if (raw.complexity !== undefined && !((raw.complexity === "random") || (typeof raw.complexity === "string" && complexitySet.has(raw.complexity)))) errors.push("complexity");
  if (isNpc(generatorId) && raw.ancestry !== undefined && !((raw.ancestry === "random") || (typeof raw.ancestry === "string" && peopleSet.has(raw.ancestry)))) errors.push("ancestry");
  if (isDungeon(generatorId) && raw.dungeonMode !== undefined && !(typeof raw.dungeonMode === "string" && dungeonModeSet.has(raw.dungeonMode))) errors.push("dungeonMode");
  if (isDungeon(generatorId) && raw.dungeonSize !== undefined && !(typeof raw.dungeonSize === "number" && dungeonSizeSet.has(raw.dungeonSize))) errors.push("dungeonSize");
  if (generatorId !== undefined && !generatorSet.has(generatorId)) errors.push("generator");
  if (!isNpc(generatorId) && generatorId !== undefined && raw.ancestry !== undefined && raw.ancestry !== null) errors.push("ancestry");
  if (!isDungeon(generatorId) && generatorId !== undefined && raw.dungeonMode !== undefined && raw.dungeonMode !== null) errors.push("dungeonMode");
  if (!isDungeon(generatorId) && generatorId !== undefined && raw.dungeonSize !== undefined && raw.dungeonSize !== null) errors.push("dungeonSize");
  return { valid: errors.length === 0, value: normalizeGenerationOptions(input, generatorId), errors };
}

export function isValidGenerationOptions(input: unknown, generatorId?: GeneratorId | string): boolean {
  return validateGenerationOptions(input, generatorId).valid;
}

function pick<T extends string>(selection: T | "random", values: readonly T[], random: Random): T {
  return selection === "random" ? random.pick(values) : selection;
}

/** Resolves random selections anew; it never mutates the selected options. */
export function resolveGenerationOptions(
  options: unknown = DEFAULT_GENERATION_OPTIONS,
  random: Random = new Random(),
  generatorId?: GeneratorId | string,
): ResolvedGenerationOptions {
  const selected = normalizeGenerationOptions(options, generatorId);
  return {
    tone: pick(selected.tone, TONE_IDS, random),
    environment: pick(selected.environment, ENVIRONMENT_IDS, random),
    complexity: pick(selected.complexity, COMPLEXITY_IDS, random),
    ancestry:
      selected.ancestry === null
        ? null
        : pick(selected.ancestry, PEOPLE.map((person) => person.id), random),
    dungeonMode: selected.dungeonMode,
    dungeonSize: selected.dungeonSize,
  };
}

export function getToneLabel(value: ToneSelection): string {
  return value === "random" ? RANDOM_LABEL : TONE_LABELS[value];
}

export function getEnvironmentLabel(value: EnvironmentSelection): string {
  return value === "random" ? RANDOM_LABEL : ENVIRONMENT_LABELS[value];
}

export function getComplexityLabel(value: ComplexitySelection): string {
  return value === "random" ? RANDOM_LABEL : COMPLEXITY_LABELS[value];
}

export function getPeopleLabel(value: PeopleId): string {
  const person = PEOPLE.find((candidate) => candidate.id === value);
  if (!person) throw new Error(`Unknown people profile: ${value}`);
  return person.label;
}

export function getDungeonModeLabel(value: DungeonModeId): string {
  return DUNGEON_MODE_LABELS[value];
}

export function getDungeonSizeLabel(value: DungeonSize): string {
  return DUNGEON_SIZE_LABELS[value];
}

/** Returns the Portuguese display label for any resolved option value. */
export function getOptionLabel(
  kind: "tone" | "environment" | "complexity" | "ancestry" | "dungeonMode" | "dungeonSize",
  value: ToneSelection | EnvironmentSelection | ComplexitySelection | PeopleId | DungeonModeId | DungeonSize | "random",
): string {
  if (value === "random") return RANDOM_LABEL;
  switch (kind) {
    case "tone": return getToneLabel(value as ToneId);
    case "environment": return getEnvironmentLabel(value as EnvironmentId);
    case "complexity": return getComplexityLabel(value as ComplexityId);
    case "ancestry": return getPeopleLabel(value as PeopleId);
    case "dungeonMode": return getDungeonModeLabel(value as DungeonModeId);
    case "dungeonSize": return getDungeonSizeLabel(value as DungeonSize);
  }
}

export const normalizeOptions = normalizeGenerationOptions;
export const resolveOptions = resolveGenerationOptions;
export const validateOptions = validateGenerationOptions;
export const labelForOption = getOptionLabel;
export const getSelectionLabel = getOptionLabel;

/** Useful for callers validating a generator identifier at a boundary. */
export function isGeneratorId(value: unknown): value is GeneratorId {
  return typeof value === "string" && generatorSet.has(value);
}

export type { PeopleId };
export type { ToneId, EnvironmentId, ComplexityId };
