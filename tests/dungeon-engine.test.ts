import { describe, expect, it } from "vitest";
import { DUNGEON_CONTENT } from "../src/catalogs/pt-BR/generated-content";
import {
  buildDungeonArtifact,
  DungeonMappingError,
  validateDungeonMap,
} from "../src/dungeon/engine";
import {
  COMPLEXITY_IDS,
  DUNGEON_MODE_IDS,
  DUNGEON_SIZES,
  ENVIRONMENT_IDS,
  type DungeonFeatureKind,
} from "../src/types";

const profile = DUNGEON_CONTENT.find((entry) => !entry.fallback)?.content;
if (!profile) throw new Error("perfil de masmorra ausente");

describe("pipeline de masmorra", () => {
  it("cobre modos, tamanhos, complexidades e topologias ambientais", () => {
    for (const mode of DUNGEON_MODE_IDS) {
      for (const size of DUNGEON_SIZES) {
        for (const environment of ENVIRONMENT_IDS) {
          for (const complexity of COMPLEXITY_IDS) {
            const artifact = buildDungeonArtifact(profile, {
              mode,
              size,
              environment,
              complexity,
            });
            expect(artifact.rooms).toHaveLength(size);
            expect(new Set(artifact.rooms.map((room) => room.id)).size).toBe(size);
            if (mode === "story") {
              expect(artifact.map).toBeNull();
            } else {
              expect(artifact.map).not.toBeNull();
              if (!artifact.map) throw new Error("mapa esperado");
              const map = artifact.map;
              expect(() => validateDungeonMap(map, size)).not.toThrow();
              expect(map.ascii).toContain("[01");
              expect(map.accessibleLabel).toContain(`${size} salas`);
            }
          }
        }
      }
    }
  });

  it("sempre distribui conteúdo reservado ao mestre", () => {
    for (const size of DUNGEON_SIZES) {
      const artifact = buildDungeonArtifact(profile, {
        mode: "mapped",
        size,
        environment: "ruins",
        complexity: "detailed",
      });
      const features = new Set<DungeonFeatureKind>(
        artifact.rooms.flatMap((room) => room.features),
      );
      expect(features).toEqual(new Set(["secret", "trap", "encounter", "reward"]));
      expect(artifact.rooms.some((room) => room.gmNotes.length > 0)).toBe(true);
    }
  });

  it("rejeita mapas inválidos com erro tipado", () => {
    const artifact = buildDungeonArtifact(profile, {
      mode: "mapped",
      size: 5,
      environment: "underground",
      complexity: "quick",
    });
    if (!artifact.map) throw new Error("mapa esperado");
    const invalid = {
      ...artifact.map,
      edges: [...artifact.map.edges, artifact.map.edges[0]].filter(
        (edge): edge is NonNullable<typeof edge> => edge !== undefined,
      ),
    };
    expect(() => validateDungeonMap(invalid, 5)).toThrow(DungeonMappingError);
  });
});
