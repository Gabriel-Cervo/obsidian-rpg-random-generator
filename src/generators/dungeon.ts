import {
  COMPILED_CONTENT_CATALOGS,
  type DungeonContent,
  type VariationBeat,
} from "../catalogs/pt-BR/generated-content";
import {
  buildDungeonArtifact,
  dungeonFeatureLabel,
} from "../dungeon/engine";
import { DEFAULT_GENERATION_OPTIONS } from "../options";
import { Random } from "../random";
import type { StructuredField } from "../structured-output";
import type {
  DungeonArtifact,
  GeneratorDefinition,
  GenerationOptionsInput,
  GenerationResult,
} from "../types";
import {
  begin,
  finish,
  GENERATOR_LABELS,
  selectProfile,
  selectVariation,
} from "./shared";

function dungeonFields(
  profile: DungeonContent,
  artifact: DungeonArtifact,
  beat: VariationBeat,
): StructuredField[] {
  const modeSummary = artifact.mode === "mapped"
    ? `Estrutura mapeada com ${artifact.size} salas e conexões validadas.`
    : `Estrutura narrativa com ${artifact.size} salas.`;
  const fields: StructuredField[] = [
    { label: "Tema", value: profile.theme },
    { label: "Visão geral", value: `${profile.overview} ${modeSummary} ${beat.dungeon}` },
  ];
  for (const room of artifact.rooms) {
    const gm = room.gmNotes.length > 0
      ? ` Mestre [${room.features.map(dungeonFeatureLabel).join(", ")}]: ${room.gmNotes.join(" ")}`
      : "";
    fields.push({
      label: room.role,
      value: `${room.description}${gm}`,
      number: room.number,
    });
  }
  return fields;
}

export function generateDungeon(
  random: Random,
  options: GenerationOptionsInput = DEFAULT_GENERATION_OPTIONS,
): GenerationResult {
  const metadata = begin("dungeon", random, options);
  const profile = selectProfile(
    COMPILED_CONTENT_CATALOGS.dungeon,
    metadata.resolved,
    random,
  );
  const beat = selectVariation(random);
  const { dungeonMode, dungeonSize } = metadata.resolved;
  if (dungeonMode === null || dungeonSize === null) {
    throw new Error("Masmorra exige modo e tamanho resolvidos");
  }
  const artifact = buildDungeonArtifact(profile, {
    mode: dungeonMode,
    size: dungeonSize,
    environment: metadata.resolved.environment,
    complexity: metadata.resolved.complexity,
  });
  const result = finish(
    "dungeon",
    `Masmorra - ${profile.theme}`,
    dungeonFields(profile, artifact, beat),
    metadata,
  );
  if (!artifact.map) return { ...result, dungeon: artifact };

  return {
    ...result,
    content: {
      plainText: `${result.content.plainText}\n\nMapa abstrato (ASCII):\n${artifact.map.ascii}`,
      markdown: `${result.content.markdown}\n\n**Mapa abstrato (ASCII):**\n\n\`\`\`text\n${artifact.map.ascii}\n\`\`\``,
    },
    dungeon: artifact,
  };
}

export const DUNGEON_GENERATOR: GeneratorDefinition = {
  id: "dungeon",
  label: GENERATOR_LABELS.dungeon,
  icon: "box",
  generate: generateDungeon,
};
