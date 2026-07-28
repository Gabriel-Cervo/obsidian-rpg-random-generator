import {
  getComplexityLabel,
  getDungeonModeLabel,
  getDungeonSizeLabel,
  getEnvironmentLabel,
  getPeopleLabel,
  getToneLabel,
} from "./options";
import type { GenerationOptionMetadata, GenerationResult } from "./types";

function normalizeTitle(title: string): string {
  return title.replace(/\s+/g, " ").trim();
}

function normalizeBody(body: string): string {
  const normalized = body.replace(/\r\n?/g, "\n");
  return normalized
    .replace(/^(?:[ \t]*\n)+/, "")
    .replace(/(?:\n[ \t]*)+$/, "");
}

function safeMetadataValue(value: string): string {
  return value.replace(/[\r\n\u0000-\u001f\u007f]/g, " ").replace(/[\\|]/g, "\\$&");
}

function metadataLines(metadata: GenerationOptionMetadata): Array<[string, string]> {
  const selected = metadata.selected;
  const resolved = metadata.resolved;
  const suffix = (selection: string): string => selection === "random" ? " (aleatório)" : "";
  const lines: Array<[string, string]> = [
    ["Tom", `${getToneLabel(resolved.tone)}${suffix(selected.tone)}`],
    ["Ambiente", `${getEnvironmentLabel(resolved.environment)}${suffix(selected.environment)}`],
    ["Complexidade", `${getComplexityLabel(resolved.complexity)}${suffix(selected.complexity)}`],
  ];

  // A null ancestry is deliberate: it means that this generator does not use it.
  if (resolved.ancestry !== null) {
    lines.push([
      "Ancestralidade",
      `${getPeopleLabel(resolved.ancestry)}${selected.ancestry === "random" ? " (aleatório)" : ""}`,
    ]);
  }
  if (resolved.dungeonMode !== null && resolved.dungeonSize !== null) {
    lines.push(
      ["Modo", getDungeonModeLabel(resolved.dungeonMode)],
      ["Salas", getDungeonSizeLabel(resolved.dungeonSize)],
    );
  }
  return lines.map(([label, value]) => [safeMetadataValue(label), safeMetadataValue(value)]);
}

function formatWithHeading(
  level: 1 | 2 | 3,
  title: string,
  body: string,
  metadata?: GenerationOptionMetadata,
): string {
  const normalizedTitle = normalizeTitle(title);
  const normalizedBody = normalizeBody(body);
  const heading = `${"#".repeat(level)} ${normalizedTitle}`;
  const parameters = metadata
    ? `> [!info] Parâmetros\n${metadataLines(metadata).map(([label, value]) => `> ${label}: ${value}`).join("\n")}`
    : "";
  const parts = [heading, parameters, normalizedBody].filter((part) => part.length > 0);

  return parts.join("\n\n");
}

/** Formats a result as a standalone Markdown section with an H1 title. */
export function formatMarkdownH1(
  title: string,
  body: string,
  metadata?: GenerationOptionMetadata,
): string {
  return formatWithHeading(1, title, body, metadata);
}

/** Formats a result for insertion into an existing Markdown document with an H2 title. */
export function formatMarkdownH2(
  title: string,
  body: string,
  metadata?: GenerationOptionMetadata,
): string {
  return formatWithHeading(2, title, body, metadata);
}

/** Formats a result as plain text, retaining the title without Markdown syntax. */
export function formatPlainText(
  title: string,
  body: string,
  metadata?: GenerationOptionMetadata,
): string {
  const normalizedTitle = normalizeTitle(title);
  const normalizedBody = normalizeBody(body);
  const parameters = metadata
    ? ["Parâmetros", ...metadataLines(metadata).map(([label, value]) => `${label}: ${value}`)].join("\n")
    : "";
  const sections = [normalizedTitle, parameters, normalizedBody].filter(
    (section) => section.length > 0,
  );
  return sections.join("\n\n");
}

/** Formats a result with its title at the requested Markdown heading level. */
export function toMarkdown(result: GenerationResult, headingLevel: 1 | 2 | 3): string {
  return formatWithHeading(
    headingLevel,
    result.title,
    result.content.markdown,
    result.options,
  );
}

/** Formats a result as plain text with its title and readable parameters included once. */
export function toPlainText(result: GenerationResult): string {
  const metadata = result.options;
  const parameters = metadata
    ? ["Parâmetros", ...metadataLines(metadata).map(([label, value]) => `${label}: ${value}`)].join("\n")
    : "";
  const normalizedBody = normalizeBody(result.content.plainText);
  const sections = [normalizeTitle(result.title), parameters, normalizedBody].filter(
    (section) => section.length > 0,
  );
  return sections.join("\n\n");
}
