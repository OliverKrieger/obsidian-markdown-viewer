import React from "react";
import type { ManifestLike, SwadeStatBlock } from "../types";
import { DiamondDivider } from "../render/Shared";
import { StatBlockSection } from "../render/shared/StatBlockSection";

import { parseToughnessAndArmor, parseWildCard } from "./helpers/parseBasics";
import { swadeStatBlockWeight } from "./helpers/statBlockSizeHelper";

import { SwadeHeader } from "./components/SwadeHeader";
import { SwadeAttributesGrid } from "./components/SwadeAttributesGrid";
import { SwadeDerivedStats } from "./components/SwadeDerivedStats";
import { SwadeSkillsInline } from "./components/SwadeSkillsInline";
import { SwadeAbilityLine } from "./components/SwadeAbilityLine";
import { SwadeAbilityRef } from "./components/SwadeAbilityRef"; // used in Special section

export const SwadeStatBlockCard: React.FC<SwadeStatBlock & { manifest?: ManifestLike }> = ({
    title,
    type,
    desc,
    attributes,
    skills,
    pace,
    parry,
    toughness,
    charisma,

    edges,
    hindrances,
    gear,
    special,

    className,
    manifest,
}) => {
    const wildCard = parseWildCard(type);
    const { tough, armor } = parseToughnessAndArmor(toughness);

    const agi = attributes?.Agi ?? (attributes as any)?.agility ?? "—";
    const sma = attributes?.Sma ?? (attributes as any)?.smarts ?? "—";
    const spi = attributes?.Spi ?? (attributes as any)?.spirit ?? "—";
    const str = attributes?.Str ?? (attributes as any)?.strength ?? "—";
    const vig = attributes?.Vig ?? (attributes as any)?.vigor ?? "—";

    const skillsList = skills ? Object.entries(skills).sort(([a], [b]) => a.localeCompare(b)) : [];

    const weight = swadeStatBlockWeight({ desc, skills, edges, hindrances, special, gear });

    const isLarge = weight >= 900;
    const isMedium = weight >= 450;

    const widthClass = isLarge
        ? "max-w-md md:max-w-2xl xl:max-w-5xl 2xl:max-w-7xl"
        : isMedium
            ? "max-w-md md:max-w-2xl xl:max-w-3xl 2xl:max-w-5xl"
            : "max-w-md md:max-w-lg xl:max-w-xl";

    const colsClass = isLarge ? "cols-large" : "cols-small";

    return (
        <div
            className={[
                "relative bg-brand-100/20 p-6 w-full mx-auto shadow-lg border border-brand-500 rounded-lg",
                "bg-linear-to-b from-brand-100/20 to-brand-200/20",
                widthClass,
                className ?? "",
            ].join(" ")}
        >
            <div className={["statblock-columns", colsClass].join(" ")}>
                {/* MAIN BLOCK participates in columns */}
                <div>
                    <SwadeHeader title={title} type={type} desc={desc} wildCard={wildCard} />

                    <DiamondDivider />

                    <SwadeAttributesGrid agi={agi} sma={sma} spi={spi} str={str} vig={vig} />

                    <SwadeDerivedStats
                        pace={pace}
                        parry={parry}
                        toughnessLabel={tough != null ? String(tough) : toughness ?? "—"}
                        armorSubValue={armor != null ? `(${armor})` : undefined}
                        charisma={charisma}
                    />

                    <DiamondDivider />

                    <SwadeSkillsInline skillsList={skillsList} />
                </div>

                {/* Edges */}
                {edges?.entries?.length ? (
                    <StatBlockSection title="Edges" desc={edges.desc}>
                        <div className="space-y-1">
                            {edges.entries.map((e, i) => (
                                <SwadeAbilityLine key={i} item={e} manifest={manifest} showDash={false} />
                            ))}
                        </div>
                    </StatBlockSection>
                ) : null}

                {/* Hindrances */}
                {hindrances?.entries?.length ? (
                    <StatBlockSection title="Hindrances" desc={hindrances.desc}>
                        <div className="flex flex-wrap gap-2 text-sm">
                            {hindrances.entries.map((h, index) => {
                                const m = h.name.match(/^(.*)\((Major|Minor)\)\s*$/i);
                                const name = m ? m[1].trim() : h.name;
                                const typeTag = m ? m[2][0].toUpperCase() + m[2].slice(1).toLowerCase() : "Minor";
                                const isMajor = typeTag.toLowerCase() === "major";

                                return (
                                    <span
                                        key={index}
                                        className={[
                                            "px-2 py-0.5 rounded text-xs",
                                            isMajor ? "bg-tertiary-100 text-tertiary-500" : "bg-brand-100/20",
                                        ].join(" ")}
                                    >
                                        {name} ({typeTag})
                                    </span>
                                );
                            })}
                        </div>
                    </StatBlockSection>
                ) : null}

                {/* Special */}
                {special?.entries?.length ? (
                    <StatBlockSection title="Special Abilities" desc={special.desc}>
                        <div className="space-y-2">
                            {special.entries.map((a, i) => (
                                <p key={i} className="text-sm">
                                    <span className="font-semibold italic text-brand-500">{a.name}:</span>{" "}
                                    {a.ref ? <SwadeAbilityRef refName={a.ref} manifest={manifest} /> : null}
                                    {a.text ? <span className="opacity-75"> {a.text}</span> : null}
                                </p>
                            ))}
                        </div>
                    </StatBlockSection>
                ) : null}

                {/* Gear */}
                {gear?.entries?.length ? (
                    <StatBlockSection title="Gear" desc={gear.desc}>
                        <div className="text-sm space-y-1">
                            {gear.entries.map((g, i) => {
                                const m = g.match(/^(.+?)\s*\((.+)\)\s*$/);
                                const name = m ? m[1].trim() : g;
                                const stats = m ? m[2].trim() : undefined;

                                return (
                                    <p key={i}>
                                        <span className="font-medium">{name}</span>
                                        {stats ? <span className="opacity-75 text-xs ml-1">({stats})</span> : null}
                                    </p>
                                );
                            })}
                        </div>
                    </StatBlockSection>
                ) : null}
            </div>
        </div>
    );
};
