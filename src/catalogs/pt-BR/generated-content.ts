import {
  compileContentCatalog,
  type TaggedContentEntry,
} from "../../content-selection";
import {
  COMPLEXITY_IDS,
  ENVIRONMENT_IDS,
  TONE_IDS,
  type ComplexityId,
  type ToneId,
} from "../../types";

export interface NpcContent {
  role: string;
  trait: string;
  appearance: string;
  personality: string;
  motivation: string;
  complication: string;
  secret: string;
  relationship: string;
  immediateHook: string;
  companion: string;
}

export interface LocationContent {
  name: string;
  type: string;
  atmosphere: string;
  feature: string;
  hook: string;
  inhabitants: string;
  history: string;
  tension: string;
  danger: string;
  secret: string;
  opportunities: string;
}

export interface QuestContent {
  giver: string;
  objective: string;
  location: string;
  complication: string;
  reward: string;
  context: string;
  stages: string;
  opposition: string;
  escalation: string;
  failure: string;
  alternative: string;
}

export interface EncounterContent {
  title: string;
  situation: string;
  immediateThreat: string;
  twist: string;
  choice: string;
  setup: string;
  actors: string;
  escalation: string;
  interaction: string;
  outcomes: string;
  aftermath: string;
}

export interface RumorContent {
  subject: string;
  claim: string;
  truth: string;
  source: string;
  variations: string;
  clues: string;
  interestedParties: string;
  investigationConsequence: string;
  context: string;
}

export interface DungeonContent {
  theme: string;
  overview: string;
  rooms: readonly [string, string, string, string, string];
  detailedRooms: readonly [string, string, string, string, string];
}

/** Stable, reusable variation beats. The generator chooses one after resolving a cell. */
export const VARIATION_BEATS = [
  { id: "testemunha", text: "Uma testemunha confiável pode confirmar o próximo passo.", companion: false },
  { id: "vestigio", text: "Um vestígio recente contradiz a versão mais conhecida.", companion: true },
  { id: "acordo", text: "Um acordo antigo ainda oferece uma saída legítima.", companion: false },
  { id: "prazo", text: "O prazo termina antes do próximo amanhecer.", companion: true },
  { id: "aliado", text: "Um aliado hesitante pede uma chance de reparar o dano.", companion: false },
  { id: "objeto", text: "Um objeto comum guarda a prova que faltava.", companion: true },
  { id: "rota", text: "Uma rota segura aparece quando alguém abandona o caminho habitual.", companion: false },
  { id: "promessa", text: "Uma promessa feita em público impede uma solução fácil.", companion: true },
  { id: "sinal", text: "Um sinal repetido indica que a ameaça mudou de lugar.", companion: false },
  { id: "preco", text: "Toda solução cobra um preço que deve ser aceito em voz alta.", companion: true },
  { id: "mensagem", text: "Uma mensagem incompleta revela quem será afetado primeiro.", companion: false },
  { id: "silencio", text: "O silêncio de uma pessoa importante vale mais que qualquer boato.", companion: true },
  { id: "marca", text: "Uma marca antiga contém um sinal que não existia ontem.", companion: false },
  { id: "disputa", text: "Duas versões sinceras entram em conflito diante do grupo.", companion: true },
  { id: "refugio", text: "Um refúgio temporário permite observar o perigo sem enfrentá-lo.", companion: false },
  { id: "heranca", text: "Uma herança esquecida transforma o problema em uma responsabilidade pessoal.", companion: true },
  { id: "ritual", text: "Um ritual simples pode conter o problema, mas só uma vez.", companion: false },
  { id: "devedor", text: "Uma pessoa devedora oferece ajuda em troca de uma decisão difícil.", companion: true },
  { id: "memoria", text: "Uma memória compartilhada esclarece por que o conflito começou.", companion: false },
  { id: "escolha", text: "A primeira escolha do grupo definirá quem poderá pedir ajuda depois.", companion: true },
] as const;

export type VariationBeat = (typeof VARIATION_BEATS)[number];

const TONE = {
  grim: {
    frame: "uma ameaça recente",
    theme: "Cicatrizes de uma perda recente",
    event: "uma ameaça deixou perdas recentes",
    pressure: "A esperança está sendo cobrada em silêncio.",
    threat: "uma consequência difícil de desfazer",
    motive: "evitar que outra pessoa pague o preço",
    color: "sóbrio e marcado por luto",
  },
  whimsical: {
    frame: "um problema absurdo",
    theme: "O problema que se recusa a fazer sentido",
    event: "um problema absurdo confundiu a região",
    pressure: "A confusão cresce sempre que alguém tenta simplificar tudo.",
    threat: "uma surpresa inconveniente e barulhenta",
    motive: "transformar a trapalhada em um relato memorável",
    color: "leve e cheio de pequenas manias",
  },
  heroic: {
    frame: "uma chance clara de proteção",
    theme: "Uma chance de proteger a região",
    event: "uma chance clara protegeu quem precisava",
    pressure: "A decisão do grupo pode inspirar a região inteira.",
    threat: "um obstáculo que exige coragem e cooperação",
    motive: "dar a outras pessoas uma oportunidade de seguir em frente",
    color: "firme e orientado por coragem",
  },
  mysterious: {
    frame: "um enigma antigo",
    theme: "O padrão escondido por trás dos sinais",
    event: "um enigma revelou apenas parte de sua intenção",
    pressure: "Cada resposta abre uma pergunta ainda mais antiga.",
    threat: "uma presença que prefere sinais a explicações",
    motive: "entender o padrão antes que ele se complete",
    color: "silencioso e difícil de interpretar",
  },
} as const satisfies Record<ToneId, Record<string, string>>;

const ENVIRONMENT = {
  wilderness: {
    name: "Marco do Horizonte Aberto",
    setting: "nas planícies abertas, entre montanhas, pântanos e terras áridas",
    texture: "O vento forte cruza um horizonte sem abrigo e espalha marcas pelo chão.",
    inhabitants: "Viajantes, pastores e comunidades conhecem os caminhos sazonais.",
    regionNoun: "as terras abertas",
    threat: "O clima severo dificulta o avanço, enquanto algo acompanha o grupo à distância.",
  },
  forest: {
    name: "Clareira das Folhas Baixas",
    setting: "na mata fechada, onde copas antigas escondem o céu",
    texture: "Raízes úmidas, folhas sobre folhas e trilhas móveis cercam a passagem.",
    inhabitants: "Guardiões da mata, coletores e animais atentos ocupam a região.",
    regionNoun: "a floresta",
    threat: "A floresta fecha a passagem, e uma presença se move entre as árvores.",
  },
  city: {
    name: "Beco das Sete Janelas",
    setting: "em ruas cheias, pátios de comércio e becos sob muitas janelas",
    texture: "Sinos, pregões, portas trancadas e mensagens trocadas depressa dominam o lugar.",
    inhabitants: "Comerciantes, autoridades, trabalhadores e vizinhos disputam os acessos.",
    regionNoun: "a cidade",
    threat: "Um rumor mobiliza a multidão, enquanto alguém controla as entradas e saídas.",
  },
  coast: {
    name: "Cais da Maré Tardia",
    setting: "no litoral, entre falésias, areia salgada e água que muda com a maré",
    texture: "Maresia, cordas molhadas, gaivotas e ondas imprevisíveis cercam o cais.",
    inhabitants: "Pescadores, navegantes e comunidades de enseada acompanham a maré.",
    regionNoun: "o litoral",
    threat: "A maré sobe depressa, e algo chega pelo caminho da água.",
  },
  ruins: {
    name: "Pátio da Pedra Rachada",
    setting: "em ruínas de pedra, com salões quebrados e símbolos cobertos de poeira",
    texture: "Arcos rachados, fuligem antiga, pedras deslocadas e ecos sem origem marcam o local.",
    inhabitants: "Saqueadores, estudiosos, famílias e vigias ocupam os restos da construção.",
    regionNoun: "as ruínas",
    threat: "A estrutura cede aos poucos, enquanto uma promessa esquecida desperta sob os escombros.",
  },
  underground: {
    name: "Câmara do Eco Baixo",
    setting: "no subterrâneo, entre túneis estreitos, cisternas e câmaras sem sol",
    texture: "Umidade, fungos luminosos, correntes de ar e vozes nas paredes tornam o caminho incerto.",
    inhabitants: "Mineiros e comunidades profundas vivem longe da luz do céu.",
    regionNoun: "os túneis subterrâneos",
    threat: "A falta de saída aperta o grupo, e algo conhece cada passagem melhor que ele."
  },
} as const;

interface Cell { tone: ToneId; environment: (typeof ENVIRONMENT_IDS)[number]; complexity: ComplexityId; }

type ContentFactory<T> = (cell: Cell) => T;

function matrix<T>(prefix: string, make: ContentFactory<T>): TaggedContentEntry<T>[] {
  const entries: TaggedContentEntry<T>[] = [];
  for (const tone of TONE_IDS) {
    for (const environment of ENVIRONMENT_IDS) {
      entries.push({
        id: `${prefix}-${tone}-${environment}`,
        tone,
        environment,
        complexity: COMPLEXITY_IDS,
        content: make({ tone, environment, complexity: "quick" }),
      });
    }
  }
  entries.push({
    id: `${prefix}-fallback`,
    fallback: true,
    content: make({
      tone: "mysterious",
      environment: "ruins",
      complexity: "quick",
    }),
  });
  return entries;
}

function context(cell: Cell) {
  return { tone: TONE[cell.tone], environment: ENVIRONMENT[cell.environment] };
}

export const NPC_CONTENT = matrix<NpcContent>("npc", (cell) => {
  const { tone, environment } = context(cell);
  return {
    role: `guia que conhece ${environment.regionNoun}`,
    trait: `tem um jeito ${tone.color}. Observa quem precisa de ajuda`,
    appearance: `Carrega sinais de viagem. ${environment.texture}`,
    personality: `ouve antes de falar e trata cada encontro como parte de ${tone.frame}`,
    motivation: `${tone.motive}, mesmo quando isso exige voltar à região`,
    complication: `${tone.pressure} Seu trabalho depende de uma escolha que não pode adiar.`,
    secret: `Sabe que ${tone.threat} já deixou marcas ${environment.setting}.`,
    relationship: `Mantém um acordo frágil com quem vive na região. ${environment.inhabitants}`,
    immediateHook: `Oferece uma pista sobre o perigo local em troca de ajuda imediata e pede uma decisão antes de seguir.`,
    companion: `um companheiro acostumado a viajar ${environment.setting}`,
  };
});

export const LOCATION_CONTENT = matrix<LocationContent>("location", (cell) => {
  const { tone, environment } = context(cell);
  return {
    name: environment.name,
    type: `um ponto de passagem com aspecto ${tone.color}`,
    atmosphere: `${tone.event[0].toLocaleUpperCase("pt-BR")}${tone.event.slice(1)}. ${environment.texture}`,
    feature: `Um marco local registra mudanças na região e guarda sinais de que ${tone.threat} se aproxima.`,
    hook: `Alguém procura ajuda para entender o perigo antes que ele alcance os moradores.`,
    inhabitants: environment.inhabitants,
    history: `O lugar foi criado porque ${tone.event}.`,
    tension: `${tone.pressure} Os habitantes discordam sobre partir ou permanecer.`,
    danger: environment.threat,
    secret: `O marco esconde uma mensagem ligada a ${tone.motive}.`,
    opportunities: `Há uma rota segura, uma testemunha e um recurso útil para quem observar o local.`,
  };
});

export const QUEST_CONTENT = matrix<QuestContent>("quest", (cell) => {
  const { tone, environment } = context(cell);
  return {
    giver: `uma liderança da comunidade que vive na região`,
    objective: `levar uma prova até ${environment.name} antes que o perigo alcance outras pessoas`,
    location: environment.name,
    complication: `A situação ligada a ${tone.frame} interfere no acordo antes que a entrega aconteça.`,
    reward: `a confiança da comunidade e acesso a uma rota escondida`,
    context: `A missão nasceu porque ${tone.pressure.toLocaleLowerCase("pt-BR")} O pedido parece simples, mas toca o futuro de quem vive ${environment.setting}.`,
    stages: `Primeiro, encontrar a pista. Depois, atravessar o lugar com cuidado. Por fim, decidir o que revelar à comunidade.`,
    opposition: `${environment.threat} Uma pessoa interessada oferece uma solução conveniente.`,
    escalation: `Cada atraso aproxima ${tone.threat} e fecha uma passagem importante.`,
    failure: `A comunidade perde uma proteção, e o mesmo perigo alcança novos viajantes.`,
    alternative: `Negociar com a oposição e agir para ${tone.motive}, sem concluir o percurso habitual.`,
  };
});

export const ENCOUNTER_CONTENT = matrix<EncounterContent>("encounter", (cell) => {
  const { tone, environment } = context(cell);
  return {
    title: environment.name,
    situation: `Um grupo interrompe a passagem ${environment.setting}. Seus integrantes fazem um pedido urgente.`,
    immediateThreat: `${environment.threat} O espaço seguro diminui a cada momento.`,
    twist: `A cena nasceu depois que ${tone.event}. A pessoa que parece precisar de ajuda conhece uma saída.`,
    choice: `Negociar, investigar ou agir agora significa aceitar uma perda diferente.`,
    setup: `O encontro começa quando o ambiente muda de repente. ${environment.texture}`,
    actors: `${environment.inhabitants} Também participa alguém ligado a ${tone.threat}.`,
    escalation: `Se ninguém decidir, ${tone.pressure.toLocaleLowerCase("pt-BR")} A ameaça muda de direção.`,
    interaction: `O grupo pode usar o ambiente de modo criativo para abrir uma rota, ganhar tempo ou expor uma mentira.`,
    outcomes: `Uma solução cuidadosa preserva a passagem. Uma decisão rápida resolve o impasse, mas deixa uma dívida.`,
    aftermath: `Depois, os sinais do conflito local permanecem ${environment.setting}. Eles apontam para uma consequência futura ligada a ${tone.frame}.`,
  };
});

export const RUMOR_CONTENT = matrix<RumorContent>("rumor", (cell) => {
  const { tone, environment } = context(cell);
  return {
    subject: `A passagem conhecida como ${environment.name}`,
    claim: `esconde um sinal de que ${tone.threat} está se aproximando`,
    truth: `O sinal existe, mas a causa está ligada ao fato de que ${tone.event}; a região ainda pode escolher como reagir.`,
    source: `Uma pessoa que vive na região ouviu a história antes da última mudança.`,
    variations: `Algumas versões citam o ambiente, enquanto outras culpam uma testemunha.`,
    clues: `Marcas no local e uma frase repetida por quem conhece ${environment.name}.`,
    interestedParties: `A comunidade quer confirmar a história, mas alguém que quer ${tone.motive} tenta abafá-la.`,
    investigationConsequence: `Investigar revela a verdade, mas torna visível ${tone.threat} para toda a região.`,
    context: `A história cresceu porque ${tone.frame} chamou atenção para este lugar, e ninguém sabe quem começou a repeti-la.`,
  };
});

export const DUNGEON_CONTENT = matrix<DungeonContent>("dungeon", (cell) => {
  const { tone, environment } = context(cell);
  const theme = `${tone.theme} ${environment.setting}`;
  const overview = `Cinco espaços mostram o que será preciso para ${tone.motive}. ${environment.texture}`;
  const rooms: [string, string, string, string, string] = [
    `O acesso fica ${environment.setting}; a passagem pede uma decisão ligada a ${tone.frame}. Sinais no chão mostram que alguém esperava visitantes.`,
    `Um vestígio da comunidade local exige interpretar sinais antes de avançar. A resposta revela o custo de subestimar a situação. A pressa pode fechar a única saída.`,
    `O perigo local separa o grupo e muda o caminho de volta. Observar o ambiente permite encontrar uma passagem estreita. Cada pessoa precisa escolher onde pisar.`,
    `Algo ligado a ${tone.threat} oferece uma troca antes de impedir a passagem. Sua proposta revela um risco imediato. O grupo ainda pode negociar antes de lutar.`,
    `Um recurso útil oferece meios para ${tone.motive} e deixa uma escolha para depois. O prêmio também chama atenção. A descoberta muda o sentido da jornada.`,
  ];
  const detailedRooms: [string, string, string, string, string] = [
    `O acesso fica ${environment.setting}. A passagem pede uma decisão ligada a ${tone.frame}; escolher com cuidado abre uma marca antiga e deixa claro que alguém esperava visitantes. A porta se fecha devagar, separando a rota conhecida daquilo que vem depois. A saída continua incerta para todos. Marcas junto ao batente registram escolhas anteriores. Compará-las revela qual caminho foi usado por último.`,
    `Um vestígio da comunidade local exige interpretar sinais antes de avançar. As pistas misturam memória e necessidade, e a pressão criada por ${tone.frame} alcançou este lugar. Um detalhe esquecido oferece uma saída, mas cobra tempo e atenção. Ninguém pode seguir sem assumir essa consequência. Uma resposta incompleta abre uma rota mais perigosa. A solução correta preserva um recurso para o retorno.`,
    `O perigo local separa o grupo e muda o caminho de volta. O desvio passa por uma área instável, onde observar o ambiente permite recuperar um objeto e evitar uma perda maior. Cada pessoa precisa decidir que pista levará consigo. O silêncio também pode ser uma escolha. Um ruído distante permite reencontrar o grupo. Segui-lo depressa demais, porém, expõe a posição de todos.`,
    `Algo ligado a ${tone.threat} oferece uma troca antes de impedir a passagem. Essa presença conhece a região e apresenta uma verdade incompleta. Aceitar, recusar ou propor outra saída muda o próximo passo. A escolha também define quem poderá atravessar em segurança. Nenhuma promessa ficará intacta depois disso. Uma testemunha escondida conhece o ponto fraco da proposta. Convencê-la a falar exige oferecer proteção real.`,
    `Um recurso útil oferece meios para ${tone.motive} e deixa uma escolha para depois. O prêmio ajuda agora, mas sua origem liga o grupo à comunidade local e a uma disputa que continua fora destas salas. Levar tudo exige abandonar uma vantagem imediata. O caminho de volta passa a ter outro significado. Uma inscrição identifica quem reivindicará o objeto. Deixá-la intacta preserva uma possível negociação futura.`,
  ];
  return { theme, overview, rooms, detailedRooms };
});

export const CONTENT_CATALOGS = {
  npc: NPC_CONTENT,
  location: LOCATION_CONTENT,
  quest: QUEST_CONTENT,
  encounter: ENCOUNTER_CONTENT,
  rumor: RUMOR_CONTENT,
  dungeon: DUNGEON_CONTENT,
} as const;

export const COMPILED_CONTENT_CATALOGS = {
  npc: compileContentCatalog(NPC_CONTENT),
  location: compileContentCatalog(LOCATION_CONTENT),
  quest: compileContentCatalog(QUEST_CONTENT),
  encounter: compileContentCatalog(ENCOUNTER_CONTENT),
  rumor: compileContentCatalog(RUMOR_CONTENT),
  dungeon: compileContentCatalog(DUNGEON_CONTENT),
} as const;
