/** The only setting persisted by the plugin. */
export interface RpgSettings {
  outputFolder: string;
}

/** Compatibility-friendly name for consumers that do not use the plugin prefix. */
export type Settings = RpgSettings;
export type PluginSettings = RpgSettings;

export const DEFAULT_SETTINGS: RpgSettings = {
  outputFolder: "",
};

export const OUTPUT_FOLDER_VALIDATION_REASONS = {
  notText: "A pasta de saída deve ser um texto.",
  absolute: "A pasta de saída deve ser relativa ao vault.",
  emptySegment: "A pasta de saída não pode conter segmentos vazios.",
  traversal: "A pasta de saída não pode conter '.' ou '..'.",
  invalidCharacter:
    'A pasta de saída contém um caractere inválido (< > : " | ? ou *).',
  trailingDotSpace:
    "A pasta de saída não pode conter segmentos terminados em ponto ou espaço.",
  reservedDeviceName:
    "A pasta de saída não pode conter nomes de dispositivos reservados do Windows (CON, PRN, AUX, NUL, COM1–COM9 ou LPT1–LPT9).",
} as const;

export type OutputFolderValidationCode = keyof typeof OUTPUT_FOLDER_VALIDATION_REASONS;

export interface ValidOutputFolder {
  valid: true;
  value: string;
}

export interface InvalidOutputFolder {
  valid: false;
  code: OutputFolderValidationCode;
  reason: string;
}

export type OutputFolderValidation = ValidOutputFolder | InvalidOutputFolder;

function invalid(code: OutputFolderValidationCode): InvalidOutputFolder {
  return {
    valid: false,
    code,
    reason: OUTPUT_FOLDER_VALIDATION_REASONS[code],
  };
}

/**
 * Validates and canonicalizes a vault-relative folder path.
 *
 * A trailing separator is harmless and is removed. A leading separator is not
 * removed: it is the marker of an absolute path and must be rejected.
 */
export function validateOutputFolder(input: unknown): OutputFolderValidation {
  if (typeof input !== "string") return invalid("notText");

  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return { valid: true, value: "" };
  }

  const slashPath = trimmed.replace(/\\/g, "/");
  if (
    slashPath.startsWith("/") ||
    /^\\\\/.test(trimmed) ||
    /^[A-Za-z]:/.test(slashPath)
  ) {
    return invalid("absolute");
  }

  // Separators at the end do not add a path segment and are canonicalized away.
  const withoutTrailingSeparators = slashPath.replace(/\/+$/g, "");
  if (withoutTrailingSeparators.length === 0) {
    return invalid("absolute");
  }

  // Surrounding whitespace is accepted for convenience, but whitespace after
  // the final segment is a Windows-invalid segment ending. Whitespace after a
  // trailing separator remains harmless formatting ("Notas/// ").
  if (/[ \t]$/.test(input) && !/[\\/]\s*$/.test(input)) {
    return invalid("trailingDotSpace");
  }

  const rawSegments = withoutTrailingSeparators.split("/");
  if (rawSegments.some((segment) => segment.trim().length === 0)) {
    return invalid("emptySegment");
  }

  const segments = rawSegments.map((segment) => segment.trim());
  if (segments.some((segment) => segment === "." || segment === "..")) {
    return invalid("traversal");
  }

  // These characters are invalid in Windows path segments and are rejected
  // even when the vault itself is running on another platform.
  if (segments.some((segment) => /[<>:"|?*]/.test(segment))) {
    return invalid("invalidCharacter");
  }

  // NUL and control characters cannot be represented safely by vault adapters.
  if (rawSegments.some((segment) => /[\u0000-\u001f\u007f]/.test(segment))) {
    return invalid("invalidCharacter");
  }

  if (rawSegments.some((segment) => /[. ]$/.test(segment))) {
    return invalid("trailingDotSpace");
  }

  if (segments.some((segment) => /^(?:CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\..*)?$/i.test(segment))) {
    return invalid("reservedDeviceName");
  }

  return { valid: true, value: segments.join("/") };
}

/**
 * Normalizes legacy data for loading. Invalid persisted values intentionally
 * become the safe root-folder default; interactive callers should use
 * validateOutputFolder directly so they can show its reason to the user.
 */
export function normalizeOutputFolder(input: unknown): string {
  const validation = validateOutputFolder(input);
  return validation.valid ? validation.value : DEFAULT_SETTINGS.outputFolder;
}

/** Keeps unknown/legacy keys out of persisted settings. */
export function normalizeSettings(input: unknown): RpgSettings {
  const outputFolder =
    typeof input === "object" && input !== null && "outputFolder" in input
      ? (input as { outputFolder?: unknown }).outputFolder
      : undefined;

  return { outputFolder: normalizeOutputFolder(outputFolder) };
}

/** Alias useful to plugin load code. */
export const sanitizeSettings = normalizeSettings;
