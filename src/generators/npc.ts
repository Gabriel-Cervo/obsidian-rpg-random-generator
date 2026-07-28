import {
  COMPILED_CONTENT_CATALOGS,
} from "../catalogs/pt-BR/generated-content";
import { getQuickVariation } from "../catalogs/pt-BR/quick-variations";
import { generateName, getPeopleProfile } from "../names";
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

export function generateNpc(
  random: Random,
  options: GenerationOptionsInput = DEFAULT_GENERATION_OPTIONS,
): GenerationResult {
  const metadata = begin("npc", random, options);
  const profile = selectProfile(COMPILED_CONTENT_CATALOGS.npc, metadata.resolved, random);
  const beat = selectVariation(random);
  const ancestry = metadata.resolved.ancestry;
  if (ancestry === null) throw new Error("NPC exige uma ancestralidade resolvida");
  const people = getPeopleProfile(ancestry);
  const name = generateName(people.id, random, metadata.resolved.tone);
  const fields: StructuredField[] = [
    { label: "Nome", value: name },
    { label: "Ancestralidade", value: people.label },
    { label: "Papel", value: profile.role },
  ];
  if (metadata.resolved.complexity === "detailed") {
    fields.push(
      { label: "Traço definidor", value: profile.trait },
      { label: "Aparência", value: profile.appearance },
      { label: "Personalidade", value: profile.personality },
      { label: "Motivação", value: profile.motivation },
      { label: "Complicação", value: profile.complication },
      { label: "Segredo", value: profile.secret },
      { label: "Relação", value: profile.relationship },
    );
    if (beat.companion) {
      fields.push({ label: "Companheiro compatível", value: profile.companion });
    }
    fields.push({ label: "Gancho imediato", value: `${profile.immediateHook} ${beat.npc}` });
  } else {
    const quickBeat = getQuickVariation(beat.id);
    fields.push(
      { label: "Postura", value: profile.quickTrait },
      { label: "Gancho", value: quickBeat.npc },
    );
  }
  return finish("npc", `NPC - ${name}`, fields, metadata);
}

export const NPC_GENERATOR: GeneratorDefinition = {
  id: "npc",
  label: GENERATOR_LABELS.npc,
  icon: "user-round",
  generate: generateNpc,
};
