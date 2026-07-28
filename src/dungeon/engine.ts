import type { DungeonContent } from "../catalogs/pt-BR/generated-content";
import type {
  ComplexityId,
  DungeonArtifact,
  DungeonEdgeArtifact,
  DungeonFeatureKind,
  DungeonMapArtifact,
  DungeonModeId,
  DungeonRoomArtifact,
  DungeonRoomRole,
  DungeonSize,
  EnvironmentId,
} from "../types";

export type DungeonMappingErrorCode =
  | "room-count"
  | "unknown-room"
  | "duplicate-edge"
  | "disconnected"
  | "duplicate-position"
  | "environment-topology";

export class DungeonMappingError extends Error {
  constructor(
    readonly code: DungeonMappingErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "DungeonMappingError";
  }
}

export interface DungeonEngineOptions {
  mode: DungeonModeId;
  size: DungeonSize;
  environment: EnvironmentId;
  complexity: ComplexityId;
}

const ROLE_SEQUENCE: Readonly<Record<DungeonSize, readonly DungeonRoomRole[]>> = {
  5: ["Entrada", "Desafio", "Contratempo", "Confronto", "Recompensa"],
  8: [
    "Entrada",
    "Exploração",
    "Desafio",
    "Segredo",
    "Contratempo",
    "Encontro",
    "Confronto",
    "Recompensa",
  ],
  12: [
    "Entrada",
    "Exploração",
    "Desafio",
    "Encruzilhada",
    "Segredo",
    "Armadilha",
    "Refúgio",
    "Contratempo",
    "Encontro",
    "Revelação",
    "Confronto",
    "Recompensa",
  ],
};

const FEATURE_BY_ROLE: Readonly<Record<DungeonRoomRole, readonly DungeonFeatureKind[]>> = {
  Entrada: [],
  Exploração: ["secret"],
  Desafio: ["trap"],
  Encruzilhada: ["secret"],
  Segredo: ["secret"],
  Armadilha: ["trap"],
  Refúgio: [],
  Contratempo: ["secret"],
  Encontro: ["encounter"],
  Revelação: ["secret"],
  Confronto: ["encounter"],
  Recompensa: ["reward"],
};

const GM_NOTE_BY_ROLE: Readonly<Record<DungeonRoomRole, string | null>> = {
  Entrada: null,
  Exploração: "Um objeto aparentemente comum foi movido recentemente e aponta para uma passagem usada pelos ocupantes.",
  Desafio: "O perigo deixa sinais antes de agir. Contorná-lo preserva recursos; neutralizá-lo cria uma rota segura para o retorno.",
  Encruzilhada: "Uma corrente de ar e rastros interrompidos denunciam uma ligação discreta entre duas das rotas.",
  Segredo: "A descoberta explica quem alterou o complexo e concede uma vantagem concreta contra uma ameaça posterior.",
  Armadilha: "O mecanismo protege um acesso específico. Acioná-lo de propósito pode bloquear perseguidores ou modificar outra sala.",
  Refúgio: null,
  Contratempo: "A mudança expõe um detalhe antes inacessível, permitindo recuperar informação mesmo quando a rota de retorno piora.",
  Encontro: "Os presentes desejam sair com segurança e escondem uma informação que oferecem em troca de ajuda verificável.",
  Revelação: "A evidência confirma uma conclusão importante e corrige uma interpretação provável das pistas anteriores.",
  Confronto: "A oposição protege algo além da própria vida e aceita negociar se o grupo reconhecer esse interesse.",
  Recompensa: "O prêmio resolve uma necessidade atual e carrega uma marca que permitirá a terceiros reconhecer sua origem.",
};

const FEATURE_MARKERS: Readonly<Record<DungeonFeatureKind, string>> = {
  secret: "S",
  trap: "A",
  encounter: "E",
  reward: "R",
};

function roomId(number: number): string {
  return `room-${number}`;
}

function roomPositions(size: DungeonSize): Array<{ x: number; y: number }> {
  const columns = size === 5 ? 5 : 4;
  return Array.from({ length: size }, (_, index) => {
    const row = Math.floor(index / columns);
    const positionInRow = index % columns;
    const column = row % 2 === 0
      ? positionInRow
      : columns - positionInRow - 1;
    return { x: 70 + column * 145, y: 65 + row * 125 };
  });
}

function roomFeatures(role: DungeonRoomRole): readonly DungeonFeatureKind[] {
  return FEATURE_BY_ROLE[role];
}

function createRooms(
  profile: DungeonContent,
  options: DungeonEngineOptions,
): DungeonRoomArtifact[] {
  const roles = ROLE_SEQUENCE[options.size];
  const positions = roomPositions(options.size);
  const sourceRooms = options.complexity === "detailed"
    ? profile.detailedRooms
    : profile.quickRooms;

  return roles.map((role, index) => {
    const base = sourceRooms[role];
    const position = positions[index];
    if (!base || !position) {
      throw new DungeonMappingError("room-count", "Não foi possível montar todas as salas.");
    }
    const features = roomFeatures(role);
    const gmNote = GM_NOTE_BY_ROLE[role];
    return {
      id: roomId(index + 1),
      number: index + 1,
      role,
      description: base,
      features,
      gmNotes: gmNote ? [gmNote] : [],
      x: position.x,
      y: position.y,
    };
  });
}

function edge(from: number, to: number, kind: DungeonEdgeArtifact["kind"]): DungeonEdgeArtifact {
  return { from: roomId(from), to: roomId(to), kind };
}

function createEdges(
  size: DungeonSize,
  environment: EnvironmentId,
): DungeonEdgeArtifact[] {
  const edges: DungeonEdgeArtifact[] = [];
  for (let number = 1; number < size; number += 1) {
    edges.push(edge(number, number + 1, "path"));
  }

  if (environment === "underground") return edges;

  const shortcuts: Array<[number, number]> =
    environment === "wilderness" || environment === "forest"
      ? [[2, 4], [5, 7], [8, 10]]
      : [[1, 3], [4, 6], [7, 9], [9, 11]];
  for (const [from, to] of shortcuts) {
    if (to <= size) edges.push(edge(from, to, "shortcut"));
  }
  return edges;
}

function degreeMap(map: DungeonMapArtifact): Map<string, number> {
  const degrees = new Map(map.rooms.map((room) => [room.id, 0]));
  for (const edgeItem of map.edges) {
    degrees.set(edgeItem.from, (degrees.get(edgeItem.from) ?? 0) + 1);
    degrees.set(edgeItem.to, (degrees.get(edgeItem.to) ?? 0) + 1);
  }
  return degrees;
}

function assertConnected(map: DungeonMapArtifact): void {
  const first = map.rooms[0];
  if (!first) throw new DungeonMappingError("room-count", "O mapa não contém salas.");
  const visited = new Set([first.id]);
  const queue = [first.id];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    for (const edgeItem of map.edges) {
      const next = edgeItem.from === current
        ? edgeItem.to
        : edgeItem.to === current
          ? edgeItem.from
          : null;
      if (next && !visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
  if (visited.size !== map.rooms.length) {
    throw new DungeonMappingError("disconnected", "O mapa contém salas desconectadas.");
  }
}

export function validateDungeonMap(
  map: DungeonMapArtifact,
  expectedSize: DungeonSize,
): void {
  if (map.rooms.length !== expectedSize) {
    throw new DungeonMappingError("room-count", "O mapa não tem o número esperado de salas.");
  }
  const ids = new Set(map.rooms.map((room) => room.id));
  const edgeKeys = new Set<string>();
  for (const edgeItem of map.edges) {
    if (!ids.has(edgeItem.from) || !ids.has(edgeItem.to) || edgeItem.from === edgeItem.to) {
      throw new DungeonMappingError("unknown-room", "Uma conexão aponta para uma sala inválida.");
    }
    const key = [edgeItem.from, edgeItem.to].sort().join("/");
    if (edgeKeys.has(key)) {
      throw new DungeonMappingError("duplicate-edge", "O mapa contém uma conexão duplicada.");
    }
    edgeKeys.add(key);
  }

  const positions = new Set(map.rooms.map((room) => `${room.x}/${room.y}`));
  if (positions.size !== map.rooms.length) {
    throw new DungeonMappingError("duplicate-position", "Duas salas ocupam a mesma posição.");
  }
  assertConnected(map);

  const degrees = [...degreeMap(map).values()];
  const maxDegree = Math.max(...degrees);
  if (map.environment === "underground") {
    if (map.edges.length !== map.rooms.length - 1 || maxDegree > 2) {
      throw new DungeonMappingError(
        "environment-topology",
        "O subterrâneo exige uma rota linear sem atalhos.",
      );
    }
  } else if (map.environment === "wilderness" || map.environment === "forest") {
    if (maxDegree < 3) {
      throw new DungeonMappingError(
        "environment-topology",
        "Este ambiente exige pelo menos uma ramificação.",
      );
    }
  } else if (map.edges.length < map.rooms.length) {
    throw new DungeonMappingError(
      "environment-topology",
      "Este ambiente exige ao menos um circuito alternativo.",
    );
  }
}

function roomToken(room: DungeonRoomArtifact): string {
  const marker = room.features[0] ? FEATURE_MARKERS[room.features[0]] : " ";
  return `[${String(room.number).padStart(2, "0")}${marker}]`;
}

export function renderDungeonAscii(
  rooms: readonly DungeonRoomArtifact[],
  edges: readonly DungeonEdgeArtifact[],
): string {
  const rows = new Map<number, DungeonRoomArtifact[]>();
  for (const room of rooms) {
    const values = rows.get(room.y) ?? [];
    values.push(room);
    rows.set(room.y, values);
  }

  const lines: string[] = [];
  const sortedRows = [...rows.entries()].sort(([a], [b]) => a - b);
  sortedRows.forEach(([, row], rowIndex) => {
    const sorted = [...row].sort((a, b) => a.x - b.x);
    lines.push(sorted.map(roomToken).join("---"));
    if (rowIndex < sortedRows.length - 1) {
      const connectorAtRight = rowIndex % 2 === 0;
      lines.push(connectorAtRight ? `${" ".repeat(Math.max(0, sorted.length * 8 - 4))}|` : "  |");
    }
  });

  const shortcuts = edges.filter((edgeItem) => edgeItem.kind === "shortcut");
  if (shortcuts.length > 0) {
    const roomById = new Map(rooms.map((room) => [room.id, room.number]));
    lines.push(
      `Atalhos: ${shortcuts.map((item) =>
        `${String(roomById.get(item.from)).padStart(2, "0")}--${String(roomById.get(item.to)).padStart(2, "0")}`
      ).join(", ")}`,
    );
  }
  lines.push("Marcadores: S segredo, A armadilha, E encontro, R recompensa");
  return lines.join("\n");
}

function accessibleMapLabel(
  rooms: readonly DungeonRoomArtifact[],
  edges: readonly DungeonEdgeArtifact[],
): string {
  const entrance = rooms.find((room) => room.role === "Entrada");
  const reward = rooms.find((room) => room.role === "Recompensa");
  return [
    `Mapa abstrato de masmorra com ${rooms.length} salas e ${edges.length} conexões.`,
    entrance ? `A entrada é a sala ${entrance.number}.` : "",
    reward ? `A recompensa fica na sala ${reward.number}.` : "",
    "Marcadores identificam segredos, armadilhas, encontros e recompensas para o mestre.",
  ].filter(Boolean).join(" ");
}

export function buildDungeonArtifact(
  profile: DungeonContent,
  options: DungeonEngineOptions,
): DungeonArtifact {
  const rooms = createRooms(profile, options);
  if (options.mode === "story") {
    return { mode: options.mode, size: options.size, rooms, map: null };
  }

  const edges = createEdges(options.size, options.environment);
  const map: DungeonMapArtifact = {
    environment: options.environment,
    rooms,
    edges,
    ascii: renderDungeonAscii(rooms, edges),
    accessibleLabel: accessibleMapLabel(rooms, edges),
  };
  validateDungeonMap(map, options.size);
  return { mode: options.mode, size: options.size, rooms, map };
}

export function dungeonFeatureLabel(feature: DungeonFeatureKind): string {
  switch (feature) {
    case "secret": return "SEGREDO";
    case "trap": return "ARMADILHA";
    case "encounter": return "ENCONTRO";
    case "reward": return "RECOMPENSA";
  }
}
