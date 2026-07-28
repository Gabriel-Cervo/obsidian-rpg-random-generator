var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => RpgRandomGeneratorPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian3 = require("obsidian");

// src/settings-tab.ts
var import_obsidian = require("obsidian");

// src/settings.ts
var DEFAULT_SETTINGS = {
  outputFolder: ""
};
var OUTPUT_FOLDER_VALIDATION_REASONS = {
  notText: "A pasta de sa\xEDda deve ser um texto.",
  absolute: "A pasta de sa\xEDda deve ser relativa ao vault.",
  emptySegment: "A pasta de sa\xEDda n\xE3o pode conter segmentos vazios.",
  traversal: "A pasta de sa\xEDda n\xE3o pode conter '.' ou '..'.",
  invalidCharacter: 'A pasta de sa\xEDda cont\xE9m um caractere inv\xE1lido (< > : " | ? ou *).',
  trailingDotSpace: "A pasta de sa\xEDda n\xE3o pode conter segmentos terminados em ponto ou espa\xE7o.",
  reservedDeviceName: "A pasta de sa\xEDda n\xE3o pode conter nomes de dispositivos reservados do Windows (CON, PRN, AUX, NUL, COM1\u2013COM9 ou LPT1\u2013LPT9)."
};
function invalid(code) {
  return {
    valid: false,
    code,
    reason: OUTPUT_FOLDER_VALIDATION_REASONS[code]
  };
}
function validateOutputFolder(input) {
  if (typeof input !== "string") return invalid("notText");
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return { valid: true, value: "" };
  }
  const slashPath = trimmed.replace(/\\/g, "/");
  if (slashPath.startsWith("/") || /^\\\\/.test(trimmed) || /^[A-Za-z]:/.test(slashPath)) {
    return invalid("absolute");
  }
  const withoutTrailingSeparators = slashPath.replace(/\/+$/g, "");
  if (withoutTrailingSeparators.length === 0) {
    return invalid("absolute");
  }
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
  if (segments.some((segment) => /[<>:"|?*]/.test(segment))) {
    return invalid("invalidCharacter");
  }
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
function normalizeOutputFolder(input) {
  const validation = validateOutputFolder(input);
  return validation.valid ? validation.value : DEFAULT_SETTINGS.outputFolder;
}
function normalizeSettings(input) {
  const outputFolder = typeof input === "object" && input !== null && "outputFolder" in input ? input.outputFolder : void 0;
  return { outputFolder: normalizeOutputFolder(outputFolder) };
}

// src/settings-tab.ts
var DESCRIPTION = "Pasta relativa ao vault onde as notas geradas ser\xE3o salvas. Deixe vazio para usar a raiz.";
var RpgRandomGeneratorSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin, dependencies) {
    super(app, plugin);
    this.saveQueue = Promise.resolve();
    this.settings = dependencies.settings;
    this.saveSettings = dependencies.saveSettings;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName("Gerador de RPG").setHeading();
    const folderSetting = new import_obsidian.Setting(containerEl).setName("Pasta de sa\xEDda").setDesc(DESCRIPTION);
    folderSetting.addText((text) => {
      text.setPlaceholder("Raiz do vault").setValue(this.settings.outputFolder || DEFAULT_SETTINGS.outputFolder).onChange((value) => {
        void this.handleOutputFolderChange(folderSetting, value);
      });
    });
  }
  async handleOutputFolderChange(setting, input) {
    const validation = validateOutputFolder(input);
    if (!validation.valid) {
      this.showValidationError(setting, validation);
      return;
    }
    const nextSettings = { outputFolder: validation.value };
    const save = this.saveQueue.catch(() => void 0).then(async () => {
      await this.saveSettings(nextSettings);
      this.settings.outputFolder = nextSettings.outputFolder;
    });
    this.saveQueue = save.catch(() => void 0);
    try {
      await save;
      setting.setDesc(DESCRIPTION);
    } catch (e) {
      setting.setDesc("A pasta de sa\xEDda n\xE3o p\xF4de ser salva. Tente novamente.");
    }
  }
  showValidationError(setting, validation) {
    setting.setDesc(`Pasta inv\xE1lida: ${validation.reason}`);
  }
};

// src/view.ts
var import_obsidian2 = require("obsidian");

// src/names.ts
var SUSPICIOUS_NAME_BLACKLIST = [
  "boleto",
  "sapo",
  "fungo",
  "morta",
  "parafuso",
  "elo-7",
  "linha-03"
];
var MAX_NAME_LENGTH = 40;
var MAX_NAME_PART_LENGTH = 28;
var NAME_PATTERN = /^\p{Script=Latin}+(?:[ '\u2019-]\p{Script=Latin}+)*$/u;
var PEOPLE = [
  {
    id: "humanos",
    label: "Humano",
    article: "um",
    noun: "humano",
    givenNames: ["Adel", "Brena", "Caio", "Dalia", "Eron", "L\xEDvia", "Mara", "Nilo", "Oren", "T\xE1lia", "Vera", "Yago"],
    familyNames: ["Valen\xE7a", "Moura", "Alvar", "Ribeiro", "Serrat", "Vilar", "Candeia", "Brum"],
    compoundFamilyName: false,
    whimsicalGivenNames: ["Pim", "Nino", "Tuca"],
    whimsicalFamilyNames: ["da Feira Lunar", "Passo Torto"]
  },
  {
    id: "elfos",
    label: "Elfo",
    article: "um",
    noun: "elfo",
    givenNames: ["Aelion", "Elaris", "Ilyra", "Lethan", "Maelis", "Naeviel", "Orian", "Saelith", "Thalion", "Vaelis", "Ylwen", "Zoreth"],
    familyNames: ["da Lua Velada", "Folha Serena", "Vento de \xC2mbar", "do Crep\xFAsculo", "Lira de Prata", "Raiz Antiga"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Lunito", "Fa\xEDsca", "Zunzum"],
    whimsicalFamilyNames: ["Chap\xE9u de Lua", "Canto Saltitante"]
  },
  {
    id: "anoes",
    label: "An\xE3o",
    article: "um",
    noun: "an\xE3o",
    givenNames: ["Bori", "Dagna", "Dorrik", "Greda", "Keld", "Marn", "Runa", "Tovin", "Varka", "Brom", "Hedra", "Orsi"],
    familyNames: ["Barbaferro", "Pedrafundida", "Machado-Seco", "Punho de Carvalho", "Filho da Bigorna", "Escudo Rachado"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Bigodim", "Tremo\xE7o", "Pavio"],
    whimsicalFamilyNames: ["Caneca Saltitante", "Martelo Mi\xFAdo"]
  },
  {
    id: "halflings",
    label: "Halfling",
    article: "um",
    noun: "halfling",
    givenNames: ["Bela", "Ciro", "Dori", "Fina", "Joca", "Luma", "Milo", "Nena", "Pipo", "Rina", "T\xE9o", "Vivi"],
    familyNames: ["P\xE9-Leve", "da Colina", "Folha-Mansa", "Vale Dourado", "Colina Serena", "Campo Verde"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Migalha", "Pudim", "Tico"],
    whimsicalFamilyNames: ["Boa-Tigela", "Tr\xEAs Panelas"]
  },
  {
    id: "orcs",
    label: "Orc",
    article: "um",
    noun: "orc",
    givenNames: ["Brakka", "Drog", "Ghorra", "Krag", "Morga", "Ruk", "Sharga", "Thokk", "Ugra", "Vorga", "Zakka"],
    familyNames: ["Quebra-Lan\xE7a", "Olho Cinzento", "da Cinza", "Presas de Ferro", "Corta-Correntes", "Trov\xE3o Baixo"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Grunho", "Patusco", "Trombeta"],
    whimsicalFamilyNames: ["Chute na Lua", "Roncador de Pedras"]
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
    whimsicalFamilyNames: ["da Lata", "P\xE9-de-Lama"]
  },
  {
    id: "infernis",
    label: "Infernis",
    article: "um",
    noun: "infernis",
    givenNames: ["Azael", "Cireth", "Draziel", "Ivera", "Kael", "Lazra", "Mavren", "Nerez", "Ravael", "Sazra", "Veyra"],
    familyNames: ["Brasa-Viva", "da \xDAltima Vela", "Cinza Rubra", "Voz de Vidro", "do Pacto Partido", "Chifre Negro"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Fagulha", "Pirueta", "Chispa"],
    whimsicalFamilyNames: ["Pavio de Festa", "Brasa Saltitante"]
  },
  {
    id: "gigantes",
    label: "Gigante",
    article: "um",
    noun: "gigante",
    givenNames: ["Arvok", "Brunda", "Drom", "Eygra", "Gorun", "Haldra", "Jorv", "Keldun", "Mavra", "Orvak", "Thyra"],
    familyNames: ["Que Caminha nas Nuvens", "P\xE9-de-Montanha", "Voz do Trov\xE3o", "Quebra-Picos", "do Vale Profundo", "M\xE3o de Granito"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Tromba", "Picol\xE9", "Grand\xE3o"],
    whimsicalFamilyNames: ["Cabe\xE7a nas Nuvens", "Passo de Pudim"]
  },
  {
    id: "quachos",
    label: "Quacho",
    article: "um",
    noun: "quacho",
    givenNames: ["Bap", "Goga", "Kru", "Lopo", "Mumu", "Nok", "Paku", "Ribi", "Nalu", "Togo", "Wek"],
    familyNames: ["Olho-de-Lagoa", "Salto-Largo", "da Chuva", "L\xEDngua-R\xE1pida", "Barriga-Verde", "Voz-da-Margem"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Pipoca", "Tutu", "Mola"],
    whimsicalFamilyNames: ["Barriga de Mel", "Pulo Redondo"]
  },
  {
    id: "simios",
    label: "S\xEDmio",
    article: "um",
    noun: "s\xEDmio",
    givenNames: ["Baku", "Duma", "Goro", "Jaka", "Kibo", "Luma", "Mako", "Nara", "Paku", "Roko", "Tamu", "Zuri"],
    familyNames: ["M\xE3o-de-Copa", "do Galho Alto", "Olho de Fruta", "Salto-Selvagem", "da Mata Vermelha", "Voz do Dossel"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Caju", "Pulo", "Tutu"],
    whimsicalFamilyNames: ["Rabo de Festa", "Banana Dourada"]
  },
  {
    id: "clanks",
    label: "Clank",
    article: "um",
    noun: "clank",
    givenNames: ["Axiom", "Biela", "Cifra", "Ferro", "\xCDon", "Lacre", "M\xF3dulo", "Nexo", "Rivet", "V\xE1lvula", "Calibre", "T\xE1lio"],
    familyNames: ["da Oficina Norte", "Unidade de Cobre", "da C\xE2mara Azul", "Protocolo Antigo", "Modelo Errante", "da Forja Leste"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Catraca", "Tinido", "Mola"],
    whimsicalFamilyNames: ["Porca Dourada", "Ru\xEDdo de Lata"]
  },
  {
    id: "faunos",
    label: "Fauno",
    article: "um",
    noun: "fauno",
    givenNames: ["Aster", "Brisa", "D\xE1lia", "Faron", "Lira", "Mirt", "Neris", "P\xE3rio", "Silen", "T\xE1lia", "Vime"],
    familyNames: ["P\xE9-de-Videira", "do Bosque Claro", "Chifre Dourado", "V\xE9u de Musgo", "da Colina Verde", "Folha de Outono"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Fub\xE1", "Pula-Folha", "Cascudo"],
    whimsicalFamilyNames: ["P\xE9 de Marmelada", "Chifre Enfeitado"]
  },
  {
    id: "fadas",
    label: "Fada",
    article: "uma",
    noun: "fada",
    givenNames: ["Avel\xE3", "Bril", "Cintila", "Eira", "Fira", "Lunel", "M\xE9li", "Nin", "Orvalha", "P\xE9rola", "Sori"],
    familyNames: ["Luz-de-Orvalho", "Asa de Primavera", "do Anel de Flores", "Sopro de Lua", "V\xE9u de P\xF3len", "da Folha Azul"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Pirilampo", "Pompom", "Lantejoula"],
    whimsicalFamilyNames: ["Asa de Confete", "Brilho de Bolha"]
  },
  {
    id: "fungrils",
    label: "Fungril",
    article: "um",
    noun: "fungril",
    givenNames: ["Agar", "Cepa", "Hifa", "Mic\xE9lio", "N\xFAcleo", "Ostra", "P\xEDleo", "Spor", "Trufa", "Espora", "Riz\xF3"],
    familyNames: ["da Cova \xDAmida", "Esporo Vermelho", "Raiz de Musgo", "Chap\xE9u P\xE1lido", "Col\xF4nia Baixa", "do Subsolo"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Bolota", "Cogumelo", "Pipoca"],
    whimsicalFamilyNames: ["Chap\xE9u Saltitante", "Raiz de Festa"]
  },
  {
    id: "firbolgs",
    label: "Firbolg",
    article: "um",
    noun: "firbolg",
    givenNames: ["Aldo", "Bruma", "Dara", "Eogan", "Fenna", "Garan", "Iona", "Muir", "Nuala", "Oran", "Tara"],
    familyNames: ["Casco de Carvalho", "do Prado Silencioso", "Passo Pesado", "Guardi\xE3o do Vale", "Chifre de Cedro", "da N\xE9voa Alta"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Musguinho", "Pinh\xE3o", "Toco"],
    whimsicalFamilyNames: ["Abra\xE7o de Carvalho", "Passo de Bolota"]
  },
  {
    id: "galapas",
    label: "Galapa",
    article: "um",
    noun: "galapa",
    givenNames: ["Aru", "Bato", "Cora", "Daku", "Guma", "Iru", "Kora", "Matu", "Nabu", "Teka", "Uru"],
    familyNames: ["Casco-de-Rio", "Passo Lento", "da Mar\xE9 Antiga", "Pedra nas Costas", "do Mangue Azul", "Escudo Vivo"],
    compoundFamilyName: true,
    whimsicalGivenNames: ["Tartaruga", "Gota", "Pingo"],
    whimsicalFamilyNames: ["Casco de Festa", "Mar\xE9 Saltitante"]
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
    whimsicalFamilyNames: ["Cauda de Pena", "Salto de Pipoca"]
  }
];
var profileMap = new Map(PEOPLE.map((profile) => [profile.id, profile]));
var whimsicalNames = new Set(
  PEOPLE.flatMap((profile) => [...profile.whimsicalGivenNames, ...profile.whimsicalFamilyNames]).map(normalizeForComparison)
);
function normalizeForComparison(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}
function containsSuspiciousName(value) {
  const blacklist = new Set(SUSPICIOUS_NAME_BLACKLIST);
  return value.split(/[ '\u2019-]+/u).some((part) => blacklist.has(normalizeForComparison(part)) || blacklist.has(normalizeForComparison(value)));
}
function isValidName(value) {
  if (typeof value !== "string") return false;
  const length = Array.from(value).length;
  return length >= 2 && length <= MAX_NAME_LENGTH && NAME_PATTERN.test(value) && !containsSuspiciousName(value);
}
function isValidNamePart(value) {
  if (typeof value !== "string") return false;
  const length = Array.from(value).length;
  return length >= 2 && length <= MAX_NAME_PART_LENGTH && NAME_PATTERN.test(value) && !containsSuspiciousName(value);
}
function titleCase(value) {
  const characters = Array.from(value);
  if (characters.length === 0) return value;
  return characters[0].toLocaleUpperCase("pt-BR") + characters.slice(1).join("");
}
function randomPick(values, random) {
  const value = random.pick(values);
  return value === void 0 ? void 0 : value;
}
function markovName(samples, random, tone) {
  var _a;
  const transitions = /* @__PURE__ */ new Map();
  for (const sample of samples) {
    if (!isValidNamePart(sample)) continue;
    const normalized = sample.normalize("NFC").toLocaleLowerCase("pt-BR");
    const padded = `^^${normalized}$`;
    for (let index = 0; index < padded.length - 2; index += 1) {
      const key = padded.slice(index, index + 2);
      const next = padded[index + 2];
      const values = (_a = transitions.get(key)) != null ? _a : [];
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
function firstValid(pool) {
  const fallback = pool.find((name) => isValidNamePart(name));
  if (fallback === void 0) throw new Error("No valid curated name available");
  return fallback;
}
function familyForTone(profile, tone) {
  return tone === "whimsical" ? profile.whimsicalFamilyNames : profile.familyNames;
}
function givenForTone(profile, tone) {
  return tone === "whimsical" ? profile.whimsicalGivenNames : profile.givenNames;
}
function getPeopleProfile(id) {
  const profile = profileMap.get(id);
  if (!profile) throw new Error(`Unknown people profile: ${id}`);
  return profile;
}
function generateName(id, random, tone = "heroic") {
  var _a;
  const profile = getPeopleProfile(id);
  const givenPool = givenForTone(profile, tone);
  const familyPool = familyForTone(profile, tone);
  const firstName = (_a = markovName(givenPool, random, tone)) != null ? _a : firstValid(givenPool);
  const selectedFamily = randomPick(familyPool, random);
  const familyName = selectedFamily !== void 0 && isValidNamePart(selectedFamily) ? selectedFamily : firstValid(familyPool);
  const includeFamily = profile.compoundFamilyName || random.chance(0.35);
  const fullName = includeFamily ? `${firstName} ${familyName}` : firstName;
  if (isValidName(fullName) && (tone === "whimsical" || !whimsicalNames.has(normalizeForComparison(firstName)))) {
    return fullName;
  }
  const fallbackFirst = firstValid(givenPool);
  const fallbackFamily = firstValid(familyPool);
  const fallback = profile.compoundFamilyName || includeFamily ? `${fallbackFirst} ${fallbackFamily}` : fallbackFirst;
  return isValidName(fallback) ? fallback : fallbackFirst;
}

// src/random.ts
var Random = class {
  constructor(source = Math.random) {
    this.source = source;
  }
  next() {
    return this.source();
  }
  int(maxExclusive) {
    if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
      throw new Error("maxExclusive must be a positive integer");
    }
    return Math.min(maxExclusive - 1, Math.floor(this.next() * maxExclusive));
  }
  pick(values) {
    if (values.length === 0) {
      throw new Error("Cannot pick from an empty table");
    }
    return values[this.int(values.length)];
  }
  chance(probability) {
    return this.next() < probability;
  }
};

// src/types.ts
var GENERATOR_IDS = [
  "npc",
  "location",
  "quest",
  "encounter",
  "rumor",
  "dungeon"
];
var TONE_IDS = ["grim", "whimsical", "heroic", "mysterious"];
var ENVIRONMENT_IDS = [
  "wilderness",
  "forest",
  "city",
  "coast",
  "ruins",
  "underground"
];
var COMPLEXITY_IDS = ["quick", "detailed"];

// src/content-selection.ts
var ContentSelectionError = class extends Error {
  constructor(message = "Nenhuma entrada de conte\xFAdo compat\xEDvel foi encontrada.") {
    super(message);
    this.name = "ContentSelectionError";
  }
};
function asArray(value) {
  if (value === void 0) return void 0;
  if (Array.isArray(value)) return value;
  return [value];
}
function tagMatches(tag, value) {
  const values = asArray(tag);
  return values === void 0 || values.includes(value);
}
function isFallback(entry) {
  return entry.fallback === true || entry.isFallback === true;
}
function entryTag(entry, key) {
  var _a, _b, _c, _d;
  return (_d = (_b = entry[key]) != null ? _b : (_a = entry.tags) == null ? void 0 : _a[key]) != null ? _d : (_c = entry.compatibility) == null ? void 0 : _c[key];
}
function matches(entry, cell, fallback) {
  const tone = entryTag(entry, "tone");
  const environment = entryTag(entry, "environment");
  const complexity = entryTag(entry, "complexity");
  if (!fallback && (tone === void 0 || environment === void 0 || complexity === void 0)) {
    return false;
  }
  return tagMatches(tone, cell.tone) && tagMatches(environment, cell.environment) && tagMatches(complexity, cell.complexity);
}
function cellKey(cell) {
  return `${cell.tone}/${cell.environment}/${cell.complexity}`;
}
function allCells() {
  return TONE_IDS.flatMap(
    (tone) => ENVIRONMENT_IDS.flatMap(
      (environment) => COMPLEXITY_IDS.map((complexity) => ({ tone, environment, complexity }))
    )
  );
}
function toCompatibility(value) {
  return { tone: value.tone, environment: value.environment, complexity: value.complexity };
}
function selectCompatibleContent(entries, compatibility, random = new Random()) {
  const cell = toCompatibility(compatibility);
  const normal = entries.filter((entry) => !isFallback(entry) && matches(entry, cell, false));
  if (normal.length > 0) return random.pick(normal);
  const fallback = entries.filter((entry) => isFallback(entry) && matches(entry, cell, true));
  if (fallback.length > 0) return random.pick(fallback);
  throw new ContentSelectionError(
    `Nenhuma entrada compat\xEDvel para ${cellKey(cell)} (normal ou fallback).`
  );
}
function validateCatalogCoverage(entries) {
  const seen = /* @__PURE__ */ new Set();
  const duplicateIds = [];
  const invalidEntryIds = [];
  for (const entry of entries) {
    if (typeof entry.id !== "string" || entry.id.trim().length === 0) {
      invalidEntryIds.push(entry.id);
    } else if (seen.has(entry.id)) {
      duplicateIds.push(entry.id);
    } else {
      seen.add(entry.id);
    }
  }
  const missing = allCells().filter(
    (cell) => !entries.some(
      (entry) => !isFallback(entry) && matches(entry, cell, false) || isFallback(entry) && matches(entry, cell, true)
    )
  );
  return { valid: duplicateIds.length === 0 && invalidEntryIds.length === 0 && missing.length === 0, missing, duplicateIds, invalidEntryIds };
}
function assertCatalogCoverage(entries) {
  const coverage = validateCatalogCoverage(entries);
  if (!coverage.valid) {
    const missing = coverage.missing.map(cellKey).join(", ");
    const duplicates = coverage.duplicateIds.join(", ");
    const invalid2 = coverage.invalidEntryIds.join(", ");
    const details = [
      missing.length > 0 ? `combina\xE7\xF5es ausentes: ${missing}` : "",
      duplicates.length > 0 ? `IDs duplicados: ${duplicates}` : "",
      invalid2.length > 0 ? `IDs inv\xE1lidos: ${invalid2}` : ""
    ].filter(Boolean).join("; ");
    throw new ContentSelectionError(`Cat\xE1logo incompleto: ${details}`);
  }
}

// src/options.ts
var TONE_LABELS = {
  grim: "Sombrio",
  whimsical: "Extravagante",
  heroic: "Heroico",
  mysterious: "Misterioso"
};
var ENVIRONMENT_LABELS = {
  wilderness: "Terras selvagens",
  forest: "Florestas",
  city: "Cidade",
  coast: "Litoral",
  ruins: "Ru\xEDnas",
  underground: "Subterr\xE2neo"
};
var COMPLEXITY_LABELS = {
  quick: "R\xE1pido",
  detailed: "Detalhado"
};
var RANDOM_LABEL = "Aleat\xF3rio";
var RANDOM_ANCESTRY_LABEL = "Aleat\xF3ria";
var TONES = TONE_IDS;
var ENVIRONMENTS = ENVIRONMENT_IDS;
var COMPLEXITIES = COMPLEXITY_IDS;
var DEFAULT_GENERATION_OPTIONS = Object.freeze({
  tone: "random",
  environment: "random",
  complexity: "random",
  ancestry: "random"
});
var toneSet = new Set(TONE_IDS);
var environmentSet = new Set(ENVIRONMENT_IDS);
var complexitySet = new Set(COMPLEXITY_IDS);
var peopleSet = new Set(PEOPLE.map((person) => person.id));
var generatorSet = new Set(GENERATOR_IDS);
function validSelection(value, values, fallback) {
  return value === "random" || typeof value === "string" && values.has(value) ? value : fallback;
}
function isNpc(generatorId) {
  return generatorId === "npc";
}
function normalizeGenerationOptions(input = {}, generatorId) {
  const value = typeof input === "object" && input !== null ? input : {};
  const ancestry = isNpc(generatorId) ? validSelection(value.ancestry, peopleSet, "random") : generatorId === void 0 ? validSelection(value.ancestry, peopleSet, "random") : null;
  return {
    tone: validSelection(value.tone, toneSet, "random"),
    environment: validSelection(value.environment, environmentSet, "random"),
    complexity: validSelection(value.complexity, complexitySet, "random"),
    ancestry
  };
}
function pick(selection, values, random) {
  return selection === "random" ? random.pick(values) : selection;
}
function resolveGenerationOptions(options = DEFAULT_GENERATION_OPTIONS, random = new Random(), generatorId) {
  const selected2 = normalizeGenerationOptions(options, generatorId);
  return {
    tone: pick(selected2.tone, TONE_IDS, random),
    environment: pick(selected2.environment, ENVIRONMENT_IDS, random),
    complexity: pick(selected2.complexity, COMPLEXITY_IDS, random),
    ancestry: selected2.ancestry === null ? null : pick(selected2.ancestry, PEOPLE.map((person) => person.id), random)
  };
}
function getToneLabel(value) {
  return value === "random" ? RANDOM_LABEL : TONE_LABELS[value];
}
function getEnvironmentLabel(value) {
  return value === "random" ? RANDOM_LABEL : ENVIRONMENT_LABELS[value];
}
function getComplexityLabel(value) {
  return value === "random" ? RANDOM_LABEL : COMPLEXITY_LABELS[value];
}
function getPeopleLabel(value) {
  const person = PEOPLE.find((candidate) => candidate.id === value);
  if (!person) throw new Error(`Unknown people profile: ${value}`);
  return person.label;
}

// src/catalogs/pt-BR/generated-content.ts
var VARIATION_BEATS = [
  { id: "testemunha", text: "Uma testemunha confi\xE1vel pode confirmar o pr\xF3ximo passo.", companion: false },
  { id: "vestigio", text: "Um vest\xEDgio recente contradiz a vers\xE3o mais conhecida.", companion: true },
  { id: "acordo", text: "Um acordo antigo ainda oferece uma sa\xEDda leg\xEDtima.", companion: false },
  { id: "prazo", text: "O prazo termina antes do pr\xF3ximo amanhecer.", companion: true },
  { id: "aliado", text: "Um aliado hesitante pede uma chance de reparar o dano.", companion: false },
  { id: "objeto", text: "Um objeto comum guarda a prova que faltava.", companion: true },
  { id: "rota", text: "Uma rota segura aparece quando algu\xE9m abandona o caminho habitual.", companion: false },
  { id: "promessa", text: "Uma promessa feita em p\xFAblico impede uma solu\xE7\xE3o f\xE1cil.", companion: true },
  { id: "sinal", text: "Um sinal repetido indica que a amea\xE7a mudou de lugar.", companion: false },
  { id: "preco", text: "Toda solu\xE7\xE3o cobra um pre\xE7o que deve ser aceito em voz alta.", companion: true },
  { id: "mensagem", text: "Uma mensagem incompleta revela quem ser\xE1 afetado primeiro.", companion: false },
  { id: "silencio", text: "O sil\xEAncio de uma pessoa importante vale mais que qualquer boato.", companion: true },
  { id: "marca", text: "Uma marca antiga cont\xE9m um sinal que n\xE3o existia ontem.", companion: false },
  { id: "disputa", text: "Duas vers\xF5es sinceras entram em conflito diante do grupo.", companion: true },
  { id: "refugio", text: "Um ref\xFAgio tempor\xE1rio permite observar o perigo sem enfrent\xE1-lo.", companion: false },
  { id: "heranca", text: "Uma heran\xE7a esquecida transforma o problema em uma responsabilidade pessoal.", companion: true },
  { id: "ritual", text: "Um ritual simples pode conter o problema, mas s\xF3 uma vez.", companion: false },
  { id: "devedor", text: "Uma pessoa devedora oferece ajuda em troca de uma decis\xE3o dif\xEDcil.", companion: true },
  { id: "memoria", text: "Uma mem\xF3ria compartilhada esclarece por que o conflito come\xE7ou.", companion: false },
  { id: "escolha", text: "A primeira escolha do grupo definir\xE1 quem poder\xE1 pedir ajuda depois.", companion: true }
];
var TONE = {
  grim: {
    frame: "uma amea\xE7a recente",
    theme: "Cicatrizes de uma perda recente",
    event: "uma amea\xE7a deixou perdas recentes",
    pressure: "A esperan\xE7a est\xE1 sendo cobrada em sil\xEAncio.",
    threat: "uma consequ\xEAncia dif\xEDcil de desfazer",
    motive: "evitar que outra pessoa pague o pre\xE7o",
    color: "s\xF3brio e marcado por luto"
  },
  whimsical: {
    frame: "um problema absurdo",
    theme: "O problema que se recusa a fazer sentido",
    event: "um problema absurdo confundiu a regi\xE3o",
    pressure: "A confus\xE3o cresce sempre que algu\xE9m tenta simplificar tudo.",
    threat: "uma surpresa inconveniente e barulhenta",
    motive: "transformar a trapalhada em um relato memor\xE1vel",
    color: "leve e cheio de pequenas manias"
  },
  heroic: {
    frame: "uma chance clara de prote\xE7\xE3o",
    theme: "Uma chance de proteger a regi\xE3o",
    event: "uma chance clara protegeu quem precisava",
    pressure: "A decis\xE3o do grupo pode inspirar a regi\xE3o inteira.",
    threat: "um obst\xE1culo que exige coragem e coopera\xE7\xE3o",
    motive: "dar a outras pessoas uma oportunidade de seguir em frente",
    color: "firme e orientado por coragem"
  },
  mysterious: {
    frame: "um enigma antigo",
    theme: "O padr\xE3o escondido por tr\xE1s dos sinais",
    event: "um enigma revelou apenas parte de sua inten\xE7\xE3o",
    pressure: "Cada resposta abre uma pergunta ainda mais antiga.",
    threat: "uma presen\xE7a que prefere sinais a explica\xE7\xF5es",
    motive: "entender o padr\xE3o antes que ele se complete",
    color: "silencioso e dif\xEDcil de interpretar"
  }
};
var ENVIRONMENT = {
  wilderness: {
    name: "Marco do Horizonte Aberto",
    setting: "nas plan\xEDcies abertas, entre montanhas, p\xE2ntanos e terras \xE1ridas",
    texture: "O vento forte cruza um horizonte sem abrigo e espalha marcas pelo ch\xE3o.",
    inhabitants: "Viajantes, pastores e comunidades conhecem os caminhos sazonais.",
    regionNoun: "as terras abertas",
    threat: "O clima severo dificulta o avan\xE7o, enquanto algo acompanha o grupo \xE0 dist\xE2ncia."
  },
  forest: {
    name: "Clareira das Folhas Baixas",
    setting: "na mata fechada, onde copas antigas escondem o c\xE9u",
    texture: "Ra\xEDzes \xFAmidas, folhas sobre folhas e trilhas m\xF3veis cercam a passagem.",
    inhabitants: "Guardi\xF5es da mata, coletores e animais atentos ocupam a regi\xE3o.",
    regionNoun: "a floresta",
    threat: "A floresta fecha a passagem, e uma presen\xE7a se move entre as \xE1rvores."
  },
  city: {
    name: "Beco das Sete Janelas",
    setting: "em ruas cheias, p\xE1tios de com\xE9rcio e becos sob muitas janelas",
    texture: "Sinos, preg\xF5es, portas trancadas e mensagens trocadas depressa dominam o lugar.",
    inhabitants: "Comerciantes, autoridades, trabalhadores e vizinhos disputam os acessos.",
    regionNoun: "a cidade",
    threat: "Um rumor mobiliza a multid\xE3o, enquanto algu\xE9m controla as entradas e sa\xEDdas."
  },
  coast: {
    name: "Cais da Mar\xE9 Tardia",
    setting: "no litoral, entre fal\xE9sias, areia salgada e \xE1gua que muda com a mar\xE9",
    texture: "Maresia, cordas molhadas, gaivotas e ondas imprevis\xEDveis cercam o cais.",
    inhabitants: "Pescadores, navegantes e comunidades de enseada acompanham a mar\xE9.",
    regionNoun: "o litoral",
    threat: "A mar\xE9 sobe depressa, e algo chega pelo caminho da \xE1gua."
  },
  ruins: {
    name: "P\xE1tio da Pedra Rachada",
    setting: "em ru\xEDnas de pedra, com sal\xF5es quebrados e s\xEDmbolos cobertos de poeira",
    texture: "Arcos rachados, fuligem antiga, pedras deslocadas e ecos sem origem marcam o local.",
    inhabitants: "Saqueadores, estudiosos, fam\xEDlias e vigias ocupam os restos da constru\xE7\xE3o.",
    regionNoun: "as ru\xEDnas",
    threat: "A estrutura cede aos poucos, enquanto uma promessa esquecida desperta sob os escombros."
  },
  underground: {
    name: "C\xE2mara do Eco Baixo",
    setting: "no subterr\xE2neo, entre t\xFAneis estreitos, cisternas e c\xE2maras sem sol",
    texture: "Umidade, fungos luminosos, correntes de ar e vozes nas paredes tornam o caminho incerto.",
    inhabitants: "Mineiros e comunidades profundas vivem longe da luz do c\xE9u.",
    regionNoun: "os t\xFAneis subterr\xE2neos",
    threat: "A falta de sa\xEDda aperta o grupo, e algo conhece cada passagem melhor que ele."
  }
};
function matrix(prefix2, make) {
  const entries = [];
  for (const tone of TONE_IDS) {
    for (const environment of ENVIRONMENT_IDS) {
      for (const complexity of COMPLEXITY_IDS) {
        const cell = { tone, environment, complexity };
        const content = make(cell);
        entries.push({ id: `${prefix2}-${tone}-${environment}-${complexity}-normal`, tone, environment, complexity, content });
        entries.push({
          id: `${prefix2}-${tone}-${environment}-${complexity}-fallback`,
          tone,
          environment,
          complexity,
          fallback: true,
          content
        });
      }
    }
  }
  return entries;
}
function context(cell) {
  return { tone: TONE[cell.tone], environment: ENVIRONMENT[cell.environment] };
}
var NPC_CONTENT = matrix("npc", (cell) => {
  const { tone, environment } = context(cell);
  return {
    role: `guia que conhece ${environment.regionNoun}`,
    trait: `tem um jeito ${tone.color}. Observa quem precisa de ajuda`,
    appearance: `Carrega sinais de viagem. ${environment.texture}`,
    personality: `ouve antes de falar e trata cada encontro como parte de ${tone.frame}`,
    motivation: `${tone.motive}, mesmo quando isso exige voltar \xE0 regi\xE3o`,
    complication: `${tone.pressure} Seu trabalho depende de uma escolha que n\xE3o pode adiar.`,
    secret: `Sabe que ${tone.threat} j\xE1 deixou marcas ${environment.setting}.`,
    relationship: `Mant\xE9m um acordo fr\xE1gil com quem vive na regi\xE3o. ${environment.inhabitants}`,
    immediateHook: `Oferece uma pista sobre o perigo local em troca de ajuda imediata e pede uma decis\xE3o antes de seguir.`,
    companion: `um companheiro acostumado a viajar ${environment.setting}`
  };
});
var LOCATION_CONTENT = matrix("location", (cell) => {
  const { tone, environment } = context(cell);
  return {
    name: environment.name,
    type: `um ponto de passagem com aspecto ${tone.color}`,
    atmosphere: `${tone.event[0].toLocaleUpperCase("pt-BR")}${tone.event.slice(1)}. ${environment.texture}`,
    feature: `Um marco local registra mudan\xE7as na regi\xE3o e guarda sinais de que ${tone.threat} se aproxima.`,
    hook: `Algu\xE9m procura ajuda para entender o perigo antes que ele alcance os moradores.`,
    inhabitants: environment.inhabitants,
    history: `O lugar foi criado porque ${tone.event}.`,
    tension: `${tone.pressure} Os habitantes discordam sobre partir ou permanecer.`,
    danger: environment.threat,
    secret: `O marco esconde uma mensagem ligada a ${tone.motive}.`,
    opportunities: `H\xE1 uma rota segura, uma testemunha e um recurso \xFAtil para quem observar o local.`
  };
});
var QUEST_CONTENT = matrix("quest", (cell) => {
  const { tone, environment } = context(cell);
  return {
    giver: `uma lideran\xE7a da comunidade que vive na regi\xE3o`,
    objective: `levar uma prova at\xE9 ${environment.name} antes que o perigo alcance outras pessoas`,
    location: environment.name,
    complication: `A situa\xE7\xE3o ligada a ${tone.frame} interfere no acordo antes que a entrega aconte\xE7a.`,
    reward: `a confian\xE7a da comunidade e acesso a uma rota escondida`,
    context: `A miss\xE3o nasceu porque ${tone.pressure.toLocaleLowerCase("pt-BR")} O pedido parece simples, mas toca o futuro de quem vive ${environment.setting}.`,
    stages: `Primeiro, encontrar a pista. Depois, atravessar o lugar com cuidado. Por fim, decidir o que revelar \xE0 comunidade.`,
    opposition: `${environment.threat} Uma pessoa interessada oferece uma solu\xE7\xE3o conveniente.`,
    escalation: `Cada atraso aproxima ${tone.threat} e fecha uma passagem importante.`,
    failure: `A comunidade perde uma prote\xE7\xE3o, e o mesmo perigo alcan\xE7a novos viajantes.`,
    alternative: `Negociar com a oposi\xE7\xE3o e agir para ${tone.motive}, sem concluir o percurso habitual.`
  };
});
var ENCOUNTER_CONTENT = matrix("encounter", (cell) => {
  const { tone, environment } = context(cell);
  return {
    title: environment.name,
    situation: `Um grupo interrompe a passagem ${environment.setting}. Seus integrantes fazem um pedido urgente.`,
    immediateThreat: `${environment.threat} O espa\xE7o seguro diminui a cada momento.`,
    twist: `A cena nasceu depois que ${tone.event}. A pessoa que parece precisar de ajuda conhece uma sa\xEDda.`,
    choice: `Negociar, investigar ou agir agora significa aceitar uma perda diferente.`,
    setup: `O encontro come\xE7a quando o ambiente muda de repente. ${environment.texture}`,
    actors: `${environment.inhabitants} Tamb\xE9m participa algu\xE9m ligado a ${tone.threat}.`,
    escalation: `Se ningu\xE9m decidir, ${tone.pressure.toLocaleLowerCase("pt-BR")} A amea\xE7a muda de dire\xE7\xE3o.`,
    interaction: `O grupo pode usar o ambiente de modo criativo para abrir uma rota, ganhar tempo ou expor uma mentira.`,
    outcomes: `Uma solu\xE7\xE3o cuidadosa preserva a passagem. Uma decis\xE3o r\xE1pida resolve o impasse, mas deixa uma d\xEDvida.`,
    aftermath: `Depois, os sinais do conflito local permanecem ${environment.setting}. Eles apontam para uma consequ\xEAncia futura ligada a ${tone.frame}.`
  };
});
var RUMOR_CONTENT = matrix("rumor", (cell) => {
  const { tone, environment } = context(cell);
  return {
    subject: `A passagem conhecida como ${environment.name}`,
    claim: `esconde um sinal de que ${tone.threat} est\xE1 se aproximando`,
    truth: `O sinal existe, mas a causa est\xE1 ligada ao fato de que ${tone.event}; a regi\xE3o ainda pode escolher como reagir.`,
    source: `Uma pessoa que vive na regi\xE3o ouviu a hist\xF3ria antes da \xFAltima mudan\xE7a.`,
    variations: `Algumas vers\xF5es citam o ambiente, enquanto outras culpam uma testemunha.`,
    clues: `Marcas no local e uma frase repetida por quem conhece ${environment.name}.`,
    interestedParties: `A comunidade quer confirmar a hist\xF3ria, mas algu\xE9m que quer ${tone.motive} tenta abaf\xE1-la.`,
    investigationConsequence: `Investigar revela a verdade, mas torna vis\xEDvel ${tone.threat} para toda a regi\xE3o.`,
    context: `A hist\xF3ria cresceu porque ${tone.frame} chamou aten\xE7\xE3o para este lugar, e ningu\xE9m sabe quem come\xE7ou a repeti-la.`
  };
});
var DUNGEON_CONTENT = matrix("dungeon", (cell) => {
  const { tone, environment } = context(cell);
  const theme = `${tone.theme} ${environment.setting}`;
  const overview = `Cinco espa\xE7os mostram o que ser\xE1 preciso para ${tone.motive}. ${environment.texture}`;
  const rooms = [
    `O acesso fica ${environment.setting}; a passagem pede uma decis\xE3o ligada a ${tone.frame}. Sinais no ch\xE3o mostram que algu\xE9m esperava visitantes.`,
    `Um vest\xEDgio da comunidade local exige interpretar sinais antes de avan\xE7ar. A resposta revela o custo de subestimar a situa\xE7\xE3o. A pressa pode fechar a \xFAnica sa\xEDda.`,
    `O perigo local separa o grupo e muda o caminho de volta. Observar o ambiente permite encontrar uma passagem estreita. Cada pessoa precisa escolher onde pisar.`,
    `Algo ligado a ${tone.threat} oferece uma troca antes de impedir a passagem. Sua proposta revela um risco imediato. O grupo ainda pode negociar antes de lutar.`,
    `Um recurso \xFAtil oferece meios para ${tone.motive} e deixa uma escolha para depois. O pr\xEAmio tamb\xE9m chama aten\xE7\xE3o. A descoberta muda o sentido da jornada.`
  ];
  const detailedRooms = [
    `O acesso fica ${environment.setting}. A passagem pede uma decis\xE3o ligada a ${tone.frame}; escolher com cuidado abre uma marca antiga e deixa claro que algu\xE9m esperava visitantes. A porta se fecha devagar, separando a rota conhecida daquilo que vem depois. A sa\xEDda continua incerta para todos. Marcas junto ao batente registram escolhas anteriores. Compar\xE1-las revela qual caminho foi usado por \xFAltimo.`,
    `Um vest\xEDgio da comunidade local exige interpretar sinais antes de avan\xE7ar. As pistas misturam mem\xF3ria e necessidade, e a press\xE3o criada por ${tone.frame} alcan\xE7ou este lugar. Um detalhe esquecido oferece uma sa\xEDda, mas cobra tempo e aten\xE7\xE3o. Ningu\xE9m pode seguir sem assumir essa consequ\xEAncia. Uma resposta incompleta abre uma rota mais perigosa. A solu\xE7\xE3o correta preserva um recurso para o retorno.`,
    `O perigo local separa o grupo e muda o caminho de volta. O desvio passa por uma \xE1rea inst\xE1vel, onde observar o ambiente permite recuperar um objeto e evitar uma perda maior. Cada pessoa precisa decidir que pista levar\xE1 consigo. O sil\xEAncio tamb\xE9m pode ser uma escolha. Um ru\xEDdo distante permite reencontrar o grupo. Segui-lo depressa demais, por\xE9m, exp\xF5e a posi\xE7\xE3o de todos.`,
    `Algo ligado a ${tone.threat} oferece uma troca antes de impedir a passagem. Essa presen\xE7a conhece a regi\xE3o e apresenta uma verdade incompleta. Aceitar, recusar ou propor outra sa\xEDda muda o pr\xF3ximo passo. A escolha tamb\xE9m define quem poder\xE1 atravessar em seguran\xE7a. Nenhuma promessa ficar\xE1 intacta depois disso. Uma testemunha escondida conhece o ponto fraco da proposta. Convenc\xEA-la a falar exige oferecer prote\xE7\xE3o real.`,
    `Um recurso \xFAtil oferece meios para ${tone.motive} e deixa uma escolha para depois. O pr\xEAmio ajuda agora, mas sua origem liga o grupo \xE0 comunidade local e a uma disputa que continua fora destas salas. Levar tudo exige abandonar uma vantagem imediata. O caminho de volta passa a ter outro significado. Uma inscri\xE7\xE3o identifica quem reivindicar\xE1 o objeto. Deix\xE1-la intacta preserva uma poss\xEDvel negocia\xE7\xE3o futura.`
  ];
  return { theme, overview, rooms, detailedRooms };
});
for (const entries of [NPC_CONTENT, LOCATION_CONTENT, QUEST_CONTENT, ENCOUNTER_CONTENT, RUMOR_CONTENT, DUNGEON_CONTENT]) {
  assertCatalogCoverage(entries);
}
var CONTENT_CATALOGS = {
  npc: NPC_CONTENT,
  location: LOCATION_CONTENT,
  quest: QUEST_CONTENT,
  encounter: ENCOUNTER_CONTENT,
  rumor: RUMOR_CONTENT,
  dungeon: DUNGEON_CONTENT
};

// src/structured-output.ts
function prefix(field) {
  return field.number === void 0 ? "" : `${field.number}. `;
}
function renderPlainFields(fields) {
  return fields.map((field) => `${prefix(field)}${field.label}: ${field.value}`).join("\n");
}
function renderMarkdownFields(fields) {
  return fields.map((field) => `${prefix(field)}**${field.label}:** ${field.value}`).join("\n");
}
function renderFields(fields) {
  return {
    plainText: renderPlainFields(fields),
    markdown: renderMarkdownFields(fields)
  };
}

// src/generators.ts
var LABELS = {
  npc: "NPCs",
  location: "Locais",
  quest: "Miss\xF5es",
  encounter: "Encontros",
  rumor: "Rumores",
  dungeon: "Masmorra"
};
function finish(id, title, fields, metadata) {
  const content = renderFields(fields);
  return { id, label: LABELS[id], title, content, options: metadata };
}
function begin(id, random, options) {
  const selected2 = normalizeGenerationOptions(options, id);
  const resolved = resolveGenerationOptions(selected2, random, id);
  return { selected: selected2, resolved };
}
function selected(entries, resolved, random) {
  return selectCompatibleContent(entries, resolved, random).content;
}
function variation(random) {
  return random.pick(VARIATION_BEATS);
}
function generateNpc(random, options = DEFAULT_GENERATION_OPTIONS) {
  const metadata = begin("npc", random, options);
  const profile = selected(CONTENT_CATALOGS.npc, metadata.resolved, random);
  const beat = variation(random);
  const ancestry = metadata.resolved.ancestry;
  if (ancestry === null) throw new Error("NPC exige uma ancestralidade resolvida");
  const people = getPeopleProfile(ancestry);
  const name = generateName(people.id, random, metadata.resolved.tone);
  const fields = [
    { label: "Nome", value: name },
    { label: "Ancestralidade", value: people.label },
    { label: "Papel", value: profile.role },
    { label: "Tra\xE7o definidor", value: profile.trait }
  ];
  if (metadata.resolved.complexity === "detailed") {
    fields.push(
      { label: "Apar\xEAncia", value: profile.appearance },
      { label: "Personalidade", value: profile.personality },
      { label: "Motiva\xE7\xE3o", value: profile.motivation },
      { label: "Complica\xE7\xE3o", value: profile.complication },
      { label: "Segredo", value: profile.secret },
      { label: "Rela\xE7\xE3o", value: profile.relationship }
    );
    if (beat.companion) fields.push({ label: "Companheiro compat\xEDvel", value: profile.companion });
  }
  fields.push({ label: "Gancho imediato", value: `${profile.immediateHook} ${beat.text}` });
  return finish("npc", `NPC - ${name}`, fields, metadata);
}
function locationFields(profile, beat, detailed) {
  const fields = [
    { label: "Nome", value: profile.name },
    { label: "Tipo", value: profile.type },
    { label: "Atmosfera", value: profile.atmosphere },
    { label: "Caracter\xEDstica", value: profile.feature },
    { label: "Gancho", value: `${profile.hook} ${beat.text}` }
  ];
  if (detailed) fields.push(
    { label: "Habitantes", value: profile.inhabitants },
    { label: "Hist\xF3ria", value: profile.history },
    { label: "Tens\xE3o atual", value: profile.tension },
    { label: "Perigo", value: profile.danger },
    { label: "Segredo", value: profile.secret },
    { label: "Oportunidades", value: profile.opportunities }
  );
  return fields;
}
function generateLocation(random, options = DEFAULT_GENERATION_OPTIONS) {
  const metadata = begin("location", random, options);
  const profile = selected(CONTENT_CATALOGS.location, metadata.resolved, random);
  const beat = variation(random);
  return finish("location", `Local - ${profile.name}`, locationFields(profile, beat, metadata.resolved.complexity === "detailed"), metadata);
}
function questFields(profile, beat, detailed) {
  const fields = [
    { label: "Contratante", value: profile.giver },
    { label: "Objetivo", value: profile.objective },
    { label: "Local", value: profile.location },
    { label: "Complica\xE7\xE3o", value: `${profile.complication} ${beat.text}` },
    { label: "Recompensa", value: profile.reward }
  ];
  if (detailed) fields.push(
    { label: "Contexto", value: profile.context },
    { label: "Etapas", value: profile.stages },
    { label: "Oposi\xE7\xE3o", value: profile.opposition },
    { label: "Escalada", value: profile.escalation },
    { label: "Consequ\xEAncia do fracasso", value: profile.failure },
    { label: "Resolu\xE7\xE3o alternativa", value: profile.alternative }
  );
  return fields;
}
function generateQuest(random, options = DEFAULT_GENERATION_OPTIONS) {
  const metadata = begin("quest", random, options);
  const profile = selected(CONTENT_CATALOGS.quest, metadata.resolved, random);
  const beat = variation(random);
  return finish("quest", `Miss\xE3o - ${sentenceCase(profile.objective)}`, questFields(profile, beat, metadata.resolved.complexity === "detailed"), metadata);
}
function encounterFields(profile, beat, detailed) {
  const fields = [
    { label: "Situa\xE7\xE3o", value: profile.situation },
    { label: "Amea\xE7a imediata", value: profile.immediateThreat },
    { label: "Reviravolta", value: `${profile.twist} ${beat.text}` },
    { label: "Escolha significativa", value: profile.choice }
  ];
  if (detailed) fields.push(
    { label: "Prepara\xE7\xE3o", value: profile.setup },
    { label: "Atores", value: profile.actors },
    { label: "Escalada", value: profile.escalation },
    { label: "Intera\xE7\xE3o com o ambiente", value: profile.interaction },
    { label: "Desfechos prov\xE1veis", value: profile.outcomes },
    { label: "Depois", value: profile.aftermath }
  );
  return fields;
}
function generateEncounter(random, options = DEFAULT_GENERATION_OPTIONS) {
  const metadata = begin("encounter", random, options);
  const profile = selected(CONTENT_CATALOGS.encounter, metadata.resolved, random);
  const beat = variation(random);
  return finish("encounter", `Encontro - ${profile.title}`, encounterFields(profile, beat, metadata.resolved.complexity === "detailed"), metadata);
}
function rumorFields(profile, beat, detailed) {
  const fields = [
    { label: "Boato", value: `${profile.subject} ${profile.claim}.` },
    { label: "Verdade para o mestre", value: profile.truth },
    { label: "Desdobramento", value: beat.text }
  ];
  if (detailed) fields.push(
    { label: "Fonte", value: profile.source },
    { label: "Varia\xE7\xF5es", value: profile.variations },
    { label: "Pistas", value: profile.clues },
    { label: "Interessados", value: profile.interestedParties },
    { label: "Consequ\xEAncia da investiga\xE7\xE3o", value: profile.investigationConsequence },
    { label: "Contexto", value: profile.context }
  );
  return fields;
}
function generateRumor(random, options = DEFAULT_GENERATION_OPTIONS) {
  const metadata = begin("rumor", random, options);
  const profile = selected(CONTENT_CATALOGS.rumor, metadata.resolved, random);
  const beat = variation(random);
  return finish("rumor", `Rumor - ${profile.subject}`, rumorFields(profile, beat, metadata.resolved.complexity === "detailed"), metadata);
}
function sentenceCase(value) {
  return value.length === 0 ? value : value[0].toLocaleUpperCase("pt-BR") + value.slice(1);
}
function dungeonFields(profile, beat, detailed) {
  const rooms = detailed ? profile.detailedRooms : profile.rooms;
  const fields = [
    { label: "Tema", value: profile.theme },
    { label: "Vis\xE3o geral", value: `${profile.overview} ${beat.text}` }
  ];
  const roles = ["Entrada", "Desafio", "Contratempo", "Confronto", "Recompensa"];
  rooms.forEach((room, index) => {
    const role = roles[index];
    if (!role) throw new Error("Masmorra exige cinco pap\xE9is de sala");
    fields.push({ label: role, value: room, number: index + 1 });
  });
  return fields;
}
function generateDungeon(random, options = DEFAULT_GENERATION_OPTIONS) {
  const metadata = begin("dungeon", random, options);
  const profile = selected(CONTENT_CATALOGS.dungeon, metadata.resolved, random);
  const beat = variation(random);
  return finish("dungeon", `Masmorra - ${profile.theme}`, dungeonFields(profile, beat, metadata.resolved.complexity === "detailed"), metadata);
}
var GENERATORS = [
  { id: "npc", label: LABELS.npc, icon: "user-round", generate: generateNpc },
  { id: "location", label: LABELS.location, icon: "map", generate: generateLocation },
  { id: "quest", label: LABELS.quest, icon: "file-text", generate: generateQuest },
  { id: "encounter", label: LABELS.encounter, icon: "target", generate: generateEncounter },
  { id: "rumor", label: LABELS.rumor, icon: "message-circle", generate: generateRumor },
  { id: "dungeon", label: LABELS.dungeon, icon: "box", generate: generateDungeon }
];
var generatorMap = new Map(GENERATORS.map((definition) => [definition.id, definition]));
function getGenerator(id) {
  const definition = generatorMap.get(id);
  if (!definition) throw new Error(`Unknown generator: ${id}`);
  return definition;
}
function generate(id, random = new Random(), options = DEFAULT_GENERATION_OPTIONS) {
  return getGenerator(id).generate(random, options);
}

// src/formatters.ts
function normalizeTitle(title) {
  return title.replace(/\s+/g, " ").trim();
}
function normalizeBody(body) {
  const normalized = body.replace(/\r\n?/g, "\n");
  return normalized.replace(/^(?:[ \t]*\n)+/, "").replace(/(?:\n[ \t]*)+$/, "");
}
function safeMetadataValue(value) {
  return value.replace(/[\r\n\u0000-\u001f\u007f]/g, " ").replace(/[\\|]/g, "\\$&");
}
function metadataLines(metadata) {
  const selected2 = metadata.selected;
  const resolved = metadata.resolved;
  const suffix = (selection) => selection === "random" ? " (aleat\xF3rio)" : "";
  const lines = [
    ["Tom", `${getToneLabel(resolved.tone)}${suffix(selected2.tone)}`],
    ["Ambiente", `${getEnvironmentLabel(resolved.environment)}${suffix(selected2.environment)}`],
    ["Complexidade", `${getComplexityLabel(resolved.complexity)}${suffix(selected2.complexity)}`]
  ];
  if (resolved.ancestry !== null) {
    lines.push([
      "Ancestralidade",
      `${getPeopleLabel(resolved.ancestry)}${selected2.ancestry === "random" ? " (aleat\xF3rio)" : ""}`
    ]);
  }
  return lines.map(([label, value]) => [safeMetadataValue(label), safeMetadataValue(value)]);
}
function formatWithHeading(level, title, body, metadata) {
  const normalizedTitle = normalizeTitle(title);
  const normalizedBody = normalizeBody(body);
  const heading = `${"#".repeat(level)} ${normalizedTitle}`;
  const parameters = metadata ? `> [!info] Par\xE2metros
${metadataLines(metadata).map(([label, value]) => `> ${label}: ${value}`).join("\n")}` : "";
  const parts = [heading, parameters, normalizedBody].filter((part) => part.length > 0);
  return parts.join("\n\n");
}
function toMarkdown(result, headingLevel) {
  return formatWithHeading(
    headingLevel,
    result.title,
    result.content.markdown,
    result.options
  );
}
function toPlainText(result) {
  const metadata = result.options;
  const parameters = metadata ? ["Par\xE2metros", ...metadataLines(metadata).map(([label, value]) => `${label}: ${value}`)].join("\n") : "";
  const normalizedBody = normalizeBody(result.content.plainText);
  const sections = [normalizeTitle(result.title), parameters, normalizedBody].filter(
    (section) => section.length > 0
  );
  return sections.join("\n\n");
}

// src/output.ts
var OutputFolderValidationError = class extends Error {
  constructor(validation) {
    super(validation.reason);
    this.name = "OutputFolderValidationError";
    this.code = validation.code;
  }
};
var OutputFolderConflictError = class extends Error {
  constructor(path) {
    super(`A pasta de sa\xEDda n\xE3o pode ser criada porque existe um arquivo em '${path}'.`);
    this.name = "OutputFolderConflictError";
    this.path = path;
  }
};
var FALLBACK_MARKDOWN_TITLE = "Sem t\xEDtulo";
var INVALID_FILENAME_CHARACTERS = /[\\/:*?"<>|\u0000-\u001f\u007f]/g;
function entryKind(entry) {
  if ("type" in entry) return entry.type;
  return entry.kind;
}
function joinVaultPath(folder, name) {
  return folder.length > 0 ? `${folder}/${name}` : name;
}
function assertValidOutputFolder(outputFolder) {
  const validation = validateOutputFolder(outputFolder);
  if (!validation.valid) throw new OutputFolderValidationError(validation);
  return validation.value;
}
function sanitizeMarkdownTitle(title) {
  const sanitized = title.replace(INVALID_FILENAME_CHARACTERS, "-").replace(/\s+/g, " ").trim().replace(/[. ]+$/g, "").replace(/^-+|-+$/g, "").trim();
  if (sanitized.length === 0 || sanitized === "." || sanitized === "..") {
    return FALLBACK_MARKDOWN_TITLE;
  }
  return sanitized;
}
async function ensureOutputFolder(vault, outputFolder) {
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
    await vault.createFolder(currentPath);
  }
  return normalizedFolder;
}
async function findAvailableMarkdownPath(vault, outputFolder, title) {
  const normalizedFolder = assertValidOutputFolder(outputFolder);
  const stem = sanitizeMarkdownTitle(title);
  for (let suffix = 1; ; suffix += 1) {
    const filename = suffix === 1 ? `${stem}.md` : `${stem} - ${suffix}.md`;
    const path = joinVaultPath(normalizedFolder, filename);
    if (vault.getEntry(path) == null) return { path, filename };
  }
}
async function createMarkdownOutput(vault, options) {
  const outputFolder = await ensureOutputFolder(vault, options.outputFolder);
  const available = await findAvailableMarkdownPath(vault, outputFolder, options.title);
  await vault.createFile(available.path, options.content);
  return available;
}
var OutputService = class {
  constructor(vault) {
    this.vault = vault;
  }
  ensureOutputFolder(outputFolder) {
    return ensureOutputFolder(this.vault, outputFolder);
  }
  findAvailableMarkdownPath(outputFolder, title) {
    return findAvailableMarkdownPath(this.vault, outputFolder, title);
  }
  createMarkdown(optionsOrTitle, content, outputFolder = "") {
    const options = typeof optionsOrTitle === "string" ? { title: optionsOrTitle, content: content != null ? content : "", outputFolder } : optionsOrTitle;
    return createMarkdownOutput(this.vault, options);
  }
};

// src/insertion-boundary.ts
function calculateInsertionBoundaries(before, after) {
  return {
    prefix: boundaryBefore(before),
    suffix: boundaryAfter(after)
  };
}
function insertionText(before, after, markdown) {
  const { prefix: prefix2, suffix } = calculateInsertionBoundaries(before, after);
  return `${prefix2}${markdown}${suffix}`;
}
function boundaryBefore(text) {
  if (text.length === 0 || text.endsWith("\n\n")) return "";
  return text.endsWith("\n") ? "\n" : "\n\n";
}
function boundaryAfter(text) {
  if (text.length === 0 || text.startsWith("\n\n")) return "";
  return text.startsWith("\n") ? "\n" : "\n\n";
}

// src/view.ts
var VIEW_TYPE_RPG_GENERATOR = "rpg-random-generator-view";
var GeneratorView = class extends import_obsidian2.ItemView {
  constructor(leaf, dependencies) {
    super(leaf);
    this.dependencies = dependencies;
    this.selectedId = "npc";
    this.generationOptions = { ...DEFAULT_GENERATION_OPTIONS };
    this.currentResult = null;
    this.resultKey = 0;
    this.renderVersion = 0;
    this.primaryButton = null;
    this.resultHeader = null;
    this.resultText = null;
    this.liveStatus = null;
    this.copyTextButton = null;
    this.copyMarkdownButton = null;
    this.insertButton = null;
    this.createButton = null;
    this.insertDestination = null;
    this.insertHelp = null;
    this.categoryButtons = /* @__PURE__ */ new Map();
    this.optionSelects = null;
    this.renderComponent = null;
    this.creatingNote = false;
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", () => this.updateInsertionTarget())
    );
    this.registerEvent(
      this.app.workspace.on("layout-change", () => this.updateInsertionTarget())
    );
  }
  getViewType() {
    return VIEW_TYPE_RPG_GENERATOR;
  }
  getDisplayText() {
    return "Gerador de RPG";
  }
  getIcon() {
    return "dice-5";
  }
  async onOpen() {
    this.resetEphemeralState();
    this.renderView();
  }
  async onClose() {
    this.renderVersion += 1;
    this.removeRenderComponent();
    this.contentEl.empty();
  }
  getState() {
    return {};
  }
  async setState(_state, result) {
    await super.setState(_state, result);
    this.resetEphemeralState();
    this.renderView();
  }
  resetEphemeralState() {
    this.selectedId = "npc";
    this.generationOptions = { ...DEFAULT_GENERATION_OPTIONS };
    this.currentResult = null;
    this.resultKey += 1;
    this.renderVersion += 1;
  }
  renderView() {
    var _a;
    this.contentEl.empty();
    this.contentEl.addClass("rpg-generator-view");
    this.categoryButtons.clear();
    this.optionSelects = null;
    const question = this.contentEl.createEl("p", {
      cls: "rpg-generator-question",
      text: "O que voc\xEA quer gerar?"
    });
    question.setAttr("id", "rpg-generator-question");
    const categories = this.contentEl.createDiv({ cls: "rpg-generator-categories" });
    categories.setAttr("role", "radiogroup");
    categories.setAttr("aria-labelledby", "rpg-generator-question");
    for (const definition of GENERATORS) {
      const selected2 = definition.id === this.selectedId;
      const button = categories.createEl("button", {
        cls: ["rpg-generator-category", ...selected2 ? ["is-selected"] : []],
        attr: {
          type: "button",
          role: "radio",
          "aria-checked": String(selected2),
          tabindex: selected2 ? "0" : "-1",
          "aria-label": definition.id === "dungeon" ? "Masmorra de cinco salas" : definition.label
        }
      });
      button.createSpan({ cls: "rpg-generator-category-label", text: definition.label });
      button.addEventListener("click", () => this.selectCategory(definition.id));
      button.addEventListener(
        "keydown",
        (event) => this.handleCategoryKeydown(event, definition.id)
      );
      this.categoryButtons.set(definition.id, button);
    }
    const optionsPanel = this.contentEl.createEl("fieldset", {
      cls: "rpg-generator-options"
    });
    optionsPanel.createEl("legend", {
      cls: "rpg-generator-options-heading",
      text: "Op\xE7\xF5es"
    });
    const optionGrid = optionsPanel.createDiv({ cls: "rpg-generator-options-grid" });
    const tone = this.createOptionSelect(
      optionGrid,
      "rpg-generator-tone",
      "Tom",
      [{ value: "random", label: RANDOM_LABEL }, ...TONES.map((id) => ({ value: id, label: TONE_LABELS[id] }))],
      this.generationOptions.tone,
      (value) => this.updateGenerationOption("tone", value)
    );
    const environment = this.createOptionSelect(
      optionGrid,
      "rpg-generator-environment",
      "Ambiente",
      [{ value: "random", label: RANDOM_LABEL }, ...ENVIRONMENTS.map((id) => ({ value: id, label: ENVIRONMENT_LABELS[id] }))],
      this.generationOptions.environment,
      (value) => this.updateGenerationOption("environment", value)
    );
    const complexity = this.createOptionSelect(
      optionGrid,
      "rpg-generator-complexity",
      "Complexidade",
      [{ value: "random", label: RANDOM_LABEL }, ...COMPLEXITIES.map((id) => ({ value: id, label: COMPLEXITY_LABELS[id] }))],
      this.generationOptions.complexity,
      (value) => this.updateGenerationOption("complexity", value)
    );
    const ancestryField = this.createOptionField(optionGrid, "rpg-generator-ancestry", "Ancestralidade");
    const ancestry = ancestryField.createEl("select", {
      cls: "rpg-generator-option-select",
      attr: { id: "rpg-generator-ancestry" }
    });
    ancestry.addEventListener(
      "change",
      () => this.updateGenerationOption("ancestry", ancestry.value)
    );
    this.addSelectOptions(ancestry, [
      { value: "random", label: RANDOM_ANCESTRY_LABEL },
      ...PEOPLE.map((person) => ({ value: person.id, label: person.label }))
    ], (_a = this.generationOptions.ancestry) != null ? _a : "random");
    ancestryField.hidden = this.selectedId !== "npc";
    this.optionSelects = { tone, environment, complexity, ancestry, ancestryField };
    this.primaryButton = this.contentEl.createEl("button", {
      cls: ["mod-cta", "rpg-generator-primary"],
      attr: { type: "button" }
    });
    this.primaryButton.addEventListener("click", () => this.generateResult());
    const resultSection = this.contentEl.createDiv({ cls: "rpg-generator-result-section" });
    this.resultHeader = resultSection.createEl("h2", {
      cls: "rpg-generator-result-heading",
      text: "Resultado"
    });
    this.resultText = resultSection.createDiv({ cls: "rpg-generator-result-text" });
    this.resultText.setAttr("tabindex", "0");
    this.resultText.setAttr("aria-label", "Nenhum resultado gerado");
    this.liveStatus = resultSection.createEl("p", {
      cls: "rpg-generator-live-status",
      attr: { "aria-live": "polite" }
    });
    const actions = resultSection.createDiv({ cls: "rpg-generator-actions" });
    this.copyTextButton = this.createActionButton(actions, "Copiar texto");
    this.copyTextButton.addEventListener("click", () => void this.copyResult("text"));
    this.copyMarkdownButton = this.createActionButton(actions, "Copiar Markdown");
    this.copyMarkdownButton.addEventListener("click", () => void this.copyResult("markdown"));
    const insertAction = actions.createDiv({ cls: "rpg-generator-insert-action" });
    this.insertButton = this.createActionButton(insertAction, "Inserir na nota");
    this.insertButton.addEventListener("click", () => this.insertResult());
    this.insertDestination = insertAction.createSpan({ cls: "rpg-generator-insert-destination" });
    this.createButton = this.createActionButton(actions, "Criar nota");
    this.createButton.addEventListener("click", () => void this.createNote());
    this.insertHelp = resultSection.createEl("p", {
      cls: "rpg-generator-insert-help",
      text: "Abra uma nota Markdown em modo de edi\xE7\xE3o para inserir o resultado."
    });
    this.updateControls();
    this.updateResultText();
  }
  createActionButton(parent, text) {
    return parent.createEl("button", {
      cls: "rpg-generator-secondary",
      attr: { type: "button" },
      text
    });
  }
  createOptionField(parent, id, label) {
    const field = parent.createDiv({ cls: "rpg-generator-option-field" });
    field.createEl("label", { text: label, attr: { for: id } });
    return field;
  }
  createOptionSelect(parent, id, label, options, selectedValue, onChange) {
    const field = this.createOptionField(parent, id, label);
    const select = field.createEl("select", {
      cls: "rpg-generator-option-select",
      attr: { id }
    });
    this.addSelectOptions(select, options, selectedValue);
    select.addEventListener("change", () => onChange(select.value));
    return select;
  }
  addSelectOptions(select, options, selectedValue) {
    for (const option of options) {
      const element = select.createEl("option", {
        text: option.label,
        attr: { value: option.value }
      });
      element.selected = option.value === selectedValue;
    }
  }
  updateGenerationOption(key, value) {
    this.generationOptions = { ...this.generationOptions, [key]: value };
    this.clearCurrentResult("Resultado limpo ao alterar op\xE7\xF5es");
  }
  clearCurrentResult(status) {
    var _a;
    this.currentResult = null;
    this.resultKey += 1;
    this.renderVersion += 1;
    this.updateControls();
    this.updateResultText();
    (_a = this.liveStatus) == null ? void 0 : _a.setText(status);
  }
  selectCategory(id) {
    if (id === this.selectedId) return;
    this.selectedId = id;
    for (const [categoryId, button] of this.categoryButtons.entries()) {
      const selected2 = categoryId === id;
      button.setAttr("aria-checked", String(selected2));
      button.setAttr("tabindex", selected2 ? "0" : "-1");
      button.toggleClass("is-selected", selected2);
    }
    if (this.optionSelects) this.optionSelects.ancestryField.hidden = id !== "npc";
    this.clearCurrentResult("Resultado limpo ao trocar de categoria");
  }
  handleCategoryKeydown(event, id) {
    var _a;
    const ids = GENERATORS.map((definition) => definition.id);
    const currentIndex = ids.indexOf(id);
    if (currentIndex < 0) return;
    let nextIndex = null;
    switch (event.key) {
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = (currentIndex - 1 + ids.length) % ids.length;
        break;
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (currentIndex + 1) % ids.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = ids.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    const nextId = ids[nextIndex];
    this.selectCategory(nextId);
    (_a = this.categoryButtons.get(nextId)) == null ? void 0 : _a.focus();
  }
  generateResult() {
    var _a;
    try {
      const result = generate(this.selectedId, new Random(), this.generationOptions);
      this.currentResult = result;
      this.resultKey += 1;
      this.updateControls();
      this.updateResultText();
      (_a = this.liveStatus) == null ? void 0 : _a.setText(`Novo resultado de ${result.label} gerado`);
    } catch (e) {
      new import_obsidian2.Notice("N\xE3o foi poss\xEDvel gerar o resultado");
    }
  }
  updateControls() {
    var _a;
    if (this.primaryButton) {
      const label = ((_a = this.currentResult) == null ? void 0 : _a.id) === this.selectedId ? "Rerrolar" : "Gerar";
      this.primaryButton.setText(label);
    }
    const hasResult = this.currentResult !== null;
    const target = this.dependencies.getEditableTarget();
    if (this.copyTextButton) this.copyTextButton.disabled = !hasResult;
    if (this.copyMarkdownButton) this.copyMarkdownButton.disabled = !hasResult;
    if (this.createButton) this.createButton.disabled = !hasResult || this.creatingNote;
    if (this.insertButton) this.insertButton.disabled = !hasResult || target === null;
    this.setInsertionTarget(target);
  }
  updateInsertionTarget() {
    const target = this.dependencies.getEditableTarget();
    this.setInsertionTarget(target);
    if (this.insertButton) {
      this.insertButton.disabled = this.currentResult === null || target === null;
    }
  }
  setInsertionTarget(target) {
    if (this.insertDestination) {
      this.insertDestination.setText(target ? `Destino: ${target.file.name}` : "");
    }
    if (this.insertHelp) this.insertHelp.hidden = target !== null;
  }
  updateResultText() {
    if (!this.resultText || !this.resultHeader) return;
    this.removeRenderComponent();
    const result = this.currentResult;
    const renderVersion = ++this.renderVersion;
    this.resultText.empty();
    if (!result) {
      this.resultHeader.setText("Resultado");
      this.resultText.setText("Escolha um gerador e clique em \u201CGerar\u201D.");
      this.resultText.addClass("is-empty");
      this.resultText.setAttr("aria-label", "Nenhum resultado gerado");
      return;
    }
    this.resultHeader.setText("Resultado");
    this.resultText.removeClass("is-empty");
    this.resultText.setAttr("aria-label", `Resultado: ${result.label}`);
    const rendered = document.createElement("div");
    const renderComponent = this.addChild(new import_obsidian2.Component());
    this.renderComponent = renderComponent;
    try {
      void import_obsidian2.MarkdownRenderer.render(this.app, toMarkdown(result, 3), rendered, "", renderComponent).then(() => {
        if (renderVersion !== this.renderVersion || this.renderComponent !== renderComponent || !this.resultText) return;
        this.resultText.empty();
        while (rendered.firstChild) this.resultText.appendChild(rendered.firstChild);
      }).catch(() => {
        var _a;
        if (renderVersion !== this.renderVersion || this.renderComponent !== renderComponent || !this.resultText) return;
        this.resultText.setText("N\xE3o foi poss\xEDvel renderizar o resultado.");
        (_a = this.liveStatus) == null ? void 0 : _a.setText("N\xE3o foi poss\xEDvel renderizar o resultado");
      });
    } catch (e) {
      if (renderVersion === this.renderVersion && this.renderComponent === renderComponent) {
        this.removeRenderComponent();
        this.resultText.setText("N\xE3o foi poss\xEDvel renderizar o resultado.");
      }
    }
  }
  removeRenderComponent() {
    if (!this.renderComponent) return;
    this.removeChild(this.renderComponent);
    this.renderComponent = null;
  }
  async copyResult(format) {
    const result = this.currentResult;
    if (!result) return;
    const content = format === "text" ? toPlainText(result) : toMarkdown(result, 1);
    try {
      await navigator.clipboard.writeText(content);
      new import_obsidian2.Notice(format === "text" ? "Texto copiado" : "Markdown copiado");
    } catch (e) {
      new import_obsidian2.Notice("N\xE3o foi poss\xEDvel copiar o conte\xFAdo");
    }
  }
  insertResult() {
    var _a;
    const result = this.currentResult;
    if (!result) return;
    const target = this.dependencies.getEditableTarget();
    this.setInsertionTarget(target);
    if (!target) {
      this.updateInsertionTarget();
      new import_obsidian2.Notice("N\xE3o h\xE1 uma nota Markdown edit\xE1vel selecionada");
      return;
    }
    try {
      const markdown = toMarkdown(result, 2);
      const replacement = this.insertionText(target.editor, markdown);
      target.editor.replaceSelection(replacement);
      target.editor.focus();
      (_a = this.liveStatus) == null ? void 0 : _a.setText(`Resultado inserido em ${target.file.name}`);
      new import_obsidian2.Notice(`Resultado inserido em ${target.file.name}`);
    } catch (e) {
      new import_obsidian2.Notice("N\xE3o foi poss\xEDvel inserir o resultado");
    }
  }
  insertionText(editor, markdown) {
    const from = editor.getCursor("from");
    const to = editor.getCursor("to");
    const start = { line: 0, ch: 0 };
    const end = { line: editor.lastLine(), ch: editor.getLine(editor.lastLine()).length };
    const before = editor.getRange(start, from);
    const after = editor.getRange(to, end);
    return insertionText(before, after, markdown);
  }
  async createNote() {
    const result = this.currentResult;
    if (!result || this.creatingNote) return;
    this.creatingNote = true;
    this.updateControls();
    try {
      const vaultAdapter = {
        getEntry: (path) => {
          const entry = this.app.vault.getAbstractFileByPath(path);
          if (entry instanceof import_obsidian2.TFile) return { type: "file", path: entry.path };
          if (entry instanceof import_obsidian2.TFolder) return { type: "folder", path: entry.path };
          return null;
        },
        createFolder: async (path) => {
          await this.app.vault.createFolder(path);
        },
        createFile: async (path, content) => {
          await this.app.vault.create(path, content);
        }
      };
      const created = await new OutputService(vaultAdapter).createMarkdown({
        outputFolder: this.dependencies.settings.outputFolder,
        title: result.title,
        content: toMarkdown(result, 1)
      });
      let file;
      try {
        const abstractFile = this.app.vault.getAbstractFileByPath(created.path);
        if (!(abstractFile instanceof import_obsidian2.TFile)) throw new Error("arquivo n\xE3o localizado");
        file = abstractFile;
        await this.app.workspace.getLeaf("tab").openFile(file);
      } catch (error) {
        const detail = error instanceof Error && error.message ? `: ${error.message}` : "";
        new import_obsidian2.Notice(`Nota criada, mas n\xE3o foi poss\xEDvel abri-la${detail}`);
        return;
      }
      new import_obsidian2.Notice(`Nota criada: ${created.filename}`);
    } catch (error) {
      const detail = error instanceof Error && error.message ? `: ${error.message}` : "";
      new import_obsidian2.Notice(`N\xE3o foi poss\xEDvel criar a nota${detail}`);
    } finally {
      this.creatingNote = false;
      this.updateControls();
    }
  }
};

// src/main.ts
var RpgRandomGeneratorPlugin = class extends import_obsidian3.Plugin {
  constructor() {
    super(...arguments);
    this.lastEditableTarget = null;
    this.settingsSaveQueue = Promise.resolve();
  }
  async onload() {
    this.rpgSettings = normalizeSettings(await this.loadData());
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", (leaf) => this.captureFromLeaf(leaf))
    );
    this.registerEvent(
      this.app.workspace.on("layout-change", () => this.captureFromActiveLeaf())
    );
    this.registerEvent(
      this.app.workspace.on("file-open", () => this.captureFromActiveLeaf())
    );
    this.registerEvent(
      this.app.workspace.on(
        "editor-change",
        (editor, info) => this.captureFromEditorChange(editor, info)
      )
    );
    this.captureFromActiveLeaf();
    this.registerView(
      VIEW_TYPE_RPG_GENERATOR,
      (leaf) => new GeneratorView(leaf, {
        settings: this.rpgSettings,
        getEditableTarget: () => this.getEditableTarget()
      })
    );
    this.addSettingTab(
      new RpgRandomGeneratorSettingTab(this.app, this, {
        settings: this.rpgSettings,
        saveSettings: (settings) => this.saveSettings(settings)
      })
    );
    this.addRibbonIcon("dice-5", "Abrir Gerador de RPG", () => {
      void this.activateView();
    });
    this.addCommand({
      id: "open-rpg-generator",
      name: "Abrir gerador de RPG",
      callback: () => void this.activateView()
    });
  }
  async saveSettings(settings) {
    const save = this.settingsSaveQueue.catch(() => void 0).then(async () => {
      await this.saveData({ outputFolder: settings.outputFolder });
      this.rpgSettings.outputFolder = settings.outputFolder;
    });
    this.settingsSaveQueue = save.catch(() => void 0);
    await save;
  }
  captureFromActiveLeaf() {
    var _a;
    this.captureFromLeaf((_a = this.app.workspace.activeLeaf) != null ? _a : null);
  }
  captureFromLeaf(leaf) {
    if (!leaf || !(leaf.view instanceof import_obsidian3.MarkdownView)) return;
    this.captureFromMarkdownView(leaf, leaf.view.editor);
  }
  captureFromEditorChange(editor, info) {
    var _a, _b;
    if (info instanceof import_obsidian3.MarkdownView) {
      let matchingLeaf = null;
      this.app.workspace.iterateAllLeaves((leaf) => {
        if (!matchingLeaf && leaf.view === info) matchingLeaf = leaf;
      });
      if (matchingLeaf) this.captureFromMarkdownView(matchingLeaf, editor);
      return;
    }
    const activeLeaf = this.app.workspace.activeLeaf;
    if (!activeLeaf || !(activeLeaf.view instanceof import_obsidian3.MarkdownView) || activeLeaf.view.editor !== editor || ((_a = activeLeaf.view.file) == null ? void 0 : _a.path) !== ((_b = info.file) == null ? void 0 : _b.path)) return;
    this.captureFromMarkdownView(activeLeaf, editor);
  }
  captureFromMarkdownView(leaf, viewEditor) {
    const view = leaf.view;
    if (!(view instanceof import_obsidian3.MarkdownView) || view.getMode() !== "source") return;
    if (!view.file || !viewEditor || view.editor !== viewEditor) return;
    this.lastEditableTarget = {
      editor: view.editor,
      file: view.file,
      leaf
    };
  }
  getEditableTarget() {
    const target = this.lastEditableTarget;
    if (!target) return null;
    const vaultFile = this.app.vault.getAbstractFileByPath(target.file.path);
    if (!(vaultFile instanceof import_obsidian3.TFile)) return null;
    if (!(target.leaf.view instanceof import_obsidian3.MarkdownView) || target.leaf.view.getMode() !== "source") return null;
    const viewFile = target.leaf.view.file;
    if ((viewFile == null ? void 0 : viewFile.path) !== target.file.path || target.leaf.view.editor !== target.editor || vaultFile.path !== target.file.path) {
      return null;
    }
    return target;
  }
  async activateView() {
    const existingLeaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_RPG_GENERATOR);
    if (existingLeaves.length > 0) {
      this.app.workspace.revealLeaf(existingLeaves[0]);
      return;
    }
    const leaf = this.app.workspace.getRightLeaf(false);
    if (!leaf) return;
    await leaf.setViewState({ type: VIEW_TYPE_RPG_GENERATOR, active: true });
    this.app.workspace.revealLeaf(leaf);
  }
};
