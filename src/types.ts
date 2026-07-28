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

export const DUNGEON_MODE_IDS = ["story", "mapped"] as const;
export type DungeonModeId = (typeof DUNGEON_MODE_IDS)[number];

export const DUNGEON_SIZES = [5, 8, 12] as const;
export type DungeonSize = (typeof DUNGEON_SIZES)[number];

export interface GenerationOptions {
  tone: ToneSelection;
  environment: EnvironmentSelection;
  complexity: ComplexitySelection;
  ancestry: PeopleId | "random" | null;
  dungeonMode: DungeonModeId | null;
  dungeonSize: DungeonSize | null;
}

export type GenerationOptionsInput = Partial<GenerationOptions>;

export interface ResolvedGenerationOptions {
  tone: ToneId;
  environment: EnvironmentId;
  complexity: ComplexityId;
  ancestry: PeopleId | null;
  dungeonMode: DungeonModeId | null;
  dungeonSize: DungeonSize | null;
}

export type DungeonFeatureKind = "secret" | "trap" | "encounter" | "reward";

export interface DungeonRoomArtifact {
  id: string;
  number: number;
  role: string;
  description: string;
  features: readonly DungeonFeatureKind[];
  gmNotes: readonly string[];
  x: number;
  y: number;
}

export interface DungeonEdgeArtifact {
  from: string;
  to: string;
  kind: "path" | "shortcut";
}

export interface DungeonMapArtifact {
  environment: EnvironmentId;
  rooms: readonly DungeonRoomArtifact[];
  edges: readonly DungeonEdgeArtifact[];
  ascii: string;
  accessibleLabel: string;
}

export interface DungeonArtifact {
  mode: DungeonModeId;
  size: DungeonSize;
  rooms: readonly DungeonRoomArtifact[];
  map: DungeonMapArtifact | null;
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
  dungeon?: DungeonArtifact;
}

export interface GeneratorDefinition {
  id: GeneratorId;
  label: string;
  icon: string;
  generate(random: Random, options?: GenerationOptionsInput): GenerationResult;
}
