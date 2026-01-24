import React, { useRef, useState } from "react";
import type { ManifestLike, StatBlockAbilityRef, SwadeStatBlock } from "../types";
import { AttributeBox, DiamondDivider, StatPill, WildCardBadge } from "./Shared";
import { WikiLink } from "../../../WikiLink";

function parseWildCard(type?: string) {
    if (!type) return false;
    return /\bwild\s*card\b/i.test(type);
}

function parseToughnessAndArmor(raw?: string): { tough?: number; armor?: number } {
    if (!raw) return {};
    const toughMatch = raw.match(/-?\d+/);
    const tough = toughMatch ? Number(toughMatch[0]) : undefined;
    const armorMatch = raw.match(/\((\d+)\)/);
    const armor = armorMatch ? Number(armorMatch[1]) : undefined;
    return { tough, armor };
}

function slugToHref(slug: string) {
    return `/page/${encodeURIComponent(slug)}`;
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
                className="underline cursor-help text-primary"
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

function AbilityLine({
    item,
    manifest,
    showDash = true,
}: {
    item: StatBlockAbilityRef;
    manifest?: ManifestLike;
    showDash?: boolean;
}) {
    return (
        <p className="text-sm">
            {showDash ? <span className="text-muted-foreground">• </span> : null}
            <span className="font-semibold">{item.name}</span>
            {item.ref ? (
                <>
                    <span className="text-muted-foreground"> — </span>
                    <AbilityRef refName={item.ref} manifest={manifest} />
                </>
            ) : null}
            {item.text ? <span className="text-muted-foreground"> — {item.text}</span> : null}
        </p>
    );
}

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

    // Attributes: handle both long/short keys gracefully
    const agi = attributes?.Agi ?? attributes?.agility ?? "—";
    const sma = attributes?.Sma ?? attributes?.smarts ?? "—";
    const spi = attributes?.Spi ?? attributes?.spirit ?? "—";
    const str = attributes?.Str ?? attributes?.strength ?? "—";
    const vig = attributes?.Vig ?? attributes?.vigor ?? "—";

    // Skills: turn map -> list in stable order (alpha)
    const skillsList = skills
        ? Object.entries(skills).sort(([a], [b]) => a.localeCompare(b))
        : [];

    return (
        <div
            className={[
                "relative bg-card p-6 max-w-md shadow-lg border border-border rounded-lg",
                "bg-linear-to-b from-card to-secondary/20",
                className ?? "",
            ].join(" ")}
        >
            {wildCard && <WildCardBadge />}

            {/* Header */}
            <header className="text-center mb-4">
                <h1 className="font-serif text-2xl font-bold text-primary tracking-wide">
                    {title}
                </h1>
                {type && (
                    <p className="text-sm text-muted-foreground italic">{type}</p>
                )}
                {wildCard && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-accent/20 text-accent rounded">
                        Wild Card
                    </span>
                )}
            </header>

            {desc && (
                <p className="text-sm text-muted-foreground italic text-center mb-4 whitespace-pre-wrap">
                    {desc}
                </p>
            )}

            <DiamondDivider />

            {/* Attributes */}
            <div className="mb-4">
                <h2 className="font-serif text-sm font-bold text-primary uppercase tracking-wider mb-2 text-center">
                    Attributes
                </h2>
                <div className="grid grid-cols-5 gap-2">
                    <AttributeBox label="Agi" value={agi} />
                    <AttributeBox label="Sma" value={sma} />
                    <AttributeBox label="Spi" value={spi} />
                    <AttributeBox label="Str" value={str} />
                    <AttributeBox label="Vig" value={vig} />
                </div>
            </div>

            {/* Derived */}
            <div className="grid grid-cols-4 gap-2 mb-4">
                <StatPill label="Pace" value={pace ?? "—"} />
                <StatPill label="Parry" value={parry ?? "—"} />
                <StatPill label="Tough" value={tough ?? (toughness ?? "—")} subValue={armor != null ? `(${armor})` : undefined} />
                {charisma != null && (
                    <StatPill
                        label="Cha"
                        value={String(charisma).startsWith("-") ? charisma : `+${charisma}`}
                    />
                )}
            </div>

            <DiamondDivider />

            {/* Skills */}
            {skillsList.length > 0 && (
                <div className="mb-4">
                    <h2 className="font-serif text-sm font-bold text-primary uppercase tracking-wider mb-2">
                        Skills
                    </h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        {skillsList.map(([name, die], index) => (
                            <span key={name}>
                                <span className="font-medium">{name}</span>{" "}
                                <span className="text-primary font-semibold">{die}</span>
                                {index < skillsList.length - 1 && ","}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Edges */}
            {edges && edges.length > 0 && (
                <div className="mb-4">
                    <h2 className="font-serif text-sm font-bold text-primary uppercase tracking-wider mb-2">
                        Edges
                    </h2>
                    <div className="space-y-1">
                        {edges.map((e, i) => (
                            <AbilityLine key={i} item={e} manifest={manifest} showDash={false} />
                        ))}
                    </div>
                </div>
            )}

            {/* Hindrances */}
            {hindrances && hindrances.length > 0 && (
                <div className="mb-4">
                    <h2 className="font-serif text-sm font-bold text-primary uppercase tracking-wider mb-2">
                        Hindrances
                    </h2>
                    <div className="flex flex-wrap gap-2 text-sm">
                        {hindrances.map((h, index) => {
                            // If author used "Wanted (Major)" keep as-is; else default "Minor"
                            const m = h.name.match(/^(.*)\((Major|Minor)\)\s*$/i);
                            const name = m ? m[1].trim() : h.name;
                            const typeTag = m ? (m[2][0].toUpperCase() + m[2].slice(1).toLowerCase()) : "Minor";

                            const isMajor = typeTag.toLowerCase() === "major";
                            return (
                                <span
                                    key={index}
                                    className={[
                                        "px-2 py-0.5 rounded text-xs",
                                        isMajor ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground",
                                    ].join(" ")}
                                >
                                    {name} ({typeTag})
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Special */}
            {special && special.length > 0 && (
                <div className="mb-4">
                    <h2 className="font-serif text-sm font-bold text-primary uppercase tracking-wider mb-2">
                        Special Abilities
                    </h2>
                    <div className="space-y-2">
                        {special.map((a, i) => (
                            <p key={i} className="text-sm">
                                <span className="font-semibold italic text-primary">{a.name}:</span>{" "}
                                {a.ref ? <AbilityRef refName={a.ref} manifest={manifest} /> : null}
                                {a.text ? <span className="text-muted-foreground"> {a.text}</span> : null}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            {/* Gear */}
            {gear && gear.length > 0 && (
                <div>
                    <h2 className="font-serif text-sm font-bold text-primary uppercase tracking-wider mb-2">
                        Gear
                    </h2>
                    <div className="text-sm space-y-1">
                        {gear.map((g, i) => {
                            const m = g.match(/^(.+?)\s*\((.+)\)\s*$/);
                            const name = m ? m[1].trim() : g;
                            const stats = m ? m[2].trim() : undefined;

                            return (
                                <p key={i}>
                                    <span className="font-medium">{name}</span>
                                    {stats && (
                                        <span className="text-muted-foreground text-xs ml-1">({stats})</span>
                                    )}
                                </p>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
