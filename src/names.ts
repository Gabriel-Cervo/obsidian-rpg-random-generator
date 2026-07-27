import { Random } from "./random";
import type { ToneId } from "./types";

export type { ToneId } from "./types";

export type PeopleId =
  | "humanos"
  | "elfos"
  | "anoes"
  | "halflings"
  | "orcs"
  | "goblins"
  | "infernis"
  | "gigantes"
  | "quachos"
  | "simios"
  | "clanks"
  | "faunos"
  | "fadas"
  | "fungrils"
  | "firbolgs"
  | "galapas"
  | "kataris";

/** The names that are known to be accidental jokes or source-data artefacts. */
export const SUSPICIOUS_NAME_BLACKLIST = [
  "boleto",
  "sapo",
  "fungo",
  "morta",
  "parafuso",
  "elo-7",
  "linha-03",
] as const;

const MAX_NAME_LENGTH = 40;
const MAX_NAME_PART_LENGTH = 28;
const NAME_PATTERN = /^\p{Script=Latin}+(?:[ '\u2019-]\p{Script=Latin}+)*$/u;

export interface PeopleProfile {
  id: PeopleId;
  /** Stable pt-BR display label. */
  label: string;
  article: "um" | "uma";
  noun: string;
  /** Normal, culturally curated given names used by every non-whimsical tone. */
  givenNames: readonly string[];
  /** Normal, culturally curated family names used by every non-whimsical tone. */
  familyNames: readonly string[];
  /** Whether this people normally includes a family name. */
  compoundFamilyName: boolean;
  /** Deliberately playful names; never used by non-whimsical tones. */
  whimsicalGivenNames: readonly string[];
  /** Deliberately playful family names; never used by non-whimsical tones. */
  whimsicalFamilyNames: readonly string[];
}

export const PEOPLE: readonly PeopleProfile[] = [
  {
    id: "humanos",
    label: "Humano",
    article: "um",
    noun: "humano",
    givenNames: ["Adel", "Brena", "Caio", "Dalia", "Eron", "Lívia", "Mara", "Nilo", "Oren", "Tália", "Vera", "Yago"],
    familyNames: ["Valença", "Moura", "Alvar", "Ribeiro", "Serrat", "Vilar", "Candeia", "Brum"],
    compoundFamilyName: false,
    whimsicalGivenNames: ["Pim", "Nino", "Tuca"],
    whimsicalFamilyNames: ["da Feira Lunar", "Passo Torto"],
  },
  {
    id: "elfos",
    label: "Elfo",
    article: "um",
    noun: "elfo",
    givenNames: ["Aelion", "Elaris", "Ilyra", "Lethan", "Maelis", "Naeviel", "Orian", "Saelith", "Thalion", "Vaelis", "Ylwen", "Zoreth"],
    familyNames: ["da Lua Velada", "Folha Serena", "Vento de Âmbar", "do Crepúsculo", "Lira de Prata", "Raiz Antiga"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Lunito", "Faísca", "Zunzum"],
    whimsicalFamilyNames: ["Chapéu de Lua", "Canto Saltitante"],
  },
  {
    id: "anoes",
    label: "Anão",
    article: "um",
    noun: "anão",
    givenNames: ["Bori", "Dagna", "Dorrik", "Greda", "Keld", "Marn", "Runa", "Tovin", "Varka", "Brom", "Hedra", "Orsi"],
    familyNames: ["Barbaferro", "Pedrafundida", "Machado-Seco", "Punho de Carvalho", "Filho da Bigorna", "Escudo Rachado"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Bigodim", "Tremoço", "Pavio"],
    whimsicalFamilyNames: ["Caneca Saltitante", "Martelo Miúdo"],
  },
  {
    id: "halflings",
    label: "Halfling",
    article: "um",
    noun: "halfling",
    givenNames: ["Bela", "Ciro", "Dori", "Fina", "Joca", "Luma", "Milo", "Nena", "Pipo", "Rina", "Téo", "Vivi"],
    familyNames: ["Pé-Leve", "da Colina", "Folha-Mansa", "Vale Dourado", "Colina Serena", "Campo Verde"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Migalha", "Pudim", "Tico"],
    whimsicalFamilyNames: ["Boa-Tigela", "Três Panelas"],
  },
  {
    id: "orcs",
    label: "Orc",
    article: "um",
    noun: "orc",
    givenNames: ["Brakka", "Drog", "Ghorra", "Krag", "Morga", "Ruk", "Sharga", "Thokk", "Ugra", "Vorga", "Zakka"],
    familyNames: ["Quebra-Lança", "Olho Cinzento", "da Cinza", "Presas de Ferro", "Corta-Correntes", "Trovão Baixo"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Grunho", "Patusco", "Trombeta"],
    whimsicalFamilyNames: ["Chute na Lua", "Roncador de Pedras"],
  },
  {
    id: "goblins",
    label: "Goblin",
    article: "um",
    noun: "goblin",
    givenNames: ["Bik", "Grix", "Keka", "Mik", "Nix", "Poka", "Rikk", "Snik", "Teka", "Vix", "Zik"],
    familyNames: ["Dente-Torto", "Ferrugem", "Ouve-Tudo", "Sobra de Fogo", "Passo Oculto", "Olho de Breu"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Pilha", "Zigue", "Toco"],
    whimsicalFamilyNames: ["da Lata", "Pé-de-Lama"],
  },
  {
    id: "infernis",
    label: "Infernis",
    article: "um",
    noun: "infernis",
    givenNames: ["Azael", "Cireth", "Draziel", "Ivera", "Kael", "Lazra", "Mavren", "Nerez", "Ravael", "Sazra", "Veyra"],
    familyNames: ["Brasa-Viva", "da Última Vela", "Cinza Rubra", "Voz de Vidro", "do Pacto Partido", "Chifre Negro"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Fagulha", "Pirueta", "Chispa"],
    whimsicalFamilyNames: ["Pavio de Festa", "Brasa Saltitante"],
  },
  {
    id: "gigantes",
    label: "Gigante",
    article: "um",
    noun: "gigante",
    givenNames: ["Arvok", "Brunda", "Drom", "Eygra", "Gorun", "Haldra", "Jorv", "Keldun", "Mavra", "Orvak", "Thyra"],
    familyNames: ["Que Caminha nas Nuvens", "Pé-de-Montanha", "Voz do Trovão", "Quebra-Picos", "do Vale Profundo", "Mão de Granito"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Tromba", "Picolé", "Grandão"],
    whimsicalFamilyNames: ["Cabeça nas Nuvens", "Passo de Pudim"],
  },
  {
    id: "quachos",
    label: "Quacho",
    article: "um",
    noun: "quacho",
    givenNames: ["Bap", "Goga", "Kru", "Lopo", "Mumu", "Nok", "Paku", "Ribi", "Nalu", "Togo", "Wek"],
    familyNames: ["Olho-de-Lagoa", "Salto-Largo", "da Chuva", "Língua-Rápida", "Barriga-Verde", "Voz-da-Margem"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Pipoca", "Tutu", "Mola"],
    whimsicalFamilyNames: ["Barriga de Mel", "Pulo Redondo"],
  },
  {
    id: "simios",
    label: "Símio",
    article: "um",
    noun: "símio",
    givenNames: ["Baku", "Duma", "Goro", "Jaka", "Kibo", "Luma", "Mako", "Nara", "Paku", "Roko", "Tamu", "Zuri"],
    familyNames: ["Mão-de-Copa", "do Galho Alto", "Olho de Fruta", "Salto-Selvagem", "da Mata Vermelha", "Voz do Dossel"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Caju", "Pulo", "Tutu"],
    whimsicalFamilyNames: ["Rabo de Festa", "Banana Dourada"],
  },
  {
    id: "clanks",
    label: "Clank",
    article: "um",
    noun: "clank",
    givenNames: ["Axiom", "Biela", "Cifra", "Ferro", "Íon", "Lacre", "Módulo", "Nexo", "Rivet", "Válvula", "Calibre", "Tálio"],
    familyNames: ["da Oficina Norte", "Unidade de Cobre", "da Câmara Azul", "Protocolo Antigo", "Modelo Errante", "da Forja Leste"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Catraca", "Tinido", "Mola"],
    whimsicalFamilyNames: ["Porca Dourada", "Ruído de Lata"],
  },
  {
    id: "faunos",
    label: "Fauno",
    article: "um",
    noun: "fauno",
    givenNames: ["Aster", "Brisa", "Dália", "Faron", "Lira", "Mirt", "Neris", "Pãrio", "Silen", "Tália", "Vime"],
    familyNames: ["Pé-de-Videira", "do Bosque Claro", "Chifre Dourado", "Véu de Musgo", "da Colina Verde", "Folha de Outono"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Fubá", "Pula-Folha", "Cascudo"],
    whimsicalFamilyNames: ["Pé de Marmelada", "Chifre Enfeitado"],
  },
  {
    id: "fadas",
    label: "Fada",
    article: "uma",
    noun: "fada",
    givenNames: ["Avelã", "Bril", "Cintila", "Eira", "Fira", "Lunel", "Méli", "Nin", "Orvalha", "Pérola", "Sori"],
    familyNames: ["Luz-de-Orvalho", "Asa de Primavera", "do Anel de Flores", "Sopro de Lua", "Véu de Pólen", "da Folha Azul"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Pirilampo", "Pompom", "Lantejoula"],
    whimsicalFamilyNames: ["Asa de Confete", "Brilho de Bolha"],
  },
  {
    id: "fungrils",
    label: "Fungril",
    article: "um",
    noun: "fungril",
    givenNames: ["Agar", "Cepa", "Hifa", "Micélio", "Núcleo", "Ostra", "Píleo", "Spor", "Trufa", "Espora", "Rizó"],
    familyNames: ["da Cova Úmida", "Esporo Vermelho", "Raiz de Musgo", "Chapéu Pálido", "Colônia Baixa", "do Subsolo"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Bolota", "Cogumelo", "Pipoca"],
    whimsicalFamilyNames: ["Chapéu Saltitante", "Raiz de Festa"],
  },
  {
    id: "firbolgs",
    label: "Firbolg",
    article: "um",
    noun: "firbolg",
    givenNames: ["Aldo", "Bruma", "Dara", "Eogan", "Fenna", "Garan", "Iona", "Muir", "Nuala", "Oran", "Tara"],
    familyNames: ["Casco de Carvalho", "do Prado Silencioso", "Passo Pesado", "Guardião do Vale", "Chifre de Cedro", "da Névoa Alta"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Musguinho", "Pinhão", "Toco"],
    whimsicalFamilyNames: ["Abraço de Carvalho", "Passo de Bolota"],
  },
  {
    id: "galapas",
    label: "Galapa",
    article: "um",
    noun: "galapa",
    givenNames: ["Aru", "Bato", "Cora", "Daku", "Guma", "Iru", "Kora", "Matu", "Nabu", "Teka", "Uru"],
    familyNames: ["Casco-de-Rio", "Passo Lento", "da Maré Antiga", "Pedra nas Costas", "do Mangue Azul", "Escudo Vivo"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Tartaruga", "Gota", "Pingo"],
    whimsicalFamilyNames: ["Casco de Festa", "Maré Saltitante"],
  },
  {
    id: "kataris",
    label: "Katari",
    article: "um",
    noun: "katari",
    givenNames: ["Asha", "Barek", "Cira", "Daro", "Jassa", "Kesh", "Lira", "Marek", "Nissa", "Rava", "Tarek", "Vesha"],
    familyNames: ["Passo de Cinza", "Olho de Lua", "Garra Serena", "Cauda Longa", "do Salto Alto", "Sombra Riscada"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Bigode", "Pirueta", "Pata"],
    whimsicalFamilyNames: ["Cauda de Pena", "Salto de Pipoca"],
  },
];

const profileMap = new Map(PEOPLE.map((profile) => [profile.id, profile]));
const whimsicalNames = new Set(
  PEOPLE.flatMap((profile) => [...profile.whimsicalGivenNames, ...profile.whimsicalFamilyNames]).map(normalizeForComparison),
);

function normalizeForComparison(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

function containsSuspiciousName(value: string): boolean {
  const blacklist: ReadonlySet<string> = new Set(SUSPICIOUS_NAME_BLACKLIST);
  return value
    .split(/[ '\u2019-]+/u)
    .some((part) => blacklist.has(normalizeForComparison(part)) || blacklist.has(normalizeForComparison(value)));
}

/** Validates one catalog item or a generated full name without modifying it. */
export function isValidName(value: string): boolean {
  if (typeof value !== "string") return false;
  const length = Array.from(value).length;
  return length >= 2 && length <= MAX_NAME_LENGTH && NAME_PATTERN.test(value) && !containsSuspiciousName(value);
}

/** Alias with a name that makes catalog/test usage explicit. */
export function isValidNamePart(value: string): boolean {
  if (typeof value !== "string") return false;
  const length = Array.from(value).length;
  return length >= 2 && length <= MAX_NAME_PART_LENGTH && NAME_PATTERN.test(value) && !containsSuspiciousName(value);
}

export function isValidNamePool(pool: readonly string[]): boolean {
  return pool.length > 0 && pool.every((name) => isValidNamePart(name));
}

/** Useful as a cheap catalog assertion in tests and development tooling. */
export function isPeopleCatalogValid(): boolean {
  return PEOPLE.length === 17
    && new Set(PEOPLE.map((profile) => profile.id)).size === 17
    && PEOPLE.every((profile) =>
      isValidNamePool(profile.givenNames)
      && isValidNamePool(profile.familyNames)
      && isValidNamePool(profile.whimsicalGivenNames)
      && isValidNamePool(profile.whimsicalFamilyNames),
    );
}

function titleCase(value: string): string {
  const characters = Array.from(value);
  if (characters.length === 0) return value;
  return characters[0]!.toLocaleUpperCase("pt-BR") + characters.slice(1).join("");
}

function randomPick<T>(values: readonly T[], random: Random): T | undefined {
  const value = random.pick(values);
  return value === undefined ? undefined : value;
}

function markovName(samples: readonly string[], random: Random, tone: ToneId): string | null {
  const transitions = new Map<string, string[]>();

  for (const sample of samples) {
    if (!isValidNamePart(sample)) continue;
    const normalized = sample.normalize("NFC").toLocaleLowerCase("pt-BR");
    const padded = `^^${normalized}$`;
    for (let index = 0; index < padded.length - 2; index += 1) {
      const key = padded.slice(index, index + 2);
      const next = padded[index + 2];
      const values = transitions.get(key) ?? [];
      values.push(next);
      transitions.set(key, values);
    }
  }

  let state = "^^";
  let value = "";
  for (let index = 0; index < 16; index += 1) {
    const options = transitions.get(state);
    if (!options) return null;
    const next = randomPick(options, random);
    if (typeof next !== "string") return null;
    if (next === "$") break;
    value += next;
    state = `${state[1]}${next}`;
  }

  const candidate = titleCase(value);
  if (!isValidNamePart(candidate)) return null;
  if (tone !== "whimsical" && whimsicalNames.has(normalizeForComparison(candidate))) return null;
  return candidate;
}

function firstValid(pool: readonly string[]): string {
  const fallback = pool.find((name) => isValidNamePart(name));
  // Built-in pools are asserted by isPeopleCatalogValid; a malformed empty pool is a data error.
  if (fallback === undefined) throw new Error("No valid curated name available");
  return fallback;
}

function familyForTone(profile: PeopleProfile, tone: ToneId): readonly string[] {
  return tone === "whimsical" ? profile.whimsicalFamilyNames : profile.familyNames;
}

function givenForTone(profile: PeopleProfile, tone: ToneId): readonly string[] {
  return tone === "whimsical" ? profile.whimsicalGivenNames : profile.givenNames;
}

export function getPeopleProfile(id: PeopleId): PeopleProfile {
  const profile = profileMap.get(id);
  if (!profile) throw new Error(`Unknown people profile: ${id}`);
  return profile;
}

export function randomPeople(random: Random): PeopleProfile {
  return random.pick(PEOPLE);
}

/**
 * Generates a local procedural name and rejects malformed output. The old two-argument
 * API remains normal/heroic by default; whimsical is the only tone with a playful pool.
 */
export function generateName(id: PeopleId, random: Random, tone: ToneId = "heroic"): string {
  const profile = getPeopleProfile(id);
  const givenPool = givenForTone(profile, tone);
  const familyPool = familyForTone(profile, tone);
  const firstName = markovName(givenPool, random, tone) ?? firstValid(givenPool);
  const selectedFamily = randomPick(familyPool, random);
  const familyName = selectedFamily !== undefined && isValidNamePart(selectedFamily)
    ? selectedFamily
    : firstValid(familyPool);
  const includeFamily = profile.compoundFamilyName || random.chance(0.35);
  const fullName = includeFamily ? `${firstName} ${familyName}` : firstName;

  if (isValidName(fullName) && (tone === "whimsical" || !whimsicalNames.has(normalizeForComparison(firstName)))) {
    return fullName;
  }

  const fallbackFirst = firstValid(givenPool);
  const fallbackFamily = firstValid(familyPool);
  const fallback = profile.compoundFamilyName || includeFamily
    ? `${fallbackFirst} ${fallbackFamily}`
    : fallbackFirst;
  return isValidName(fallback) ? fallback : fallbackFirst;
}
