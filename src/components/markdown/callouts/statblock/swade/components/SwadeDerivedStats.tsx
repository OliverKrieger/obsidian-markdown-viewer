import { StatPill } from "../../render/Shared";

export function SwadeDerivedStats({
    pace,
    parry,
    toughnessLabel,
    armorSubValue,
    charisma,
}: {
    pace?: string;
    parry?: string;
    toughnessLabel: string;
    armorSubValue?: string;
    charisma?: string;
}) {
    return (
        <div className="grid grid-cols-4 gap-2 mb-4">
            <StatPill label="Pace" value={pace ?? "—"} />
            <StatPill label="Parry" value={parry ?? "—"} />
            <StatPill label="Tough" value={toughnessLabel} subValue={armorSubValue} />
            <StatPill label="Cha" value={charisma ?? "—"} />
        </div>
    );
}
