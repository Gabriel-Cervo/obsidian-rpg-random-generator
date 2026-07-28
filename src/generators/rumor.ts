import {
  COMPILED_CONTENT_CATALOGS,
  type RumorContent,
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

function rumorFields(
  profile: RumorContent,
  beat: VariationBeat,
  detailed: boolean,
): StructuredField[] {
  const fields: StructuredField[] = [
    { label: "Boato", value: `${profile.subject} ${profile.claim}.` },
    { label: "Verdade para o mestre", value: profile.truth },
    { label: "Desdobramento", value: beat.text },
  ];
  if (detailed) {
    fields.push(
      { label: "Fonte", value: profile.source },
      { label: "Variações", value: profile.variations },
      { label: "Pistas", value: profile.clues },
      { label: "Interessados", value: profile.interestedParties },
      { label: "Consequência da investigação", value: profile.investigationConsequence },
      { label: "Contexto", value: profile.context },
    );
  }
  return fields;
}

export function generateRumor(
  random: Random,
  options: GenerationOptionsInput = DEFAULT_GENERATION_OPTIONS,
): GenerationResult {
  const metadata = begin("rumor", random, options);
  const profile = selectProfile(COMPILED_CONTENT_CATALOGS.rumor, metadata.resolved, random);
  const beat = selectVariation(random);
  return finish(
    "rumor",
    `Rumor - ${profile.subject}`,
    rumorFields(profile, beat, metadata.resolved.complexity === "detailed"),
    metadata,
  );
}

export const RUMOR_GENERATOR: GeneratorDefinition = {
  id: "rumor",
  label: GENERATOR_LABELS.rumor,
  icon: "message-circle",
  generate: generateRumor,
};
