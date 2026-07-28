import { generateName, getPeopleProfile } from "./names";
import { Random } from "./random";
import type { CompiledContentCatalog } from "./content-selection";
import {
  DEFAULT_GENERATION_OPTIONS,
  normalizeGenerationOptions,
  resolveGenerationOptions,
} from "./options";
import {
  COMPILED_CONTENT_CATALOGS,
  VARIATION_BEATS,
  type DungeonContent,
  type EncounterContent,
  type LocationContent,
  type QuestContent,
  type RumorContent,
  type VariationBeat,
} from "./catalogs/pt-BR/generated-content";
import { renderFields, type StructuredField } from "./structured-output";
import type {
  GeneratorDefinition,
  GeneratorId,
  GenerationOptionsInput,
  GenerationResult,
  ResolvedGenerationOptions,
} from "./types";

const LABELS: Record<GeneratorId, string> = {
  npc: "NPCs",
  location: "Locais",
  quest: "Missões",
  encounter: "Encontros",
  rumor: "Rumores",
  dungeon: "Masmorra",
};

type Metadata = GenerationResult["options"];

function finish(
  id: GeneratorId,
  title: string,
  fields: readonly StructuredField[],
  metadata: Metadata,
): GenerationResult {
  const content = renderFields(fields);
  return { id, label: LABELS[id], title, content, options: metadata };
}

function begin(id: GeneratorId, random: Random, options: GenerationOptionsInput): Metadata {
  // Resolve options before selecting a catalog entry or writing any prose.
  const selected = normalizeGenerationOptions(options, id);
  const resolved = resolveGenerationOptions(selected, random, id);
  return { selected, resolved };
}

function selected<T>(
  catalog: CompiledContentCatalog<T>,
  resolved: ResolvedGenerationOptions,
  random: Random,
): T {
  return catalog.select(resolved, random).content;
}

function variation(random: Random): VariationBeat {
  return random.pick(VARIATION_BEATS);
}

function generateNpc(random: Random, options: GenerationOptionsInput = DEFAULT_GENERATION_OPTIONS): GenerationResult {
  const metadata = begin("npc", random, options);
  const profile = selected(COMPILED_CONTENT_CATALOGS.npc, metadata.resolved, random);
  const beat = variation(random);
  const ancestry = metadata.resolved.ancestry;
  if (ancestry === null) throw new Error("NPC exige uma ancestralidade resolvida");
  const people = getPeopleProfile(ancestry);
  const name = generateName(people.id, random, metadata.resolved.tone);
  const fields: StructuredField[] = [
    { label: "Nome", value: name },
    { label: "Ancestralidade", value: people.label },
    { label: "Papel", value: profile.role },
    { label: "Traço definidor", value: profile.trait },
  ];
  if (metadata.resolved.complexity === "detailed") {
    fields.push(
      { label: "Aparência", value: profile.appearance },
      { label: "Personalidade", value: profile.personality },
      { label: "Motivação", value: profile.motivation },
      { label: "Complicação", value: profile.complication },
      { label: "Segredo", value: profile.secret },
      { label: "Relação", value: profile.relationship },
    );
    if (beat.companion) fields.push({ label: "Companheiro compatível", value: profile.companion });
  }
  fields.push({ label: "Gancho imediato", value: `${profile.immediateHook} ${beat.text}` });
  return finish("npc", `NPC - ${name}`, fields, metadata);
}

function locationFields(profile: LocationContent, beat: VariationBeat, detailed: boolean): StructuredField[] {
  const fields: StructuredField[] = [
    { label: "Nome", value: profile.name },
    { label: "Tipo", value: profile.type },
    { label: "Atmosfera", value: profile.atmosphere },
    { label: "Característica", value: profile.feature },
    { label: "Gancho", value: `${profile.hook} ${beat.text}` },
  ];
  if (detailed) fields.push(
    { label: "Habitantes", value: profile.inhabitants },
    { label: "História", value: profile.history },
    { label: "Tensão atual", value: profile.tension },
    { label: "Perigo", value: profile.danger },
    { label: "Segredo", value: profile.secret },
    { label: "Oportunidades", value: profile.opportunities },
  );
  return fields;
}

function generateLocation(random: Random, options: GenerationOptionsInput = DEFAULT_GENERATION_OPTIONS): GenerationResult {
  const metadata = begin("location", random, options);
  const profile = selected(COMPILED_CONTENT_CATALOGS.location, metadata.resolved, random);
  const beat = variation(random);
  return finish("location", `Local - ${profile.name}`, locationFields(profile, beat, metadata.resolved.complexity === "detailed"), metadata);
}

function questFields(profile: QuestContent, beat: VariationBeat, detailed: boolean): StructuredField[] {
  const fields: StructuredField[] = [
    { label: "Contratante", value: profile.giver },
    { label: "Objetivo", value: profile.objective },
    { label: "Local", value: profile.location },
    { label: "Complicação", value: `${profile.complication} ${beat.text}` },
    { label: "Recompensa", value: profile.reward },
  ];
  if (detailed) fields.push(
    { label: "Contexto", value: profile.context },
    { label: "Etapas", value: profile.stages },
    { label: "Oposição", value: profile.opposition },
    { label: "Escalada", value: profile.escalation },
    { label: "Consequência do fracasso", value: profile.failure },
    { label: "Resolução alternativa", value: profile.alternative },
  );
  return fields;
}

function generateQuest(random: Random, options: GenerationOptionsInput = DEFAULT_GENERATION_OPTIONS): GenerationResult {
  const metadata = begin("quest", random, options);
  const profile = selected(COMPILED_CONTENT_CATALOGS.quest, metadata.resolved, random);
  const beat = variation(random);
  return finish("quest", `Missão - ${sentenceCase(profile.objective)}`, questFields(profile, beat, metadata.resolved.complexity === "detailed"), metadata);
}

function encounterFields(profile: EncounterContent, beat: VariationBeat, detailed: boolean): StructuredField[] {
  const fields: StructuredField[] = [
    { label: "Situação", value: profile.situation },
    { label: "Ameaça imediata", value: profile.immediateThreat },
    { label: "Reviravolta", value: `${profile.twist} ${beat.text}` },
    { label: "Escolha significativa", value: profile.choice },
  ];
  if (detailed) fields.push(
    { label: "Preparação", value: profile.setup },
    { label: "Atores", value: profile.actors },
    { label: "Escalada", value: profile.escalation },
    { label: "Interação com o ambiente", value: profile.interaction },
    { label: "Desfechos prováveis", value: profile.outcomes },
    { label: "Depois", value: profile.aftermath },
  );
  return fields;
}

function generateEncounter(random: Random, options: GenerationOptionsInput = DEFAULT_GENERATION_OPTIONS): GenerationResult {
  const metadata = begin("encounter", random, options);
  const profile = selected(COMPILED_CONTENT_CATALOGS.encounter, metadata.resolved, random);
  const beat = variation(random);
  return finish("encounter", `Encontro - ${profile.title}`, encounterFields(profile, beat, metadata.resolved.complexity === "detailed"), metadata);
}

function rumorFields(profile: RumorContent, beat: VariationBeat, detailed: boolean): StructuredField[] {
  const fields: StructuredField[] = [
    { label: "Boato", value: `${profile.subject} ${profile.claim}.` },
    { label: "Verdade para o mestre", value: profile.truth },
    { label: "Desdobramento", value: beat.text },
  ];
  if (detailed) fields.push(
    { label: "Fonte", value: profile.source },
    { label: "Variações", value: profile.variations },
    { label: "Pistas", value: profile.clues },
    { label: "Interessados", value: profile.interestedParties },
    { label: "Consequência da investigação", value: profile.investigationConsequence },
    { label: "Contexto", value: profile.context },
  );
  return fields;
}

function generateRumor(random: Random, options: GenerationOptionsInput = DEFAULT_GENERATION_OPTIONS): GenerationResult {
  const metadata = begin("rumor", random, options);
  const profile = selected(COMPILED_CONTENT_CATALOGS.rumor, metadata.resolved, random);
  const beat = variation(random);
  return finish("rumor", `Rumor - ${profile.subject}`, rumorFields(profile, beat, metadata.resolved.complexity === "detailed"), metadata);
}

function sentenceCase(value: string): string {
  return value.length === 0
    ? value
    : value.charAt(0).toLocaleUpperCase("pt-BR") + value.slice(1);
}

function dungeonFields(profile: DungeonContent, beat: VariationBeat, detailed: boolean): StructuredField[] {
  const rooms = detailed ? profile.detailedRooms : profile.rooms;
  const fields: StructuredField[] = [
    { label: "Tema", value: profile.theme },
    { label: "Visão geral", value: `${profile.overview} ${beat.text}` },
  ];
  const roles = ["Entrada", "Desafio", "Contratempo", "Confronto", "Recompensa"];
  rooms.forEach((room, index) => {
    const role = roles[index];
    if (!role) throw new Error("Masmorra exige cinco papéis de sala");
    fields.push({ label: role, value: room, number: index + 1 });
  });
  return fields;
}

function generateDungeon(random: Random, options: GenerationOptionsInput = DEFAULT_GENERATION_OPTIONS): GenerationResult {
  const metadata = begin("dungeon", random, options);
  const profile = selected(COMPILED_CONTENT_CATALOGS.dungeon, metadata.resolved, random);
  const beat = variation(random);
  return finish("dungeon", `Masmorra - ${profile.theme}`, dungeonFields(profile, beat, metadata.resolved.complexity === "detailed"), metadata);
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
