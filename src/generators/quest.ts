import {
  COMPILED_CONTENT_CATALOGS,
  type QuestContent,
  type VariationBeat,
} from "../catalogs/pt-BR/generated-content";
import { DEFAULT_GENERATION_OPTIONS } from "../options";
import { Random } from "../random";
import type { StructuredField } from "../structured-output";
import type { GeneratorDefinition, GenerationOptionsInput, GenerationResult } from "../types";
import {
  begin,
  finish,
  GENERATOR_LABELS,
  selectProfile,
  selectVariation,
} from "./shared";

function questFields(
  profile: QuestContent,
  beat: VariationBeat,
  detailed: boolean,
): StructuredField[] {
  const fields: StructuredField[] = [
    { label: "Contratante", value: profile.giver },
    { label: "Objetivo", value: profile.objective },
    { label: "Local", value: profile.location },
    { label: "Complicação", value: `${profile.complication} ${beat.quest}` },
    { label: "Recompensa", value: profile.reward },
  ];
  if (detailed) {
    fields.push(
      { label: "Contexto", value: profile.context },
      { label: "Etapas", value: profile.stages },
      { label: "Oposição", value: profile.opposition },
      { label: "Escalada", value: profile.escalation },
      { label: "Consequência do fracasso", value: profile.failure },
      { label: "Resolução alternativa", value: profile.alternative },
    );
  }
  return fields;
}

export function generateQuest(
  random: Random,
  options: GenerationOptionsInput = DEFAULT_GENERATION_OPTIONS,
): GenerationResult {
  const metadata = begin("quest", random, options);
  const profile = selectProfile(COMPILED_CONTENT_CATALOGS.quest, metadata.resolved, random);
  const beat = selectVariation(random);
  return finish(
    "quest",
    `Missão - ${profile.title}`,
    questFields(profile, beat, metadata.resolved.complexity === "detailed"),
    metadata,
  );
}

export const QUEST_GENERATOR: GeneratorDefinition = {
  id: "quest",
  label: GENERATOR_LABELS.quest,
  icon: "file-text",
  generate: generateQuest,
};
