import React, { useRef, useState } from "react";
import type { Dnd5eAction, Dnd5eStatBlock, ManifestLike } from "../types";
import { OrnamentBorder, StatDivider } from "./Shared";
import { WikiLink } from "../../../WikiLink";

function slugToHref(slug: string) {
    return `/page/${encodeURIComponent(slug)}`;
}

function calculateModifier(score: number): string {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
}

function parseAC(ac?: string): { armorClass?: number; armorType?: string } {
    if (!ac) return {};
    const n = ac.match(/-?\d+/);
    const armorClass = n ? Number(n[0]) : undefined;
    const t = ac.match(/\((.+?)\)/);
    const armorType = t?.[1]?.trim();
    return { armorClass, armorType };
}

function parseHP(hp?: string): { hitPoints?: number; hitDice?: string } {
    if (!hp) return {};
    const n = hp.match(/-?\d+/);
    const hitPoints = n ? Number(n[0]) : undefined;
    const d = hp.match(/\((.+?)\)/);
    const hitDice = d?.[1]?.trim();
    return { hitPoints, hitDice };
}

function parseCR(cr?: string): { challengeRating?: string; proficiencyBonus?: string } {
    if (!cr) return {};
    const pbMatch = cr.match(/\(([-+]\d+)\)\s*$/);
    const proficiencyBonus = pbMatch ? pbMatch[1] : undefined;
    const challengeRating = pbMatch ? cr.replace(/\(([-+]\d+)\)\s*$/, "").trim() : cr.trim();
    return { challengeRating, proficiencyBonus };
}

function HoverPanel({
    title,
    meta,
    x,
    y,
    onMouseEnter,
    onMouseLeave,
}: {
    title: string;
    meta: any;
    x: number;
    y: number;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}) {
    const snippet =
        typeof meta?.summary === "string"
            ? meta.summary
            : typeof meta?.description === "string"
                ? meta.description
                : typeof meta?.excerpt === "string"
                    ? meta.excerpt
                    : null;

    return (
        <div
            className="fixed z-50 max-w-sm p-3 rounded-xl border shadow bg-white text-black"
            style={{ left: x + 12, top: y + 12 }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="font-bold mb-1">{title}</div>
            {snippet ? (
                <div className="text-sm opacity-80 whitespace-pre-wrap">{snippet}</div>
            ) : (
                <div className="text-sm opacity-70">No preview available.</div>
            )}
        </div>
    );
}

function AbilityRef({
    refName,
    manifest,
}: {
    refName: string;
    manifest?: ManifestLike;
}) {
    const [hoverXY, setHoverXY] = useState<{ x: number; y: number } | null>(null);
    const [panelHovered, setPanelHovered] = useState(false);
    const closeTimerRef = useRef<number | null>(null);

    const meta = manifest?.pageMeta?.[refName];

    function clearCloseTimer() {
        if (closeTimerRef.current != null) {
            window.clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    }

    function scheduleClose() {
        clearCloseTimer();
        closeTimerRef.current = window.setTimeout(() => setHoverXY(null), 120);
    }

    return (
        <>
            <WikiLink
                href={slugToHref(refName)}
                className="underline cursor-help text-brand-500"
                onMouseEnter={(e: any) => {
                    clearCloseTimer();
                    setHoverXY({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => {
                    if (!panelHovered) scheduleClose();
                }}
            >
                {refName}
            </WikiLink>

            {hoverXY && meta && (
                <HoverPanel
                    title={refName}
                    meta={meta}
                    x={hoverXY.x}
                    y={hoverXY.y}
                    onMouseEnter={() => {
                        clearCloseTimer();
                        setPanelHovered(true);
                    }}
                    onMouseLeave={() => {
                        setPanelHovered(false);
                        scheduleClose();
                    }}
                />
            )}
        </>
    );
}

function ActionLine({
    item,
    manifest,
}: {
    item: Dnd5eAction;
    manifest?: ManifestLike;
}) {
    return (
        <p className="text-sm">
            <span className="font-semibold italic text-brand-500">{item.name}.</span>{" "}
            {item.ref ? <AbilityRef refName={item.ref} manifest={manifest} /> : null}
            {item.text ? <span className="opacity-90"> {item.text}</span> : null}
        </p>
    );
}

export const Dnd5eStatBlockCard: React.FC<Dnd5eStatBlock & { manifest?: ManifestLike }> = ({
    title,
    size,
    creatureType,
    alignment,
    ac,
    hp,
    speed,
    abilities,
    saves,
    skills,
    resistances,
    immunities,
    vulnerabilities,
    conditionImmunities,
    senses,
    languages,
    cr,
    traits,
    actions,
    reactions,
    legendaryActions,
    className,
    manifest,
}) => {
    const { armorClass, armorType } = parseAC(ac);
    const { hitPoints, hitDice } = parseHP(hp);
    const { challengeRating, proficiencyBonus } = parseCR(cr);

    const subtitle = [size, creatureType, alignment].filter(Boolean).join(" ");

    const ab = abilities ?? {};
    const abilityOrder: Array<["STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA", string]> = [
        ["STR", "STR"],
        ["DEX", "DEX"],
        ["CON", "CON"],
        ["INT", "INT"],
        ["WIS", "WIS"],
        ["CHA", "CHA"],
    ];

    return (
        <div
            className={[
                "relative bg-secondary-500/20 p-6 max-w-md shadow-lg border-2 border-brand-500/40",
                className ?? "",
            ].join(" ")}
        >
            <OrnamentBorder />

            {/* Header */}
            <header className="mb-2">
                <h1 className="font-serif text-2xl font-bold text-brand-500 tracking-wide">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-sm italic text-muted-foreground">{subtitle}</p>
                )}
            </header>

            <StatDivider />

            {/* Basic Stats */}
            <div className="space-y-1 text-sm">
                {(armorClass != null || ac) && (
                    <p>
                        <span className="font-semibold text-brand-500">Armor Class</span>{" "}
                        {armorClass ?? ac}
                        {armorType && ` (${armorType})`}
                    </p>
                )}
                {(hitPoints != null || hp) && (
                    <p>
                        <span className="font-semibold text-brand-500">Hit Points</span>{" "}
                        {hitPoints ?? hp} {hitDice ? `(${hitDice})` : null}
                    </p>
                )}
                {speed && (
                    <p>
                        <span className="font-semibold text-brand-500">Speed</span> {speed}
                    </p>
                )}
            </div>

            <StatDivider />

            {/* Ability Scores */}
            <div className="grid grid-cols-6 gap-1 text-center text-sm">
                {abilityOrder.map(([k]) => {
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

            <StatDivider />

            {/* Additional Stats */}
            <div className="space-y-1 text-sm">
                {saves && (
                    <p>
                        <span className="font-semibold text-brand-500">Saving Throws</span>{" "}
                        {saves}
                    </p>
                )}
                {skills && (
                    <p>
                        <span className="font-semibold text-brand-500">Skills</span>{" "}
                        {skills}
                    </p>
                )}
                {resistances && (
                    <p>
                        <span className="font-semibold text-brand-500">Damage Resistances</span>{" "}
                        {resistances}
                    </p>
                )}
                {immunities && (
                    <p>
                        <span className="font-semibold text-brand-500">Damage Immunities</span>{" "}
                        {immunities}
                    </p>
                )}
                {vulnerabilities && (
                    <p>
                        <span className="font-semibold text-brand-500">Damage Vulnerabilities</span>{" "}
                        {vulnerabilities}
                    </p>
                )}
                {conditionImmunities && (
                    <p>
                        <span className="font-semibold text-brand-500">Condition Immunities</span>{" "}
                        {conditionImmunities}
                    </p>
                )}
                {senses && (
                    <p>
                        <span className="font-semibold text-brand-500">Senses</span> {senses}
                    </p>
                )}
                {languages && (
                    <p>
                        <span className="font-semibold text-brand-500">Languages</span>{" "}
                        {languages}
                    </p>
                )}
                {(challengeRating || cr) && (
                    <p>
                        <span className="font-semibold text-brand-500">Challenge</span>{" "}
                        {challengeRating ?? cr}
                        {proficiencyBonus ? ` (${proficiencyBonus})` : null}
                    </p>
                )}
            </div>

            <StatDivider />

            {/* Traits */}
            {traits && traits.length > 0 && (
                <div className="space-y-2 text-sm">
                    {traits.map((t, i) => (
                        <ActionLine key={i} item={t} manifest={manifest} />
                    ))}
                </div>
            )}

            {/* Actions */}
            {actions && actions.length > 0 && (
                <div className="mt-4">
                    <h2 className="font-serif text-lg font-bold text-brand-500 border-b border-brand-500 pb-1 mb-2">
                        Actions
                    </h2>
                    <div className="space-y-2 text-sm">
                        {actions.map((a, i) => (
                            <ActionLine key={i} item={a} manifest={manifest} />
                        ))}
                    </div>
                </div>
            )}

            {/* Reactions */}
            {reactions && reactions.length > 0 && (
                <div className="mt-4">
                    <h2 className="font-serif text-lg font-bold text-brand-500 border-b border-brand-500 pb-1 mb-2">
                        Reactions
                    </h2>
                    <div className="space-y-2 text-sm">
                        {reactions.map((r, i) => (
                            <ActionLine key={i} item={r} manifest={manifest} />
                        ))}
                    </div>
                </div>
            )}

            {/* Legendary Actions */}
            {legendaryActions && legendaryActions.length > 0 && (
                <div className="mt-4">
                    <h2 className="font-serif text-lg font-bold text-brand-500 border-b border-brand-500 pb-1 mb-2">
                        Legendary Actions
                    </h2>
                    <p className="text-sm text-muted-foreground mb-2">
                        The creature can take 3 legendary actions, choosing from the options below.
                        Only one legendary action option can be used at a time and only at the end of
                        another creature{"'"}s turn. The creature regains spent legendary actions at the
                        start of its turn.
                    </p>
                    <div className="space-y-2 text-sm">
                        {legendaryActions.map((a, i) => (
                            <ActionLine key={i} item={a} manifest={manifest} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
