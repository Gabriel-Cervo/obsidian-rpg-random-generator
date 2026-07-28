/** Canonical ordered fields used by both plain text and Markdown renderers. */
export interface StructuredField {
  label: string;
  value: string;
  number?: number;
}

function prefix(field: StructuredField): string {
  return field.number === undefined ? "" : `${field.number}. `;
}

export function renderPlainFields(fields: readonly StructuredField[]): string {
  return fields.map((field) => `${prefix(field)}${field.label}: ${field.value}`).join("\n");
}

export function renderMarkdownFields(fields: readonly StructuredField[]): string {
  return fields
    .map((field) => `${prefix(field)}**${field.label}:** ${field.value}`)
    .join("\n");
}

export function renderFields(
  fields: readonly StructuredField[],
): { plainText: string; markdown: string } {
  return {
    plainText: renderPlainFields(fields),
    markdown: renderMarkdownFields(fields),
  };
}
