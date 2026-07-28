"use strict";
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

// src/application/readable-store.ts
var MutableStore = class {
  constructor(value) {
    this.value = value;
    this.listeners = /* @__PURE__ */ new Set();
  }
  get() {
    return this.value;
  }
  set(value) {
    this.value = value;
    this.notify();
  }
  notify() {
    for (const listener of this.listeners) listener();
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
};

// src/application/settings-repository.ts
var SettingsRepository = class {
  constructor(current, write) {
    this.current = current;
    this.write = write;
    this.queue = Promise.resolve();
  }
  save(settings) {
    const next = { ...settings };
    const save = this.queue.catch(() => void 0).then(async () => {
      await this.write(next);
      this.current.outputFolder = next.outputFolder;
    });
    this.queue = save.catch(() => void 0);
    return save;
  }
};

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
    this.pendingSaveTimer = null;
    this.pendingSave = null;
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
  hide() {
    this.flushPendingSave();
  }
  handleOutputFolderChange(setting, input) {
    const validation = validateOutputFolder(input);
    if (!validation.valid) {
      this.showValidationError(setting, validation);
      return;
    }
    this.pendingSave = {
      setting,
      settings: { outputFolder: validation.value }
    };
    if (this.pendingSaveTimer !== null) window.clearTimeout(this.pendingSaveTimer);
    this.pendingSaveTimer = window.setTimeout(() => this.flushPendingSave(), 250);
  }
  flushPendingSave() {
    if (this.pendingSaveTimer !== null) {
      window.clearTimeout(this.pendingSaveTimer);
      this.pendingSaveTimer = null;
    }
    const pending = this.pendingSave;
    this.pendingSave = null;
    if (!pending) return;
    void this.persistSettings(pending.setting, pending.settings);
  }
  async persistSettings(setting, settings) {
    try {
      await this.saveSettings(settings);
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
      if (next === void 0) continue;
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
var DUNGEON_MODE_IDS = ["story", "mapped"];
var DUNGEON_SIZES = [5, 8, 12];
var DUNGEON_ROOM_ROLES = [
  "Entrada",
  "Explora\xE7\xE3o",
  "Desafio",
  "Encruzilhada",
  "Segredo",
  "Armadilha",
  "Ref\xFAgio",
  "Contratempo",
  "Encontro",
  "Revela\xE7\xE3o",
  "Confronto",
  "Recompensa"
];

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
var DUNGEON_MODE_LABELS = {
  story: "Narrativa",
  mapped: "Mapeada"
};
var DUNGEON_SIZE_LABELS = {
  5: "5 salas",
  8: "8 salas",
  12: "12 salas"
};
var RANDOM_LABEL = "Aleat\xF3rio";
var RANDOM_ANCESTRY_LABEL = "Aleat\xF3ria";
var TONES = TONE_IDS;
var ENVIRONMENTS = ENVIRONMENT_IDS;
var COMPLEXITIES = COMPLEXITY_IDS;
var DUNGEON_MODES = DUNGEON_MODE_IDS;
var DUNGEON_ROOM_COUNTS = DUNGEON_SIZES;
var DEFAULT_GENERATION_OPTIONS = Object.freeze({
  tone: "random",
  environment: "random",
  complexity: "random",
  ancestry: "random",
  dungeonMode: null,
  dungeonSize: null
});
var toneSet = new Set(TONE_IDS);
var environmentSet = new Set(ENVIRONMENT_IDS);
var complexitySet = new Set(COMPLEXITY_IDS);
var peopleSet = new Set(PEOPLE.map((person) => person.id));
var dungeonModeSet = new Set(DUNGEON_MODE_IDS);
var dungeonSizeSet = new Set(DUNGEON_SIZES);
var generatorSet = new Set(GENERATOR_IDS);
function validSelection(value, values, fallback) {
  return value === "random" || typeof value === "string" && values.has(value) ? value : fallback;
}
function isNpc(generatorId) {
  return generatorId === "npc";
}
function isDungeon(generatorId) {
  return generatorId === "dungeon";
}
function normalizeGenerationOptions(input = {}, generatorId) {
  const value = typeof input === "object" && input !== null ? input : {};
  const ancestry = isNpc(generatorId) ? validSelection(value.ancestry, peopleSet, "random") : generatorId === void 0 ? validSelection(value.ancestry, peopleSet, "random") : null;
  return {
    tone: validSelection(value.tone, toneSet, "random"),
    environment: validSelection(value.environment, environmentSet, "random"),
    complexity: validSelection(value.complexity, complexitySet, "random"),
    ancestry,
    dungeonMode: isDungeon(generatorId) ? typeof value.dungeonMode === "string" && dungeonModeSet.has(value.dungeonMode) ? value.dungeonMode : "story" : generatorId === void 0 ? typeof value.dungeonMode === "string" && dungeonModeSet.has(value.dungeonMode) ? value.dungeonMode : null : null,
    dungeonSize: isDungeon(generatorId) ? typeof value.dungeonSize === "number" && dungeonSizeSet.has(value.dungeonSize) ? value.dungeonSize : 5 : generatorId === void 0 ? typeof value.dungeonSize === "number" && dungeonSizeSet.has(value.dungeonSize) ? value.dungeonSize : null : null
  };
}
function pick(selection, values, random) {
  return selection === "random" ? random.pick(values) : selection;
}
function resolveGenerationOptions(options = DEFAULT_GENERATION_OPTIONS, random = new Random(), generatorId) {
  const selected = normalizeGenerationOptions(options, generatorId);
  return {
    tone: pick(selected.tone, TONE_IDS, random),
    environment: pick(selected.environment, ENVIRONMENT_IDS, random),
    complexity: pick(selected.complexity, COMPLEXITY_IDS, random),
    ancestry: selected.ancestry === null ? null : pick(selected.ancestry, PEOPLE.map((person) => person.id), random),
    dungeonMode: selected.dungeonMode,
    dungeonSize: selected.dungeonSize
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
function getDungeonModeLabel(value) {
  return DUNGEON_MODE_LABELS[value];
}
function getDungeonSizeLabel(value) {
  return DUNGEON_SIZE_LABELS[value];
}

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
function catalogCellKey(cell) {
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
    const missing = coverage.missing.map(catalogCellKey).join(", ");
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
function compileContentCatalog(entries) {
  assertCatalogCoverage(entries);
  const candidates = /* @__PURE__ */ new Map();
  for (const cell of allCells()) {
    candidates.set(catalogCellKey(cell), {
      normal: entries.filter((entry) => !isFallback(entry) && matches(entry, cell, false)),
      fallback: entries.filter((entry) => isFallback(entry) && matches(entry, cell, true))
    });
  }
  return {
    entries,
    select(compatibility, random = new Random()) {
      const cell = toCompatibility(compatibility);
      const cellCandidates = candidates.get(catalogCellKey(cell));
      if (!cellCandidates) {
        throw new ContentSelectionError(
          `Nenhuma c\xE9lula compilada para ${catalogCellKey(cell)}.`
        );
      }
      if (cellCandidates.normal.length > 0) return random.pick(cellCandidates.normal);
      if (cellCandidates.fallback.length > 0) return random.pick(cellCandidates.fallback);
      throw new ContentSelectionError(
        `Nenhuma entrada compat\xEDvel para ${catalogCellKey(cell)} (normal ou fallback).`
      );
    }
  };
}

// src/catalogs/pt-BR/environments.ts
var ROOM_DEVELOPMENT = {
  Entrada: "A entrada informa o risco antes de cobr\xE1-lo. Pistas vis\xEDveis permitem preparar a travessia, enquanto sinais de passagem recente mostram que o complexo reage a visitantes.",
  Explora\u00E7\u00E3o: "Tr\xEAs detalhes podem ser examinados sem perigo imediato. Cada um revela uma informa\xE7\xE3o \xFAtil sobre os ocupantes, as rotas dispon\xEDveis ou o prop\xF3sito original do lugar.",
  Desafio: "O obst\xE1culo possui causa, sinais e mais de uma solu\xE7\xE3o. For\xE7a bruta funciona, mas altera o ambiente e cria uma consequ\xEAncia que ser\xE1 percebida nas salas seguintes.",
  Encruzilhada: "As rotas anunciam diferen\xE7as concretas por meio de sons, correntes de ar e rastros. Uma oferece rapidez; outra oferece informa\xE7\xE3o; a terceira evita uma amea\xE7a conhecida.",
  Segredo: "A passagem oculta pode ser descoberta por observa\xE7\xE3o, n\xE3o por adivinha\xE7\xE3o. Seu conte\xFAdo explica uma parte do complexo e concede uma vantagem para um conflito posterior.",
  Armadilha: "O mecanismo protege algo espec\xEDfico e apresenta ind\xEDcios antes de disparar. Desarm\xE1-lo, contorn\xE1-lo ou acion\xE1-lo de prop\xF3sito produz benef\xEDcios e riscos diferentes.",
  Ref\u00FAgio: "O espa\xE7o permite descansar, conversar e reorganizar recursos. Vest\xEDgios de ocupa\xE7\xE3o recente, por\xE9m, indicam que o abrigo n\xE3o permanecer\xE1 seguro por muito tempo.",
  Contratempo: "Uma mudan\xE7a f\xEDsica altera a rota de retorno sem apagar o progresso. O grupo precisa escolher entre gastar recursos, revelar sua presen\xE7a ou aceitar um caminho desconhecido.",
  Encontro: "Os presentes t\xEAm objetivo, receio e algo que podem oferecer. Eles n\xE3o come\xE7am hostis, mas respondem rapidamente a amea\xE7as, mentiras e demonstra\xE7\xF5es de respeito.",
  Revela\u00E7\u00E3o: "Evid\xEAncias de salas anteriores se unem numa explica\xE7\xE3o clara. A descoberta muda o objetivo imediato e aponta pelo menos duas maneiras de agir antes do confronto.",
  Confronto: "A oposi\xE7\xE3o usa o terreno, protege algo importante e aceita condi\xE7\xF5es al\xE9m da rendi\xE7\xE3o total. Interromper seu plano \xE9 urgente; decidir o destino dos envolvidos continua aberto.",
  Recompensa: "O pr\xEAmio \xE9 identific\xE1vel, \xFAtil e ligado \xE0 hist\xF3ria do complexo. Lev\xE1-lo resolve uma necessidade imediata, mas chama a aten\xE7\xE3o de algu\xE9m que conhece seu verdadeiro valor."
};
function completeRooms(rooms) {
  for (const role of DUNGEON_ROOM_ROLES) {
    if (!rooms[role].trim()) throw new Error(`Descri\xE7\xE3o ausente para ${role}`);
  }
  return rooms;
}
var ENVIRONMENT_WRITING = {
  wilderness: {
    name: "Marco do Horizonte Partido",
    setting: "pelas terras abertas, entre chapadas, brejos e campos varridos pelo vento",
    texture: "O vento dobra o capim em ondas, carrega poeira avermelhada e apaga pegadas rasas antes do meio-dia.",
    inhabitants: "Pastores sazonais, batedores, curandeiras itinerantes e pequenas comunidades conhecem os poucos pontos de \xE1gua.",
    regionNoun: "as terras abertas",
    npcRole: "guia que l\xEA mudan\xE7as no tempo e conhece as rotas entre os po\xE7os",
    npcCompanion: "uma montaria resistente, treinada para encontrar \xE1gua e permanecer im\xF3vel durante tempestades",
    location: {
      type: "Entreposto de pedra constru\xEDdo ao redor de um po\xE7o profundo e de tr\xEAs caminhos de caravana.",
      landmark: "Duas colunas inclinadas sustentam placas de bronze que giram com o vento e apontam rotas diferentes conforme a esta\xE7\xE3o.",
      history: "O entreposto surgiu depois que viajantes de comunidades rivais cavaram o po\xE7o juntos durante uma seca de sete meses.",
      conflict: "Os pastores desejam reservar a \xE1gua para os rebanhos; os condutores de caravana afirmam que o antigo acordo garante passagem livre.",
      danger: "Uma frente de poeira aproxima-se pelo oeste. Ela encobre ravinas, assusta animais e reduz a orienta\xE7\xE3o a poucos passos.",
      secret: "Sob a borda do po\xE7o, marcas de medi\xE7\xE3o provam que algu\xE9m retirou \xE1gua durante as noites em que o acesso deveria estar fechado.",
      opportunities: "O lugar oferece \xE1gua limpa, animais descansados, not\xEDcias de tr\xEAs rotas e um mirante capaz de revelar movimentos a quil\xF4metros de dist\xE2ncia.",
      hook: "Uma crian\xE7a encontrou no fundo de um balde um medalh\xE3o pertencente a uma caravana desaparecida no m\xEAs anterior."
    },
    quest: {
      title: "A Caravana Antes da Tempestade",
      giver: "a respons\xE1vel pelo po\xE7o comunit\xE1rio, eleita por fam\xEDlias de tr\xEAs rotas",
      objective: "encontrar a caravana desaparecida e recuperar seu registro de carga antes da chegada da tempestade",
      complication: "As marcas deixadas pela caravana se dividem junto a uma ravina, como se parte dos viajantes tivesse seguido sob coer\xE7\xE3o.",
      context: "A carga inclui rem\xE9dios e ferramentas prometidos a comunidades que j\xE1 consumiram suas reservas.",
      stages: "Confirmar a \xFAltima parada da caravana; atravessar a rota antes que a poeira apague os sinais; localizar sobreviventes e decidir como transportar a carga restante.",
      opposition: "Um grupo de cobradores controla o desfiladeiro e afirma possuir um contrato que lhe d\xE1 direito sobre toda a carga.",
      escalation: "A tempestade fecha primeiro a rota curta, depois alcan\xE7a os pontos de \xE1gua e por fim impede qualquer viagem sem abrigo.",
      failure: "Duas comunidades ficam sem rem\xE9dios, e os cobradores passam a controlar o \xFAnico caminho seguro durante a esta\xE7\xE3o.",
      alternative: "O grupo pode comprovar a fraude no contrato e reunir testemunhas das caravanas, evitando uma disputa pela for\xE7a.",
      reward: "Provis\xF5es para uma longa viagem, direito de usar os po\xE7os comunit\xE1rios e um mapa atualizado das rotas sazonais."
    },
    encounter: {
      title: "O C\xEDrculo dos Carros",
      situation: "Tr\xEAs carro\xE7as formam uma barreira ao redor de fam\xEDlias e animais exaustos. Batedores armados observam a poeira que cresce no horizonte.",
      threat: "Uma manada assustada corre na dire\xE7\xE3o do abrigo e pode destruir as carro\xE7as antes que a tempestade chegue.",
      twist: "Os batedores provocaram a debandada para afastar predadores, mas calcularam mal a dire\xE7\xE3o do vento.",
      choice: "O grupo pode desviar a manada, refor\xE7ar o c\xEDrculo ou conduzir as fam\xEDlias at\xE9 uma forma\xE7\xE3o rochosa que talvez j\xE1 esteja ocupada.",
      setup: "Cordas vibram, animais puxam arreios e uma faixa escura cobre metade do c\xE9u. H\xE1 poucos minutos para preparar qualquer solu\xE7\xE3o.",
      actors: "Condutores de caravana protegem crian\xE7as e carga; dois batedores escondem sua responsabilidade; pastores procuram animais perdidos.",
      escalation: "A primeira fileira da manada atravessa o acampamento quando as rajadas mais fortes tornam gritos e sinais dif\xEDceis de perceber.",
      interaction: "Valas rasas, lonas, sinos, fogo controlado e o pr\xF3prio formato das carro\xE7as podem redirecionar animais ou criar uma passagem segura.",
      outcomes: "Salvar a carga conquista a gratid\xE3o dos condutores. Priorizar as pessoas evita feridos, mas deixa recursos valiosos espalhados pelo campo.",
      aftermath: "Quando a poeira baixa, pegadas de uma criatura solit\xE1ria aparecem entre as marcas da manada e seguem na dire\xE7\xE3o oposta."
    },
    rumor: {
      subject: "As luzes do Po\xE7o Sem Lua",
      claim: "Dizem que luzes azuis percorrem os campos durante a madrugada e param sobre po\xE7os cuja \xE1gua desaparecer\xE1 antes do amanhecer.",
      truth: "As luzes v\xEAm de lanternas cobertas usadas por ladr\xF5es de \xE1gua. O grupo marca os po\xE7os escolhidos com sais que brilham quando recebem orvalho.",
      source: "Uma pastora viu as luzes de uma eleva\xE7\xE3o distante e encontrou o reservat\xF3rio de sua fam\xEDlia quase vazio no dia seguinte.",
      variations: "Alguns juram que as luzes caminham sozinhas; outros afirmam ouvir rodas, vozes abafadas ou o choro de animais sedentos.",
      clues: "Sulcos estreitos de carro\xE7a, gotas de cera azul e marcas recentes de corda aparecem junto aos po\xE7os afetados.",
      interested: "Fam\xEDlias sem \xE1gua querem respostas, enquanto comerciantes que lucram com a escassez pagam para ridicularizar o relato.",
      consequence: "Seguir as luzes revela o dep\xF3sito clandestino, mas deixa os demais po\xE7os sem vigil\xE2ncia durante uma noite.",
      context: "A hist\xF3ria se espalhou entre acampamentos depois que tr\xEAs reservat\xF3rios secaram apesar de n\xE3o apresentarem rachaduras."
    },
    dungeon: {
      name: "Santu\xE1rio sob o Vento",
      overview: "Um observat\xF3rio semienterrado liga cisternas, t\xFAneis de manuten\xE7\xE3o e c\xE2maras usadas para registrar tempestades. Saqueadores procuram o mecanismo que localiza \xE1gua subterr\xE2nea.",
      rooms: completeRooms({
        Entrada: "Tr\xEAs mon\xF3litos cercam uma escadaria tomada pela areia. Ranhuras no ch\xE3o revelam onde placas de pedra deslizam quando o vento sopra do oeste.",
        Explora\u00E7\u00E3o: "Mapas de couro ressecado pendem de cilindros girat\xF3rios. Furos, manchas de sal e pequenas pedras coloridas registram po\xE7os que n\xE3o aparecem em mapas atuais.",
        Desafio: "Uma ponte estreita cruza uma cisterna vazia, enquanto contrapesos rangem nas paredes. Redistribuir o peso estabiliza a travessia e abre o acesso inferior.",
        Encruzilhada: "Tr\xEAs t\xFAneis recebem correntes de ar distintas: um traz cheiro de chuva, outro carrega vozes e o terceiro sopra areia marcada por pegadas recentes.",
        Segredo: "Uma pedra do mapa central pode ser pressionada e revela um nicho com registros de nascentes. A \xFAltima anota\xE7\xE3o indica um po\xE7o deliberadamente selado.",
        Armadilha: "Placas de press\xE3o liberam areia de reservat\xF3rios no teto. Pequenos montes junto \xE0s juntas e riscos de p\xE1 tornam o mecanismo vis\xEDvel antes do disparo.",
        Ref\u00FAgio: "Uma sala de vigia conserva bancos, mantas e um jarro vedado. A abertura superior oferece vis\xE3o da entrada e mostra sinais de uma tempestade pr\xF3xima.",
        Contratempo: "Uma rajada move as placas externas e bloqueia o caminho conhecido. Um duto de manuten\xE7\xE3o continua aberto, mas desce para uma \xE1rea parcialmente inundada.",
        Encontro: "Dois saqueadores feridos defendem um carrinho de registros. Eles perderam companheiros adiante e trocam informa\xE7\xF5es por \xE1gua, luz ou passagem segura.",
        Revela\u00E7\u00E3o: "O mecanismo central n\xE3o prev\xEA tempestades; ele mede a retirada de \xE1gua subterr\xE2nea. Os registros mostram que a escassez atual foi provocada por extra\xE7\xE3o deliberada.",
        Confronto: "A l\xEDder dos saqueadores opera uma bomba antiga numa c\xE2mara circular. Fechar as v\xE1lvulas salva o aqu\xEDfero, mas pode romper os condutos sob seus aliados.",
        Recompensa: "Um astrol\xE1bio de bronze localiza \xE1gua pela vibra\xE7\xE3o de sua agulha. O estojo tamb\xE9m cont\xE9m os nomes de quem financiou a extra\xE7\xE3o clandestina."
      })
    }
  },
  forest: {
    name: "Clareira do Sino Verde",
    setting: "na mata antiga, sob copas espessas e trilhas que mudam com a chuva",
    texture: "Folhas molhadas abafam passos, ra\xEDzes atravessam o caminho e gotas pesadas caem muito depois de a chuva terminar.",
    inhabitants: "Coletores de resina, guardi\xF5es de trilha, lenhadores, eremitas e animais territoriais dividem a mata.",
    regionNoun: "a floresta",
    npcRole: "batedor que reconhece \xE1rvores feridas, rastros recentes e mudan\xE7as nas trilhas",
    npcCompanion: "uma ave de plumagem escura, capaz de imitar assobios usados pelos guardi\xF5es da mata",
    location: {
      type: "Clareira comunit\xE1ria formada ao redor de uma \xE1rvore oca onde viajantes deixam mensagens e oferendas.",
      landmark: "Um sino coberto por trepadeiras pende dentro do tronco. Seu som muda conforme a dire\xE7\xE3o de onde algu\xE9m se aproxima.",
      history: "A clareira marcou durante gera\xE7\xF5es o limite entre \xE1reas de coleta, ca\xE7a e preserva\xE7\xE3o acordadas por comunidades vizinhas.",
      conflict: "Novas \xE1rvores marcadas para corte aparecem al\xE9m do limite permitido, e cada grupo acusa o outro de avan\xE7ar durante a noite.",
      danger: "Uma doen\xE7a escurece as folhas mais altas e atrai insetos agressivos para as \xE1rvores saud\xE1veis.",
      secret: "As marcas de corte foram feitas por ferramentas diferentes das usadas pelas comunidades locais e seguem um desenho visto do alto.",
      opportunities: "Ervas medicinais, resina valiosa, abrigo elevado e tr\xEAs trilhas pouco conhecidas ficam acess\xEDveis a quem conquistar a confian\xE7a dos guardi\xF5es.",
      hook: "O sino tocou sozinho durante tr\xEAs noites, sempre pouco antes de uma nova \xE1rvore adoecer."
    },
    quest: {
      title: "A Doen\xE7a da Nascente",
      giver: "uma guardi\xE3 de trilha que representa coletores e fam\xEDlias instaladas na orla da mata",
      objective: "localizar a origem da doen\xE7a das \xE1rvores e impedir que alcance a nascente central",
      complication: "A \xFAnica amostra intacta est\xE1 numa \xE1rea que os guardi\xF5es fecharam depois do desaparecimento de dois exploradores.",
      context: "A floresta fornece \xE1gua, alimento e rem\xE9dios para v\xE1rias comunidades; queim\xE1-la ou abandon\xE1-la n\xE3o \xE9 uma op\xE7\xE3o aceit\xE1vel.",
      stages: "Comparar as primeiras \xE1rvores afetadas; seguir insetos e marcas de ferramenta; alcan\xE7ar a origem da contamina\xE7\xE3o e decidir como isol\xE1-la.",
      opposition: "Coletores clandestinos espalham a doen\xE7a para enfraquecer \xE1rvores antigas e retirar uma resina rara sem resist\xEAncia.",
      escalation: "A cada dia, os insetos alcan\xE7am uma nova trilha e obrigam fam\xEDlias a abandonar postos de coleta.",
      failure: "A nascente fica contaminada, os animais migram e comunidades rivais iniciam uma disputa pelas \xE1reas ainda saud\xE1veis.",
      alternative: "Expor os compradores da resina e oferecer prote\xE7\xE3o aos trabalhadores pode desmontar a opera\xE7\xE3o sem destruir seus acampamentos.",
      reward: "Rem\xE9dios preparados pelos coletores, acesso \xE0s trilhas protegidas e sementes capazes de purificar solo contaminado."
    },
    encounter: {
      title: "A \xC1rvore que Caminha",
      situation: "Lenhadores cercam uma \xE1rvore jovem cujas ra\xEDzes se arrancaram do solo. Guardi\xF5es exigem que ningu\xE9m se aproxime.",
      threat: "A \xE1rvore avan\xE7a de forma desajeitada em dire\xE7\xE3o a um acampamento, derrubando troncos e assustando animais pelo caminho.",
      twist: "Uma criatura pequena est\xE1 presa entre as ra\xEDzes e guia o movimento na tentativa de voltar \xE0 nascente.",
      choice: "O grupo pode imobilizar a \xE1rvore, abrir caminho at\xE9 a nascente ou convencer os presentes a ajudar numa opera\xE7\xE3o que todos consideram perigosa.",
      setup: "Galhos estalam acima das tendas, ra\xEDzes grossas levantam terra \xFAmida e p\xE1ssaros abandonam a \xE1rea em bandos.",
      actors: "Lenhadores querem proteger o acampamento; guardi\xF5es desejam preservar a \xE1rvore; a criatura presa reage a vozes calmas e luz suave.",
      escalation: "Fogo acidental alcan\xE7a a vegeta\xE7\xE3o seca quando algu\xE9m tenta assustar a \xE1rvore com uma tocha.",
      interaction: "Cordas presas a troncos, canais de \xE1gua, m\xFAsica, terreno inclinado e a remo\xE7\xE3o cuidadosa de ra\xEDzes podem alterar o percurso.",
      outcomes: "Levar a \xE1rvore \xE0 nascente conquista aliados entre os guardi\xF5es. Derrub\xE1-la salva o acampamento, mas revela a criatura ferida diante de todos.",
      aftermath: "No local onde a \xE1rvore estava, surge uma cavidade com ferramentas recentes e frascos usados para tratar madeira clandestinamente."
    },
    rumor: {
      subject: "O coro sob as ra\xEDzes",
      claim: "Ca\xE7adores afirmam que vozes chamam pessoas pelo nome sob as \xE1rvores mais antigas e oferecem caminhos que n\xE3o existiam no dia anterior.",
      truth: "Tubos de madeira enterrados conectam antigos postos de vigia. Algu\xE9m voltou a us\xE1-los para conduzir viajantes longe de uma \xE1rea proibida.",
      source: "Uma coletora ouviu a voz de sua irm\xE3 falecida e seguiu as instru\xE7\xF5es at\xE9 encontrar uma trilha rec\xE9m-bloqueada.",
      variations: "Alguns ouvem parentes mortos; outros escutam a pr\xF3pria voz ou assobios conhecidos apenas pelos guardi\xF5es.",
      clues: "Pequenos furos nos troncos, resina removida recentemente e cord\xF5es de fibra ligam \xE1rvores distantes.",
      interested: "Guardi\xF5es temem que a rede seja profanada; contrabandistas querem preservar o medo que mant\xE9m curiosos afastados.",
      consequence: "Seguir a rede revela quem transmite as mensagens e conduz o grupo at\xE9 a \xE1rea que todos tentam esconder.",
      context: "O boato reapareceu quando trilhas seguras come\xE7aram a terminar diante de barreiras constru\xEDdas durante a noite."
    },
    dungeon: {
      name: "Ra\xEDzes do Sino Verde",
      overview: "Galerias sob a \xE1rvore central ligam santu\xE1rios de sementes, canais de \xE1gua e postos de vigia. Fungos invasores avan\xE7am por passagens abertas por coletores clandestinos.",
      rooms: completeRooms({
        Entrada: "Uma fenda entre ra\xEDzes desce at\xE9 uma porta de madeira viva. Cortes recentes mostram onde cunhas foram usadas sem despertar os espinhos da moldura.",
        Explora\u00E7\u00E3o: "Prateleiras de barro guardam sementes rotuladas por esta\xE7\xE3o e altitude. Algumas gavetas est\xE3o vazias, e pegadas cobertas de p\xF3len seguem para o leste.",
        Desafio: "Ra\xEDzes entrela\xE7adas bloqueiam um canal e acumulam \xE1gua escura. Soltar a press\xE3o abre a passagem, mas exige direcionar a corrente para outra galeria.",
        Encruzilhada: "Tr\xEAs t\xFAneis separam-se ao redor de uma \xE1rvore subterr\xE2nea. Um recebe luz, outro carrega \xE1gua limpa e o terceiro exala o cheiro doce dos fungos.",
        Segredo: "Um padr\xE3o de folhas gravado na parede indica uma porta flex\xEDvel. Atr\xE1s dela, registros ligam cada semente guardada a uma comunidade da regi\xE3o.",
        Armadilha: "Vagens pendentes liberam p\xF3len entorpecente quando galhos baixos s\xE3o tocados. Insetos adormecidos no ch\xE3o revelam o alcance do mecanismo natural.",
        Ref\u00FAgio: "Uma plataforma seca possui redes, ervas e recipientes de \xE1gua filtrada. Algu\xE9m esteve aqui recentemente e deixou uma mensagem sob uma tigela.",
        Contratempo: "Uma raiz rompe o piso e separa a passagem em dois n\xEDveis. O desvio superior \xE9 exposto; o inferior atravessa \xE1gua onde algo grande se move.",
        Encontro: "Tr\xEAs coletores cercados por fungos pedem ajuda para retirar caixas roubadas. Eles discordam sobre abandonar a carga ou queimar a galeria.",
        Revela\u00E7\u00E3o: "As caixas cont\xEAm sementes tratadas com o mesmo fungo que adoece a floresta. Os r\xF3tulos mostram que a contamina\xE7\xE3o foi planejada para se espalhar.",
        Confronto: "A respons\xE1vel pela opera\xE7\xE3o prepara a abertura do reservat\xF3rio de esporos. Ela amea\xE7a contaminar as sementes restantes se n\xE3o receber passagem livre.",
        Recompensa: "Um estojo vivo preserva sementes em qualquer clima e indica quando o solo \xE9 seguro. Dentro dele h\xE1 contratos assinados pelos compradores da resina."
      })
    }
  },
  city: {
    name: "P\xE1tio das Sete Janelas",
    setting: "entre ruas populosas, oficinas apertadas e passagens mantidas fora dos mapas oficiais",
    texture: "Preg\xF5es, martelos e rodas de carro\xE7a se misturam ao cheiro de p\xE3o, tinta, chuva sobre pedra e canais mal cobertos.",
    inhabitants: "Artes\xE3os, carregadores, comerciantes, mensageiros, guardas e fam\xEDlias antigas disputam espa\xE7o e influ\xEAncia.",
    regionNoun: "a cidade",
    npcRole: "mensageiro que conhece atalhos, hor\xE1rios de patrulha e rela\xE7\xF5es entre os bairros",
    npcCompanion: "um c\xE3o pequeno treinado para levar bilhetes por passagens onde uma pessoa n\xE3o conseguiria entrar",
    location: {
      type: "P\xE1tio comercial cercado por pr\xE9dios estreitos, balc\xF5es de oficina e sete janelas que pertencem a fam\xEDlias rivais.",
      landmark: "Um rel\xF3gio p\xFAblico sem ponteiros abre pequenas portinholas em hor\xE1rios conhecidos apenas pelos moradores mais antigos.",
      history: "O p\xE1tio nasceu sobre um mercado coberto destru\xEDdo por inc\xEAndio e conserva acessos para dep\xF3sitos que nunca foram registrados.",
      conflict: "Uma reforma amea\xE7a expulsar oficinas e fam\xEDlias, enquanto o cons\xF3rcio respons\xE1vel afirma que a estrutura corre risco de desabar.",
      danger: "Vigas cedem sob os pr\xE9dios do lado norte, e qualquer tumulto pode bloquear as duas sa\xEDdas mais largas.",
      secret: "Os laudos de risco foram alterados para incluir edif\xEDcios seguros e excluir um dep\xF3sito pertencente ao cons\xF3rcio.",
      opportunities: "O p\xE1tio oferece contatos em v\xE1rios of\xEDcios, acesso aos telhados, passagens subterr\xE2neas e not\xEDcias que ainda n\xE3o chegaram \xE0s autoridades.",
      hook: "Uma das sete janelas acende todas as noites num pr\xE9dio oficialmente vazio, e mensageiros deixam pacotes no parapeito."
    },
    quest: {
      title: "Os Laudos das Sete Janelas",
      giver: "uma representante das oficinas, escolhida numa assembleia que o cons\xF3rcio se recusa a reconhecer",
      objective: "obter os laudos originais da reforma e apresent\xE1-los antes da vota\xE7\xE3o do conselho",
      complication: "Os documentos est\xE3o divididos entre um arquivo municipal e o escrit\xF3rio particular do engenheiro respons\xE1vel.",
      context: "A reforma pode melhorar a seguran\xE7a do bairro, mas o projeto atual transfere propriedades p\xFAblicas para investidores ligados ao conselho.",
      stages: "Identificar quem alterou os registros; recuperar as duas partes do laudo; reunir testemunhas e apresentar a prova durante a sess\xE3o p\xFAblica.",
      opposition: "Agentes do cons\xF3rcio compram sil\xEAncio, espalham avisos falsos de interdi\xE7\xE3o e usam guardas privados para controlar os acessos.",
      escalation: "Novos despejos come\xE7am ao amanhecer, e cada oficina vazia permite que o cons\xF3rcio feche outra passagem do p\xE1tio.",
      failure: "As fam\xEDlias perdem suas casas, as passagens subterr\xE2neas s\xE3o seladas e o cons\xF3rcio assume o com\xE9rcio do bairro.",
      alternative: "Provar que o dep\xF3sito do cons\xF3rcio \xE9 o ponto mais inst\xE1vel pode suspender toda a reforma at\xE9 uma inspe\xE7\xE3o independente.",
      reward: "Servi\xE7os gratuitos de artes\xE3os, abrigo seguro no bairro e acesso \xE0 rede de mensageiros das sete janelas."
    },
    encounter: {
      title: "A Prociss\xE3o Interrompida",
      situation: "Uma prociss\xE3o ocupa a rua principal quando guardas fecham o port\xE3o adiante. Carregadores com uma maca n\xE3o conseguem retornar.",
      threat: "A multid\xE3o comprime pessoas contra barracas e paredes, enquanto um cavalo assustado tenta romper a linha dos guardas.",
      twist: "A pessoa levada na maca transporta provas contra o oficial que ordenou o bloqueio e finge estar inconsciente.",
      choice: "O grupo pode abrir espa\xE7o para a maca, negociar a abertura do port\xE3o ou conduzir a multid\xE3o por uma passagem que atravessa propriedade privada.",
      setup: "Sinos, cantos e ordens contradit\xF3rias impedem que os presentes compreendam o que acontece a poucos metros.",
      actors: "Devotos querem concluir a prociss\xE3o; guardas temem perder o controle; comerciantes protegem suas lojas; os carregadores procuram uma sa\xEDda discreta.",
      escalation: "Algu\xE9m lan\xE7a uma pedra, o cavalo derruba uma barraca e os guardas interpretam o acidente como in\xEDcio de uma revolta.",
      interaction: "Balc\xF5es, toldos, sinos, carro\xE7as e acessos aos telhados permitem criar rotas, sinais vis\xEDveis ou barreiras tempor\xE1rias.",
      outcomes: "Evitar o confronto mant\xE9m o bairro aberto. For\xE7ar a passagem salva a prova, mas permite que o oficial justifique novas patrulhas.",
      aftermath: "Entre os objetos ca\xEDdos surge um selo municipal ligado a documentos que deveriam estar guardados no arquivo central."
    },
    rumor: {
      subject: "A oitava janela",
      claim: "Moradores juram que uma oitava janela aparece em paredes diferentes depois da meia-noite e recebe cartas destinadas a pessoas desaparecidas.",
      truth: "A janela \xE9 uma moldura port\xE1til usada por mensageiros clandestinos para marcar pontos de coleta sem revelar a rede completa.",
      source: "Um aprendiz entregou uma carta no local indicado e, na manh\xE3 seguinte, encontrou apenas uma parede rec\xE9m-pintada.",
      variations: "Alguns dizem que a janela muda de bairro; outros afirmam que ela surge apenas para quem escreveu um nome proibido.",
      clues: "Res\xEDduos da mesma tinta, marcas de ganchos e envelopes dobrados de maneira id\xEAntica aparecem nos locais citados.",
      interested: "Fam\xEDlias procuram not\xEDcias dos desaparecidos; autoridades desejam localizar a rede; chantagistas tentam inserir mensagens falsas.",
      consequence: "Acompanhar uma coleta revela um arquivo de correspond\xEAncias e exp\xF5e um mensageiro que protege v\xE1rias testemunhas.",
      context: "O boato cresceu quando cartas sem destinat\xE1rio come\xE7aram a receber respostas com informa\xE7\xF5es que somente os desaparecidos conheciam."
    },
    dungeon: {
      name: "Galerias da Oitava Janela",
      overview: "Dep\xF3sitos, cisternas e corredores de servi\xE7o formam uma rede sob o bairro antigo. Mensageiros clandestinos e agentes do cons\xF3rcio disputam arquivos escondidos.",
      rooms: completeRooms({
        Entrada: "Uma escada sob uma oficina termina diante de um port\xE3o de ferro sem fechadura. Marcas de tinta nas barras indicam quais pe\xE7as giram em conjunto.",
        Explora\u00E7\u00E3o: "Nichos numerados guardam caixas de entrega, ferramentas e bilhetes sem assinatura. Um mapa de turnos mostra quando cada acesso fica sem vigil\xE2ncia.",
        Desafio: "Um elevador de carga parou entre dois n\xEDveis e bloqueia o corredor. Correntes, contrapesos e uma escada lateral permitem solu\xE7\xF5es com riscos diferentes.",
        Encruzilhada: "Tr\xEAs galerias seguem sob bairros distintos. Cheiro de tinta vem da esquerda, vozes ecoam adiante e \xE1gua de chuva corre pela passagem mais baixa.",
        Segredo: "A parede atr\xE1s de um arm\xE1rio conserva a planta original do mercado. Uma anota\xE7\xE3o revela salas apagadas dos registros depois do inc\xEAndio.",
        Armadilha: "Fios presos a sinos percorrem a altura dos tornozelos e alertam postos distantes. Poeira limpa ao redor das \xE2ncoras denuncia o sistema.",
        Ref\u00FAgio: "Uma antiga sala de descanso cont\xE9m mesa, fogareiro e rotas de fuga anotadas. Canecas ainda \xFAmidas mostram que os mensageiros voltam com frequ\xEAncia.",
        Contratempo: "\xC1gua de chuva invade a galeria inferior e arrasta caixas contra as grades. O caminho seco passa por um dep\xF3sito ocupado por guardas privados.",
        Encontro: "Mensageiros armados protegem uma testemunha e confundem o grupo com agentes do cons\xF3rcio. Eles aceitam verificar nomes, selos e hist\xF3rias.",
        Revela\u00E7\u00E3o: "Os arquivos provam que o cons\xF3rcio financiou os dois lados de conflitos recentes. A reforma serve para destruir as \xFAltimas c\xF3pias dos contratos.",
        Confronto: "O engenheiro respons\xE1vel prepara fogo numa c\xE2mara de documentos. Ele oferece os laudos originais em troca de passagem e prote\xE7\xE3o contra seus empregadores.",
        Recompensa: "Um livro-caixa codificado registra pagamentos, propriedades e identidades falsas. Sua capa cont\xE9m a chave para abrir cofres de correspond\xEAncia pela cidade."
      })
    }
  },
  coast: {
    name: "Cais da Mar\xE9 de Vidro",
    setting: "ao longo do litoral, entre fal\xE9sias, enseadas, ilhas rasas e constru\xE7\xF5es castigadas pelo sal",
    texture: "Cordas molhadas rangem, gaivotas disputam restos e ondas batem sob as t\xE1buas com for\xE7a crescente.",
    inhabitants: "Pescadores, barqueiros, mergulhadores, faroleiros e comerciantes acompanham ventos e mar\xE9s antes de tomar decis\xF5es.",
    regionNoun: "o litoral",
    npcRole: "piloto que conhece bancos de areia, correntes trai\xE7oeiras e sinais de tempestade",
    npcCompanion: "uma lontra treinada para recuperar cabos, chaves e pequenos objetos levados pela \xE1gua",
    location: {
      type: "Cais protegido por quebra-mares antigos, armaz\xE9ns de sal e um farol constru\xEDdo sobre a rocha.",
      landmark: "Uma lente verde no topo do farol projeta linhas sobre a \xE1gua quando a mar\xE9 alcan\xE7a o ponto mais baixo.",
      history: "O cais foi fundado por fam\xEDlias que resgataram juntas os sobreviventes de um naufr\xE1gio e dividiram a carga encontrada.",
      conflict: "Barqueiros querem fechar a enseada por seguran\xE7a; comerciantes exigem que os navios partam antes que os contratos expirem.",
      danger: "A mar\xE9 sobe por canais sob o cais e pode isolar armaz\xE9ns, romper amarras e arrastar pessoas para baixo das plataformas.",
      secret: "Registros de atraca\xE7\xE3o mostram que um navio sem bandeira descarrega caixas durante as noites em que o farol permanece apagado.",
      opportunities: "O cais oferece embarca\xE7\xF5es r\xE1pidas, mapas de correntes, mergulhadores experientes e acesso a cavernas vis\xEDveis apenas na mar\xE9 baixa.",
      hook: "O farol emitiu um sinal proibido, e uma embarca\xE7\xE3o respondeu de algum ponto al\xE9m da neblina."
    },
    quest: {
      title: "O Navio sem Bandeira",
      giver: "a faroleira respons\xE1vel pelos sinais de navega\xE7\xE3o e pelos registros de entrada na enseada",
      objective: "alcan\xE7ar o navio sem bandeira e descobrir por que ele responde a um c\xF3digo usado apenas em naufr\xE1gios",
      complication: "A embarca\xE7\xE3o est\xE1 presa num banco de areia que desaparecer\xE1 sob v\xE1rios metros de \xE1gua quando a mar\xE9 virar.",
      context: "Tr\xEAs barcos de pesca sumiram depois de seguir o mesmo sinal, e as fam\xEDlias recusam novas buscas sem uma explica\xE7\xE3o.",
      stages: "Confirmar o c\xF3digo enviado pelo farol; atravessar a neblina antes da mudan\xE7a da mar\xE9; abordar o navio e decidir o destino de sua carga.",
      opposition: "Contrabandistas mant\xEAm tripulantes como ref\xE9ns e usam falsos pedidos de socorro para afastar patrulhas do cais.",
      escalation: "A mar\xE9 cobre rotas de retorno, a neblina reduz a visibilidade e uma tempestade empurra o navio contra os recifes.",
      failure: "O navio afunda com provas e ref\xE9ns, enquanto os contrabandistas continuam usando o sinal para controlar a enseada.",
      alternative: "Responder ao c\xF3digo com uma mensagem falsa pode atrair o comando dos contrabandistas at\xE9 uma \xE1rea preparada para negocia\xE7\xE3o.",
      reward: "Direito de passagem nos barcos locais, uma b\xFAssola ajustada \xE0s correntes e parte legal da carga recuperada."
    },
    encounter: {
      title: "O Barco sob o Cais",
      situation: "Batidas regulares ecoam sob as plataformas. Pescadores afirmam que v\xEAm de um barco preso nas estacas, mas ningu\xE9m consegue v\xEA-lo.",
      threat: "A mar\xE9 sobe e comprime a embarca\xE7\xE3o contra a estrutura, amea\xE7ando derrubar parte do cais sobre quem estiver dentro.",
      twist: "Os ocupantes esconderam o barco de prop\xF3sito porque transportam uma testemunha perseguida pelos guardas do porto.",
      choice: "O grupo pode libertar o barco, entregar os ocupantes ou ganhar tempo enquanto investiga por que a testemunha \xE9 procurada.",
      setup: "\xC1gua gelada cobre degraus, t\xE1buas se curvam e cada onda desloca o casco alguns cent\xEDmetros.",
      actors: "Pescadores querem salvar o cais; guardas procuram contrabandistas; os ocupantes protegem uma pessoa que carrega registros do porto.",
      escalation: "Uma amarra se rompe, o barco gira sob a plataforma e guardas fecham as sa\xEDdas em terra.",
      interaction: "Cabos, guinchos, boias, barcos menores e a abertura controlada de uma se\xE7\xE3o do cais podem mudar o risco.",
      outcomes: "Salvar todos preserva o cais e exp\xF5e os registros. Entregar os ocupantes encerra o perigo imediato, mas a prova desaparece sob cust\xF3dia.",
      aftermath: "Um compartimento quebrado libera moedas cobertas pelo selo de um navio declarado perdido muitos anos antes."
    },
    rumor: {
      subject: "O sino debaixo da mar\xE9",
      claim: "Nas noites sem vento, um sino toca sob a \xE1gua e cada badalada anuncia o retorno de um navio que nunca chegou ao porto.",
      truth: "O sino pertence a uma torre submersa e \xE9 acionado por correntes alteradas depois que mergulhadores removeram parte de sua estrutura.",
      source: "Uma barqueira contou as badaladas e percebeu que sempre come\xE7am pouco antes de caixas clandestinas aparecerem na praia.",
      variations: "Alguns associam cada toque a um naufr\xE1gio; outros juram ver luzes movendo-se sob a superf\xEDcie.",
      clues: "Fragmentos de bronze, cordas novas e marcas de arrasto aparecem na praia ap\xF3s as noites em que o sino toca.",
      interested: "Mergulhadores buscam o restante da torre; contrabandistas usam o som para coordenar entregas; fam\xEDlias querem respostas sobre navios perdidos.",
      consequence: "Mergulhar at\xE9 a torre revela a rota das caixas e desperta a aten\xE7\xE3o de quem vigia o local a partir das fal\xE9sias.",
      context: "O boato voltou quando uma crian\xE7a encontrou na praia um sino de m\xE3o com o nome de um navio desaparecido."
    },
    dungeon: {
      name: "Torre sob a Mar\xE9",
      overview: "Uma torre inclinada e cavernas conectadas ficam acess\xEDveis durante poucas horas. Contrabandistas removeram suportes antigos e desestabilizaram c\xE2maras cheias de \xE1gua.",
      rooms: completeRooms({
        Entrada: "Degraus cobertos de cracas descem quando a mar\xE9 recua. Faixas sem limo indicam at\xE9 onde a \xE1gua voltar\xE1 e quais apoios foram usados recentemente.",
        Explora\u00E7\u00E3o: "Uma sala de mapas conserva placas de marfim com linhas de corrente. Pe\xE7as ausentes correspondem \xE0s rotas onde navios desapareceram.",
        Desafio: "Uma galeria inundada separa duas plataformas e recebe ondas por uma fenda. Comportas laterais podem reduzir a corrente ou abrir outra c\xE2mara.",
        Encruzilhada: "Tr\xEAs passagens t\xEAm n\xEDveis de \xE1gua diferentes. Uma sobe \xE0 torre, outra segue vozes abafadas e a terceira revela luzes sob a superf\xEDcie.",
        Segredo: "Um mosaico de peixes esconde alavancas entre as escamas. A combina\xE7\xE3o correta abre um dep\xF3sito seco com registros de antigos faroleiros.",
        Armadilha: "Uma porta estanque libera \xE1gua quando aberta sem equalizar a press\xE3o. Gotas nas juntas e uma roda travada anunciam o perigo.",
        Ref\u00FAgio: "Uma bolsa de ar permanece numa c\xE2mara alta com bancos de pedra e velas recentes. Marcas na parede contam o tempo seguro at\xE9 a mar\xE9.",
        Contratempo: "A \xE1gua cobre a escada de retorno antes do previsto. Uma abertura na parede conduz para cima, mas exige abandonar equipamentos volumosos.",
        Encontro: "Mergulhadores rivais protegem um companheiro ferido e um sino retirado da torre. Eles negociam rem\xE9dios, informa\xE7\xE3o e ajuda para sair.",
        Revela\u00E7\u00E3o: "Os mapas mostram que os naufr\xE1gios ocorreram ap\xF3s altera\xE7\xF5es deliberadas nos sinais do farol. A torre servia para conferir c\xF3digos, n\xE3o para produzi-los.",
        Confronto: "A chefe dos contrabandistas tenta desprender a lente central enquanto a c\xE2mara alaga. Ela possui ref\xE9ns e conhece a \xFAnica sa\xEDda ainda seca.",
        Recompensa: "Uma b\xFAssola de marfim aponta para sinais luminosos, n\xE3o para o norte. Os registros pr\xF3ximos identificam quem alterou o farol e comprou as cargas roubadas."
      })
    }
  },
  ruins: {
    name: "P\xE1tio da Coroa Rachada",
    setting: "entre sal\xF5es desabados, muralhas partidas e monumentos cobertos por cinza e vegeta\xE7\xE3o",
    texture: "Pedras soltas estalam sob os p\xE9s, mosaicos aparecem entre a poeira e ecos atravessam paredes que j\xE1 n\xE3o existem.",
    inhabitants: "Escavadores, fam\xEDlias deslocadas, estudiosos, vigias e saqueadores ocupam setores diferentes das ru\xEDnas.",
    regionNoun: "as ru\xEDnas",
    npcRole: "explorador que reconhece t\xE9cnicas de constru\xE7\xE3o, s\xEDmbolos de risco e sinais de desabamento",
    npcCompanion: "um pequeno lagarto de pedra que desperta perto de inscri\xE7\xF5es antigas e procura superf\xEDcies aquecidas",
    location: {
      type: "P\xE1tio cerimonial cercado por colunas quebradas, abrigos improvisados e entradas para n\xEDveis soterrados.",
      landmark: "Uma coroa de pedra partida ao meio permanece suspensa por correntes sobre o mosaico central.",
      history: "O p\xE1tio era usado para juramentos p\xFAblicos at\xE9 que uma disputa sucess\xF3ria dividiu a cidade e terminou com o abandono do complexo.",
      conflict: "Fam\xEDlias usam os sal\xF5es como moradia; estudiosos querem isolar a \xE1rea; saqueadores vendem pe\xE7as retiradas das estruturas ainda ocupadas.",
      danger: "Escava\xE7\xF5es recentes removeram suportes e criaram rachaduras que atravessam pisos, paredes e cisternas antigas.",
      secret: "O mosaico registra um acordo de sucess\xE3o diferente daquele preservado pelos cronistas e reconhece uma linhagem apagada.",
      opportunities: "As ru\xEDnas oferecem abrigo, artefatos hist\xF3ricos, rotas subterr\xE2neas e documentos capazes de alterar disputas atuais.",
      hook: "A metade desaparecida da coroa surgiu num mercado pr\xF3ximo, ainda coberta por argamassa fresca."
    },
    quest: {
      title: "A Metade da Coroa",
      giver: "uma representante das fam\xEDlias abrigadas nas ru\xEDnas e respons\xE1vel por negociar com estudiosos",
      objective: "recuperar a metade da coroa e descobrir de qual setor ela foi retirada antes que a estrutura desabe",
      complication: "O comprador da pe\xE7a possui autoriza\xE7\xE3o oficial, mas o documento descreve uma escava\xE7\xE3o em outro ponto das ru\xEDnas.",
      context: "A retirada abriu uma rachadura sob os abrigos e pode destruir provas hist\xF3ricas junto com as moradias.",
      stages: "Rastrear a venda da pe\xE7a; identificar a escava\xE7\xE3o clandestina; estabilizar o setor e decidir onde a coroa deve permanecer.",
      opposition: "Um colecionador financia saqueadores, autoridades e falsos laudos para transformar patrim\xF4nio p\xFAblico em propriedade particular.",
      escalation: "Cada tremor derruba outra passagem e for\xE7a fam\xEDlias a se concentrarem em sal\xF5es cada vez mais fr\xE1geis.",
      failure: "O setor desaba, as fam\xEDlias perdem o abrigo e o colecionador culpa os moradores pela destrui\xE7\xE3o das provas.",
      alternative: "Expor os laudos falsos e organizar uma escava\xE7\xE3o p\xFAblica pode obrigar o comprador a devolver a pe\xE7a sem confronto.",
      reward: "Direito de consultar os arquivos encontrados, abrigo seguro nas ru\xEDnas e uma rel\xEDquia legalmente cedida pelas fam\xEDlias."
    },
    encounter: {
      title: "O Muro que se Lembra",
      situation: "Um trecho de muralha repete em voz alta frases pronunciadas diante dele. Uma multid\xE3o se re\xFAne para ouvir o depoimento de algu\xE9m morto h\xE1 s\xE9culos.",
      threat: "As vibra\xE7\xF5es soltam pedras do arco superior, e pessoas se empurram para chegar mais perto da parede.",
      twist: "Uma estudiosa manipula a ordem das frases com batidas discretas para produzir uma acusa\xE7\xE3o conveniente.",
      choice: "O grupo pode dispersar a multid\xE3o, revelar a manipula\xE7\xE3o ou usar o mecanismo para recuperar o restante do depoimento.",
      setup: "Cada palavra ecoa por sal\xF5es vazios, poeira cai das juntas e o arco range quando a multid\xE3o responde.",
      actors: "Moradores buscam justi\xE7a, estudiosos disputam interpreta\xE7\xE3o, guardas protegem a \xE1rea e a manipuladora tenta concluir sua demonstra\xE7\xE3o.",
      escalation: "Uma frase menciona uma fam\xEDlia presente, provoca acusa\xE7\xF5es e leva os guardas a fechar a sa\xEDda principal.",
      interaction: "Batidas, posi\xE7\xE3o diante do muro, objetos de metal e o bloqueio de determinadas cavidades alteram as frases reproduzidas.",
      outcomes: "Recuperar o depoimento completo revela um fato hist\xF3rico. Derrubar a parte inst\xE1vel salva a multid\xE3o, mas destr\xF3i parte da mem\xF3ria.",
      aftermath: "Atr\xE1s de uma pedra solta aparece um compartimento com o instrumento usado para registrar as vozes originais."
    },
    rumor: {
      subject: "A rainha sem rosto",
      claim: "Viajantes dizem que uma figura coroada percorre as ru\xEDnas ao entardecer e apaga o rosto de est\xE1tuas que pronunciam seu verdadeiro nome.",
      truth: "Algu\xE9m remove tra\xE7os espec\xEDficos das est\xE1tuas para ocultar a linhagem representada no mosaico central.",
      source: "Uma vigia viu a figura trabalhando e encontrou p\xF3 de pedra, ferramentas finas e uma lista de monumentos.",
      variations: "Alguns descrevem um esp\xEDrito; outros falam numa pessoa mascarada ou em v\xE1rias figuras usando o mesmo manto.",
      clues: "As est\xE1tuas danificadas pertencem ao mesmo per\xEDodo, e todas conservam marcas de um cinzel fabricado recentemente.",
      interested: "Herdeiros, estudiosos e colecionadores procuram controlar a interpreta\xE7\xE3o da linhagem apagada.",
      consequence: "Vigiar a pr\xF3xima est\xE1tua revela a pessoa respons\xE1vel e exp\xF5e documentos que ligam a destrui\xE7\xE3o a uma autoridade atual.",
      context: "O boato come\xE7ou depois que nomes antigos reapareceram em documentos encontrados sob os abrigos das fam\xEDlias."
    },
    dungeon: {
      name: "Arquivo da Coroa Partida",
      overview: "Sal\xF5es administrativos, cofres e passagens de servi\xE7o sobrevivem sob o p\xE1tio. Saqueadores retiraram suportes e libertaram mecanismos criados para proteger documentos.",
      rooms: completeRooms({
        Entrada: "Uma rampa soterrada termina em portas de bronze deformadas. Escoras recentes sustentam o teto, e n\xFAmeros pintados indicam a ordem segura de remov\xEA-las.",
        Explora\u00E7\u00E3o: "Estantes tombadas dividem um arquivo coberto de p\xF3. Selos, datas e espa\xE7os vazios mostram quais documentos foram procurados primeiro.",
        Desafio: "O piso de mosaico cede sobre uma c\xE2mara inferior. Distribuir peso pelas figuras intactas permite atravessar sem destruir as imagens restantes.",
        Encruzilhada: "Tr\xEAs corredores exibem bras\xF5es diferentes. Um est\xE1 refor\xE7ado, outro recebe ar fresco e o terceiro cont\xE9m rastros de caixas arrastadas.",
        Segredo: "Uma sequ\xEAncia de nomes repetidos abre o painel atr\xE1s do registro de sucess\xE3o. O nicho guarda a vers\xE3o que foi retirada das cr\xF4nicas oficiais.",
        Armadilha: "Pesos de pedra caem quando documentos s\xE3o retirados sem substitui\xE7\xE3o. T\xE1buas quebradas e pilhas de cascalho revelam o padr\xE3o dos disparos anteriores.",
        Ref\u00FAgio: "Uma sala de escribas conserva bancos, lamparinas e \xE1gua em jarros lacrados. Anota\xE7\xF5es recentes indicam turnos de saqueadores e pontos fr\xE1geis.",
        Contratempo: "Uma coluna se desloca e bloqueia a rota de retorno. Um duto estreito contorna o desabamento, mas passa sobre o arquivo principal.",
        Encontro: "Fam\xEDlias escondidas protegem documentos retirados dos saqueadores. Elas temem estudiosos e exigem garantias antes de mostrar o material.",
        Revela\u00E7\u00E3o: "Os registros provam que a cidade n\xE3o caiu numa batalha; seus l\xEDderes ordenaram a evacua\xE7\xE3o ap\xF3s romper o acordo de sucess\xE3o.",
        Confronto: "O financiador da escava\xE7\xE3o tenta remover o cofre central com roldanas. O esfor\xE7o amea\xE7a derrubar o p\xE1tio onde as fam\xEDlias est\xE3o abrigadas.",
        Recompensa: "O cofre cont\xE9m a matriz dos selos reais e cartas que reconhecem a linhagem apagada. Uma pe\xE7a menor permite autenticar outros documentos antigos."
      })
    }
  },
  underground: {
    name: "C\xE2mara do Eco Profundo",
    setting: "sob a terra, entre minas antigas, cisternas, pontes estreitas e t\xFAneis sem luz natural",
    texture: "Gotas marcam o tempo, correntes de ar atravessam fendas e fungos p\xE1lidos desenham bordas ao longo das paredes.",
    inhabitants: "Mineiros, carregadores, comunidades profundas, exploradores e criaturas adaptadas \xE0 escurid\xE3o conhecem setores diferentes.",
    regionNoun: "os t\xFAneis subterr\xE2neos",
    npcRole: "prospector que interpreta ecos, correntes de ar e rachaduras antes de escolher uma passagem",
    npcCompanion: "um besouro luminoso criado numa caixa ventilada e treinado para reagir a gases perigosos",
    location: {
      type: "Esta\xE7\xE3o subterr\xE2nea constru\xEDda onde t\xFAneis de minera\xE7\xE3o encontram uma cisterna e uma antiga via de transporte.",
      landmark: "Um conjunto de placas met\xE1licas transforma ecos em notas diferentes e indica quando alguma galeria muda de forma.",
      history: "A esta\xE7\xE3o foi aberta por comunidades que precisavam compartilhar \xE1gua, ventila\xE7\xE3o e rotas de fuga durante uma longa interdi\xE7\xE3o da superf\xEDcie.",
      conflict: "Mineiros querem reabrir uma galeria produtiva; moradores afirmam que as escava\xE7\xF5es enfraquecem a cisterna e contaminam o ar.",
      danger: "Gases sem cheiro acumulam-se nas partes baixas, enquanto vibra\xE7\xF5es recentes desprendem lascas do teto.",
      secret: "Os registros de ventila\xE7\xE3o mostram desvios noturnos de ar para uma instala\xE7\xE3o que n\xE3o aparece em nenhuma planta.",
      opportunities: "A esta\xE7\xE3o oferece \xE1gua filtrada, ferramentas, guias, acesso a rotas profundas e minerais usados para produzir luz duradoura.",
      hook: "As placas de eco come\xE7aram a tocar uma nota reservada a desabamentos, embora nenhuma galeria conhecida tenha cedido."
    },
    quest: {
      title: "O Ar Roubado",
      giver: "a respons\xE1vel pela ventila\xE7\xE3o, escolhida por mineiros e fam\xEDlias da esta\xE7\xE3o",
      objective: "localizar a galeria ausente das plantas e interromper o desvio de ar antes da troca de turno",
      complication: "O fluxo roubado mant\xE9m vivas pessoas instaladas numa se\xE7\xE3o isolada que a administra\xE7\xE3o declarou vazia.",
      context: "Fechar o desvio protege a esta\xE7\xE3o, mas condena os ocupantes ocultos; mant\xEA-lo aberto exp\xF5e centenas de pessoas aos gases.",
      stages: "Comparar registros de eco e ventila\xE7\xE3o; atravessar as galerias baixas; encontrar a instala\xE7\xE3o oculta e criar uma divis\xE3o segura do ar.",
      opposition: "Supervisores escondem trabalhadores sem registro e desviam recursos para manter uma opera\xE7\xE3o de minera\xE7\xE3o clandestina.",
      escalation: "A qualidade do ar piora por setores, as luzes enfraquecem e o pr\xF3ximo turno entra nos t\xFAneis sem conhecer o risco.",
      failure: "A esta\xE7\xE3o \xE9 evacuada \xE0s pressas, trabalhadores ficam presos e a opera\xE7\xE3o clandestina sela as provas atr\xE1s de um desabamento.",
      alternative: "Abrir uma chamin\xE9 antiga at\xE9 a superf\xEDcie pode ventilar os dois setores, mas revela a instala\xE7\xE3o para quem controla a regi\xE3o acima.",
      reward: "Cristais de luz, ferramentas de escava\xE7\xE3o, acesso \xE0s rotas profundas e apoio das comunidades resgatadas."
    },
    encounter: {
      title: "A \xDAltima L\xE2mpada",
      situation: "Mineiros e fam\xEDlias disputam a \xFAltima caixa de cristais luminosos enquanto uma equipe permanece presa numa galeria escura.",
      threat: "As luzes instaladas apagam uma a uma, e algo se move nas \xE1reas que ficam sem ilumina\xE7\xE3o.",
      twist: "A criatura atra\xEDda pela escurid\xE3o foge de vibra\xE7\xF5es; os gritos e golpes usados para afast\xE1-la apenas a conduzem at\xE9 as pessoas.",
      choice: "O grupo pode levar os cristais ao resgate, iluminar a esta\xE7\xE3o ou criar um caminho de vibra\xE7\xF5es para afastar a criatura.",
      setup: "O brilho azul diminui, vozes ecoam de t\xFAneis diferentes e cada pessoa segura sua fonte de luz junto ao corpo.",
      actors: "Mineiros querem resgatar colegas; fam\xEDlias protegem crian\xE7as; a respons\xE1vel pelo estoque procura uma solu\xE7\xE3o que n\xE3o abandone nenhum setor.",
      escalation: "Uma luz cai e se quebra, a criatura muda de dire\xE7\xE3o e uma passagem lateral come\xE7a a ceder.",
      interaction: "Placas de eco, carrinhos, trilhos, ferramentas e cristais quebrados permitem controlar som, movimento e ilumina\xE7\xE3o.",
      outcomes: "Coordenar os presentes permite o resgate e preserva parte da luz. Priorizar um setor salva vidas agora, mas rompe a confian\xE7a da esta\xE7\xE3o.",
      aftermath: "A criatura deixa presa ao corpo uma etiqueta met\xE1lica usada apenas na instala\xE7\xE3o que n\xE3o aparece nas plantas."
    },
    rumor: {
      subject: "A esta\xE7\xE3o abaixo da esta\xE7\xE3o",
      claim: "Mineiros dizem ouvir outro turno trabalhando sob a cisterna, embora as plantas mostrem apenas rocha maci\xE7a naquele n\xEDvel.",
      truth: "Uma instala\xE7\xE3o clandestina funciona abaixo da esta\xE7\xE3o e transmite vibra\xE7\xF5es pelos antigos trilhos de carga.",
      source: "Uma operadora de guincho reconheceu a sequ\xEAncia de golpes usada para anunciar troca de equipe e respondeu sem receber retorno.",
      variations: "Alguns falam em mineiros mortos; outros descrevem m\xE1quinas, cantos ou pedidos de socorro sob a \xE1gua.",
      clues: "Poeira recente sobe por fendas, o n\xEDvel da cisterna baixa durante a noite e ferramentas somem sempre no mesmo turno.",
      interested: "Fam\xEDlias procuram desaparecidos; supervisores escondem a opera\xE7\xE3o; comerciantes desejam acesso ao min\xE9rio extra\xEDdo.",
      consequence: "Seguir as vibra\xE7\xF5es revela uma entrada t\xE9cnica e faz os respons\xE1veis anteciparem o fechamento da instala\xE7\xE3o.",
      context: "O boato existe h\xE1 meses, mas ganhou urg\xEAncia quando uma resposta correta veio de baixo durante um teste de seguran\xE7a."
    },
    dungeon: {
      name: "Esta\xE7\xE3o sob a Cisterna",
      overview: "Uma instala\xE7\xE3o clandestina ocupa galerias de manuten\xE7\xE3o e po\xE7os abandonados. O desvio de ventila\xE7\xE3o mant\xE9m trabalhadores presos e desperta algo sens\xEDvel a vibra\xE7\xF5es.",
      rooms: completeRooms({
        Entrada: "Uma grade atr\xE1s da cisterna esconde degraus que descem junto aos canos. Parafusos polidos e marcas de luva mostram que ela \xE9 aberta regularmente.",
        Explora\u00E7\u00E3o: "Um posto de controle registra fluxo de ar, turnos e consumo de \xE1gua. N\xFAmeros alterados \xE0 m\xE3o revelam um grupo n\xE3o inclu\xEDdo nas listas oficiais.",
        Desafio: "Uma ponte de trilhos cruza um po\xE7o sem fundo vis\xEDvel. Travessas danificadas podem ser refor\xE7adas ou o carrinho pode servir de contrapeso.",
        Encruzilhada: "Tr\xEAs galerias conduzem ar em dire\xE7\xF5es diferentes. Uma leva vozes, outra recebe calor e a terceira cont\xE9m pegadas que terminam diante da parede.",
        Segredo: "Placas de eco ocultam uma alavanca afinada para responder a uma nota espec\xEDfica. O painel aberto revela mapas e nomes de trabalhadores clandestinos.",
        Armadilha: "Uma v\xE1lvula libera g\xE1s quando a porta seguinte \xE9 for\xE7ada. Besouros im\xF3veis, chama reduzida e um aviso raspado tornam o risco percept\xEDvel.",
        Ref\u00FAgio: "Uma c\xE2mara ventilada conserva macas, \xE1gua e cristais de luz. Um di\xE1rio registra falhas recentes e uma rota de emerg\xEAncia ainda desobstru\xEDda.",
        Contratempo: "Um tremor desloca os trilhos e fecha a passagem de retorno. Um po\xE7o de ventila\xE7\xE3o oferece sa\xEDda, mas sobe perto das m\xE1quinas em funcionamento.",
        Encontro: "Trabalhadores exaustos guardam ferramentas como armas e acreditam que o grupo veio selar a galeria. Eles precisam de ar, comida e prova contra os supervisores.",
        Revela\u00E7\u00E3o: "Os mapas mostram que a extra\xE7\xE3o perfurou a parede de uma cavidade maior. As vibra\xE7\xF5es da opera\xE7\xE3o despertaram a criatura que agora ronda a esta\xE7\xE3o.",
        Confronto: "O supervisor tenta explodir a liga\xE7\xE3o com a instala\xE7\xE3o e abandonar trabalhadores e provas. Os detonadores tamb\xE9m sustentam parte do sistema de ventila\xE7\xE3o.",
        Recompensa: "Um diapas\xE3o mineral localiza vazios e fontes de ar atrav\xE9s da pedra. Os livros pr\xF3ximos registram toda a opera\xE7\xE3o e seus financiadores."
      })
    }
  }
};

// src/catalogs/pt-BR/tones.ts
var TONE_WRITING = {
  grim: {
    npcFrame: "uma perda que ningu\xE9m conseguiu reparar",
    npcColor: "contido, atento e marcado por noites mal dormidas",
    npcMotive: "impedir que outra fam\xEDlia pague pelo mesmo erro",
    npcPressure: "A comunidade exige uma resposta, embora j\xE1 tenha escolhido um culpado conveniente.",
    npcThreat: "uma decis\xE3o antiga ainda amea\xE7a pessoas que n\xE3o participaram dela",
    locationMood: "As conversas cessam quando algu\xE9m menciona os desaparecidos, e todas as portas s\xE3o fechadas antes do anoitecer.",
    locationLandmark: "Nomes riscados na superf\xEDcie lembram quem n\xE3o voltou para casa.",
    locationHook: "Os moradores pedem ajuda porque a pr\xF3xima perda j\xE1 pode ser prevista.",
    locationPressure: "O medo transforma vizinhos em acusadores e torna qualquer demora mais perigosa.",
    locationSecret: "A verdade n\xE3o inocenta todos, mas prova que o sacrif\xEDcio mais recente poderia ter sido evitado.",
    questComplication: "O contratante omitiu uma morte ocorrida na primeira tentativa de cumprir a miss\xE3o.",
    questReward: "A recompensa inclui repara\xE7\xE3o para quem sofreu as consequ\xEAncias do conflito.",
    questContext: "A miss\xE3o come\xE7a tarde demais para impedir todo o dano, mas ainda h\xE1 tempo para proteger os sobreviventes.",
    questOpposition: "A oposi\xE7\xE3o prefere destruir a prova a admitir que se beneficiou da trag\xE9dia.",
    questEscalation: "Cada atraso elimina uma rota de fuga e coloca outra pessoa sob suspeita.",
    questFailure: "Se o grupo falhar, a comunidade repetir\xE1 a solu\xE7\xE3o cruel que adotou da \xFAltima vez.",
    questAlternative: "Uma confiss\xE3o p\xFAblica pode encerrar a persegui\xE7\xE3o, desde que algu\xE9m aceite responder pelo que fez.",
    encounterPressure: "Uma pessoa ferida perde for\xE7as enquanto os presentes discutem quem merece ser salvo.",
    encounterTwist: "O respons\xE1vel imediato agiu para proteger algu\xE9m e agora n\xE3o consegue recuar sem expor essa pessoa.",
    encounterChoice: "Qualquer solu\xE7\xE3o preserva uma vida e abandona outra necessidade urgente.",
    encounterEscalation: "O p\xE2nico se espalha, e antigos ressentimentos passam a orientar as a\xE7\xF5es dos envolvidos.",
    encounterAftermath: "Mesmo uma vit\xF3ria deixa um nome a ser lembrado e uma d\xEDvida que n\xE3o desaparece.",
    rumorClaim: "Quem conta a hist\xF3ria sempre acrescenta uma v\xEDtima, porque o medo tornou o exagero mais convincente que os fatos.",
    rumorTruth: "O n\xFAcleo do relato \xE9 verdadeiro, mas sua causa exp\xF5e uma tentativa desesperada de evitar uma perda maior.",
    rumorInterested: "Uma autoridade alimenta o boato para desviar a culpa de decis\xF5es recentes.",
    rumorConsequence: "A investiga\xE7\xE3o salva poss\xEDveis v\xEDtimas, mas for\xE7a a comunidade a reconhecer sua participa\xE7\xE3o no problema.",
    rumorContext: "O boato se espalha em funerais, filas de racionamento e conversas mantidas longe das autoridades.",
    dungeonTheme: "Vest\xEDgios de uma escolha cruel",
    dungeonOverview: "Cada setor revela quem foi sacrificado para manter o lugar funcionando e quem ainda lucra com esse sil\xEAncio.",
    dungeonRoom: "Sinais recentes mostram que o perigo continua ativo e que algu\xE9m ser\xE1 atingido se o grupo simplesmente recuar."
  },
  whimsical: {
    npcFrame: "uma confus\xE3o que ganhou regras pr\xF3prias",
    npcColor: "cordial, inquieto e cheio de h\xE1bitos dif\xEDceis de explicar",
    npcMotive: "resolver a trapalhada antes que algu\xE9m a transforme em tradi\xE7\xE3o",
    npcPressure: "Cada tentativa de simplificar o problema cria uma exce\xE7\xE3o ainda mais inconveniente.",
    npcThreat: "uma cadeia de mal-entendidos j\xE1 mobiliza gente demais",
    locationMood: "Objetos trocam de lugar sem ajuda, placas contradizem umas \xE0s outras e os moradores tratam o absurdo como parte da rotina.",
    locationLandmark: "O marco ainda cumpre uma fun\xE7\xE3o pr\xE1tica, embora cada morador ofere\xE7a uma explica\xE7\xE3o diferente e igualmente improv\xE1vel.",
    locationHook: "Os habitantes procuram algu\xE9m de fora porque todas as solu\xE7\xF5es locais j\xE1 viraram parte do problema.",
    locationPressure: "Duas regras igualmente rid\xEDculas entram em vigor ao mesmo tempo e ningu\xE9m aceita suspend\xEA-las.",
    locationSecret: "A explica\xE7\xE3o \xE9 simples, por\xE9m t\xE3o constrangedora que tr\xEAs pessoas preferem sustentar o mist\xE9rio.",
    questComplication: "O objeto ou a pessoa procurada foi registrado com tr\xEAs nomes diferentes e entregue ao destinat\xE1rio errado.",
    questReward: "Al\xE9m do pagamento, o grupo recebe um favor surpreendentemente \xFAtil de algu\xE9m improv\xE1vel.",
    questContext: "A miss\xE3o come\xE7ou como uma tarefa banal e cresceu porque cada participante tentou corrigir o erro sem consultar os demais.",
    questOpposition: "A oposi\xE7\xE3o explora a confus\xE3o entre registros, ordens e responsabilidades para continuar agindo sem assumir a culpa.",
    questEscalation: "Novos curiosos chegam, repetem instru\xE7\xF5es incompletas e transformam o problema em espet\xE1culo p\xFAblico.",
    questFailure: "Se ningu\xE9m intervier, a solu\xE7\xE3o improvisada ser\xE1 oficializada e passar\xE1 a ser aplicada a todos.",
    questAlternative: "O impasse pode terminar com uma demonstra\xE7\xE3o p\xFAblica que exponha a contradi\xE7\xE3o sem humilhar seus respons\xE1veis.",
    encounterPressure: "A solu\xE7\xE3o que parece mais \xF3bvia cria um segundo problema sempre que algu\xE9m a executa sem coordenar os presentes.",
    encounterTwist: "A aparente confus\xE3o resulta de v\xE1rias decis\xF5es compreens\xEDveis tomadas sem que seus respons\xE1veis conversassem entre si.",
    encounterChoice: "O grupo pode restaurar a ordem anterior ou aproveitar a confus\xE3o para criar uma solu\xE7\xE3o melhor.",
    encounterEscalation: "Cada interven\xE7\xE3o bem-intencionada cria um novo obst\xE1culo at\xE9 que os presentes coordenem suas a\xE7\xF5es.",
    encounterAftermath: "A hist\xF3ria ser\xE1 contada por anos, embora ningu\xE9m concorde sobre quem realmente resolveu a situa\xE7\xE3o.",
    rumorClaim: "A vers\xE3o mais popular acrescenta um detalhe imposs\xEDvel porque ele torna a hist\xF3ria muito melhor.",
    rumorTruth: "O acontecimento central \xE9 real; a explica\xE7\xE3o envolve erros acumulados e interesses menores, n\xE3o a grande conspira\xE7\xE3o descrita nas vers\xF5es populares.",
    rumorInterested: "Artistas, comerciantes e autoridades disputam o direito de apresentar a vers\xE3o oficial.",
    rumorConsequence: "Investigar encerra a confus\xE3o, mas tamb\xE9m destr\xF3i uma oportunidade lucrativa para parte da comunidade.",
    rumorContext: "O boato circula em can\xE7\xF5es, desenhos apressados e apostas sobre qual ser\xE1 o pr\xF3ximo acontecimento absurdo.",
    dungeonTheme: "Engrenagens de um erro magn\xEDfico",
    dungeonOverview: "O complexo foi adaptado tantas vezes que cada solu\xE7\xE3o engenhosa interfere em outra sala de maneira inesperada.",
    dungeonRoom: "O perigo \xE9 evidente o bastante para ser levado a s\xE9rio, embora seu funcionamento revele uma l\xF3gica deliciosamente equivocada."
  },
  heroic: {
    npcFrame: "uma oportunidade concreta de proteger a regi\xE3o",
    npcColor: "franco, disciplinado e disposto a dividir responsabilidades",
    npcMotive: "garantir que outras pessoas possam escolher o pr\xF3prio futuro",
    npcPressure: "A comunidade precisa de um exemplo de coragem que n\xE3o dependa de sacrif\xEDcios in\xFAteis.",
    npcThreat: "uma for\xE7a organizada avan\xE7a sobre quem n\xE3o consegue se defender",
    locationMood: "Bandeiras remendadas continuam erguidas, e os moradores transformam cada espa\xE7o dispon\xEDvel em abrigo, oficina ou posto de vigia.",
    locationLandmark: "Sinais de reparos sucessivos mostram que muitas pessoas contribu\xEDram para manter o marco de p\xE9.",
    locationHook: "Os habitantes sabem o que precisa ser feito, mas n\xE3o t\xEAm gente suficiente para agir em todas as frentes.",
    locationPressure: "Duas medidas necess\xE1rias competem pelos mesmos recursos e exigem uma decis\xE3o transparente.",
    locationSecret: "Os registros p\xFAblicos omitiram a contribui\xE7\xE3o de pessoas cuja participa\xE7\xE3o ainda pode alterar a disputa atual.",
    questComplication: "A miss\xE3o exige proteger tamb\xE9m quem se op\xF4s ao contratante e agora est\xE1 preso na mesma amea\xE7a.",
    questReward: "A recompensa fortalece a comunidade e concede ao grupo apoio para uma causa futura.",
    questContext: "O pedido oferece uma chance real de proteger a regi\xE3o e provar que a coopera\xE7\xE3o continua poss\xEDvel sob press\xE3o.",
    questOpposition: "A oposi\xE7\xE3o controla recursos e informa\xE7\xE3o, mas perde apoio sempre que o grupo protege algu\xE9m sem exigir lealdade.",
    questEscalation: "A amea\xE7a concentra for\xE7as contra o ponto mais vulner\xE1vel e obriga os aliados a coordenar suas a\xE7\xF5es.",
    questFailure: "Se o grupo falhar, a regi\xE3o continuar\xE1 reagindo, por\xE9m com menos recursos, coordena\xE7\xE3o e confian\xE7a.",
    questAlternative: "Unir grupos rivais em torno de uma a\xE7\xE3o comum pode alcan\xE7ar o objetivo sem uma vit\xF3ria militar.",
    encounterPressure: "Pessoas vulner\xE1veis est\xE3o no caminho da amea\xE7a e precisam de uma rota segura agora.",
    encounterTwist: "Uma pessoa ligada \xE0 oposi\xE7\xE3o tenta proteger inocentes, mesmo que isso signifique desobedecer aos pr\xF3prios aliados.",
    encounterChoice: "O grupo decide entre conter a amea\xE7a, conduzir a evacua\xE7\xE3o ou conquistar um aliado importante.",
    encounterEscalation: "A oposi\xE7\xE3o testa as defesas em v\xE1rios pontos e tenta separar quem trabalha em conjunto.",
    encounterAftermath: "O resultado se torna exemplo para outras comunidades, que passam a esperar uma posi\xE7\xE3o clara do grupo.",
    rumorClaim: "A hist\xF3ria \xE9 repetida como prova de que a regi\xE3o ainda consegue enfrentar seus perigos quando age em conjunto.",
    rumorTruth: "A parte verific\xE1vel do relato oferece uma vantagem concreta a quem compartilhar informa\xE7\xF5es e coordenar esfor\xE7os.",
    rumorInterested: "Lideran\xE7as rivais desejam associar seus nomes ao acontecimento e controlar o que ele inspira.",
    rumorConsequence: "A investiga\xE7\xE3o revela aliados esquecidos e oferece \xE0 comunidade uma forma mais honesta de organizar a pr\xF3xima a\xE7\xE3o.",
    rumorContext: "O boato circula entre vigias, mensageiros e fam\xEDlias que procuram raz\xF5es para continuar resistindo.",
    dungeonTheme: "Provas deixadas por quem resistiu",
    dungeonOverview: "As salas preservam recursos, rotas e decis\xF5es de pessoas que defenderam o lugar sem esperar resgate.",
    dungeonRoom: "Cada obst\xE1culo pode ser vencido pela coopera\xE7\xE3o e oferece uma vantagem concreta para quem protege os demais."
  },
  mysterious: {
    npcFrame: "um padr\xE3o que aparece em acontecimentos separados",
    npcColor: "reservado, preciso e atento a detalhes que os outros ignoram",
    npcMotive: "compreender o padr\xE3o antes que sua \xFAltima etapa se complete",
    npcPressure: "Toda resposta elimina uma hip\xF3tese e torna as possibilidades restantes mais inquietantes.",
    npcThreat: "uma presen\xE7a que se comunica por sinais e coincid\xEAncias",
    locationMood: "Sons chegam de dire\xE7\xF5es erradas, sombras repetem movimentos antigos e pequenos detalhes mudam quando deixam de ser observados.",
    locationLandmark: "Um detalhe repetido no marco parece ornamental at\xE9 ser comparado com sinais encontrados em outros pontos do lugar.",
    locationHook: "Os moradores procuram algu\xE9m sem liga\xE7\xE3o com as disputas locais para interpretar sinais que todos j\xE1 aprenderam a temer.",
    locationPressure: "Cada grupo possui uma parte da explica\xE7\xE3o e protege o pr\xF3prio fragmento como se fosse a verdade inteira.",
    locationSecret: "A evid\xEAncia aponta para algu\xE9m de fora do lugar e conecta o problema atual a acontecimentos tratados como isolados.",
    questComplication: "A prova confirma o objetivo da miss\xE3o, mas contradiz tudo o que o contratante afirmou sobre sua origem.",
    questReward: "A recompensa inclui acesso a um arquivo, uma rota ou um nome que responde a outra pergunta importante.",
    questContext: "O pedido nasce de uma sequ\xEAncia de coincid\xEAncias que deixa de parecer acidental quando colocada na ordem correta.",
    questOpposition: "A oposi\xE7\xE3o apaga conex\xF5es, troca registros e age apenas quando pode fazer cada incidente parecer isolado.",
    questEscalation: "Um novo sinal surge a cada atraso e demonstra que o padr\xE3o est\xE1 se aproximando de sua conclus\xE3o.",
    questFailure: "Se o grupo falhar, a verdade permanecer\xE1 oculta e o pr\xF3ximo acontecimento parecer\xE1 n\xE3o ter rela\xE7\xE3o com os anteriores.",
    questAlternative: "Uma solu\xE7\xE3o indireta pode usar a rotina da oposi\xE7\xE3o para faz\xEA-la revelar o que tenta esconder.",
    encounterPressure: "Algu\xE9m parece antecipar os movimentos do grupo porque observa sinais que os demais ainda n\xE3o relacionaram.",
    encounterTwist: "O que parecia uma a\xE7\xE3o deliberada \xE9 uma rea\xE7\xE3o repetida a um detalhe presente na cena.",
    encounterChoice: "O grupo decide entre interromper o fen\xF4meno, segui-lo at\xE9 a origem ou permitir que ele complete uma etapa.",
    encounterEscalation: "Detalhes desconexos passam a se repetir at\xE9 formarem uma instru\xE7\xE3o reconhec\xEDvel.",
    encounterAftermath: "O acontecimento termina sem explica\xE7\xE3o completa e deixa uma pista precisa para quem decidir continuar.",
    rumorClaim: "As vers\xF5es divergem nos nomes e motivos, mas repetem a mesma sequ\xEAncia de imagens.",
    rumorTruth: "Detalhes incompat\xEDveis vieram de testemunhas que observaram partes diferentes do mesmo processo.",
    rumorInterested: "Estudiosos e agentes discretos procuram os relatos originais antes que sejam comparados.",
    rumorConsequence: "A investiga\xE7\xE3o revela uma conex\xE3o verdadeira e faz com que a for\xE7a por tr\xE1s dela perceba o grupo.",
    rumorContext: "A hist\xF3ria aparece em margens de livros, conversas interrompidas e desenhos feitos por pessoas que nunca se encontraram.",
    dungeonTheme: "O desenho oculto entre as salas",
    dungeonOverview: "Posi\xE7\xF5es, inscri\xE7\xF5es e trajetos repetem uma sequ\xEAncia cuja finalidade s\xF3 aparece quando o complexo \xE9 observado como um todo.",
    dungeonRoom: "O detalhe mais importante n\xE3o est\xE1 escondido; ele apenas parece comum at\xE9 ser comparado com o que surgiu nas salas anteriores."
  }
};

// src/catalogs/pt-BR/variations.ts
var VARIATION_BEATS = [
  {
    id: "testemunha",
    companion: false,
    npc: "Uma testemunha procura essa pessoa porque reconheceu seu nome em uma carta interceptada.",
    location: "Uma testemunha viu algu\xE9m alterar o marco local durante a madrugada e reconheceu o bras\xE3o preso ao manto.",
    quest: "Uma testemunha entrega a prova somente se o grupo retirar sua fam\xEDlia da rota do perigo.",
    encounter: "A pessoa encurralada causou parte do problema e admite o erro se receber prote\xE7\xE3o.",
    rumor: "A \xFAnica testemunha muda pequenos detalhes a cada relato, mas nunca altera o hor\xE1rio em que tudo aconteceu.",
    dungeon: "Pegadas recentes mostram que outro grupo entrou h\xE1 poucas horas e ainda pode estar nas salas adiante."
  },
  {
    id: "vestigio",
    companion: true,
    npc: "Um vest\xEDgio encontrado em seu equipamento contradiz a vers\xE3o p\xFAblica de sua \xFAltima viagem.",
    location: "Cinzas ainda mornas revelam que o lugar foi usado depois do suposto abandono.",
    quest: "Um vest\xEDgio no caminho prova que a oposi\xE7\xE3o conhece a rota planejada e prepara uma emboscada.",
    encounter: "Os sinais de viol\xEAncia foram encenados para esconder uma fuga combinada entre dois advers\xE1rios.",
    rumor: "Um objeto deixado no local confirma a parte mais improv\xE1vel da hist\xF3ria, mas aponta para outro respons\xE1vel.",
    dungeon: "Restos de comida, cera fresca e uma corda cortada revelam que as salas n\xE3o est\xE3o abandonadas."
  },
  {
    id: "acordo",
    companion: false,
    npc: "Um acordo antigo lhe d\xE1 autoridade para negociar, embora a outra parte prefira fingir que o documento n\xE3o existe.",
    location: "Uma placa de pedra registra um acordo que ainda obriga as duas comunidades rivais.",
    quest: "O objetivo pode ser alcan\xE7ado sem confronto se o grupo provar que um tratado esquecido continua v\xE1lido.",
    encounter: "Os dois lados desejam cumprir o acordo, mas discordam sobre quem deve dar o primeiro passo.",
    rumor: "A hist\xF3ria omite que o acontecimento foi previsto em um tratado guardado por ambas as partes.",
    dungeon: "Uma inscri\xE7\xE3o estabelece regras de passagem; cumpri-las abre uma rota que os invasores n\xE3o perceberam."
  },
  {
    id: "prazo",
    companion: true,
    npc: "Essa pessoa precisa agir antes do pr\xF3ximo amanhecer, quando a \xFAnica testemunha deixar\xE1 a regi\xE3o.",
    location: "Ao cair da noite, uma mudan\xE7a no ambiente tornar\xE1 o acesso perigoso por v\xE1rios dias.",
    quest: "O prazo termina ao amanhecer, quando a prova perder\xE1 valor e a oposi\xE7\xE3o assumir\xE1 o controle do local.",
    encounter: "A amea\xE7a piora a cada poucos minutos, mas uma retirada apressada abandona pessoas inocentes.",
    rumor: "Quem espalha a hist\xF3ria insiste que algo acontecer\xE1 ao amanhecer, e os sinais observ\xE1veis confirmam a urg\xEAncia.",
    dungeon: "\xC1gua, fuma\xE7a ou areia avan\xE7a pelas passagens; o grupo precisa decidir o que explorar antes que a rota se feche."
  },
  {
    id: "aliado",
    companion: false,
    npc: "Um antigo aliado oferece ajuda, mas exige que sua participa\xE7\xE3o permane\xE7a em segredo.",
    location: "Uma moradora conhece um acesso seguro e aceita gui\xE1-lo se o grupo proteger quem ficar\xE1 para tr\xE1s.",
    quest: "Um aliado hesitante conhece a fraqueza da oposi\xE7\xE3o, mas teme ser reconhecido durante a opera\xE7\xE3o.",
    encounter: "Uma pessoa do lado advers\xE1rio tenta impedir a viol\xEAncia sem revelar que est\xE1 traindo seus companheiros.",
    rumor: "A fonte mais bem informada trabalha para quem deseja abafar o caso e precisa falar sem ser descoberta.",
    dungeon: "Um habitante acuado conhece atalhos e h\xE1bitos dos ocupantes, mas n\xE3o seguir\xE1 adiante sem garantias."
  },
  {
    id: "objeto",
    companion: true,
    npc: "Um objeto comum que ela carrega cont\xE9m a prova de uma acusa\xE7\xE3o antiga.",
    location: "Uma pe\xE7a de uso cotidiano esconde um mapa incompleto quando observada contra a luz.",
    quest: "A prova procurada est\xE1 escondida em um objeto banal que j\xE1 passou pelas m\xE3os do contratante.",
    encounter: "O item disputado n\xE3o tem valor material; sua import\xE2ncia est\xE1 na mensagem gravada sob o revestimento.",
    rumor: "A hist\xF3ria nasceu por causa de um objeto real, embora quase todos descrevam sua apar\xEAncia de forma errada.",
    dungeon: "Um utens\xEDlio abandonado funciona como chave para um mecanismo que parece fazer parte da parede."
  },
  {
    id: "rota",
    companion: false,
    npc: "Ela conhece uma rota que evita o perigo, mas atravessa terras de algu\xE9m que n\xE3o esqueceu uma d\xEDvida.",
    location: "Um caminho secund\xE1rio surge apenas quando o terreno, a mar\xE9 ou o movimento das pessoas muda.",
    quest: "A rota mais segura exige um desvio pelo territ\xF3rio de uma terceira parte que pode cobrar passagem.",
    encounter: "H\xE1 duas sa\xEDdas vis\xEDveis: uma \xE9 r\xE1pida e exposta; a outra \xE9 lenta e passa perto da origem do problema.",
    rumor: "Todas as vers\xF5es apontam para a rota principal, mas as marcas no terreno indicam outro caminho.",
    dungeon: "Uma passagem estreita contorna o obst\xE1culo central e permite chegar ao outro lado sem enfrent\xE1-lo de frente."
  },
  {
    id: "promessa",
    companion: true,
    npc: "Uma promessa feita em p\xFAblico limita suas escolhas e oferece aos rivais uma forma de pression\xE1-la.",
    location: "Os moradores aguardam o cumprimento de uma promessa feita diante do marco central.",
    quest: "O contratante prometeu poupar a oposi\xE7\xE3o, e quebrar sua palavra transformar\xE1 aliados em inimigos.",
    encounter: "Uma das partes n\xE3o pode recuar sem violar uma promessa conhecida por todos os presentes.",
    rumor: "A vers\xE3o popular exagera o perigo para testar se uma promessa antiga ainda ser\xE1 cumprida.",
    dungeon: "A abertura de uma porta sela outra passagem, como advertia uma promessa inscrita na entrada."
  },
  {
    id: "sinal",
    companion: false,
    npc: "Ela reconhece um sinal repetido nas \xFAltimas ocorr\xEAncias e teme contar onde o viu pela primeira vez.",
    location: "O mesmo s\xEDmbolo aparece em tr\xEAs pontos do lugar, sempre voltado para uma sa\xEDda diferente.",
    quest: "Um sinal recorrente permite prever o pr\xF3ximo movimento da oposi\xE7\xE3o, desde que seja interpretado a tempo.",
    encounter: "A amea\xE7a reage a um som, uma cor ou um gesto que os presentes repetem sem perceber.",
    rumor: "O detalhe repetido em todos os relatos \xE9 verdadeiro e funciona como aviso para quem souber reconhec\xEA-lo.",
    dungeon: "Marcas discretas indicam quais superf\xEDcies foram tocadas com seguran\xE7a pelos ocupantes anteriores."
  },
  {
    id: "preco",
    companion: true,
    npc: "Ela oferece exatamente a ajuda necess\xE1ria, mas cobra um compromisso que produzir\xE1 consequ\xEAncias depois.",
    location: "O recurso mais \xFAtil do lugar pode ser tomado agora, embora sua retirada prejudique quem depende dele.",
    quest: "A solu\xE7\xE3o mais r\xE1pida exige sacrificar a recompensa ou transferir o risco para pessoas inocentes.",
    encounter: "\xC9 poss\xEDvel encerrar o conflito imediatamente, desde que algu\xE9m aceite uma perda p\xFAblica e irrevers\xEDvel.",
    rumor: "A hist\xF3ria \xE9 verdadeira, mas quem a espalha esconde o pre\xE7o cobrado de todos que tentaram agir.",
    dungeon: "O mecanismo central concede passagem em troca de um objeto valioso, uma lembran\xE7a ou uma promessa registrada."
  },
  {
    id: "mensagem",
    companion: false,
    npc: "Uma mensagem incompleta pede sua presen\xE7a e termina antes de revelar quem corre perigo.",
    location: "Uma frase interrompida foi gravada \xE0s pressas em um ponto vis\xEDvel apenas para quem est\xE1 saindo.",
    quest: "A \xFAltima mensagem do contato indica o destino correto, mas omite deliberadamente o nome de um c\xFAmplice.",
    encounter: "Uma mensagem entregue durante o impasse prova que nenhum dos lados conhece toda a situa\xE7\xE3o.",
    rumor: "O boato come\xE7ou como uma mensagem truncada; recuperar o trecho ausente muda o sentido do aviso.",
    dungeon: "Uma sequ\xEAncia de inscri\xE7\xF5es forma uma mensagem quando as salas s\xE3o percorridas na ordem correta."
  },
  {
    id: "silencio",
    companion: true,
    npc: "Seu sil\xEAncio protege uma pessoa culpada de um erro menor, n\xE3o do crime que todos imaginam.",
    location: "A pessoa que mais conhece o lugar se recusa a falar diante dos demais, mas deixa pistas intencionais.",
    quest: "O contratante omite um nome porque teme perder o apoio da comunidade antes do fim da miss\xE3o.",
    encounter: "Todos acusam quem fala demais, enquanto a pessoa silenciosa controla a \xFAnica sa\xEDda.",
    rumor: "A aus\xEAncia de um nome nos relatos \xE9 deliberada e revela quem exerce poder sobre as testemunhas.",
    dungeon: "Sinos quebrados e placas abafadas mostram que os antigos ocupantes precisavam atravessar algumas salas em sil\xEAncio."
  },
  {
    id: "marca",
    companion: false,
    npc: "Uma marca recente em sua roupa pertence a uma organiza\xE7\xE3o que ela afirma nunca ter encontrado.",
    location: "Uma marca antiga recebeu um tra\xE7o novo, gravado com ferramenta ainda coberta de p\xF3.",
    quest: "O grupo precisa identificar quem alterou a marca de fronteira antes que duas comunidades se acusem.",
    encounter: "Os advers\xE1rios usam a mesma marca, mas cada lado acredita que o outro a falsificou.",
    rumor: "A marca citada no boato existe, por\xE9m foi acrescentada recentemente para orientar algu\xE9m at\xE9 o local.",
    dungeon: "S\xEDmbolos nas soleiras se repetem com pequenas diferen\xE7as e antecipam o perigo de cada sala."
  },
  {
    id: "disputa",
    companion: true,
    npc: "Duas pessoas sinceras contam vers\xF5es incompat\xEDveis sobre uma decis\xE3o que ela tomou.",
    location: "Duas comunidades reivindicam o mesmo espa\xE7o e apresentam documentos igualmente convincentes.",
    quest: "Cumprir o pedido como foi formulado favorece uma das partes antes que o grupo conhe\xE7a a vers\xE3o rival.",
    encounter: "Os dois lados t\xEAm raz\xF5es leg\xEDtimas para permanecer, e nenhum deles iniciou a amea\xE7a imediata.",
    rumor: "Duas vers\xF5es contradit\xF3rias s\xE3o verdadeiras em partes diferentes e revelam interesses opostos.",
    dungeon: "Dois grupos ocupam setores distintos e disputam um recurso que nenhum deles consegue alcan\xE7ar sozinho."
  },
  {
    id: "refugio",
    companion: false,
    npc: "Ela oferece um ref\xFAgio seguro por uma noite, mas a presen\xE7a do grupo colocar\xE1 seus moradores em risco.",
    location: "Um abrigo discreto permite observar o perigo e conversar com quem n\xE3o pode aparecer em p\xFAblico.",
    quest: "O \xFAnico ponto seguro abriga pessoas procuradas que n\xE3o t\xEAm rela\xE7\xE3o com o objetivo da miss\xE3o.",
    encounter: "Uma \xE1rea protegida comporta apenas parte dos presentes, e a amea\xE7a j\xE1 percebeu onde ela fica.",
    rumor: "A hist\xF3ria aponta para um ref\xFAgio real, mas omite quem o mant\xE9m e por que sua localiza\xE7\xE3o \xE9 perigosa.",
    dungeon: "Uma sala defens\xE1vel oferece descanso e vis\xE3o das passagens, embora sinais recentes indiquem que algu\xE9m conhece o esconderijo."
  },
  {
    id: "heranca",
    companion: true,
    npc: "Uma heran\xE7a esquecida lhe d\xE1 direito sobre o objeto da disputa e responsabilidade pelas d\xEDvidas ligadas a ele.",
    location: "O lugar pertence legalmente a algu\xE9m que desconhece a pr\xF3pria heran\xE7a.",
    quest: "A prova procurada revela um herdeiro leg\xEDtimo, o que torna a entrega mais perigosa que a busca.",
    encounter: "A pessoa tratada como invasora possui o \xFAnico documento capaz de comprovar sua liga\xE7\xE3o com o local.",
    rumor: "A hist\xF3ria preservou o nome errado durante gera\xE7\xF5es, mas acertou a linhagem respons\xE1vel pelo acontecimento.",
    dungeon: "Um selo de fam\xEDlia abre dep\xF3sitos e tamb\xE9m desperta defesas criadas para testar futuros herdeiros."
  },
  {
    id: "ritual",
    companion: false,
    npc: "Ela sabe executar um ritual capaz de conter a amea\xE7a uma \xFAnica vez e procura quem possa concluir o trabalho.",
    location: "Um ritual simples estabiliza o lugar at\xE9 o pr\xF3ximo ciclo, mas exige a participa\xE7\xE3o de grupos rivais.",
    quest: "O objetivo pode ser adiado por um ritual de conten\xE7\xE3o, dando tempo para encontrar uma solu\xE7\xE3o permanente.",
    encounter: "Uma das partes tenta completar um ritual imperfeito enquanto a outra interpreta o ato como ataque.",
    rumor: "Os gestos descritos no boato pertencem a um ritual de prote\xE7\xE3o, n\xE3o \xE0 invoca\xE7\xE3o que todos temem.",
    dungeon: "Objetos distribu\xEDdos entre v\xE1rias salas formam um ritual interrompido que pode ser conclu\xEDdo ou desfeito."
  },
  {
    id: "devedor",
    companion: true,
    npc: "Uma pessoa endividada oferece acesso privilegiado em troca do perd\xE3o de uma obriga\xE7\xE3o leg\xEDtima.",
    location: "O respons\xE1vel pela manuten\xE7\xE3o do lugar desviou recursos para pagar uma d\xEDvida e agora tenta reparar o dano.",
    quest: "Um devedor conhece a rotina da oposi\xE7\xE3o e ajuda o grupo se sua participa\xE7\xE3o n\xE3o for usada contra sua fam\xEDlia.",
    encounter: "A pessoa que iniciou o impasse pretendia apenas cobrar uma d\xEDvida, mas perdeu o controle da situa\xE7\xE3o.",
    rumor: "Quem espalhou a hist\xF3ria tenta pressionar um devedor e acrescentou detalhes para exp\xF4-lo publicamente.",
    dungeon: "Registros guardados numa sala lateral mostram quem financiou a constru\xE7\xE3o e qual d\xEDvida ainda pode ser cobrada."
  },
  {
    id: "memoria",
    companion: false,
    npc: "Uma lembran\xE7a compartilhada com a pessoa errada explica sua lealdade e a origem de sua culpa.",
    location: "Os habitantes recordam o mesmo acontecimento de maneiras diferentes, mas todos mencionam um som espec\xEDfico.",
    quest: "Uma mem\xF3ria considerada irrelevante cont\xE9m a ordem correta dos fatos e inocenta um suspeito conveniente.",
    encounter: "Um dos envolvidos reconhece o lugar e percebe que a amea\xE7a repete um desastre do passado.",
    rumor: "A hist\xF3ria mudou a cada gera\xE7\xE3o, embora uma imagem concreta tenha permanecido intacta em todas as vers\xF5es.",
    dungeon: "Murais danificados registram a rotina dos antigos ocupantes e revelam como eles evitavam os pr\xF3prios mecanismos."
  },
  {
    id: "escolha",
    companion: true,
    npc: "Ela pede que o grupo escolha quem receber\xE1 a informa\xE7\xE3o primeiro e promete respeitar a decis\xE3o.",
    location: "Duas necessidades urgentes competem pelo mesmo recurso, e atender uma delas torna a outra mais dif\xEDcil.",
    quest: "A miss\xE3o termina com uma escolha entre entregar a prova, destru\xED-la ou torn\xE1-la p\xFAblica.",
    encounter: "O grupo pode salvar quem est\xE1 em perigo, capturar o respons\xE1vel ou impedir a pr\xF3xima amea\xE7a, mas n\xE3o fazer tudo ao mesmo tempo.",
    rumor: "Confirmar a hist\xF3ria permite agir cedo; divulg\xE1-la, por\xE9m, provoca a rea\xE7\xE3o imediata dos interessados.",
    dungeon: "A \xFAltima passagem obriga o grupo a escolher entre uma sa\xEDda segura e o acesso ao que veio procurar."
  }
];

// src/catalogs/pt-BR/generated-content.ts
function matrix(prefix2, make) {
  const entries = [];
  for (const tone of TONE_IDS) {
    for (const environment of ENVIRONMENT_IDS) {
      entries.push({
        id: `${prefix2}-${tone}-${environment}`,
        tone,
        environment,
        complexity: COMPLEXITY_IDS,
        content: make({ tone, environment, complexity: "quick" })
      });
    }
  }
  entries.push({
    id: `${prefix2}-fallback`,
    fallback: true,
    content: make({
      tone: "mysterious",
      environment: "ruins",
      complexity: "quick"
    })
  });
  return entries;
}
function context(cell) {
  return {
    tone: TONE_WRITING[cell.tone],
    environment: ENVIRONMENT_WRITING[cell.environment]
  };
}
function detailedRooms(rooms) {
  const expand = (role) => `${rooms[role]} ${ROOM_DEVELOPMENT[role]}`;
  return {
    Entrada: expand("Entrada"),
    Explora\u00E7\u00E3o: expand("Explora\xE7\xE3o"),
    Desafio: expand("Desafio"),
    Encruzilhada: expand("Encruzilhada"),
    Segredo: expand("Segredo"),
    Armadilha: expand("Armadilha"),
    Ref\u00FAgio: expand("Ref\xFAgio"),
    Contratempo: expand("Contratempo"),
    Encontro: expand("Encontro"),
    Revela\u00E7\u00E3o: expand("Revela\xE7\xE3o"),
    Confronto: expand("Confronto"),
    Recompensa: expand("Recompensa")
  };
}
var NPC_CONTENT = matrix("npc", (cell) => {
  const { tone, environment } = context(cell);
  return {
    role: environment.npcRole,
    trait: `Mant\xE9m um jeito ${tone.npcColor}. Observa primeiro quem precisa de ajuda.`,
    appearance: `Carrega sinais de viagem e trabalho. ${environment.texture}`,
    personality: `Escuta antes de falar e relaciona cada decis\xE3o a ${tone.npcFrame}.`,
    motivation: `${tone.npcMotive.charAt(0).toLocaleUpperCase("pt-BR")}${tone.npcMotive.slice(1)}.`,
    complication: tone.npcPressure,
    secret: `Sabe que ${tone.npcThreat} e possui uma prova que ainda n\xE3o mostrou.`,
    relationship: `Mant\xE9m um acordo fr\xE1gil com quem vive na regi\xE3o. ${environment.inhabitants}`,
    immediateHook: "Oferece uma informa\xE7\xE3o concreta em troca de ajuda com um problema que n\xE3o pode resolver sozinho.",
    companion: environment.npcCompanion
  };
});
var LOCATION_CONTENT = matrix("location", (cell) => {
  const { tone, environment } = context(cell);
  return {
    name: environment.name,
    type: environment.location.type,
    atmosphere: `${environment.texture} ${tone.locationMood}`,
    feature: `${environment.location.landmark} ${tone.locationLandmark}`,
    hook: `${environment.location.hook} ${tone.locationHook}`,
    inhabitants: environment.inhabitants,
    history: environment.location.history,
    tension: `${environment.location.conflict} ${tone.locationPressure}`,
    danger: environment.location.danger,
    secret: `${environment.location.secret} ${tone.locationSecret}`,
    opportunities: environment.location.opportunities
  };
});
var QUEST_CONTENT = matrix("quest", (cell) => {
  const { tone, environment } = context(cell);
  return {
    title: environment.quest.title,
    giver: environment.quest.giver,
    objective: environment.quest.objective,
    location: environment.name,
    complication: `${tone.questComplication} ${environment.quest.complication}`,
    reward: `${environment.quest.reward} ${tone.questReward}`,
    context: `${environment.quest.context} ${tone.questContext}`,
    stages: environment.quest.stages,
    opposition: `${environment.quest.opposition} ${tone.questOpposition}`,
    escalation: `${environment.quest.escalation} ${tone.questEscalation}`,
    failure: `${environment.quest.failure} ${tone.questFailure}`,
    alternative: `${environment.quest.alternative} ${tone.questAlternative}`
  };
});
var ENCOUNTER_CONTENT = matrix("encounter", (cell) => {
  const { tone, environment } = context(cell);
  return {
    title: environment.encounter.title,
    situation: environment.encounter.situation,
    immediateThreat: `${environment.encounter.threat} ${tone.encounterPressure}`,
    twist: `${environment.encounter.twist} ${tone.encounterTwist}`,
    choice: `${environment.encounter.choice} ${tone.encounterChoice}`,
    setup: environment.encounter.setup,
    actors: environment.encounter.actors,
    escalation: `${environment.encounter.escalation} ${tone.encounterEscalation}`,
    interaction: environment.encounter.interaction,
    outcomes: environment.encounter.outcomes,
    aftermath: `${environment.encounter.aftermath} ${tone.encounterAftermath}`
  };
});
var RUMOR_CONTENT = matrix("rumor", (cell) => {
  const { tone, environment } = context(cell);
  return {
    subject: environment.rumor.subject,
    claim: `${environment.rumor.claim} ${tone.rumorClaim}`,
    truth: `${environment.rumor.truth} ${tone.rumorTruth}`,
    source: environment.rumor.source,
    variations: environment.rumor.variations,
    clues: environment.rumor.clues,
    interestedParties: `${environment.rumor.interested} ${tone.rumorInterested}`,
    investigationConsequence: `${environment.rumor.consequence} ${tone.rumorConsequence}`,
    context: `${environment.rumor.context} ${tone.rumorContext}`
  };
});
var DUNGEON_CONTENT = matrix("dungeon", (cell) => {
  const { tone, environment } = context(cell);
  return {
    theme: `${environment.dungeon.name}: ${tone.dungeonTheme}`,
    overview: `${environment.dungeon.overview} ${tone.dungeonOverview} ${tone.dungeonRoom}`,
    rooms: environment.dungeon.rooms,
    detailedRooms: detailedRooms(environment.dungeon.rooms)
  };
});
var COMPILED_CONTENT_CATALOGS = {
  npc: compileContentCatalog(NPC_CONTENT),
  location: compileContentCatalog(LOCATION_CONTENT),
  quest: compileContentCatalog(QUEST_CONTENT),
  encounter: compileContentCatalog(ENCOUNTER_CONTENT),
  rumor: compileContentCatalog(RUMOR_CONTENT),
  dungeon: compileContentCatalog(DUNGEON_CONTENT)
};

// src/dungeon/engine.ts
var DungeonMappingError = class extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "DungeonMappingError";
  }
};
var ROLE_SEQUENCE = {
  5: ["Entrada", "Desafio", "Contratempo", "Confronto", "Recompensa"],
  8: [
    "Entrada",
    "Explora\xE7\xE3o",
    "Desafio",
    "Segredo",
    "Contratempo",
    "Encontro",
    "Confronto",
    "Recompensa"
  ],
  12: [
    "Entrada",
    "Explora\xE7\xE3o",
    "Desafio",
    "Encruzilhada",
    "Segredo",
    "Armadilha",
    "Ref\xFAgio",
    "Contratempo",
    "Encontro",
    "Revela\xE7\xE3o",
    "Confronto",
    "Recompensa"
  ]
};
var FEATURE_BY_ROLE = {
  Entrada: [],
  Explora\u00E7\u00E3o: ["secret"],
  Desafio: ["trap"],
  Encruzilhada: ["secret"],
  Segredo: ["secret"],
  Armadilha: ["trap"],
  Ref\u00FAgio: [],
  Contratempo: ["secret"],
  Encontro: ["encounter"],
  Revela\u00E7\u00E3o: ["secret"],
  Confronto: ["encounter"],
  Recompensa: ["reward"]
};
var GM_NOTE_BY_ROLE = {
  Entrada: null,
  Explora\u00E7\u00E3o: "Um objeto aparentemente comum foi movido recentemente e aponta para uma passagem usada pelos ocupantes.",
  Desafio: "O perigo deixa sinais antes de agir. Contorn\xE1-lo preserva recursos; neutraliz\xE1-lo cria uma rota segura para o retorno.",
  Encruzilhada: "Uma corrente de ar e rastros interrompidos denunciam uma liga\xE7\xE3o discreta entre duas das rotas.",
  Segredo: "A descoberta explica quem alterou o complexo e concede uma vantagem concreta contra uma amea\xE7a posterior.",
  Armadilha: "O mecanismo protege um acesso espec\xEDfico. Acion\xE1-lo de prop\xF3sito pode bloquear perseguidores ou modificar outra sala.",
  Ref\u00FAgio: null,
  Contratempo: "A mudan\xE7a exp\xF5e um detalhe antes inacess\xEDvel, permitindo recuperar informa\xE7\xE3o mesmo quando a rota de retorno piora.",
  Encontro: "Os presentes desejam sair com seguran\xE7a e escondem uma informa\xE7\xE3o que oferecem em troca de ajuda verific\xE1vel.",
  Revela\u00E7\u00E3o: "A evid\xEAncia confirma uma conclus\xE3o importante e corrige uma interpreta\xE7\xE3o prov\xE1vel das pistas anteriores.",
  Confronto: "A oposi\xE7\xE3o protege algo al\xE9m da pr\xF3pria vida e aceita negociar se o grupo reconhecer esse interesse.",
  Recompensa: "O pr\xEAmio resolve uma necessidade atual e carrega uma marca que permitir\xE1 a terceiros reconhecer sua origem."
};
var FEATURE_MARKERS = {
  secret: "S",
  trap: "A",
  encounter: "E",
  reward: "R"
};
function roomId(number) {
  return `room-${number}`;
}
function roomPositions(size) {
  const columns = size === 5 ? 5 : 4;
  return Array.from({ length: size }, (_, index) => {
    const row = Math.floor(index / columns);
    const positionInRow = index % columns;
    const column = row % 2 === 0 ? positionInRow : columns - positionInRow - 1;
    return { x: 70 + column * 145, y: 65 + row * 125 };
  });
}
function roomFeatures(role) {
  return FEATURE_BY_ROLE[role];
}
function createRooms(profile, options) {
  const roles = ROLE_SEQUENCE[options.size];
  const positions = roomPositions(options.size);
  const sourceRooms = options.complexity === "detailed" ? profile.detailedRooms : profile.rooms;
  return roles.map((role, index) => {
    const base = sourceRooms[role];
    const position = positions[index];
    if (!base || !position) {
      throw new DungeonMappingError("room-count", "N\xE3o foi poss\xEDvel montar todas as salas.");
    }
    const features = roomFeatures(role);
    const gmNote = GM_NOTE_BY_ROLE[role];
    return {
      id: roomId(index + 1),
      number: index + 1,
      role,
      description: base,
      features,
      gmNotes: gmNote ? [gmNote] : [],
      x: position.x,
      y: position.y
    };
  });
}
function edge(from, to, kind) {
  return { from: roomId(from), to: roomId(to), kind };
}
function createEdges(size, environment) {
  const edges = [];
  for (let number = 1; number < size; number += 1) {
    edges.push(edge(number, number + 1, "path"));
  }
  if (environment === "underground") return edges;
  const shortcuts = environment === "wilderness" || environment === "forest" ? [[2, 4], [5, 7], [8, 10]] : [[1, 3], [4, 6], [7, 9], [9, 11]];
  for (const [from, to] of shortcuts) {
    if (to <= size) edges.push(edge(from, to, "shortcut"));
  }
  return edges;
}
function degreeMap(map) {
  var _a, _b;
  const degrees = new Map(map.rooms.map((room) => [room.id, 0]));
  for (const edgeItem of map.edges) {
    degrees.set(edgeItem.from, ((_a = degrees.get(edgeItem.from)) != null ? _a : 0) + 1);
    degrees.set(edgeItem.to, ((_b = degrees.get(edgeItem.to)) != null ? _b : 0) + 1);
  }
  return degrees;
}
function assertConnected(map) {
  const first = map.rooms[0];
  if (!first) throw new DungeonMappingError("room-count", "O mapa n\xE3o cont\xE9m salas.");
  const visited = /* @__PURE__ */ new Set([first.id]);
  const queue = [first.id];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    for (const edgeItem of map.edges) {
      const next = edgeItem.from === current ? edgeItem.to : edgeItem.to === current ? edgeItem.from : null;
      if (next && !visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
  if (visited.size !== map.rooms.length) {
    throw new DungeonMappingError("disconnected", "O mapa cont\xE9m salas desconectadas.");
  }
}
function validateDungeonMap(map, expectedSize) {
  if (map.rooms.length !== expectedSize) {
    throw new DungeonMappingError("room-count", "O mapa n\xE3o tem o n\xFAmero esperado de salas.");
  }
  const ids = new Set(map.rooms.map((room) => room.id));
  const edgeKeys = /* @__PURE__ */ new Set();
  for (const edgeItem of map.edges) {
    if (!ids.has(edgeItem.from) || !ids.has(edgeItem.to) || edgeItem.from === edgeItem.to) {
      throw new DungeonMappingError("unknown-room", "Uma conex\xE3o aponta para uma sala inv\xE1lida.");
    }
    const key = [edgeItem.from, edgeItem.to].sort().join("/");
    if (edgeKeys.has(key)) {
      throw new DungeonMappingError("duplicate-edge", "O mapa cont\xE9m uma conex\xE3o duplicada.");
    }
    edgeKeys.add(key);
  }
  const positions = new Set(map.rooms.map((room) => `${room.x}/${room.y}`));
  if (positions.size !== map.rooms.length) {
    throw new DungeonMappingError("duplicate-position", "Duas salas ocupam a mesma posi\xE7\xE3o.");
  }
  assertConnected(map);
  const degrees = [...degreeMap(map).values()];
  const maxDegree = Math.max(...degrees);
  if (map.environment === "underground") {
    if (map.edges.length !== map.rooms.length - 1 || maxDegree > 2) {
      throw new DungeonMappingError(
        "environment-topology",
        "O subterr\xE2neo exige uma rota linear sem atalhos."
      );
    }
  } else if (map.environment === "wilderness" || map.environment === "forest") {
    if (maxDegree < 3) {
      throw new DungeonMappingError(
        "environment-topology",
        "Este ambiente exige pelo menos uma ramifica\xE7\xE3o."
      );
    }
  } else if (map.edges.length < map.rooms.length) {
    throw new DungeonMappingError(
      "environment-topology",
      "Este ambiente exige ao menos um circuito alternativo."
    );
  }
}
function roomToken(room) {
  const marker = room.features[0] ? FEATURE_MARKERS[room.features[0]] : " ";
  return `[${String(room.number).padStart(2, "0")}${marker}]`;
}
function renderDungeonAscii(rooms, edges) {
  var _a;
  const rows = /* @__PURE__ */ new Map();
  for (const room of rooms) {
    const values = (_a = rows.get(room.y)) != null ? _a : [];
    values.push(room);
    rows.set(room.y, values);
  }
  const lines = [];
  const sortedRows = [...rows.entries()].sort(([a], [b]) => a - b);
  sortedRows.forEach(([, row], rowIndex) => {
    const sorted = [...row].sort((a, b) => a.x - b.x);
    lines.push(sorted.map(roomToken).join("---"));
    if (rowIndex < sortedRows.length - 1) {
      const connectorAtRight = rowIndex % 2 === 0;
      lines.push(connectorAtRight ? `${" ".repeat(Math.max(0, sorted.length * 8 - 4))}|` : "  |");
    }
  });
  const shortcuts = edges.filter((edgeItem) => edgeItem.kind === "shortcut");
  if (shortcuts.length > 0) {
    const roomById = new Map(rooms.map((room) => [room.id, room.number]));
    lines.push(
      `Atalhos: ${shortcuts.map(
        (item) => `${String(roomById.get(item.from)).padStart(2, "0")}--${String(roomById.get(item.to)).padStart(2, "0")}`
      ).join(", ")}`
    );
  }
  lines.push("Marcadores: S segredo, A armadilha, E encontro, R recompensa");
  return lines.join("\n");
}
function accessibleMapLabel(rooms, edges) {
  const entrance = rooms.find((room) => room.role === "Entrada");
  const reward = rooms.find((room) => room.role === "Recompensa");
  return [
    `Mapa abstrato de masmorra com ${rooms.length} salas e ${edges.length} conex\xF5es.`,
    entrance ? `A entrada \xE9 a sala ${entrance.number}.` : "",
    reward ? `A recompensa fica na sala ${reward.number}.` : "",
    "Marcadores identificam segredos, armadilhas, encontros e recompensas para o mestre."
  ].filter(Boolean).join(" ");
}
function buildDungeonArtifact(profile, options) {
  const rooms = createRooms(profile, options);
  if (options.mode === "story") {
    return { mode: options.mode, size: options.size, rooms, map: null };
  }
  const edges = createEdges(options.size, options.environment);
  const map = {
    environment: options.environment,
    rooms,
    edges,
    ascii: renderDungeonAscii(rooms, edges),
    accessibleLabel: accessibleMapLabel(rooms, edges)
  };
  validateDungeonMap(map, options.size);
  return { mode: options.mode, size: options.size, rooms, map };
}
function dungeonFeatureLabel(feature) {
  switch (feature) {
    case "secret":
      return "SEGREDO";
    case "trap":
      return "ARMADILHA";
    case "encounter":
      return "ENCONTRO";
    case "reward":
      return "RECOMPENSA";
  }
}

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

// src/generators/shared.ts
var GENERATOR_LABELS = {
  npc: "NPCs",
  location: "Locais",
  quest: "Miss\xF5es",
  encounter: "Encontros",
  rumor: "Rumores",
  dungeon: "Masmorra"
};
function finish(id, title, fields, metadata) {
  return {
    id,
    label: GENERATOR_LABELS[id],
    title,
    content: renderFields(fields),
    options: metadata
  };
}
function begin(id, random, options = DEFAULT_GENERATION_OPTIONS) {
  const selected = normalizeGenerationOptions(options, id);
  const resolved = resolveGenerationOptions(selected, random, id);
  return { selected, resolved };
}
function selectProfile(catalog, resolved, random) {
  return catalog.select(resolved, random).content;
}
function selectVariation(random) {
  return random.pick(VARIATION_BEATS);
}

// src/generators/dungeon.ts
function dungeonFields(profile, artifact, beat) {
  const modeSummary = artifact.mode === "mapped" ? `Estrutura mapeada com ${artifact.size} salas e conex\xF5es validadas.` : `Estrutura narrativa com ${artifact.size} salas.`;
  const fields = [
    { label: "Tema", value: profile.theme },
    { label: "Vis\xE3o geral", value: `${profile.overview} ${modeSummary} ${beat.dungeon}` }
  ];
  for (const room of artifact.rooms) {
    const gm = room.gmNotes.length > 0 ? ` Mestre [${room.features.map(dungeonFeatureLabel).join(", ")}]: ${room.gmNotes.join(" ")}` : "";
    fields.push({
      label: room.role,
      value: `${room.description}${gm}`,
      number: room.number
    });
  }
  return fields;
}
function generateDungeon(random, options = DEFAULT_GENERATION_OPTIONS) {
  const metadata = begin("dungeon", random, options);
  const profile = selectProfile(
    COMPILED_CONTENT_CATALOGS.dungeon,
    metadata.resolved,
    random
  );
  const beat = selectVariation(random);
  const { dungeonMode, dungeonSize } = metadata.resolved;
  if (dungeonMode === null || dungeonSize === null) {
    throw new Error("Masmorra exige modo e tamanho resolvidos");
  }
  const artifact = buildDungeonArtifact(profile, {
    mode: dungeonMode,
    size: dungeonSize,
    environment: metadata.resolved.environment,
    complexity: metadata.resolved.complexity
  });
  const result = finish(
    "dungeon",
    `Masmorra - ${profile.theme}`,
    dungeonFields(profile, artifact, beat),
    metadata
  );
  if (!artifact.map) return { ...result, dungeon: artifact };
  return {
    ...result,
    content: {
      plainText: `${result.content.plainText}

Mapa abstrato (ASCII):
${artifact.map.ascii}`,
      markdown: `${result.content.markdown}

**Mapa abstrato (ASCII):**

\`\`\`text
${artifact.map.ascii}
\`\`\``
    },
    dungeon: artifact
  };
}
var DUNGEON_GENERATOR = {
  id: "dungeon",
  label: GENERATOR_LABELS.dungeon,
  icon: "box",
  generate: generateDungeon
};

// src/generators/encounter.ts
function encounterFields(profile, beat, detailed) {
  const fields = [
    { label: "Situa\xE7\xE3o", value: profile.situation },
    { label: "Amea\xE7a imediata", value: profile.immediateThreat },
    { label: "Reviravolta", value: `${profile.twist} ${beat.encounter}` },
    { label: "Escolha significativa", value: profile.choice }
  ];
  if (detailed) {
    fields.push(
      { label: "Prepara\xE7\xE3o", value: profile.setup },
      { label: "Atores", value: profile.actors },
      { label: "Escalada", value: profile.escalation },
      { label: "Intera\xE7\xE3o com o ambiente", value: profile.interaction },
      { label: "Desfechos prov\xE1veis", value: profile.outcomes },
      { label: "Depois", value: profile.aftermath }
    );
  }
  return fields;
}
function generateEncounter(random, options = DEFAULT_GENERATION_OPTIONS) {
  const metadata = begin("encounter", random, options);
  const profile = selectProfile(
    COMPILED_CONTENT_CATALOGS.encounter,
    metadata.resolved,
    random
  );
  const beat = selectVariation(random);
  return finish(
    "encounter",
    `Encontro - ${profile.title}`,
    encounterFields(profile, beat, metadata.resolved.complexity === "detailed"),
    metadata
  );
}
var ENCOUNTER_GENERATOR = {
  id: "encounter",
  label: GENERATOR_LABELS.encounter,
  icon: "target",
  generate: generateEncounter
};

// src/generators/location.ts
function locationFields(profile, beat, detailed) {
  const fields = [
    { label: "Nome", value: profile.name },
    { label: "Tipo", value: profile.type },
    { label: "Atmosfera", value: profile.atmosphere },
    { label: "Caracter\xEDstica", value: profile.feature },
    { label: "Gancho", value: `${profile.hook} ${beat.location}` }
  ];
  if (detailed) {
    fields.push(
      { label: "Habitantes", value: profile.inhabitants },
      { label: "Hist\xF3ria", value: profile.history },
      { label: "Tens\xE3o atual", value: profile.tension },
      { label: "Perigo", value: profile.danger },
      { label: "Segredo", value: profile.secret },
      { label: "Oportunidades", value: profile.opportunities }
    );
  }
  return fields;
}
function generateLocation(random, options = DEFAULT_GENERATION_OPTIONS) {
  const metadata = begin("location", random, options);
  const profile = selectProfile(
    COMPILED_CONTENT_CATALOGS.location,
    metadata.resolved,
    random
  );
  const beat = selectVariation(random);
  return finish(
    "location",
    `Local - ${profile.name}`,
    locationFields(profile, beat, metadata.resolved.complexity === "detailed"),
    metadata
  );
}
var LOCATION_GENERATOR = {
  id: "location",
  label: GENERATOR_LABELS.location,
  icon: "map",
  generate: generateLocation
};

// src/generators/npc.ts
function generateNpc(random, options = DEFAULT_GENERATION_OPTIONS) {
  const metadata = begin("npc", random, options);
  const profile = selectProfile(COMPILED_CONTENT_CATALOGS.npc, metadata.resolved, random);
  const beat = selectVariation(random);
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
    if (beat.companion) {
      fields.push({ label: "Companheiro compat\xEDvel", value: profile.companion });
    }
  }
  fields.push({ label: "Gancho imediato", value: `${profile.immediateHook} ${beat.npc}` });
  return finish("npc", `NPC - ${name}`, fields, metadata);
}
var NPC_GENERATOR = {
  id: "npc",
  label: GENERATOR_LABELS.npc,
  icon: "user-round",
  generate: generateNpc
};

// src/generators/quest.ts
function questFields(profile, beat, detailed) {
  const fields = [
    { label: "Contratante", value: profile.giver },
    { label: "Objetivo", value: profile.objective },
    { label: "Local", value: profile.location },
    { label: "Complica\xE7\xE3o", value: `${profile.complication} ${beat.quest}` },
    { label: "Recompensa", value: profile.reward }
  ];
  if (detailed) {
    fields.push(
      { label: "Contexto", value: profile.context },
      { label: "Etapas", value: profile.stages },
      { label: "Oposi\xE7\xE3o", value: profile.opposition },
      { label: "Escalada", value: profile.escalation },
      { label: "Consequ\xEAncia do fracasso", value: profile.failure },
      { label: "Resolu\xE7\xE3o alternativa", value: profile.alternative }
    );
  }
  return fields;
}
function generateQuest(random, options = DEFAULT_GENERATION_OPTIONS) {
  const metadata = begin("quest", random, options);
  const profile = selectProfile(COMPILED_CONTENT_CATALOGS.quest, metadata.resolved, random);
  const beat = selectVariation(random);
  return finish(
    "quest",
    `Miss\xE3o - ${profile.title}`,
    questFields(profile, beat, metadata.resolved.complexity === "detailed"),
    metadata
  );
}
var QUEST_GENERATOR = {
  id: "quest",
  label: GENERATOR_LABELS.quest,
  icon: "file-text",
  generate: generateQuest
};

// src/generators/rumor.ts
function rumorFields(profile, beat, detailed) {
  const fields = [
    { label: "Boato", value: profile.claim },
    { label: "Verdade para o mestre", value: profile.truth },
    { label: "Desdobramento", value: beat.rumor }
  ];
  if (detailed) {
    fields.push(
      { label: "Fonte", value: profile.source },
      { label: "Varia\xE7\xF5es", value: profile.variations },
      { label: "Pistas", value: profile.clues },
      { label: "Interessados", value: profile.interestedParties },
      { label: "Consequ\xEAncia da investiga\xE7\xE3o", value: profile.investigationConsequence },
      { label: "Contexto", value: profile.context }
    );
  }
  return fields;
}
function generateRumor(random, options = DEFAULT_GENERATION_OPTIONS) {
  const metadata = begin("rumor", random, options);
  const profile = selectProfile(COMPILED_CONTENT_CATALOGS.rumor, metadata.resolved, random);
  const beat = selectVariation(random);
  return finish(
    "rumor",
    `Rumor - ${profile.subject}`,
    rumorFields(profile, beat, metadata.resolved.complexity === "detailed"),
    metadata
  );
}
var RUMOR_GENERATOR = {
  id: "rumor",
  label: GENERATOR_LABELS.rumor,
  icon: "message-circle",
  generate: generateRumor
};

// src/generators.ts
var GENERATORS = [
  NPC_GENERATOR,
  LOCATION_GENERATOR,
  QUEST_GENERATOR,
  ENCOUNTER_GENERATOR,
  RUMOR_GENERATOR,
  DUNGEON_GENERATOR
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

// src/application/generation-session.ts
var GenerationSessionController = class {
  constructor(generateResult = generate) {
    this.generateResult = generateResult;
    this.state = this.initialState();
  }
  get snapshot() {
    return this.state;
  }
  reset() {
    this.state = this.initialState();
  }
  selectGenerator(id) {
    if (id === this.state.selectedId) return false;
    this.state = { ...this.state, selectedId: id, currentResult: null };
    return true;
  }
  updateOption(key, value) {
    this.state = {
      ...this.state,
      options: { ...this.state.options, [key]: value },
      currentResult: null
    };
  }
  clearResult() {
    if (this.state.currentResult === null) return;
    this.state = { ...this.state, currentResult: null };
  }
  generate(random = new Random()) {
    try {
      const result = this.generateResult(
        this.state.selectedId,
        random,
        this.state.options
      );
      this.state = { ...this.state, currentResult: result };
      return { ok: true, result };
    } catch (error) {
      return { ok: false, error };
    }
  }
  setCreatingNote(creatingNote) {
    this.state = { ...this.state, creatingNote };
  }
  initialState() {
    return {
      selectedId: "npc",
      options: { ...DEFAULT_GENERATION_OPTIONS },
      currentResult: null,
      creatingNote: false
    };
  }
};

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
  const selected = metadata.selected;
  const resolved = metadata.resolved;
  const suffix = (selection) => selection === "random" ? " (aleat\xF3rio)" : "";
  const lines = [
    ["Tom", `${getToneLabel(resolved.tone)}${suffix(selected.tone)}`],
    ["Ambiente", `${getEnvironmentLabel(resolved.environment)}${suffix(selected.environment)}`],
    ["Complexidade", `${getComplexityLabel(resolved.complexity)}${suffix(selected.complexity)}`]
  ];
  if (resolved.ancestry !== null) {
    lines.push([
      "Ancestralidade",
      `${getPeopleLabel(resolved.ancestry)}${selected.ancestry === "random" ? " (aleat\xF3rio)" : ""}`
    ]);
  }
  if (resolved.dungeonMode !== null && resolved.dungeonSize !== null) {
    lines.push(
      ["Modo", getDungeonModeLabel(resolved.dungeonMode)],
      ["Salas", getDungeonSizeLabel(resolved.dungeonSize)]
    );
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
var OutputCollisionLimitError = class extends Error {
  constructor() {
    super("N\xE3o foi poss\xEDvel encontrar um nome de nota dispon\xEDvel.");
    this.name = "OutputCollisionLimitError";
  }
};
var FALLBACK_MARKDOWN_TITLE = "Sem t\xEDtulo";
var INVALID_FILENAME_CHARACTERS = /[\\/:*?"<>|\u0000-\u001f\u007f]/g;
var RESERVED_WINDOWS_NAME = /^(?:CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\..*)?$/i;
var MAX_STEM_UTF8_BYTES = 220;
var MAX_COLLISION_SUFFIX = 9999;
var MAX_CREATE_ATTEMPTS = 8;
function truncateUtf8(value, maxBytes) {
  const encoder = new TextEncoder();
  let bytes = 0;
  let result = "";
  for (const character of value) {
    const size = encoder.encode(character).length;
    if (bytes + size > maxBytes) break;
    result += character;
    bytes += size;
  }
  return result;
}
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
  let sanitized = title.normalize("NFC").replace(INVALID_FILENAME_CHARACTERS, "-").replace(/\s+/g, " ").trim().replace(/[. ]+$/g, "").replace(/^-+|-+$/g, "").trim();
  if (RESERVED_WINDOWS_NAME.test(sanitized)) {
    sanitized = `_${sanitized}`;
  }
  sanitized = truncateUtf8(sanitized, MAX_STEM_UTF8_BYTES).replace(/[. ]+$/g, "").trim();
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
  for (let suffix = 1; suffix <= MAX_COLLISION_SUFFIX; suffix += 1) {
    const filename = suffix === 1 ? `${stem}.md` : `${stem} - ${suffix}.md`;
    const path = joinVaultPath(normalizedFolder, filename);
    if (vault.getEntry(path) == null) return { path, filename };
  }
  throw new OutputCollisionLimitError();
}
async function createMarkdownOutput(vault, options) {
  const outputFolder = await ensureOutputFolder(vault, options.outputFolder);
  for (let attempt = 0; attempt < MAX_CREATE_ATTEMPTS; attempt += 1) {
    const available = await findAvailableMarkdownPath(vault, outputFolder, options.title);
    try {
      await vault.createFile(available.path, options.content);
      return available;
    } catch (error) {
      if (vault.getEntry(available.path) == null) throw error;
    }
  }
  throw new OutputCollisionLimitError();
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
    this.session = new GenerationSessionController();
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
    this.register(
      this.dependencies.subscribeEditableTarget(() => this.updateInsertionTarget())
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
    this.session.reset();
    this.renderVersion += 1;
  }
  renderView() {
    var _a, _b, _c;
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
      const selected = definition.id === this.session.snapshot.selectedId;
      const button = categories.createEl("button", {
        cls: ["rpg-generator-category", ...selected ? ["is-selected"] : []],
        attr: {
          type: "button",
          role: "radio",
          "aria-checked": String(selected),
          tabindex: selected ? "0" : "-1",
          "aria-label": definition.label
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
      this.session.snapshot.options.tone,
      (value) => this.updateGenerationOption("tone", value)
    );
    const environment = this.createOptionSelect(
      optionGrid,
      "rpg-generator-environment",
      "Ambiente",
      [{ value: "random", label: RANDOM_LABEL }, ...ENVIRONMENTS.map((id) => ({ value: id, label: ENVIRONMENT_LABELS[id] }))],
      this.session.snapshot.options.environment,
      (value) => this.updateGenerationOption("environment", value)
    );
    const complexity = this.createOptionSelect(
      optionGrid,
      "rpg-generator-complexity",
      "Complexidade",
      [{ value: "random", label: RANDOM_LABEL }, ...COMPLEXITIES.map((id) => ({ value: id, label: COMPLEXITY_LABELS[id] }))],
      this.session.snapshot.options.complexity,
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
    ], (_a = this.session.snapshot.options.ancestry) != null ? _a : "random");
    ancestryField.hidden = this.session.snapshot.selectedId !== "npc";
    const dungeonModeField = this.createOptionField(
      optionGrid,
      "rpg-generator-dungeon-mode",
      "Modo"
    );
    const dungeonMode = dungeonModeField.createEl("select", {
      cls: "rpg-generator-option-select",
      attr: { id: "rpg-generator-dungeon-mode" }
    });
    this.addSelectOptions(
      dungeonMode,
      DUNGEON_MODES.map((id) => ({ value: id, label: DUNGEON_MODE_LABELS[id] })),
      (_b = this.session.snapshot.options.dungeonMode) != null ? _b : "story"
    );
    dungeonMode.addEventListener(
      "change",
      () => this.updateGenerationOption(
        "dungeonMode",
        dungeonMode.value
      )
    );
    dungeonModeField.hidden = this.session.snapshot.selectedId !== "dungeon";
    const dungeonSizeField = this.createOptionField(
      optionGrid,
      "rpg-generator-dungeon-size",
      "Tamanho"
    );
    const dungeonSize = dungeonSizeField.createEl("select", {
      cls: "rpg-generator-option-select",
      attr: { id: "rpg-generator-dungeon-size" }
    });
    this.addSelectOptions(
      dungeonSize,
      DUNGEON_ROOM_COUNTS.map((size) => ({
        value: String(size),
        label: DUNGEON_SIZE_LABELS[size]
      })),
      String((_c = this.session.snapshot.options.dungeonSize) != null ? _c : 5)
    );
    dungeonSize.addEventListener(
      "change",
      () => this.updateGenerationOption(
        "dungeonSize",
        Number(dungeonSize.value)
      )
    );
    dungeonSizeField.hidden = this.session.snapshot.selectedId !== "dungeon";
    this.optionSelects = {
      tone,
      environment,
      complexity,
      ancestry,
      ancestryField,
      dungeonMode,
      dungeonModeField,
      dungeonSize,
      dungeonSizeField
    };
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
    this.session.updateOption(key, value);
    this.clearCurrentResult("Resultado limpo ao alterar op\xE7\xF5es");
  }
  clearCurrentResult(status) {
    var _a;
    this.session.clearResult();
    this.renderVersion += 1;
    this.updateControls();
    this.updateResultText();
    (_a = this.liveStatus) == null ? void 0 : _a.setText(status);
  }
  selectCategory(id) {
    if (!this.session.selectGenerator(id)) return;
    for (const [categoryId, button] of this.categoryButtons.entries()) {
      const selected = categoryId === id;
      button.setAttr("aria-checked", String(selected));
      button.setAttr("tabindex", selected ? "0" : "-1");
      button.toggleClass("is-selected", selected);
    }
    if (this.optionSelects) {
      this.optionSelects.ancestryField.hidden = id !== "npc";
      this.optionSelects.dungeonModeField.hidden = id !== "dungeon";
      this.optionSelects.dungeonSizeField.hidden = id !== "dungeon";
    }
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
    if (!nextId) return;
    this.selectCategory(nextId);
    (_a = this.categoryButtons.get(nextId)) == null ? void 0 : _a.focus();
  }
  generateResult() {
    var _a;
    const attempt = this.session.generate(new Random());
    if (!attempt.ok) {
      this.handleGenerationError(attempt.error);
      return;
    }
    const result = attempt.result;
    this.updateControls();
    this.updateResultText();
    (_a = this.liveStatus) == null ? void 0 : _a.setText(`Novo resultado de ${result.label} gerado`);
  }
  handleGenerationError(error) {
    var _a, _b;
    if (error instanceof DungeonMappingError) {
      console.error("[Gerador de RPG] Falha de mapeamento de masmorra", {
        code: error.code,
        message: error.message
      });
      (_a = this.liveStatus) == null ? void 0 : _a.setText(
        "Falha ao mapear a masmorra; o resultado anterior foi preservado"
      );
      new import_obsidian2.Notice(
        "N\xE3o foi poss\xEDvel mapear a masmorra. O resultado anterior foi preservado."
      );
      return;
    }
    console.error("[Gerador de RPG] Falha de gera\xE7\xE3o", error);
    (_b = this.liveStatus) == null ? void 0 : _b.setText(
      "Falha ao gerar; o resultado anterior foi preservado"
    );
    new import_obsidian2.Notice("N\xE3o foi poss\xEDvel gerar o resultado. O resultado anterior foi preservado.");
  }
  updateControls() {
    if (this.primaryButton) {
      const currentResult = this.session.snapshot.currentResult;
      const label = (currentResult == null ? void 0 : currentResult.id) === this.session.snapshot.selectedId ? "Rerrolar" : "Gerar";
      this.primaryButton.setText(label);
    }
    const hasResult = this.session.snapshot.currentResult !== null;
    const target = this.dependencies.getEditableTarget();
    if (this.copyTextButton) this.copyTextButton.disabled = !hasResult;
    if (this.copyMarkdownButton) this.copyMarkdownButton.disabled = !hasResult;
    if (this.createButton) this.createButton.disabled = !hasResult || this.session.snapshot.creatingNote;
    if (this.insertButton) this.insertButton.disabled = !hasResult || target === null;
    this.setInsertionTarget(target);
  }
  updateInsertionTarget() {
    const target = this.dependencies.getEditableTarget();
    this.setInsertionTarget(target);
    if (this.insertButton) {
      this.insertButton.disabled = this.session.snapshot.currentResult === null || target === null;
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
    const result = this.session.snapshot.currentResult;
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
        this.appendDungeonMap(result);
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
  appendDungeonMap(result) {
    var _a;
    const map = (_a = result.dungeon) == null ? void 0 : _a.map;
    if (!map || !this.resultText) return;
    const namespace = "http://www.w3.org/2000/svg";
    const roomById = new Map(map.rooms.map((room) => [room.id, room]));
    const maxX = Math.max(...map.rooms.map((room) => room.x));
    const maxY = Math.max(...map.rooms.map((room) => room.y));
    const container = this.resultText.createDiv({ cls: "rpg-dungeon-map" });
    container.createEl("h4", { text: "Mapa abstrato" });
    const frame = container.createDiv({ cls: "rpg-dungeon-map-frame" });
    const svg = document.createElementNS(namespace, "svg");
    const titleId = `rpg-dungeon-map-title-${this.renderVersion}`;
    const descriptionId = `rpg-dungeon-map-description-${this.renderVersion}`;
    svg.setAttribute("viewBox", `0 0 ${maxX + 70} ${maxY + 65}`);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-labelledby", `${titleId} ${descriptionId}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    const title = document.createElementNS(namespace, "title");
    title.setAttribute("id", titleId);
    title.textContent = "Mapa abstrato da masmorra";
    svg.appendChild(title);
    const description = document.createElementNS(namespace, "desc");
    description.setAttribute("id", descriptionId);
    description.textContent = map.accessibleLabel;
    svg.appendChild(description);
    for (const connection of map.edges) {
      const from = roomById.get(connection.from);
      const to = roomById.get(connection.to);
      if (!from || !to) continue;
      const line = document.createElementNS(namespace, "line");
      line.setAttribute("x1", String(from.x));
      line.setAttribute("y1", String(from.y));
      line.setAttribute("x2", String(to.x));
      line.setAttribute("y2", String(to.y));
      line.setAttribute(
        "class",
        connection.kind === "shortcut" ? "rpg-dungeon-map-edge is-shortcut" : "rpg-dungeon-map-edge"
      );
      svg.appendChild(line);
    }
    for (const room of map.rooms) {
      const group = document.createElementNS(namespace, "g");
      group.setAttribute("class", "rpg-dungeon-map-room");
      const roomTitle = document.createElementNS(namespace, "title");
      const featureSummary = room.features.map((feature) => dungeonFeatureLabel(feature)).join(", ");
      roomTitle.textContent = [
        `Sala ${room.number}: ${room.role}.`,
        featureSummary ? `Marcadores do mestre: ${featureSummary}.` : ""
      ].filter(Boolean).join(" ");
      group.appendChild(roomTitle);
      const rect = document.createElementNS(namespace, "rect");
      rect.setAttribute("x", String(room.x - 28));
      rect.setAttribute("y", String(room.y - 22));
      rect.setAttribute("width", "56");
      rect.setAttribute("height", "44");
      rect.setAttribute("rx", "8");
      group.appendChild(rect);
      const number = document.createElementNS(namespace, "text");
      number.setAttribute("x", String(room.x));
      number.setAttribute("y", String(room.y + 5));
      number.setAttribute("text-anchor", "middle");
      number.setAttribute("class", "rpg-dungeon-map-number");
      number.textContent = String(room.number).padStart(2, "0");
      group.appendChild(number);
      if (room.features.length > 0) {
        const marker = document.createElementNS(namespace, "text");
        marker.setAttribute("x", String(room.x + 23));
        marker.setAttribute("y", String(room.y - 14));
        marker.setAttribute("text-anchor", "middle");
        marker.setAttribute("class", "rpg-dungeon-map-marker");
        marker.textContent = room.features.map((feature) => dungeonFeatureLabel(feature).charAt(0)).join("");
        group.appendChild(marker);
      }
      const role = document.createElementNS(namespace, "text");
      role.setAttribute("x", String(room.x));
      role.setAttribute("y", String(room.y + 39));
      role.setAttribute("text-anchor", "middle");
      role.setAttribute("class", "rpg-dungeon-map-role");
      role.textContent = room.role;
      group.appendChild(role);
      svg.appendChild(group);
    }
    frame.appendChild(svg);
    container.createEl("p", {
      cls: "rpg-dungeon-map-legend",
      text: "Linhas tracejadas indicam atalhos. Marcadores: S segredo, A armadilha, E encontro, R recompensa."
    });
  }
  removeRenderComponent() {
    if (!this.renderComponent) return;
    this.removeChild(this.renderComponent);
    this.renderComponent = null;
  }
  async copyResult(format) {
    const result = this.session.snapshot.currentResult;
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
    const result = this.session.snapshot.currentResult;
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
    const result = this.session.snapshot.currentResult;
    if (!result || this.session.snapshot.creatingNote) return;
    this.session.setCreatingNote(true);
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
      this.session.setCreatingNote(false);
      this.updateControls();
    }
  }
};

// src/main.ts
var RpgRandomGeneratorPlugin = class extends import_obsidian3.Plugin {
  constructor() {
    super(...arguments);
    this.lastEditableTarget = null;
    this.editableTargetChanges = new MutableStore(0);
  }
  async onload() {
    const settings = normalizeSettings(await this.loadData());
    this.settingsRepository = new SettingsRepository(settings, async (next) => {
      await this.saveData({ outputFolder: next.outputFolder });
    });
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", (leaf) => this.captureFromLeaf(leaf))
    );
    this.registerEvent(
      this.app.workspace.on("layout-change", () => {
        const version = this.editableTargetChanges.get();
        this.captureFromActiveLeaf();
        if (this.editableTargetChanges.get() === version) {
          this.editableTargetChanges.notify();
        }
      })
    );
    this.registerEvent(
      this.app.workspace.on("file-open", () => this.captureFromActiveLeaf())
    );
    this.captureFromActiveLeaf();
    this.registerView(
      VIEW_TYPE_RPG_GENERATOR,
      (leaf) => new GeneratorView(leaf, {
        settings: this.settingsRepository.current,
        getEditableTarget: () => this.getEditableTarget(),
        subscribeEditableTarget: (listener) => this.editableTargetChanges.subscribe(listener)
      })
    );
    this.addSettingTab(
      new RpgRandomGeneratorSettingTab(this.app, this, {
        settings: this.settingsRepository.current,
        saveSettings: (settings2) => this.saveSettings(settings2)
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
    await this.settingsRepository.save(settings);
  }
  captureFromActiveLeaf() {
    var _a;
    this.captureFromLeaf((_a = this.app.workspace.activeLeaf) != null ? _a : null);
  }
  captureFromLeaf(leaf) {
    if (!leaf || !(leaf.view instanceof import_obsidian3.MarkdownView)) return;
    this.captureFromMarkdownView(leaf, leaf.view.editor);
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
    this.editableTargetChanges.set(this.editableTargetChanges.get() + 1);
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
    const existingLeaf = existingLeaves[0];
    if (existingLeaf) {
      this.app.workspace.revealLeaf(existingLeaf);
      return;
    }
    const leaf = this.app.workspace.getRightLeaf(false);
    if (!leaf) return;
    await leaf.setViewState({ type: VIEW_TYPE_RPG_GENERATOR, active: true });
    this.app.workspace.revealLeaf(leaf);
  }
};
