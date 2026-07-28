import {
  compileContentCatalog,
  type TaggedContentEntry,
} from "../../content-selection";
import {
  COMPLEXITY_IDS,
  ENVIRONMENT_IDS,
  TONE_IDS,
  type ComplexityId,
  type DungeonRoomRole,
  type EnvironmentId,
  type ToneId,
} from "../../types";
import {
  ENVIRONMENT_WRITING,
  ROOM_DEVELOPMENT,
  type DungeonRoomDescriptions,
  type EnvironmentWritingProfile,
} from "./environments";
import { TONE_WRITING, type ToneWritingProfile } from "./tones";
import {
  VARIATION_BEATS,
  type EditorialVariation,
} from "./variations";

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
  title: string;
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
  rooms: DungeonRoomDescriptions;
  detailedRooms: DungeonRoomDescriptions;
}

export type VariationBeat = EditorialVariation;
export { VARIATION_BEATS };

interface Cell {
  tone: ToneId;
  environment: EnvironmentId;
  complexity: ComplexityId;
}

interface WritingContext {
  tone: ToneWritingProfile;
  environment: EnvironmentWritingProfile;
}

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

function context(cell: Cell): WritingContext {
  return {
    tone: TONE_WRITING[cell.tone],
    environment: ENVIRONMENT_WRITING[cell.environment],
  };
}

function detailedRooms(
  rooms: DungeonRoomDescriptions,
): DungeonRoomDescriptions {
  const expand = (role: DungeonRoomRole): string =>
    `${rooms[role]} ${ROOM_DEVELOPMENT[role]}`;
  return {
    Entrada: expand("Entrada"),
    Exploração: expand("Exploração"),
    Desafio: expand("Desafio"),
    Encruzilhada: expand("Encruzilhada"),
    Segredo: expand("Segredo"),
    Armadilha: expand("Armadilha"),
    Refúgio: expand("Refúgio"),
    Contratempo: expand("Contratempo"),
    Encontro: expand("Encontro"),
    Revelação: expand("Revelação"),
    Confronto: expand("Confronto"),
    Recompensa: expand("Recompensa"),
  };
}

export const NPC_CONTENT = matrix<NpcContent>("npc", (cell) => {
  const { tone, environment } = context(cell);
  return {
    role: environment.npcRole,
    trait: `Mantém um jeito ${tone.npcColor}. Observa primeiro quem precisa de ajuda.`,
    appearance: `Carrega sinais de viagem e trabalho. ${environment.texture}`,
    personality: `Escuta antes de falar e relaciona cada decisão a ${tone.npcFrame}.`,
    motivation: `${tone.npcMotive.charAt(0).toLocaleUpperCase("pt-BR")}${tone.npcMotive.slice(1)}.`,
    complication: tone.npcPressure,
    secret: `Sabe que ${tone.npcThreat} e possui uma prova que ainda não mostrou.`,
    relationship: `Mantém um acordo frágil com quem vive na região. ${environment.inhabitants}`,
    immediateHook: "Oferece uma informação concreta em troca de ajuda com um problema que não pode resolver sozinho.",
    companion: environment.npcCompanion,
  };
});

export const LOCATION_CONTENT = matrix<LocationContent>("location", (cell) => {
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
    opportunities: environment.location.opportunities,
  };
});

export const QUEST_CONTENT = matrix<QuestContent>("quest", (cell) => {
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
    alternative: `${environment.quest.alternative} ${tone.questAlternative}`,
  };
});

export const ENCOUNTER_CONTENT = matrix<EncounterContent>("encounter", (cell) => {
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
    aftermath: `${environment.encounter.aftermath} ${tone.encounterAftermath}`,
  };
});

export const RUMOR_CONTENT = matrix<RumorContent>("rumor", (cell) => {
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
    context: `${environment.rumor.context} ${tone.rumorContext}`,
  };
});

export const DUNGEON_CONTENT = matrix<DungeonContent>("dungeon", (cell) => {
  const { tone, environment } = context(cell);
  return {
    theme: `${environment.dungeon.name}: ${tone.dungeonTheme}`,
    overview: `${environment.dungeon.overview} ${tone.dungeonOverview} ${tone.dungeonRoom}`,
    rooms: environment.dungeon.rooms,
    detailedRooms: detailedRooms(environment.dungeon.rooms),
  };
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
