import type { NormalizedStatBlock, ManifestLike } from "./types";
import { SwadeStatBlockCard } from "./render/SwadeStatBlockCard";
import { Dnd5eStatBlockCard } from "./render/DnD5eStatBlockCard";
import { FallbackStatBlockCard } from "./render/FallbackStatBlcokCard";

export function getStatBlockRenderer(ruleset: string) {
  const key = (ruleset || "").toLowerCase();
  if (key === "swade") return SwadeStatBlockCard;
  if (key === "dnd5e") return Dnd5eStatBlockCard;
  return FallbackStatBlockCard;
}

export type StatBlockRendererProps = NormalizedStatBlock & {
  manifest?: ManifestLike;
};
