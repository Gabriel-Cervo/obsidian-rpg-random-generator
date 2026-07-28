/**
 * Compatibility boundary for integrations that imported the old table module.
 * Authoritative content lives in the option-aware pt-BR catalog.
 */
export {
  CONTENT_CATALOGS,
  DUNGEON_CONTENT,
  ENCOUNTER_CONTENT,
  LOCATION_CONTENT,
  NPC_CONTENT,
  QUEST_CONTENT,
  RUMOR_CONTENT,
  VARIATION_BEATS,
} from "./catalogs/pt-BR/generated-content";
export type {
  DungeonContent,
  EncounterContent,
  LocationContent,
  NpcContent,
  QuestContent,
  RumorContent,
  VariationBeat,
} from "./catalogs/pt-BR/generated-content";
