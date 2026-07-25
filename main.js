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
var import_obsidian2 = require("obsidian");

// src/view.ts
var import_obsidian = require("obsidian");

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
  "de cora\xE7\xE3o leal",
  "guiado pela ambi\xE7\xE3o",
  "de moral duvidosa",
  "movido por uma culpa antiga",
  "devoto de uma causa justa",
  "cruel quando se sente amea\xE7ado",
  "obcecado por reconhecimento",
  "disposto a quebrar qualquer promessa",
  "mais gentil do que aparenta",
  "convencido de que o fim justifica os meios"
];
var NPC_APPEARANCES = [
  "tem uma cicatriz fina atravessando o queixo e olhos atentos demais",
  "\xE9 baixo e robusto, com m\xE3os manchadas de tinta e fuligem",
  "tem cabelos presos com fios coloridos e uma capa cheia de remendos",
  "parece sempre cansado, mas nunca deixa de observar as portas",
  "usa roupas pr\xE1ticas cobertas por pequenos amuletos de prote\xE7\xE3o",
  "tem uma voz suave que contrasta com a express\xE3o severa",
  "carrega uma bolsa pesada de ingredientes, cartas e ferramentas",
  "tem um sorriso f\xE1cil e uma marca de queimadura no pulso esquerdo",
  "\xE9 elegante demais para o lugar onde foi encontrado",
  "fala com as m\xE3os e muda de assunto quando o passado \xE9 mencionado"
];
var NPC_PERSONALITIES = [
  "faz perguntas antes de responder",
  "tenta transformar qualquer conversa em uma negocia\xE7\xE3o",
  "ri nos momentos mais inconvenientes",
  "memoriza o nome de todos que encontra",
  "n\xE3o suporta ficar em sil\xEAncio",
  "oferece conselhos que nunca foram solicitados",
  "parece estar sempre esperando uma trai\xE7\xE3o",
  "trata desconhecidos como velhos amigos",
  "finge n\xE3o entender quando uma pergunta \xE9 perigosa",
  "fala de forma direta e raramente se desculpa"
];
var NPC_MOTIVATIONS = [
  "procura uma pessoa desaparecida antes que a trilha esfrie",
  "junta dinheiro para comprar a liberdade de algu\xE9m querido",
  "tenta recuperar um objeto que roubou da pessoa errada",
  "busca uma oportunidade para provar seu valor \xE0 pr\xF3pria comunidade",
  "quer encontrar um lugar seguro para come\xE7ar de novo",
  "investiga sinais de uma amea\xE7a que ningu\xE9m mais acredita existir",
  "pretende quitar uma d\xEDvida feita com uma criatura sobrenatural",
  "espera descobrir quem est\xE1 sabotando seu trabalho"
];
var NPC_COMPLICATIONS = [
  "em segredo, mant\xE9m uma d\xEDvida com a guilda dos ladr\xF5es",
  "est\xE1 sendo seguido por algu\xE9m que conhece sua verdadeira identidade",
  "carrega uma carta que pode iniciar uma guerra local",
  "prometeu entregar uma informa\xE7\xE3o falsa antes do amanhecer",
  "esconde que foi respons\xE1vel pelo problema que agora tenta resolver",
  "tem um aliado poderoso, mas n\xE3o sabe se ainda pode confiar nele",
  "foi marcado por uma maldi\xE7\xE3o que piora sempre que mente",
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
  "um posto de com\xE9rcio constru\xEDdo sobre ru\xEDnas muito mais antigas",
  "um lugar de passagem onde viajantes deixam oferendas antes de seguir viagem",
  "uma comunidade isolada que parece pr\xF3spera demais para a regi\xE3o",
  "um ref\xFAgio escondido entre ra\xEDzes, neblina e pedras cobertas de musgo",
  "um santu\xE1rio abandonado que ainda recebe visitantes durante a madrugada",
  "uma constru\xE7\xE3o torta, ampliada tantas vezes que nenhum c\xF4modo combina com o outro",
  "uma antiga fortifica\xE7\xE3o tomada por plantas, animais e pequenos sinais de vida recente"
];
var LOCATION_ATMOSPHERES = [
  "O ar cheira a chuva, ferro e flores esmagadas.",
  "O lugar \xE9 silencioso, exceto por um som ritmado vindo de algum ponto subterr\xE2neo.",
  "As pessoas falam baixo e evitam olhar para a mesma dire\xE7\xE3o.",
  "Luzes quentes aparecem nas janelas mesmo quando o local deveria estar vazio.",
  "A temperatura muda sempre que algu\xE9m menciona o nome de um antigo morador.",
  "Marcas recentes foram deixadas sobre s\xEDmbolos que parecem ter s\xE9culos de idade."
];
var LOCATION_FEATURES = [
  "Uma porta sem fechadura s\xF3 se abre quando algu\xE9m conta uma lembran\xE7a verdadeira.",
  "Um mapa incompleto mostra caminhos que n\xE3o existem mais durante o dia.",
  "A \xE1gua local reflete lugares que ficam a quil\xF4metros dali.",
  "Um morador oferece abrigo, mas pede que ningu\xE9m acenda fogo depois da meia-noite.",
  "Uma est\xE1tua muda de posi\xE7\xE3o sempre que o grupo deixa de observ\xE1-la.",
  "H\xE1 uma sala que todos conhecem, mas ningu\xE9m admite ter visitado."
];
var LOCATION_HOOKS = [
  "Algu\xE9m est\xE1 pagando para que aventureiros descubram o que existe sob o lugar.",
  "Um visitante desapareceu depois de seguir uma m\xFAsica que vinha de dentro das paredes.",
  "O local ser\xE1 destru\xEDdo em poucos dias se ningu\xE9m interromper um ritual silencioso.",
  "A comunidade precisa decidir entre abandonar sua casa ou aceitar a prote\xE7\xE3o de uma criatura perigosa.",
  "Um objeto valioso est\xE1 escondido \xE0 vista de todos, mas s\xF3 pode ser reconhecido por quem conhece sua hist\xF3ria."
];
var QUEST_GIVERS = [
  "uma velha cart\xF3grafa",
  "um mensageiro ferido",
  "a l\xEDder de uma pequena comunidade",
  "um nobre que tenta n\xE3o parecer desesperado",
  "uma crian\xE7a que repete palavras de um sonho",
  "um comerciante que perdeu seu comboio",
  "uma sacerdotisa que recebeu um press\xE1gio imposs\xEDvel",
  "um prisioneiro que oferece informa\xE7\xF5es em troca de prote\xE7\xE3o"
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
  "A pessoa que pediu ajuda n\xE3o contou toda a verdade.",
  "O alvo da miss\xE3o tamb\xE9m acredita estar fazendo a coisa certa.",
  "A recompensa pertence a algu\xE9m que n\xE3o pretende entreg\xE1-la voluntariamente.",
  "Cada tentativa de resolver o problema fortalece a amea\xE7a escondida.",
  "H\xE1 um prazo curto, mas agir depressa pode colocar inocentes em perigo.",
  "Um aliado confi\xE1vel est\xE1 secretamente trabalhando para os dois lados."
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
  "um grupo de viajantes bloqueia a passagem e pede ajuda para mover algo que n\xE3o deveria estar vivo",
  "uma criatura ferida tenta impedir que algu\xE9m se aproxime de uma pequena caixa de madeira",
  "guardas discutem sobre um prisioneiro que afirma conhecer o futuro de cada pessoa presente",
  "um inc\xEAndio come\xE7a debaixo da terra enquanto uma caravana tenta atravessar o local",
  "uma prociss\xE3o silenciosa carrega uma est\xE1tua que parece acompanhar o grupo com os olhos",
  "um duelo est\xE1 prestes a come\xE7ar, mas os dois combatentes pedem que os aventureiros escolham um lado",
  "uma crian\xE7a oferece um mapa em troca de ser levada para longe de uma criatura invis\xEDvel"
];
var ENCOUNTER_TWISTS = [
  "O perigo vis\xEDvel \xE9 apenas uma distra\xE7\xE3o para algo que j\xE1 entrou no acampamento.",
  "A suposta v\xEDtima organizou a situa\xE7\xE3o e est\xE1 testando quem aparece para ajudar.",
  "Resolver o encontro pela for\xE7a faz com que uma amea\xE7a muito maior seja libertada.",
  "Os envolvidos n\xE3o querem vencer; querem atrasar o grupo at\xE9 que outra coisa aconte\xE7a.",
  "A criatura tem um motivo leg\xEDtimo para estar ali e oferece uma troca inesperada.",
  "Entre os presentes existe algu\xE9m usando o rosto de uma pessoa conhecida pelos aventureiros."
];
var ENCOUNTER_CHOICES = [
  "O grupo pode negociar, investigar os arredores ou assumir o risco de passar \xE0 for\xE7a.",
  "A melhor solu\xE7\xE3o exige escolher quem ser\xE1 protegido e quem ficar\xE1 para tr\xE1s.",
  "Se ningu\xE9m agir, o problema se espalhar\xE1 para a pr\xF3xima comunidade no caminho.",
  "Uma decis\xE3o r\xE1pida pode evitar uma luta, mas deixar\xE1 uma d\xEDvida dif\xEDcil de explicar.",
  "Os aventureiros t\xEAm poucos minutos para descobrir qual dos sinais \xE9 uma armadilha."
];
var RUMOR_SUBJECTS = [
  "o sino enterrado sob a pra\xE7a",
  "a rainha que nunca aparece em p\xFAblico",
  "a estrada que muda de lugar durante a lua nova",
  "um po\xE7o que devolve objetos perdidos",
  "o ferreiro que n\xE3o envelhece",
  "as luzes vistas no topo da montanha",
  "um navio que navega sem tripula\xE7\xE3o",
  "a criatura que vive dentro do moinho"
];
var RUMOR_CLAIMS = [
  "\xE9 poss\xEDvel ouvir uma segunda voz quando algu\xE9m toca sua borda",
  "a pessoa que governa a regi\xE3o fez um pacto para manter a paz",
  "quem segue suas marcas encontra um lugar que n\xE3o existia no dia anterior",
  "ele devolve qualquer coisa, mas sempre troca uma mem\xF3ria por isso",
  "ele guarda um nome que poderia derrubar uma fam\xEDlia inteira",
  "elas s\xE3o sinais de que uma antiga porta est\xE1 prestes a se abrir",
  "ele transporta passageiros para portos que desapareceram dos mapas",
  "ela protege uma passagem usada por algo que n\xE3o deveria estar acordado"
];
var RUMOR_TRUTHS = [
  "O rumor \xE9 verdadeiro, mas a consequ\xEAncia foi exagerada.",
  "O rumor \xE9 falso; algu\xE9m o espalhou para esconder uma pista mais importante.",
  "O rumor \xE9 parcialmente verdadeiro: o fen\xF4meno existe, mas sua causa \xE9 outra.",
  "O rumor \xE9 verdadeiro, embora s\xF3 aconte\xE7a quando uma condi\xE7\xE3o espec\xEDfica \xE9 cumprida.",
  "O rumor come\xE7ou como uma mentira, mas tornou-se verdadeiro depois de um acontecimento recente."
];
var DUNGEON_ENTRIES = [
  "A entrada e o guardi\xE3o: o acesso est\xE1 escondido em um lugar banal, mas um guardi\xE3o exige que os invasores deixem para tr\xE1s algo que consideram valioso.",
  "O desafio: um mecanismo antigo, uma escolha moral ou uma pista incompleta impede o avan\xE7o sem exigir necessariamente um combate.",
  "O contratempo: o caminho seguro desaba e revela que algu\xE9m chegou antes do grupo, levando consigo parte daquilo que os aventureiros procuravam.",
  "O confronto: a amea\xE7a principal usa o pr\xF3prio ambiente como arma e oferece uma barganha tentadora antes de lutar at\xE9 o fim.",
  "A recompensa e a revela\xE7\xE3o: o pr\xEAmio resolve um problema imediato, mas prova que a masmorra era apenas uma pe\xE7a de um conflito muito maior."
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
function result(id, title, text) {
  return { id, label: LABELS[id], title, text };
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
  const companion = random.chance(0.3) ? ` Como companhia, mant\xE9m ${random.pick(ANIMAL_COMPANIONS)}.` : "";
  const text = `${name} \xE9 ${people.article} ${people.noun} que trabalha como ${role}, ${morality}. ${name} ${appearance}. ${name} ${personality} e ${motivation}. Em segredo, ${name.toLocaleLowerCase("pt-BR")} ${complication}.${companion}`;
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
  const subject = random.pick(RUMOR_SUBJECTS);
  const claim = random.pick(RUMOR_CLAIMS);
  const truth = random.pick(RUMOR_TRUTHS);
  const text = `O rumor diz que ${subject} ${claim}. Verdade oculta: ${truth}`;
  return result("rumor", `Rumor - ${sentenceCase(subject)}`, text);
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
  { id: "quest", label: LABELS.quest, icon: "scroll-text", generate: generateQuest },
  { id: "encounter", label: LABELS.encounter, icon: "swords", generate: generateEncounter },
  { id: "rumor", label: LABELS.rumor, icon: "message-circle-question", generate: generateRumor },
  { id: "dungeon", label: LABELS.dungeon, icon: "castle", generate: generateDungeon }
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

// src/view.ts
var VIEW_TYPE_RPG_GENERATOR = "rpg-random-generator-view";
function isGeneratorId(value) {
  return typeof value === "string" && GENERATORS.some((definition) => definition.id === value);
}
function sanitizeFileName(value) {
  return value.replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, " ").trim().replace(/[. ]+$/g, "") || "Resultado de RPG";
}
var GeneratorView = class extends import_obsidian.ItemView {
  constructor(leaf) {
    super(leaf);
    this.selectedId = "npc";
    this.currentResult = null;
    this.resultKey = 0;
    this.noteCreatedForKey = null;
    this.primaryButton = null;
    this.resultHeader = null;
    this.resultText = null;
    this.liveStatus = null;
    this.copyButton = null;
    this.noteButton = null;
    this.clearButton = null;
    this.categoryButtons = /* @__PURE__ */ new Map();
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
    this.renderView();
  }
  async onClose() {
    this.contentEl.empty();
  }
  getState() {
    return { category: this.selectedId };
  }
  async setState(state, result2) {
    const nextState = state && typeof state === "object" ? state : {};
    if (isGeneratorId(nextState.category)) {
      this.selectedId = nextState.category;
    }
    await super.setState(state, result2);
    this.renderView();
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
      const button = categories.createEl("button", {
        cls: "rpg-generator-category",
        attr: {
          type: "button",
          role: "radio",
          "aria-pressed": String(definition.id === this.selectedId),
          "aria-label": definition.id === "dungeon" ? "Masmorra de cinco salas" : definition.label
        }
      });
      (0, import_obsidian.setIcon)(button, definition.icon);
      button.createSpan({ text: definition.label });
      button.addEventListener("click", () => this.selectCategory(definition.id));
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
    this.liveStatus = resultSection.createEl("p", {
      cls: "rpg-generator-live-status",
      attr: { "aria-live": "polite" }
    });
    const actions = resultSection.createDiv({ cls: "rpg-generator-actions" });
    this.copyButton = actions.createEl("button", {
      cls: "rpg-generator-secondary",
      attr: { type: "button" },
      text: "Copiar"
    });
    this.copyButton.addEventListener("click", () => void this.copyResult());
    this.noteButton = actions.createEl("button", {
      cls: "rpg-generator-secondary",
      attr: { type: "button" },
      text: "Criar nota"
    });
    this.noteButton.addEventListener("click", () => void this.createNote());
    this.clearButton = resultSection.createEl("button", {
      cls: "rpg-generator-clear",
      attr: { type: "button" },
      text: "Limpar resultado"
    });
    this.clearButton.addEventListener("click", () => this.clearResult());
    this.updateControls();
    this.updateResultText();
  }
  selectCategory(id) {
    this.selectedId = id;
    for (const [categoryId, button] of this.categoryButtons.entries()) {
      const selected = categoryId === id;
      button.setAttr("aria-pressed", String(selected));
      button.toggleClass("is-selected", selected);
    }
    this.updateControls();
  }
  generateResult() {
    var _a;
    this.currentResult = generate(this.selectedId, new Random());
    this.resultKey += 1;
    this.noteCreatedForKey = null;
    this.updateControls();
    this.updateResultText();
    (_a = this.liveStatus) == null ? void 0 : _a.setText(`Novo resultado de ${this.currentResult.label} gerado`);
  }
  clearResult() {
    var _a;
    this.currentResult = null;
    this.noteCreatedForKey = null;
    this.updateControls();
    this.updateResultText();
    (_a = this.liveStatus) == null ? void 0 : _a.setText("Resultado limpo");
  }
  updateControls() {
    var _a;
    if (this.primaryButton) {
      const label = ((_a = this.currentResult) == null ? void 0 : _a.id) === this.selectedId ? "Rerrolar" : "Gerar";
      this.primaryButton.setText(label);
    }
    const hasResult = this.currentResult !== null;
    const noteAlreadyCreated = this.noteCreatedForKey === this.resultKey;
    if (this.copyButton) this.copyButton.disabled = !hasResult;
    if (this.noteButton) {
      this.noteButton.disabled = !hasResult || noteAlreadyCreated;
      this.noteButton.setText(noteAlreadyCreated ? "Nota criada" : "Criar nota");
    }
    if (this.clearButton) this.clearButton.disabled = !hasResult;
  }
  updateResultText() {
    if (!this.resultText || !this.resultHeader) return;
    if (!this.currentResult) {
      this.resultHeader.setText("Resultado");
      this.resultText.setText("Escolha um gerador e clique em \u201CGerar\u201D.");
      this.resultText.addClass("is-empty");
      this.resultText.setAttr("aria-label", "Nenhum resultado gerado");
      return;
    }
    this.resultHeader.setText(this.currentResult.label);
    this.resultText.setText(this.currentResult.text);
    this.resultText.removeClass("is-empty");
    this.resultText.setAttr("aria-label", `Resultado: ${this.currentResult.label}`);
  }
  async copyResult() {
    if (!this.currentResult) return;
    try {
      await navigator.clipboard.writeText(this.currentResult.text);
      new import_obsidian.Notice("Texto copiado");
    } catch (e) {
      new import_obsidian.Notice("N\xE3o foi poss\xEDvel copiar o texto");
    }
  }
  async createNote() {
    if (!this.currentResult || this.noteCreatedForKey === this.resultKey) return;
    const folderPath = "Gerados";
    const existingFolder = this.app.vault.getAbstractFileByPath(folderPath);
    if (existingFolder && !(existingFolder instanceof import_obsidian.TFolder)) {
      new import_obsidian.Notice("N\xE3o foi poss\xEDvel criar a nota: Gerados j\xE1 \xE9 um arquivo");
      return;
    }
    try {
      if (!existingFolder) await this.app.vault.createFolder(folderPath);
      const baseName = sanitizeFileName(this.currentResult.title);
      let path = `${folderPath}/${baseName}.md`;
      let suffix = 2;
      while (this.app.vault.getAbstractFileByPath(path)) {
        path = `${folderPath}/${baseName} - ${suffix}.md`;
        suffix += 1;
      }
      const file = await this.app.vault.create(path, this.currentResult.text);
      await this.app.workspace.getLeaf("tab").openFile(file);
      this.noteCreatedForKey = this.resultKey;
      this.updateControls();
      new import_obsidian.Notice("Nota criada em Gerados");
    } catch (e) {
      new import_obsidian.Notice("N\xE3o foi poss\xEDvel criar a nota");
    }
  }
};

// src/main.ts
var RpgRandomGeneratorPlugin = class extends import_obsidian2.Plugin {
  async onload() {
    this.registerView(VIEW_TYPE_RPG_GENERATOR, (leaf) => new GeneratorView(leaf));
    this.addRibbonIcon("dice-5", "Abrir Gerador de RPG", () => {
      void this.activateView();
    });
    this.addCommand({
      id: "open-rpg-generator",
      name: "Abrir gerador de RPG",
      callback: () => void this.activateView()
    });
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
