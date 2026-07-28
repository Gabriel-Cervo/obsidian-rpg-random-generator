import {
  COMPILED_CONTENT_CATALOGS,
  type LocationContent,
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

function locationFields(
  profile: LocationContent,
  beat: VariationBeat,
  detailed: boolean,
): StructuredField[] {
  const fields: StructuredField[] = [
    { label: "Nome", value: profile.name },
    { label: "Tipo", value: profile.type },
    { label: "Atmosfera", value: profile.atmosphere },
    { label: "Característica", value: profile.feature },
    { label: "Gancho", value: `${profile.hook} ${beat.text}` },
  ];
  if (detailed) {
    fields.push(
      { label: "Habitantes", value: profile.inhabitants },
      { label: "História", value: profile.history },
      { label: "Tensão atual", value: profile.tension },
      { label: "Perigo", value: profile.danger },
      { label: "Segredo", value: profile.secret },
      { label: "Oportunidades", value: profile.opportunities },
    );
  }
  return fields;
}

export function generateLocation(
  random: Random,
  options: GenerationOptionsInput = DEFAULT_GENERATION_OPTIONS,
): GenerationResult {
  const metadata = begin("location", random, options);
  const profile = selectProfile(
    COMPILED_CONTENT_CATALOGS.location,
    metadata.resolved,
    random,
  );
  const beat = selectVariation(random);
  return finish(
    "location",
    `Local - ${profile.name}`,
    locationFields(profile, beat, metadata.resolved.complexity === "detailed"),
    metadata,
  );
}

export const LOCATION_GENERATOR: GeneratorDefinition = {
  id: "location",
  label: GENERATOR_LABELS.location,
  icon: "map",
  generate: generateLocation,
};
