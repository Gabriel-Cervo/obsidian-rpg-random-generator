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

export interface GenerationResult {
  id: GeneratorId;
  label: string;
  title: string;
  text: string;
}

export interface GeneratorDefinition {
  id: GeneratorId;
  label: string;
  icon: string;
  generate(random: Random): GenerationResult;
}

