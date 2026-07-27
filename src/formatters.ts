import type { GenerationResult } from "./types";

function normalizeTitle(title: string): string {
  return title.replace(/\s+/g, " ").trim();
}

function normalizeBody(body: string): string {
  const normalized = body.replace(/\r\n?/g, "\n");
  return normalized
    .replace(/^(?:[ \t]*\n)+/, "")
    .replace(/(?:\n[ \t]*)+$/, "");
}

function formatWithHeading(level: 1 | 2, title: string, body: string): string {
  const normalizedTitle = normalizeTitle(title);
  const normalizedBody = normalizeBody(body);
  const heading = `${"#".repeat(level)} ${normalizedTitle}`;

  return normalizedBody.length > 0 ? `${heading}\n\n${normalizedBody}` : heading;
}

/** Formats a result as a standalone Markdown section with an H1 title. */
export function formatMarkdownH1(title: string, body: string): string {
  return formatWithHeading(1, title, body);
}

/** Formats a result for insertion into an existing Markdown document with an H2 title. */
export function formatMarkdownH2(title: string, body: string): string {
  return formatWithHeading(2, title, body);
}

/** Formats a result as plain text, retaining the title without Markdown syntax. */
export function formatPlainText(title: string, body: string): string {
  const normalizedTitle = normalizeTitle(title);
  const normalizedBody = normalizeBody(body);

  return normalizedBody.length > 0 ? `${normalizedTitle}\n\n${normalizedBody}` : normalizedTitle;
}

/** Formats a result with its title at the requested Markdown heading level. */
export function toMarkdown(result: GenerationResult, headingLevel: 1 | 2): string {
  return formatWithHeading(headingLevel, result.title, result.content.markdown);
}

/** Formats a result as plain text with its title included exactly once. */
export function toPlainText(result: GenerationResult): string {
  return formatPlainText(result.title, result.content.plainText);
}
