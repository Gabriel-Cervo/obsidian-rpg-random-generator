import {
  COMPILED_CONTENT_CATALOGS,
  type EncounterContent,
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

function encounterFields(
  profile: EncounterContent,
  beat: VariationBeat,
  detailed: boolean,
): StructuredField[] {
  const fields: StructuredField[] = [
    { label: "Situação", value: profile.situation },
    { label: "Ameaça imediata", value: profile.immediateThreat },
    { label: "Reviravolta", value: `${profile.twist} ${beat.text}` },
    { label: "Escolha significativa", value: profile.choice },
  ];
  if (detailed) {
    fields.push(
      { label: "Preparação", value: profile.setup },
      { label: "Atores", value: profile.actors },
      { label: "Escalada", value: profile.escalation },
      { label: "Interação com o ambiente", value: profile.interaction },
      { label: "Desfechos prováveis", value: profile.outcomes },
      { label: "Depois", value: profile.aftermath },
    );
  }
  return fields;
}

export function generateEncounter(
  random: Random,
  options: GenerationOptionsInput = DEFAULT_GENERATION_OPTIONS,
): GenerationResult {
  const metadata = begin("encounter", random, options);
  const profile = selectProfile(
    COMPILED_CONTENT_CATALOGS.encounter,
    metadata.resolved,
    random,
  );
  const beat = selectVariation(random);
  return finish(
    "encounter",
    `Encontro - ${profile.title}`,
    encounterFields(profile, beat, metadata.resolved.complexity === "detailed"),
    metadata,
  );
}

export const ENCOUNTER_GENERATOR: GeneratorDefinition = {
  id: "encounter",
  label: GENERATOR_LABELS.encounter,
  icon: "target",
  generate: generateEncounter,
};
