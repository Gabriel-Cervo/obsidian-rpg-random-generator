import { validateOutputFolder, type OutputFolderValidation } from "./settings";

/** The only information the pure service needs about an existing vault item. */
export type OutputEntry =
  | { type: "file"; path?: string }
  | { type: "folder"; path?: string }
  | { kind: "file"; path?: string }
  | { kind: "folder"; path?: string };

/** Minimal vault-side adapter used by the output service and its tests. */
export interface VaultAdapter {
  getEntry(path: string): OutputEntry | null | undefined;
  createFolder(path: string): Promise<void>;
}

/** Minimal file-side adapter used by the output service and its tests. */
export interface FileAdapter {
  createFile(path: string, content: string): Promise<void>;
}

export type OutputVault = VaultAdapter & FileAdapter;

/** Aliases make the adapter's role explicit to callers integrating the service. */
export type VaultFileAdapter = OutputVault;
export type OutputVaultAdapter = OutputVault;

export interface CreateMarkdownOptions {
  outputFolder: string;
  title: string;
  content: string;
}

export interface CreatedMarkdown {
  path: string;
  filename: string;
}

export class OutputFolderValidationError extends Error {
  readonly code: OutputFolderValidation["valid"] extends true
    ? never
    : Exclude<OutputFolderValidation, { valid: true }>["code"];

  constructor(validation: Exclude<OutputFolderValidation, { valid: true }>) {
    super(validation.reason);
    this.name = "OutputFolderValidationError";
    this.code = validation.code;
  }
}

export class OutputFolderConflictError extends Error {
  readonly path: string;

  constructor(path: string) {
    super(`A pasta de saída não pode ser criada porque existe um arquivo em '${path}'.`);
    this.name = "OutputFolderConflictError";
    this.path = path;
  }
}

const FALLBACK_MARKDOWN_TITLE = "Sem título";
const INVALID_FILENAME_CHARACTERS = /[\\/:*?"<>|\u0000-\u001f\u007f]/g;

function entryKind(entry: OutputEntry): "file" | "folder" {
  if ("type" in entry) return entry.type;
  return entry.kind;
}

function joinVaultPath(folder: string, name: string): string {
  return folder.length > 0 ? `${folder}/${name}` : name;
}

function assertValidOutputFolder(outputFolder: string): string {
  const validation = validateOutputFolder(outputFolder);
  if (!validation.valid) throw new OutputFolderValidationError(validation);
  return validation.value;
}

/**
 * Turns a result title into one safe, nonempty filename stem. It does not add
 * the Markdown extension; callers can use it for display or collision checks.
 */
export function sanitizeMarkdownTitle(title: string): string {
  const sanitized = title
    .replace(INVALID_FILENAME_CHARACTERS, "-")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[. ]+$/g, "")
    .replace(/^-+|-+$/g, "")
    .trim();

  if (sanitized.length === 0 || sanitized === "." || sanitized === "..") {
    return FALLBACK_MARKDOWN_TITLE;
  }

  return sanitized;
}

/** Alias emphasizing that the returned value is a filename stem. */
export const sanitizeResultTitle = sanitizeMarkdownTitle;

/** Ensures a relative output folder exists, creating each missing segment. */
export async function ensureOutputFolder(
  vault: OutputVault,
  outputFolder: string,
): Promise<string> {
  const normalizedFolder = assertValidOutputFolder(outputFolder);
  if (normalizedFolder.length === 0) return "";

  const segments = normalizedFolder.split("/");
  let currentPath = "";

  for (const segment of segments) {
    currentPath = joinVaultPath(currentPath, segment);
    const existing = vault.getEntry(currentPath);

    if (existing != null) {
      if (entryKind(existing) === "file") {
        throw new OutputFolderConflictError(currentPath);
      }
      continue;
    }

    // Do not catch this error: a concurrent creator is a meaningful operation
    // failure and must not be mistaken for a successful folder preparation.
    await vault.createFolder(currentPath);
  }

  return normalizedFolder;
}

/** Finds the first unoccupied Markdown path without changing the vault. */
export async function findAvailableMarkdownPath(
  vault: OutputVault,
  outputFolder: string,
  title: string,
): Promise<CreatedMarkdown> {
  const normalizedFolder = assertValidOutputFolder(outputFolder);
  const stem = sanitizeMarkdownTitle(title);

  for (let suffix = 1; ; suffix += 1) {
    const filename = suffix === 1 ? `${stem}.md` : `${stem} - ${suffix}.md`;
    const path = joinVaultPath(normalizedFolder, filename);
    if (vault.getEntry(path) == null) return { path, filename };
  }
}

/** Ensures folders, chooses a collision-safe path, then creates exactly once. */
export async function createMarkdownOutput(
  vault: OutputVault,
  options: CreateMarkdownOptions,
): Promise<CreatedMarkdown> {
  const outputFolder = await ensureOutputFolder(vault, options.outputFolder);
  const available = await findAvailableMarkdownPath(vault, outputFolder, options.title);

  // A create failure (including a creation race) is intentionally propagated.
  await vault.createFile(available.path, options.content);
  return available;
}

export class OutputService {
  constructor(private readonly vault: OutputVault) {}

  ensureOutputFolder(outputFolder: string): Promise<string> {
    return ensureOutputFolder(this.vault, outputFolder);
  }

  findAvailableMarkdownPath(outputFolder: string, title: string): Promise<CreatedMarkdown> {
    return findAvailableMarkdownPath(this.vault, outputFolder, title);
  }

  createMarkdown(options: CreateMarkdownOptions): Promise<CreatedMarkdown>;
  createMarkdown(
    title: string,
    content: string,
    outputFolder?: string,
  ): Promise<CreatedMarkdown>;
  createMarkdown(
    optionsOrTitle: CreateMarkdownOptions | string,
    content?: string,
    outputFolder = "",
  ): Promise<CreatedMarkdown> {
    const options: CreateMarkdownOptions =
      typeof optionsOrTitle === "string"
        ? { title: optionsOrTitle, content: content ?? "", outputFolder }
        : optionsOrTitle;
    return createMarkdownOutput(this.vault, options);
  }
}
