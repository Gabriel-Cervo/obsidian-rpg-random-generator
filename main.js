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
var PEOPLE = [
  {
    id: "humanos",
    label: "Humano",
    article: "um",
    noun: "humano",
    givenNames: ["Adel", "Brena", "Caio", "Dalia", "Eron", "L\xEDvia", "Mara", "Nilo", "Oren", "T\xE1lia", "Vera", "Yago"],
    familyNames: ["Valen\xE7a", "Moura", "Alvar", "Ribeiro", "Serrat", "Vilar", "Candeia", "Brum"],
    compoundFamilyName: false
  },
  {
    id: "elfos",
    label: "Elfo",
    article: "um",
    noun: "elfo",
    givenNames: ["Aelion", "Elaris", "Ilyra", "Lethan", "Maelis", "Naeviel", "Orian", "Saelith", "Thalion", "Vaelis", "Ylwen", "Zoreth"],
    familyNames: ["da Lua Velada", "Folha Serena", "Vento de \xC2mbar", "do Crep\xFAsculo", "Canto de Prata", "Raiz Antiga"],
    compoundFamilyName: true
  },
  {
    id: "anoes",
    label: "An\xE3o",
    article: "um",
    noun: "an\xE3o",
    givenNames: ["Bori", "Dagna", "Dorrik", "Greda", "Keld", "Marn", "Runa", "Tovin", "Varka", "Brom", "Hedra", "Orsi"],
    familyNames: ["Barbaferro", "Pedrafundida", "Martelo-Seco", "Punho de Carvalho", "Filho da Bigorna", "Escudo Rachado"],
    compoundFamilyName: true
  },
  {
    id: "halflings",
    label: "Halfling",
    article: "um",
    noun: "halfling",
    givenNames: ["Bela", "Ciro", "Dori", "Fina", "Joca", "Luma", "Milo", "Nena", "Pipo", "Rina", "T\xE9o", "Vivi"],
    familyNames: ["P\xE9-Leve", "da Colina", "Fub\xE1", "Boa-Tigela", "Folha-Mansa", "Tr\xEAs Panelas"],
    compoundFamilyName: true
  },
  {
    id: "orcs",
    label: "Orc",
    article: "um",
    noun: "orc",
    givenNames: ["Brakka", "Drog", "Ghorra", "Krag", "Morga", "Ruk", "Sharga", "Thokk", "Ugra", "Vorga", "Zakka"],
    familyNames: ["Quebra-Lan\xE7a", "Olho Cinzento", "da Cinza", "Presas de Ferro", "Corta-Correntes", "Trov\xE3o Baixo"],
    compoundFamilyName: true
  },
  {
    id: "goblins",
    label: "Goblin",
    article: "um",
    noun: "goblin",
    givenNames: ["Bik", "Grix", "Keka", "Mik", "Nix", "Poka", "Rikk", "Snik", "Teka", "Vix", "Zik"],
    familyNames: ["Catado", "Dente-Torto", "da Lata", "P\xE9-de-Lama", "Ouve-Tudo", "Sobra de Fogo"],
    compoundFamilyName: true
  },
  {
    id: "infernis",
    label: "Infernis",
    article: "um",
    noun: "infernis",
    givenNames: ["Azael", "Cireth", "Draziel", "Ivera", "Kael", "Lazra", "Mavren", "Nerez", "Ravael", "Sazra", "Veyra"],
    familyNames: ["Brasa-Viva", "da \xDAltima Vela", "Cinza Rubra", "Voz de Vidro", "do Pacto Partido", "Chifre Negro"],
    compoundFamilyName: true
  },
  {
    id: "gigantes",
    label: "Gigante",
    article: "um",
    noun: "gigante",
    givenNames: ["Arvok", "Brunda", "Drom", "Eygra", "Gorun", "Haldra", "Jorv", "Keldun", "Mavra", "Orvak", "Thyra"],
    familyNames: ["Que Caminha nas Nuvens", "P\xE9-de-Montanha", "Voz do Trov\xE3o", "Quebra-Picos", "do Vale Profundo", "M\xE3o de Granito"],
    compoundFamilyName: true
  },
  {
    id: "quachos",
    label: "Quacho",
    article: "um",
    noun: "quacho",
    givenNames: ["Bap", "Goga", "Kru", "Lopo", "Mumu", "Nok", "Paku", "Ribi", "Sapo", "Togo", "Wek"],
    familyNames: ["Olho-de-Lagoa", "Pulo-Largo", "da Chuva", "L\xEDngua-R\xE1pida", "Barriga-Verde", "Canto-da-Margem"],
    compoundFamilyName: true
  },
  {
    id: "simios",
    label: "S\xEDmio",
    article: "um",
    noun: "s\xEDmio",
    givenNames: ["Baku", "Duma", "Goro", "Jaka", "Kibo", "Luma", "Mako", "Nara", "Paku", "Roko", "Tamu", "Zuri"],
    familyNames: ["M\xE3o-de-Copa", "do Galho Alto", "Olho de Fruta", "Pulo-Selvagem", "da Mata Vermelha", "Riso-Largo"],
    compoundFamilyName: true
  },
  {
    id: "clanks",
    label: "Clank",
    article: "um",
    noun: "clank",
    givenNames: ["Axiom", "Biela", "Cifra", "Elo-7", "Ferro", "\xCDon", "Lacre", "M\xF3dulo", "Nexo", "Parafuso", "Rivet", "V\xE1lvula"],
    familyNames: ["da Oficina Norte", "Unidade de Cobre", "Linha-03", "da C\xE2mara Azul", "Protocolo Antigo", "Modelo Errante"],
    compoundFamilyName: true
  },
  {
    id: "faunos",
    label: "Fauno",
    article: "um",
    noun: "fauno",
    givenNames: ["Aster", "Brisa", "D\xE1lia", "Faron", "Lira", "Mirt", "Neris", "P\xE3rio", "Silen", "T\xE1lia", "Vime"],
    familyNames: ["P\xE9-de-Videira", "do Bosque Claro", "Chifre Dourado", "Riso de Musgo", "da Colina Verde", "Folha de Outono"],
    compoundFamilyName: true
  },
  {
    id: "fadas",
    label: "Fada",
    article: "uma",
    noun: "fada",
    givenNames: ["Avel\xE3", "Bril", "Cintila", "Eira", "Fira", "Lunel", "M\xE9li", "Nin", "Orvalha", "P\xE9rola", "Sori"],
    familyNames: ["Luz-de-Orvalho", "Asa de Primavera", "do Anel de Cogumelos", "Sopro de Lua", "Riso de P\xF3len", "da Folha Azul"],
    compoundFamilyName: true
  },
  {
    id: "fungrils",
    label: "Fungril",
    article: "um",
    noun: "fungril",
    givenNames: ["Agar", "Boleto", "Cepa", "Fungo", "Hifa", "Morta", "N\xFAcleo", "Ostra", "P\xEDleo", "Spor", "Trufa"],
    familyNames: ["da Cova \xDAmida", "Esporo Vermelho", "Raiz de Musgo", "Chap\xE9u P\xE1lido", "Col\xF4nia Baixa", "do Subsolo"],
    compoundFamilyName: true
  },
  {
    id: "firbolgs",
    label: "Firbolg",
    article: "um",
    noun: "firbolg",
    givenNames: ["Aldo", "Bruma", "Dara", "Eogan", "Fenna", "Garan", "Iona", "Muir", "Nuala", "Oran", "Tara"],
    familyNames: ["Casco de Carvalho", "do Prado Silencioso", "Passo Pesado", "Guardi\xE3o do Vale", "Chifre de Cedro", "da N\xE9voa Alta"],
    compoundFamilyName: true
  },
  {
    id: "galapas",
    label: "Galapa",
    article: "um",
    noun: "galapa",
    givenNames: ["Aru", "Bato", "Cora", "Daku", "Guma", "Iru", "Kora", "Matu", "Nabu", "Teka", "Uru"],
    familyNames: ["Casco-de-Rio", "Passo Lento", "da Mar\xE9 Antiga", "Pedra nas Costas", "do Mangue Azul", "Escudo Vivo"],
    compoundFamilyName: true
  },
  {
    id: "kataris",
    label: "Katari",
    article: "um",
    noun: "katari",
    givenNames: ["Asha", "Barek", "Cira", "Daro", "Jassa", "Kesh", "Lira", "Marek", "Nissa", "Rava", "Tarek", "Vesha"],
    familyNames: ["Passo de Cinza", "Olho de Lua", "Garra Serena", "Cauda Longa", "do Salto Alto", "Ronronar Sombrio"],
    compoundFamilyName: true
  }
];
var profileMap = new Map(PEOPLE.map((profile) => [profile.id, profile]));
function cleanName(value) {
  return value.replace(/[^a-zA-ZÀ-ÿ-]/g, "").replace(/-{2,}/g, "-").replace(/^-|-$/g, "");
}
function titleCase(value) {
  return value.length === 0 ? value : value[0].toLocaleUpperCase("pt-BR") + value.slice(1);
}
function markovName(samples, random) {
  var _a;
  const transitions = /* @__PURE__ */ new Map();
  for (const sample of samples) {
    const normalized = cleanName(sample).toLocaleLowerCase("pt-BR");
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
function getPeopleProfile(id) {
  const profile = profileMap.get(id);
  if (!profile) throw new Error(`Unknown people profile: ${id}`);
  return profile;
}
function randomPeople(random) {
  return random.pick(PEOPLE);
}
function generateName(id, random) {
  const profile = getPeopleProfile(id);
  const firstName = markovName(profile.givenNames, random);
  const familyName = random.pick(profile.familyNames);
  if (profile.compoundFamilyName || random.chance(0.35)) {
    return `${firstName} ${familyName}`;
  }
  return firstName;
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

// src/tables.ts
var NPC_ROLES = [
  "ferreiro de estrada",
  "guarda de port\xE3o",
  "mercadora de rel\xEDquias",
  "curandeiro de aldeia",
  "batedora de fronteira",
  "cozinheiro de taverna",
  "ca\xE7adora de monstros",
  "escriba de um nobre",
  "contrabandista de po\xE7\xF5es",
  "peregrino sem templo",
  "artista itinerante",
  "cobradora de d\xEDvidas",
  "carpinteiro naval",
  "guia de p\xE2ntanos",
  "aprendiz de alquimista",
  "mensageira de uma guilda"
];
var NPC_MORALITIES = [
  "\xE9 de cora\xE7\xE3o leal",
  "est\xE1 sempre em busca de uma vantagem",
  "tem moral duvidosa",
  "carrega uma culpa antiga",
  "dedica-se a uma causa justa",
  "reage com crueldade quando \xE9 amea\xE7ado",
  "busca reconhecimento a qualquer custo",
  "quebra promessas quando isso lhe conv\xE9m",
  "\xE9 mais gentil do que aparenta",
  "acredita que os fins justificam os meios"
];
var NPC_APPEARANCES = [
  "tem uma cicatriz fina atravessando o queixo e olhos atentos demais",
  "tem baixa estatura e m\xE3os manchadas de tinta e fuligem",
  "prende os cabelos com fios coloridos e usa uma capa cheia de remendos",
  "trabalha como se n\xE3o dormisse h\xE1 dias, mas nunca deixa de observar as portas",
  "usa roupas pr\xE1ticas cobertas por pequenos amuletos de prote\xE7\xE3o",
  "fala com uma voz suave, apesar da express\xE3o severa",
  "carrega uma bolsa pesada de ingredientes, cartas e ferramentas",
  "sorri com facilidade, mas esconde uma queimadura no pulso esquerdo",
  "veste-se com eleg\xE2ncia demais para o lugar onde foi encontrado",
  "fala com as m\xE3os e muda de assunto quando o passado \xE9 mencionado"
];
var NPC_PERSONALITIES = [
  "fazer perguntas antes de responder",
  "tentar transformar qualquer conversa em uma negocia\xE7\xE3o",
  "rir nos momentos mais inconvenientes",
  "memorizar o nome de todos que encontra",
  "procurar qualquer desculpa para continuar falando",
  "oferecer conselhos que nunca foram solicitados",
  "esperar uma trai\xE7\xE3o a cada conversa",
  "tratar desconhecidos como velhos amigos",
  "fingir n\xE3o entender quando uma pergunta \xE9 perigosa",
  "falar de forma direta e raramente se desculpar"
];
var NPC_MOTIVATIONS = [
  "encontrar uma pessoa desaparecida antes que a trilha esfrie",
  "juntar dinheiro para comprar a liberdade de algu\xE9m querido",
  "recuperar um objeto que roubou da pessoa errada",
  "provar seu valor \xE0 pr\xF3pria comunidade",
  "encontrar um lugar seguro para come\xE7ar de novo",
  "investigar sinais de uma amea\xE7a que ningu\xE9m mais acredita existir",
  "quitar uma d\xEDvida feita com uma criatura sobrenatural",
  "descobrir quem est\xE1 sabotando seu trabalho"
];
var NPC_COMPLICATIONS = [
  "em segredo, mant\xE9m uma d\xEDvida com a guilda dos ladr\xF5es",
  "algu\xE9m conhece sua verdadeira identidade e n\xE3o para de seguir seus passos",
  "carrega uma carta que pode iniciar uma guerra local",
  "prometeu entregar uma informa\xE7\xE3o falsa antes do amanhecer",
  "esconde que foi respons\xE1vel pelo problema que agora tenta resolver",
  "tem um aliado poderoso, mas n\xE3o sabe se ainda pode confiar nele",
  "carrega uma maldi\xE7\xE3o que piora sempre que mente",
  "deve escolher entre salvar sua reputa\xE7\xE3o e salvar uma vida"
];
var ANIMAL_COMPANIONS = [
  "um corvo albino chamado Nimbo",
  "uma raposa manca chamada Fa\xEDsca",
  "um urso marrom chamado Bude",
  "uma cabra de chifres dourados chamada Tremo\xE7o",
  "um c\xE3o de guerra chamado Risco",
  "uma coruja que responde pelo nome de Vela",
  "um lagarto azul chamado Pingo",
  "um gato de olhos diferentes chamado Sombra"
];
var LOCATION_NAMES = [
  "Ponte dos Sinos",
  "Torre da N\xE9voa",
  "Mercado das Sete Portas",
  "Bosque do Veado Branco",
  "Santu\xE1rio da \xDAltima Brasa",
  "Caverna do Eco Fundo",
  "Estrada dos Ossos Brancos",
  "Moinho do Corvo",
  "Aldeia de Pedra Baixa",
  "Farol do Mar Interior",
  "Jardim das Est\xE1tuas Dormindo",
  "Fortaleza de Sal"
];
var LOCATION_TYPES = [
  "um posto de com\xE9rcio constru\xEDdo sobre as ru\xEDnas de uma estrada imperial",
  "um lugar de passagem onde viajantes deixam uma moeda antes de seguir",
  "uma comunidade isolada que parece pr\xF3spera demais para a regi\xE3o",
  "um ref\xFAgio escondido entre ra\xEDzes grossas e pedras cobertas de musgo",
  "uma fortaleza abandonada que ainda recebe ordens durante a madrugada",
  "uma constru\xE7\xE3o torta, ampliada por gera\xE7\xF5es sem um \xFAnico plano",
  "uma antiga torre de vigia tomada por vinhas e ninhos"
];
var LOCATION_ATMOSPHERES = [
  "O local cheira a chuva, ferro e flores esmagadas.",
  "De vez em quando, algo bate do outro lado das paredes.",
  "Os moradores falam baixo e deixam uma cadeira vazia em cada mesa.",
  "Luzes quentes aparecem nas janelas mesmo quando o local deveria estar vazio.",
  "A temperatura cai quando algu\xE9m pronuncia o nome do antigo dono.",
  "Marcas recentes cobrem s\xEDmbolos gastos pelo tempo."
];
var LOCATION_FEATURES = [
  "A porta dos fundos s\xF3 abre quando algu\xE9m conta uma lembran\xE7a verdadeira.",
  "Um mapa incompleto mostra caminhos que desaparecem ao amanhecer.",
  "A \xE1gua do po\xE7o reflete lugares que ficam a quil\xF4metros dali.",
  "Uma anfitri\xE3 oferece abrigo, mas exige que ningu\xE9m acenda fogo depois da meia-noite.",
  "A est\xE1tua da pra\xE7a muda de posi\xE7\xE3o quando ningu\xE9m est\xE1 olhando.",
  "Todos conhecem uma sala da casa, mas ningu\xE9m admite ter entrado nela."
];
var LOCATION_HOOKS = [
  "Algu\xE9m paga bem por qualquer informa\xE7\xE3o sobre o que existe sob o lugar.",
  "Um visitante sumiu depois de seguir uma m\xFAsica vinda de dentro das paredes.",
  "Um ritual silencioso destruir\xE1 o lugar em poucos dias.",
  "A comunidade precisa escolher entre partir ou aceitar a prote\xE7\xE3o de uma criatura perigosa.",
  "Um objeto valioso est\xE1 \xE0 vista de todos, mas ningu\xE9m reconhece o que ele \xE9."
];
var QUEST_GIVERS = [
  "uma autoridade local",
  "uma testemunha ferida",
  "a lideran\xE7a de uma pequena comunidade",
  "uma pessoa da nobreza que tenta n\xE3o parecer desesperada",
  "uma crian\xE7a que repete palavras de um sonho",
  "a pessoa respons\xE1vel por um comboio perdido",
  "algu\xE9m que recebeu um press\xE1gio imposs\xEDvel",
  "uma pessoa presa que oferece informa\xE7\xF5es em troca de prote\xE7\xE3o"
];
var QUEST_OBJECTIVES = [
  "recuperar um objeto roubado antes que ele seja vendido",
  "encontrar uma pessoa desaparecida sem alertar quem a levou",
  "escoltar uma testemunha at\xE9 um lugar seguro",
  "descobrir por que uma estrada deixou de aparecer nos mapas",
  "convencer duas comunidades a adiar um conflito",
  "investigar uma ru\xEDna que come\xE7ou a emitir sinais durante a noite",
  "interromper uma troca que acontecer\xE1 em um local secreto",
  "levar uma mensagem que n\xE3o pode ser escrita"
];
var QUEST_COMPLICATIONS = [
  "O contratante esconde uma parte da hist\xF3ria.",
  "O alvo da miss\xE3o tamb\xE9m acredita estar fazendo a coisa certa.",
  "A recompensa pertence a algu\xE9m que n\xE3o pretende entreg\xE1-la voluntariamente.",
  "Cada tentativa de resolver o problema fortalece a amea\xE7a escondida.",
  "O prazo \xE9 curto, mas agir depressa pode colocar inocentes em perigo.",
  "Um aliado confi\xE1vel trabalha secretamente para os dois lados."
];
var QUEST_REWARDS = [
  "uma rel\xEDquia que aponta para um segredo maior",
  "a prote\xE7\xE3o de uma comunidade influente",
  "um mapa para um lugar que n\xE3o aparece em nenhum atlas",
  "uma d\xEDvida de favor que poder\xE1 ser cobrada uma \xFAnica vez",
  "uma pequena fortuna e uma reputa\xE7\xE3o dif\xEDcil de apagar",
  "acesso a uma biblioteca que guarda hist\xF3rias proibidas"
];
var ENCOUNTER_ENVIRONMENTS = [
  "uma estrada estreita entre colinas",
  "um mercado lotado no fim da tarde",
  "uma clareira coberta por n\xE9voa",
  "uma ponte onde o rio corre para cima",
  "um corredor escuro sob uma antiga fortaleza",
  "um acampamento abandonado ainda quente",
  "uma trilha de montanha durante uma tempestade"
];
var ENCOUNTER_SITUATIONS = [
  "uma carro\xE7a quebrada bloqueia a passagem, e seus ocupantes pedem ajuda para conter algo preso sob a lona",
  "uma criatura ferida protege uma caixa de madeira que ainda se move",
  "guardas discutem sobre um prisioneiro que afirma conhecer o futuro de cada pessoa presente",
  "um inc\xEAndio come\xE7a sob o ch\xE3o enquanto uma caravana tenta atravessar",
  "uma prociss\xE3o carrega uma est\xE1tua que parece acompanhar o grupo com os olhos",
  "um duelo est\xE1 prestes a come\xE7ar, mas os dois combatentes pedem que os aventureiros escolham o vencedor",
  "uma crian\xE7a oferece um mapa em troca de prote\xE7\xE3o contra algo invis\xEDvel"
];
var ENCOUNTER_TWISTS = [
  "O perigo vis\xEDvel serve apenas para manter os olhos longe do acampamento.",
  "A suposta v\xEDtima armou a cena para descobrir quem viria ajud\xE1-la.",
  "Vencer pela for\xE7a abre uma passagem que estava selada.",
  "Os envolvidos s\xF3 querem ganhar tempo at\xE9 a mar\xE9 subir.",
  "A criatura tem um motivo leg\xEDtimo e oferece uma troca.",
  "Uma das pessoas presentes usa o rosto de algu\xE9m conhecido pelo grupo."
];
var ENCOUNTER_CHOICES = [
  "H\xE1 tempo para negociar, investigar ou passar \xE0 for\xE7a, mas n\xE3o para fazer os tr\xEAs.",
  "Para resolver o problema, ser\xE1 preciso escolher quem ficar\xE1 para tr\xE1s.",
  "Se ningu\xE9m agir, o problema alcan\xE7ar\xE1 a pr\xF3xima comunidade antes do amanhecer.",
  "Uma decis\xE3o r\xE1pida evita a luta, mas cria uma d\xEDvida.",
  "O grupo precisa descobrir qual dos sinais \xE9 uma armadilha antes que todos desapare\xE7am."
];
var RUMOR_PREMISES = [
  { subject: "o sino enterrado sob a pra\xE7a", claim: "toca sozinho \xE0 meia-noite" },
  { subject: "a rainha da cidade", claim: "nunca aparece em p\xFAblico porque deixou seu corpo em outra cidade" },
  { subject: "a estrada velha do norte", claim: "muda de lugar durante a lua nova" },
  { subject: "um po\xE7o no centro da aldeia", claim: "devolve objetos perdidos, mas cobra uma mem\xF3ria em troca" },
  { subject: "o ferreiro da rua baixa", claim: "n\xE3o envelhece desde que encontrou um martelo enterrado" },
  { subject: "as luzes vistas no topo da montanha", claim: "s\xE3o sinais de que uma antiga porta est\xE1 prestes a se abrir" },
  { subject: "um navio sem tripula\xE7\xE3o", claim: "leva passageiros para portos que desapareceram dos mapas" },
  { subject: "a criatura do moinho", claim: "protege uma passagem usada por algo que ainda est\xE1 acordado" }
];
var RUMOR_SUBJECTS = RUMOR_PREMISES.map(({ subject }) => subject);
var RUMOR_CLAIMS = RUMOR_PREMISES.map(({ claim }) => claim);
var RUMOR_TRUTHS = [
  "\xE9 verdade, mas a consequ\xEAncia foi exagerada",
  "\xE9 uma mentira espalhada para esconder uma pista mais importante",
  "h\xE1 algo de verdade nisso, mas a causa \xE9 outra",
  "s\xF3 acontece quando uma condi\xE7\xE3o espec\xEDfica \xE9 cumprida",
  "come\xE7ou como uma mentira e se tornou verdade depois de um acontecimento recente"
];
var DUNGEON_ENTRIES = [
  "Entrada: o acesso fica atr\xE1s de uma porta comum, mas um guardi\xE3o pede que cada visitante deixe algo para tr\xE1s antes de passar.",
  "Desafio: um mecanismo antigo abre o caminho depois de uma escolha dif\xEDcil ou da interpreta\xE7\xE3o de uma pista incompleta.",
  "Contratempo: o ch\xE3o cede, separa o grupo e revela que algu\xE9m chegou antes, levando parte do tesouro.",
  "Confronto: a amea\xE7a principal conhece os nomes dos invasores e oferece uma barganha antes de atacar.",
  "Recompensa: o pr\xEAmio resolve um problema imediato, mas traz o nome de quem construiu o lugar e o pr\xF3ximo alvo da disputa."
];
var DUNGEON_THEMES = [
  "uma ordem de curandeiros que desapareceu sem deixar corpos",
  "um tesouro que pertence a tr\xEAs herdeiros inimigos",
  "uma criatura adormecida sob as funda\xE7\xF5es",
  "um pacto feito entre uma cidade e o rio que a alimenta",
  "um arquivo capaz de alterar a mem\xF3ria de quem o l\xEA",
  "uma guerra antiga que continua sendo travada por mortos"
];

// src/generators.ts
var LABELS = {
  npc: "NPCs",
  location: "Locais",
  quest: "Miss\xF5es",
  encounter: "Encontros",
  rumor: "Rumores",
  dungeon: "Masmorra"
};
function result(id, title, body) {
  const content = {
    plainText: body,
    markdown: body
  };
  return { id, label: LABELS[id], title, content };
}
function sentenceCase(value) {
  return value.length === 0 ? value : value[0].toLocaleUpperCase("pt-BR") + value.slice(1);
}
function generateNpc(random) {
  const people = randomPeople(random);
  const name = generateName(people.id, random);
  const role = random.pick(NPC_ROLES);
  const morality = random.pick(NPC_MORALITIES);
  const appearance = random.pick(NPC_APPEARANCES);
  const personality = random.pick(NPC_PERSONALITIES);
  const motivation = random.pick(NPC_MOTIVATIONS);
  const complication = random.pick(NPC_COMPLICATIONS);
  const companion = random.chance(0.3) ? ` Viaja com ${random.pick(ANIMAL_COMPANIONS)}.` : "";
  const text = `${name} \xE9 ${people.article} ${people.noun} que trabalha como ${role} e ${morality}. ${sentenceCase(appearance)}. Costuma ${personality}. Procura ${motivation}. ${sentenceCase(complication)}.${companion}`;
  return result("npc", `NPC - ${name}`, text);
}
function generateLocation(random) {
  const name = random.pick(LOCATION_NAMES);
  const type = random.pick(LOCATION_TYPES);
  const atmosphere = random.pick(LOCATION_ATMOSPHERES);
  const feature = random.pick(LOCATION_FEATURES);
  const hook = random.pick(LOCATION_HOOKS);
  const text = `${name} \xE9 ${type}. ${atmosphere} ${feature} ${hook}`;
  return result("location", `Local - ${name}`, text);
}
function generateQuest(random) {
  const giverPeople = randomPeople(random);
  const giverName = generateName(giverPeople.id, random);
  const objective = random.pick(QUEST_OBJECTIVES);
  const complication = random.pick(QUEST_COMPLICATIONS);
  const reward = random.pick(QUEST_REWARDS);
  const location = random.pick(LOCATION_NAMES);
  const giverDetail = random.pick(QUEST_GIVERS);
  const text = `${giverName}, ${giverDetail}, procura aventureiros para ${objective} em ${location}. ${complication} Se tiverem sucesso, receber\xE3o ${reward}.`;
  return result("quest", `Miss\xE3o - ${sentenceCase(objective)}`, text);
}
function generateEncounter(random) {
  const environment = random.pick(ENCOUNTER_ENVIRONMENTS);
  const situation = random.pick(ENCOUNTER_SITUATIONS);
  const twist = random.pick(ENCOUNTER_TWISTS);
  const choice = random.pick(ENCOUNTER_CHOICES);
  const text = `Em ${environment}, ${situation}. ${twist} ${choice}`;
  return result("encounter", `Encontro - ${sentenceCase(environment)}`, text);
}
function generateRumor(random) {
  const premise = random.pick(RUMOR_PREMISES);
  const truth = random.pick(RUMOR_TRUTHS);
  const text = `Corre o boato de que ${premise.subject} ${premise.claim}. Para o mestre: ${truth}.`;
  return result("rumor", `Rumor - ${sentenceCase(premise.subject)}`, text);
}
function generateDungeon(random) {
  const theme = random.pick(DUNGEON_THEMES);
  const rooms = DUNGEON_ENTRIES.map((entry, index) => `${index + 1}. ${entry}`).join("\n");
  const text = `Tema: ${theme}.

${rooms}`;
  return result("dungeon", `Masmorra - ${sentenceCase(theme)}`, text);
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
function generate(id, random = new Random()) {
  return getGenerator(id).generate(random);
}

// src/formatters.ts
function normalizeTitle(title) {
  return title.replace(/\s+/g, " ").trim();
}
function normalizeBody(body) {
  const normalized = body.replace(/\r\n?/g, "\n");
  return normalized.replace(/^(?:[ \t]*\n)+/, "").replace(/(?:\n[ \t]*)+$/, "");
}
function formatWithHeading(level, title, body) {
  const normalizedTitle = normalizeTitle(title);
  const normalizedBody = normalizeBody(body);
  const heading = `${"#".repeat(level)} ${normalizedTitle}`;
  return normalizedBody.length > 0 ? `${heading}

${normalizedBody}` : heading;
}
function formatPlainText(title, body) {
  const normalizedTitle = normalizeTitle(title);
  const normalizedBody = normalizeBody(body);
  return normalizedBody.length > 0 ? `${normalizedTitle}

${normalizedBody}` : normalizedTitle;
}
function toMarkdown(result2, headingLevel) {
  return formatWithHeading(headingLevel, result2.title, result2.content.markdown);
}
function toPlainText(result2) {
  return formatPlainText(result2.title, result2.content.plainText);
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
  const { prefix, suffix } = calculateInsertionBoundaries(before, after);
  return `${prefix}${markdown}${suffix}`;
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
  async setState(_state, result2) {
    await super.setState(_state, result2);
    this.resetEphemeralState();
    this.renderView();
  }
  resetEphemeralState() {
    this.selectedId = "npc";
    this.currentResult = null;
    this.resultKey += 1;
    this.renderVersion += 1;
  }
  renderView() {
    this.contentEl.empty();
    this.contentEl.addClass("rpg-generator-view");
    this.categoryButtons.clear();
    const question = this.contentEl.createEl("p", {
      cls: "rpg-generator-question",
      text: "O que voc\xEA quer gerar?"
    });
    question.setAttr("id", "rpg-generator-question");
    const categories = this.contentEl.createDiv({ cls: "rpg-generator-categories" });
    categories.setAttr("role", "radiogroup");
    categories.setAttr("aria-labelledby", "rpg-generator-question");
    for (const definition of GENERATORS) {
      const selected = definition.id === this.selectedId;
      const button = categories.createEl("button", {
        cls: ["rpg-generator-category", ...selected ? ["is-selected"] : []],
        attr: {
          type: "button",
          role: "radio",
          "aria-checked": String(selected),
          tabindex: selected ? "0" : "-1",
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
  selectCategory(id) {
    var _a;
    if (id === this.selectedId) return;
    this.selectedId = id;
    this.currentResult = null;
    this.resultKey += 1;
    this.renderVersion += 1;
    for (const [categoryId, button] of this.categoryButtons.entries()) {
      const selected = categoryId === id;
      button.setAttr("aria-checked", String(selected));
      button.setAttr("tabindex", selected ? "0" : "-1");
      button.toggleClass("is-selected", selected);
    }
    this.updateControls();
    this.updateResultText();
    (_a = this.liveStatus) == null ? void 0 : _a.setText("Resultado limpo ao trocar de categoria");
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
      const result2 = generate(this.selectedId, new Random());
      this.currentResult = result2;
      this.resultKey += 1;
      this.updateControls();
      this.updateResultText();
      (_a = this.liveStatus) == null ? void 0 : _a.setText(`Novo resultado de ${result2.label} gerado`);
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
    const result2 = this.currentResult;
    const renderVersion = ++this.renderVersion;
    this.resultText.empty();
    if (!result2) {
      this.resultHeader.setText("Resultado");
      this.resultText.setText("Escolha um gerador e clique em \u201CGerar\u201D.");
      this.resultText.addClass("is-empty");
      this.resultText.setAttr("aria-label", "Nenhum resultado gerado");
      return;
    }
    this.resultHeader.setText("Resultado");
    this.resultText.removeClass("is-empty");
    this.resultText.setAttr("aria-label", `Resultado: ${result2.label}`);
    const rendered = document.createElement("div");
    const renderComponent = this.addChild(new import_obsidian2.Component());
    this.renderComponent = renderComponent;
    try {
      void import_obsidian2.MarkdownRenderer.render(this.app, toMarkdown(result2, 1), rendered, "", renderComponent).then(() => {
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
    const result2 = this.currentResult;
    if (!result2) return;
    const content = format === "text" ? toPlainText(result2) : toMarkdown(result2, 1);
    try {
      await navigator.clipboard.writeText(content);
      new import_obsidian2.Notice(format === "text" ? "Texto copiado" : "Markdown copiado");
    } catch (e) {
      new import_obsidian2.Notice("N\xE3o foi poss\xEDvel copiar o conte\xFAdo");
    }
  }
  insertResult() {
    var _a;
    const result2 = this.currentResult;
    if (!result2) return;
    const target = this.dependencies.getEditableTarget();
    this.setInsertionTarget(target);
    if (!target) {
      this.updateInsertionTarget();
      new import_obsidian2.Notice("N\xE3o h\xE1 uma nota Markdown edit\xE1vel selecionada");
      return;
    }
    try {
      const markdown = toMarkdown(result2, 2);
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
    const result2 = this.currentResult;
    if (!result2 || this.creatingNote) return;
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
        title: result2.title,
        content: toMarkdown(result2, 1)
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
