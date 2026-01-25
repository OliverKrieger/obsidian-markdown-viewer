export function Dnd5eBasicStats({
    armorClass,
    acRaw,
    armorType,
    hitPoints,
    hpRaw,
    hitDice,
    speed,
}: {
    armorClass?: number;
    acRaw?: string;
    armorType?: string;
    hitPoints?: number;
    hpRaw?: string;
    hitDice?: string;
    speed?: string;
}) {
    return (
        <div className="space-y-1 text-sm">
            {(armorClass != null || acRaw) && (
                <p>
                    <span className="font-semibold text-brand-500">Armor Class</span>{" "}
                    {armorClass ?? acRaw}
                    {armorType && ` (${armorType})`}
                </p>
            )}
            {(hitPoints != null || hpRaw) && (
                <p>
                    <span className="font-semibold text-brand-500">Hit Points</span>{" "}
                    {hitPoints ?? hpRaw} {hitDice ? `(${hitDice})` : null}
                </p>
            )}
            {speed && (
                <p>
                    <span className="font-semibold text-brand-500">Speed</span> {speed}
                </p>
            )}
        </div>
    );
}
