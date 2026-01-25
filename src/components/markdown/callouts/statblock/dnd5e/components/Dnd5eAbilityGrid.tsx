import { calculateModifier } from "../helpers/parseBasics";
import type { Dnd5eStatBlock } from "../../types";

export function Dnd5eAbilityGrid({ abilities }: { abilities?: Dnd5eStatBlock["abilities"] }) {
    const ab = abilities ?? {};
    const order: Array<"STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA"> = [
        "STR",
        "DEX",
        "CON",
        "INT",
        "WIS",
        "CHA",
    ];

    return (
        <div className="grid grid-cols-6 gap-1 text-center text-sm">
            {order.map((k) => {
                const score = (ab as any)?.[k]?.score;
                const scoreNumber = typeof score === "number" ? score : undefined;

                return (
                    <div key={k}>
                        <div className="font-serif font-bold text-brand-500 text-xs">{k}</div>
                        <div className="font-semibold">
                            {scoreNumber != null ? scoreNumber : "—"}{" "}
                            <span className="text-muted-foreground text-xs">
                                {scoreNumber != null ? `(${calculateModifier(scoreNumber)})` : ""}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
