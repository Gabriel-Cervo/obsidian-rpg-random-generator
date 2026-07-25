import { Random } from "./random";

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

export interface PeopleProfile {
  id: PeopleId;
  label: string;
  article: "um" | "uma";
  noun: string;
  givenNames: readonly string[];
  familyNames: readonly string[];
  compoundFamilyName: boolean;
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
  },
  {
    id: "elfos",
    label: "Elfo",
    article: "um",
    noun: "elfo",
    givenNames: ["Aelion", "Elaris", "Ilyra", "Lethan", "Maelis", "Naeviel", "Orian", "Saelith", "Thalion", "Vaelis", "Ylwen", "Zoreth"],
    familyNames: ["da Lua Velada", "Folha Serena", "Vento de Âmbar", "do Crepúsculo", "Canto de Prata", "Raiz Antiga"],
    compoundFamilyName: true,
  },
  {
    id: "anoes",
    label: "Anão",
    article: "um",
    noun: "anão",
    givenNames: ["Bori", "Dagna", "Dorrik", "Greda", "Keld", "Marn", "Runa", "Tovin", "Varka", "Brom", "Hedra", "Orsi"],
    familyNames: ["Barbaferro", "Pedrafundida", "Martelo-Seco", "Punho de Carvalho", "Filho da Bigorna", "Escudo Rachado"],
    compoundFamilyName: true,
  },
  {
    id: "halflings",
    label: "Halfling",
    article: "um",
    noun: "halfling",
    givenNames: ["Bela", "Ciro", "Dori", "Fina", "Joca", "Luma", "Milo", "Nena", "Pipo", "Rina", "Téo", "Vivi"],
    familyNames: ["Pé-Leve", "da Colina", "Fubá", "Boa-Tigela", "Folha-Mansa", "Três Panelas"],
    compoundFamilyName: true,
  },
  {
    id: "orcs",
    label: "Orc",
    article: "um",
    noun: "orc",
    givenNames: ["Brakka", "Drog", "Ghorra", "Krag", "Morga", "Ruk", "Sharga", "Thokk", "Ugra", "Vorga", "Zakka"],
    familyNames: ["Quebra-Lança", "Olho Cinzento", "da Cinza", "Presas de Ferro", "Corta-Correntes", "Trovão Baixo"],
    compoundFamilyName: true,
  },
  {
    id: "goblins",
    label: "Goblin",
    article: "um",
    noun: "goblin",
    givenNames: ["Bik", "Grix", "Keka", "Mik", "Nix", "Poka", "Rikk", "Snik", "Teka", "Vix", "Zik"],
    familyNames: ["Catado", "Dente-Torto", "da Lata", "Pé-de-Lama", "Ouve-Tudo", "Sobra de Fogo"],
    compoundFamilyName: true,
  },
  {
    id: "infernis",
    label: "Infernis",
    article: "um",
    noun: "infernis",
    givenNames: ["Azael", "Cireth", "Draziel", "Ivera", "Kael", "Lazra", "Mavren", "Nerez", "Ravael", "Sazra", "Veyra"],
    familyNames: ["Brasa-Viva", "da Última Vela", "Cinza Rubra", "Voz de Vidro", "do Pacto Partido", "Chifre Negro"],
    compoundFamilyName: true,
  },
  {
    id: "gigantes",
    label: "Gigante",
    article: "um",
    noun: "gigante",
    givenNames: ["Arvok", "Brunda", "Drom", "Eygra", "Gorun", "Haldra", "Jorv", "Keldun", "Mavra", "Orvak", "Thyra"],
    familyNames: ["Que Caminha nas Nuvens", "Pé-de-Montanha", "Voz do Trovão", "Quebra-Picos", "do Vale Profundo", "Mão de Granito"],
    compoundFamilyName: true,
  },
  {
    id: "quachos",
    label: "Quacho",
    article: "um",
    noun: "quacho",
    givenNames: ["Bap", "Goga", "Kru", "Lopo", "Mumu", "Nok", "Paku", "Ribi", "Sapo", "Togo", "Wek"],
    familyNames: ["Olho-de-Lagoa", "Pulo-Largo", "da Chuva", "Língua-Rápida", "Barriga-Verde", "Canto-da-Margem"],
    compoundFamilyName: true,
  },
  {
    id: "simios",
    label: "Símio",
    article: "um",
    noun: "símio",
    givenNames: ["Baku", "Duma", "Goro", "Jaka", "Kibo", "Luma", "Mako", "Nara", "Paku", "Roko", "Tamu", "Zuri"],
    familyNames: ["Mão-de-Copa", "do Galho Alto", "Olho de Fruta", "Pulo-Selvagem", "da Mata Vermelha", "Riso-Largo"],
    compoundFamilyName: true,
  },
  {
    id: "clanks",
    label: "Clank",
    article: "um",
    noun: "clank",
    givenNames: ["Axiom", "Biela", "Cifra", "Elo-7", "Ferro", "Íon", "Lacre", "Módulo", "Nexo", "Parafuso", "Rivet", "Válvula"],
    familyNames: ["da Oficina Norte", "Unidade de Cobre", "Linha-03", "da Câmara Azul", "Protocolo Antigo", "Modelo Errante"],
    compoundFamilyName: true,
  },
  {
    id: "faunos",
    label: "Fauno",
    article: "um",
    noun: "fauno",
    givenNames: ["Aster", "Brisa", "Dália", "Faron", "Lira", "Mirt", "Neris", "Pãrio", "Silen", "Tália", "Vime"],
    familyNames: ["Pé-de-Videira", "do Bosque Claro", "Chifre Dourado", "Riso de Musgo", "da Colina Verde", "Folha de Outono"],
    compoundFamilyName: true,
  },
  {
    id: "fadas",
    label: "Fada",
    article: "uma",
    noun: "fada",
    givenNames: ["Avelã", "Bril", "Cintila", "Eira", "Fira", "Lunel", "Méli", "Nin", "Orvalha", "Pérola", "Sori"],
    familyNames: ["Luz-de-Orvalho", "Asa de Primavera", "do Anel de Cogumelos", "Sopro de Lua", "Riso de Pólen", "da Folha Azul"],
    compoundFamilyName: true,
  },
  {
    id: "fungrils",
    label: "Fungril",
    article: "um",
    noun: "fungril",
    givenNames: ["Agar", "Boleto", "Cepa", "Fungo", "Hifa", "Morta", "Núcleo", "Ostra", "Píleo", "Spor", "Trufa"],
    familyNames: ["da Cova Úmida", "Esporo Vermelho", "Raiz de Musgo", "Chapéu Pálido", "Colônia Baixa", "do Subsolo"],
    compoundFamilyName: true,
  },
  {
    id: "firbolgs",
    label: "Firbolg",
    article: "um",
    noun: "firbolg",
    givenNames: ["Aldo", "Bruma", "Dara", "Eogan", "Fenna", "Garan", "Iona", "Muir", "Nuala", "Oran", "Tara"],
    familyNames: ["Casco de Carvalho", "do Prado Silencioso", "Passo Pesado", "Guardião do Vale", "Chifre de Cedro", "da Névoa Alta"],
    compoundFamilyName: true,
  },
  {
    id: "galapas",
    label: "Galapa",
    article: "um",
    noun: "galapa",
    givenNames: ["Aru", "Bato", "Cora", "Daku", "Guma", "Iru", "Kora", "Matu", "Nabu", "Teka", "Uru"],
    familyNames: ["Casco-de-Rio", "Passo Lento", "da Maré Antiga", "Pedra nas Costas", "do Mangue Azul", "Escudo Vivo"],
    compoundFamilyName: true,
  },
  {
    id: "kataris",
    label: "Katari",
    article: "um",
    noun: "katari",
    givenNames: ["Asha", "Barek", "Cira", "Daro", "Jassa", "Kesh", "Lira", "Marek", "Nissa", "Rava", "Tarek", "Vesha"],
    familyNames: ["Passo de Cinza", "Olho de Lua", "Garra Serena", "Cauda Longa", "do Salto Alto", "Ronronar Sombrio"],
    compoundFamilyName: true,
  },
];

const profileMap = new Map(PEOPLE.map((profile) => [profile.id, profile]));

function cleanName(value: string): string {
  return value
    .replace(/[^a-zA-ZÀ-ÿ-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

function titleCase(value: string): string {
  return value.length === 0 ? value : value[0].toLocaleUpperCase("pt-BR") + value.slice(1);
}

function markovName(samples: readonly string[], random: Random): string {
  const transitions = new Map<string, string[]>();

  for (const sample of samples) {
    const normalized = cleanName(sample).toLocaleLowerCase("pt-BR");
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
    if (!options) break;
    const next = random.pick(options);
    if (next === "$") break;
    value += next;
    state = `${state[1]}${next}`;
  }

  const candidate = titleCase(cleanName(value));
  if (candidate.length < 2 || candidate.length > 14) {
    return titleCase(cleanName(random.pick(samples)));
  }
  return candidate;
}

export function getPeopleProfile(id: PeopleId): PeopleProfile {
  const profile = profileMap.get(id);
  if (!profile) throw new Error(`Unknown people profile: ${id}`);
  return profile;
}

export function randomPeople(random: Random): PeopleProfile {
  return random.pick(PEOPLE);
}

export function generateName(id: PeopleId, random: Random): string {
  const profile = getPeopleProfile(id);
  const firstName = markovName(profile.givenNames, random);
  const familyName = random.pick(profile.familyNames);

  if (profile.compoundFamilyName || random.chance(0.35)) {
    return `${firstName} ${familyName}`;
  }
  return firstName;
}

