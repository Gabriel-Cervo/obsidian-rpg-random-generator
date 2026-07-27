import { Random } from "./random";
import {
  COMPLEXITY_IDS,
  ENVIRONMENT_IDS,
  TONE_IDS,
  type ComplexityId,
  type EnvironmentId,
  type ResolvedGenerationOptions,
  type ToneId,
} from "./types";

export interface ContentCompatibility {
  tone: ToneId;
  environment: EnvironmentId;
  complexity: ComplexityId;
}

export interface ContentTagSet {
  tone?: ToneId | readonly ToneId[];
  environment?: EnvironmentId | readonly EnvironmentId[];
  complexity?: ComplexityId | readonly ComplexityId[];
}

/** A catalog entry has an immutable, human-independent ID for diagnostics. */
export interface TaggedContentEntry<T> {
  id: string;
  content: T;
  tone?: ToneId | readonly ToneId[];
  environment?: EnvironmentId | readonly EnvironmentId[];
  complexity?: ComplexityId | readonly ComplexityId[];
  /** Optional nested spelling is useful when tags are loaded as one object. */
  tags?: ContentTagSet;
  compatibility?: ContentTagSet;
  /** Fallback entries are considered only when no normal match exists. */
  fallback?: boolean;
  /** Readable alias accepted when catalog data comes from another producer. */
  isFallback?: boolean;
}

export interface CatalogCell {
  tone: ToneId;
  environment: EnvironmentId;
  complexity: ComplexityId;
}

export interface CatalogCoverage {
  valid: boolean;
  missing: CatalogCell[];
  duplicateIds: string[];
  invalidEntryIds: string[];
}

export class ContentSelectionError extends Error {
  constructor(message = "Nenhuma entrada de conteúdo compatível foi encontrada.") {
    super(message);
    this.name = "ContentSelectionError";
  }
}

function asArray<T>(value: T | readonly T[] | undefined): readonly T[] | undefined {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) return value as readonly T[];
  return [value as T];
}

function tagMatches<T extends string>(tag: T | readonly T[] | undefined, value: T): boolean {
  const values = asArray(tag);
  return values === undefined || values.includes(value);
}

function isFallback<T>(entry: TaggedContentEntry<T>): boolean {
  return entry.fallback === true || entry.isFallback === true;
}

function entryTag<T>(
  entry: TaggedContentEntry<T>,
  key: "tone" | "environment" | "complexity",
): ToneId | EnvironmentId | ComplexityId | readonly ToneId[] | readonly EnvironmentId[] | readonly ComplexityId[] | undefined {
  return entry[key] ?? entry.tags?.[key] ?? entry.compatibility?.[key];
}

function matches<T>(entry: TaggedContentEntry<T>, cell: CatalogCell, fallback: boolean): boolean {
  const tone = entryTag(entry, "tone") as ToneId | readonly ToneId[] | undefined;
  const environment = entryTag(entry, "environment") as EnvironmentId | readonly EnvironmentId[] | undefined;
  const complexity = entryTag(entry, "complexity") as ComplexityId | readonly ComplexityId[] | undefined;
  // Missing tags are wildcards only for explicitly marked fallback entries.
  if (!fallback && (tone === undefined || environment === undefined || complexity === undefined)) {
    return false;
  }
  return tagMatches(tone, cell.tone) && tagMatches(environment, cell.environment) && tagMatches(complexity, cell.complexity);
}

function cellKey(cell: CatalogCell): string {
  return `${cell.tone}/${cell.environment}/${cell.complexity}`;
}

function allCells(): CatalogCell[] {
  return TONE_IDS.flatMap((tone) =>
    ENVIRONMENT_IDS.flatMap((environment) =>
      COMPLEXITY_IDS.map((complexity) => ({ tone, environment, complexity })),
    ),
  );
}

function toCompatibility(value: ContentCompatibility | ResolvedGenerationOptions): ContentCompatibility {
  return { tone: value.tone, environment: value.environment, complexity: value.complexity };
}

/** Selects a normal compatible entry first, then an explicitly marked fallback. */
export function selectCompatibleContent<T>(
  entries: readonly TaggedContentEntry<T>[],
  compatibility: ContentCompatibility | ResolvedGenerationOptions,
  random: Random = new Random(),
): TaggedContentEntry<T> {
  const cell = toCompatibility(compatibility);
  const normal = entries.filter((entry) => !isFallback(entry) && matches(entry, cell, false));
  if (normal.length > 0) return random.pick(normal);

  const fallback = entries.filter((entry) => isFallback(entry) && matches(entry, cell, true));
  if (fallback.length > 0) return random.pick(fallback);

  throw new ContentSelectionError(
    `Nenhuma entrada compatível para ${cellKey(cell)} (normal ou fallback).`,
  );
}

/** Alias emphasizing that the selector returns the catalog entry, including its ID. */
export const selectTaggedContent = selectCompatibleContent;
export const selectTaggedEntry = selectCompatibleContent;

/** Checks IDs and ensures every option combination has a normal or fallback entry. */
export function validateCatalogCoverage<T>(
  entries: readonly TaggedContentEntry<T>[],
): CatalogCoverage {
  const seen = new Set<string>();
  const duplicateIds: string[] = [];
  const invalidEntryIds: string[] = [];

  for (const entry of entries) {
    if (typeof entry.id !== "string" || entry.id.trim().length === 0) {
      invalidEntryIds.push(entry.id);
    } else if (seen.has(entry.id)) {
      duplicateIds.push(entry.id);
    } else {
      seen.add(entry.id);
    }
  }

  const missing = allCells().filter((cell) =>
    !entries.some((entry) =>
      (!isFallback(entry) && matches(entry, cell, false)) ||
      (isFallback(entry) && matches(entry, cell, true)),
    ),
  );

  return { valid: duplicateIds.length === 0 && invalidEntryIds.length === 0 && missing.length === 0, missing, duplicateIds, invalidEntryIds };
}

export function assertCatalogCoverage<T>(entries: readonly TaggedContentEntry<T>[]): void {
  const coverage = validateCatalogCoverage(entries);
  if (!coverage.valid) {
    const missing = coverage.missing.map(cellKey).join(", ");
    const duplicates = coverage.duplicateIds.join(", ");
    const invalid = coverage.invalidEntryIds.join(", ");
    const details = [
      missing.length > 0 ? `combinações ausentes: ${missing}` : "",
      duplicates.length > 0 ? `IDs duplicados: ${duplicates}` : "",
      invalid.length > 0 ? `IDs inválidos: ${invalid}` : "",
    ].filter(Boolean).join("; ");
    throw new ContentSelectionError(`Catálogo incompleto: ${details}`);
  }
}

export const validateCompatibilityMatrix = validateCatalogCoverage;
export const validateCatalog = validateCatalogCoverage;
export const assertCompatibilityMatrix = assertCatalogCoverage;
export const assertCatalogComplete = assertCatalogCoverage;
