import { generateName, randomPeople } from "./names";
import { Random } from "./random";
import {
  ANIMAL_COMPANIONS,
  DUNGEON_ENTRIES,
  DUNGEON_THEMES,
  ENCOUNTER_CHOICES,
  ENCOUNTER_ENVIRONMENTS,
  ENCOUNTER_SITUATIONS,
  ENCOUNTER_TWISTS,
  LOCATION_ATMOSPHERES,
  LOCATION_FEATURES,
  LOCATION_HOOKS,
  LOCATION_NAMES,
  LOCATION_TYPES,
  NPC_APPEARANCES,
  NPC_COMPLICATIONS,
  NPC_MORALITIES,
  NPC_MOTIVATIONS,
  NPC_PERSONALITIES,
  NPC_ROLES,
  QUEST_COMPLICATIONS,
  QUEST_GIVERS,
  QUEST_OBJECTIVES,
  QUEST_REWARDS,
  RUMOR_CLAIMS,
  RUMOR_SUBJECTS,
  RUMOR_TRUTHS,
} from "./tables";
import type { GeneratorDefinition, GeneratorId, GenerationResult } from "./types";

const LABELS: Record<GeneratorId, string> = {
  npc: "NPCs",
  location: "Locais",
  quest: "Missões",
  encounter: "Encontros",
  rumor: "Rumores",
  dungeon: "Masmorra",
};

function result(id: GeneratorId, title: string, body: string): GenerationResult {
  const content = {
    plainText: body,
    markdown: body,
  };

  return { id, label: LABELS[id], title, content };
}

function sentenceCase(value: string): string {
  return value.length === 0 ? value : value[0].toLocaleUpperCase("pt-BR") + value.slice(1);
}

function generateNpc(random: Random): GenerationResult {
  const people = randomPeople(random);
  const name = generateName(people.id, random);
  const role = random.pick(NPC_ROLES);
  const morality = random.pick(NPC_MORALITIES);
  const appearance = random.pick(NPC_APPEARANCES);
  const personality = random.pick(NPC_PERSONALITIES);
  const motivation = random.pick(NPC_MOTIVATIONS);
  const complication = random.pick(NPC_COMPLICATIONS);
  const companion = random.chance(0.3) ? ` Viaja com ${random.pick(ANIMAL_COMPANIONS)}.` : "";

  const text = `${name} é ${people.article} ${people.noun} que trabalha como ${role} e ${morality}. ${sentenceCase(appearance)}. Costuma ${personality}. Procura ${motivation}. Em segredo, ${complication}.${companion}`;
  return result("npc", `NPC - ${name}`, text);
}

function generateLocation(random: Random): GenerationResult {
  const name = random.pick(LOCATION_NAMES);
  const type = random.pick(LOCATION_TYPES);
  const atmosphere = random.pick(LOCATION_ATMOSPHERES);
  const feature = random.pick(LOCATION_FEATURES);
  const hook = random.pick(LOCATION_HOOKS);

  const text = `${name} é ${type}. ${atmosphere} ${feature} ${hook}.`;
  return result("location", `Local - ${name}`, text);
}

function generateQuest(random: Random): GenerationResult {
  const giverPeople = randomPeople(random);
  const giverName = generateName(giverPeople.id, random);
  const objective = random.pick(QUEST_OBJECTIVES);
  const complication = random.pick(QUEST_COMPLICATIONS);
  const reward = random.pick(QUEST_REWARDS);
  const location = random.pick(LOCATION_NAMES);
  const giverDetail = random.pick(QUEST_GIVERS);

  const text = `${giverName}, ${giverDetail}, procura aventureiros para ${objective} na região de ${location}. ${complication} Se tiverem sucesso, receberão ${reward}.`;
  return result("quest", `Missão - ${sentenceCase(objective)}`, text);
}

function generateEncounter(random: Random): GenerationResult {
  const environment = random.pick(ENCOUNTER_ENVIRONMENTS);
  const situation = random.pick(ENCOUNTER_SITUATIONS);
  const twist = random.pick(ENCOUNTER_TWISTS);
  const choice = random.pick(ENCOUNTER_CHOICES);

  const text = `Em ${environment}, ${situation}. ${twist} ${choice}`;
  return result("encounter", `Encontro - ${sentenceCase(environment)}`, text);
}

function generateRumor(random: Random): GenerationResult {
  const subject = random.pick(RUMOR_SUBJECTS);
  const claim = random.pick(RUMOR_CLAIMS);
  const truth = random.pick(RUMOR_TRUTHS);

  const text = `Corre o boato de que ${subject} ${claim}. Para o mestre: ${truth}.`;
  return result("rumor", `Rumor - ${sentenceCase(subject)}`, text);
}

function generateDungeon(random: Random): GenerationResult {
  const theme = random.pick(DUNGEON_THEMES);
  const rooms = DUNGEON_ENTRIES.map((entry, index) => `${index + 1}. ${entry}`).join("\n");
  const text = `Tema: ${theme}.\n\n${rooms}`;
  return result("dungeon", `Masmorra - ${sentenceCase(theme)}`, text);
}

export const GENERATORS: readonly GeneratorDefinition[] = [
  { id: "npc", label: LABELS.npc, icon: "user-round", generate: generateNpc },
  { id: "location", label: LABELS.location, icon: "map", generate: generateLocation },
  { id: "quest", label: LABELS.quest, icon: "file-text", generate: generateQuest },
  { id: "encounter", label: LABELS.encounter, icon: "target", generate: generateEncounter },
  { id: "rumor", label: LABELS.rumor, icon: "message-circle", generate: generateRumor },
  { id: "dungeon", label: LABELS.dungeon, icon: "box", generate: generateDungeon },
];

const generatorMap = new Map(GENERATORS.map((definition) => [definition.id, definition]));

export function getGenerator(id: GeneratorId): GeneratorDefinition {
  const definition = generatorMap.get(id);
  if (!definition) throw new Error(`Unknown generator: ${id}`);
  return definition;
}

export function generate(id: GeneratorId, random: Random = new Random()): GenerationResult {
  return getGenerator(id).generate(random);
}
