import type { PeopleId } from "./names";
import type { Random } from "./random";

export const GENERATOR_IDS = [
  "npc",
  "location",
  "quest",
  "encounter",
  "rumor",
  "dungeon",
] as const;

export type GeneratorId = (typeof GENERATOR_IDS)[number];

export const TONE_IDS = ["grim", "whimsical", "heroic", "mysterious"] as const;
export type ToneId = (typeof TONE_IDS)[number];
export type ToneSelection = ToneId | "random";

export const ENVIRONMENT_IDS = [
  "wilderness",
  "forest",
  "city",
  "coast",
  "ruins",
  "underground",
] as const;
export type EnvironmentId = (typeof ENVIRONMENT_IDS)[number];
export type EnvironmentSelection = EnvironmentId | "random";

export const COMPLEXITY_IDS = ["quick", "detailed"] as const;
export type ComplexityId = (typeof COMPLEXITY_IDS)[number];
export type ComplexitySelection = ComplexityId | "random";

export interface GenerationOptions {
  tone: ToneSelection;
  environment: EnvironmentSelection;
  complexity: ComplexitySelection;
  ancestry: PeopleId | "random" | null;
}

export type GenerationOptionsInput = Partial<GenerationOptions>;

export interface ResolvedGenerationOptions {
  tone: ToneId;
  environment: EnvironmentId;
  complexity: ComplexityId;
  ancestry: PeopleId | null;
}

export interface GenerationOptionMetadata {
  selected: GenerationOptions;
  resolved: ResolvedGenerationOptions;
}

export interface GenerationContent {
  plainText: string;
  markdown: string;
}

export interface GenerationResult {
  id: GeneratorId;
  label: string;
  title: string;
  content: GenerationContent;
  options: GenerationOptionMetadata;
}

export interface GeneratorDefinition {
  id: GeneratorId;
  label: string;
  icon: string;
  generate(random: Random, options?: GenerationOptionsInput): GenerationResult;
}
