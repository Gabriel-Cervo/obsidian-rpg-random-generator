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
  RUMOR_PREMISES,
  RUMOR_TRUTHS,
} from "./tables";
import {
  DEFAULT_GENERATION_OPTIONS,
  normalizeGenerationOptions,
  resolveGenerationOptions,
} from "./options";
import type {
  GeneratorDefinition,
  GeneratorId,
  GenerationOptionsInput,
  GenerationResult,
} from "./types";

const LABELS: Record<GeneratorId, string> = {
  npc: "NPCs",
  location: "Locais",
  quest: "Missões",
  encounter: "Encontros",
  rumor: "Rumores",
  dungeon: "Masmorra",
};

function result(
  id: GeneratorId,
  title: string,
  body: string,
  random: Random,
  options: GenerationOptionsInput = DEFAULT_GENERATION_OPTIONS,
): GenerationResult {
  const content = {
    plainText: body,
    markdown: body,
  };
  const selected = normalizeGenerationOptions(options, id);
  const resolved = resolveGenerationOptions(selected, random, id);

  const metadata = { selected, resolved };
  return {
    id,
    label: LABELS[id],
    title,
    content,
    options: metadata,
  };
}

function sentenceCase(value: string): string {
  return value.length === 0 ? value : value[0].toLocaleUpperCase("pt-BR") + value.slice(1);
}

function generateNpc(random: Random, options: GenerationOptionsInput = DEFAULT_GENERATION_OPTIONS): GenerationResult {
  const people = randomPeople(random);
  const name = generateName(people.id, random);
  const role = random.pick(NPC_ROLES);
  const morality = random.pick(NPC_MORALITIES);
  const appearance = random.pick(NPC_APPEARANCES);
  const personality = random.pick(NPC_PERSONALITIES);
  const motivation = random.pick(NPC_MOTIVATIONS);
  const complication = random.pick(NPC_COMPLICATIONS);
  const companion = random.chance(0.3) ? ` Viaja com ${random.pick(ANIMAL_COMPANIONS)}.` : "";

  const text = `${name} é ${people.article} ${people.noun} que trabalha como ${role} e ${morality}. ${sentenceCase(appearance)}. Costuma ${personality}. Procura ${motivation}. ${sentenceCase(complication)}.${companion}`;
  return result("npc", `NPC - ${name}`, text, random, options);
}

function generateLocation(random: Random, options: GenerationOptionsInput = DEFAULT_GENERATION_OPTIONS): GenerationResult {
  const name = random.pick(LOCATION_NAMES);
  const type = random.pick(LOCATION_TYPES);
  const atmosphere = random.pick(LOCATION_ATMOSPHERES);
  const feature = random.pick(LOCATION_FEATURES);
  const hook = random.pick(LOCATION_HOOKS);

  // The location tables contain complete sentences, so do not append another period.
  const text = `${name} é ${type}. ${atmosphere} ${feature} ${hook}`;
  return result("location", `Local - ${name}`, text, random, options);
}

function generateQuest(random: Random, options: GenerationOptionsInput = DEFAULT_GENERATION_OPTIONS): GenerationResult {
  const giverPeople = randomPeople(random);
  const giverName = generateName(giverPeople.id, random);
  const objective = random.pick(QUEST_OBJECTIVES);
  const complication = random.pick(QUEST_COMPLICATIONS);
  const reward = random.pick(QUEST_REWARDS);
  const location = random.pick(LOCATION_NAMES);
  const giverDetail = random.pick(QUEST_GIVERS);

  const text = `${giverName}, ${giverDetail}, procura aventureiros para ${objective} em ${location}. ${complication} Se tiverem sucesso, receberão ${reward}.`;
  return result("quest", `Missão - ${sentenceCase(objective)}`, text, random, options);
}

function generateEncounter(random: Random, options: GenerationOptionsInput = DEFAULT_GENERATION_OPTIONS): GenerationResult {
  const environment = random.pick(ENCOUNTER_ENVIRONMENTS);
  const situation = random.pick(ENCOUNTER_SITUATIONS);
  const twist = random.pick(ENCOUNTER_TWISTS);
  const choice = random.pick(ENCOUNTER_CHOICES);

  const text = `Em ${environment}, ${situation}. ${twist} ${choice}`;
  return result("encounter", `Encontro - ${sentenceCase(environment)}`, text, random, options);
}

function generateRumor(random: Random, options: GenerationOptionsInput = DEFAULT_GENERATION_OPTIONS): GenerationResult {
  const premise = random.pick(RUMOR_PREMISES);
  const truth = random.pick(RUMOR_TRUTHS);

  const text = `Corre o boato de que ${premise.subject} ${premise.claim}. Para o mestre: ${truth}.`;
  return result("rumor", `Rumor - ${sentenceCase(premise.subject)}`, text, random, options);
}

function generateDungeon(random: Random, options: GenerationOptionsInput = DEFAULT_GENERATION_OPTIONS): GenerationResult {
  const theme = random.pick(DUNGEON_THEMES);
  const rooms = DUNGEON_ENTRIES.map((entry, index) => `${index + 1}. ${entry}`).join("\n");
  const text = `Tema: ${theme}.\n\n${rooms}`;
  return result("dungeon", `Masmorra - ${sentenceCase(theme)}`, text, random, options);
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

export function generate(
  id: GeneratorId,
  random: Random = new Random(),
  options: GenerationOptionsInput = DEFAULT_GENERATION_OPTIONS,
): GenerationResult {
  return getGenerator(id).generate(random, options);
}
