export interface InsertionBoundaries {
  prefix: string;
  suffix: string;
}

/**
 * Calculates the newlines needed to make inserted Markdown a standalone block.
 * The caller supplies the document text on either side of the replaced range.
 */
export function calculateInsertionBoundaries(
  before: string,
  after: string,
): InsertionBoundaries {
  return {
    prefix: boundaryBefore(before),
    suffix: boundaryAfter(after),
  };
}

export function insertionText(
  before: string,
  after: string,
  markdown: string,
): string {
  const { prefix, suffix } = calculateInsertionBoundaries(before, after);
  return `${prefix}${markdown}${suffix}`;
}

function boundaryBefore(text: string): string {
  if (text.length === 0 || text.endsWith("\n\n")) return "";
  return text.endsWith("\n") ? "\n" : "\n\n";
}

function boundaryAfter(text: string): string {
  if (text.length === 0 || text.startsWith("\n\n")) return "";
  return text.startsWith("\n") ? "\n" : "\n\n";
}
