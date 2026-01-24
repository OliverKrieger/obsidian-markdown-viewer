// src/components/markdown/callouts/statblock/render/Dnd5eStatBlockCard.tsx
import React, { useRef, useState } from "react";
import type { Dnd5eAction, Dnd5eStatBlock, ManifestLike } from "../types";

function AbilityTable({ abilities }: { abilities: NonNullable<Dnd5eStatBlock["abilities"]> }) {
    const order: (keyof typeof abilities)[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
    return (
        <div className="grid grid-cols-6 gap-2 text-center text-sm">
            {order.map((k) => {
                const v = abilities[k];
                return (
                    <div key={k} className="rounded-lg border p-2 bg-white/50">
                        <div className="font-bold">{k}</div>
                        <div>{v ? v.score : "—"}</div>
                        <div className="opacity-70">{v ? `(${v.mod})` : ""}</div>
                    </div>
                );
            })}
        </div>
    );
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

function ActionList({
    title,
    items,
    manifest,
}: {
    title: string;
    items: Dnd5eAction[];
    manifest?: ManifestLike;
}) {
    const [hoverRef, setHoverRef] = useState<string | null>(null);
    const [hoverXY, setHoverXY] = useState<{ x: number; y: number } | null>(null);
    const [panelHovered, setPanelHovered] = useState(false);
    const closeTimerRef = useRef<number | null>(null);

    function clearCloseTimer() {
        if (closeTimerRef.current != null) {
            window.clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    }
    function scheduleClose() {
        clearCloseTimer();
        closeTimerRef.current = window.setTimeout(() => {
            setHoverRef(null);
            setHoverXY(null);
        }, 120);
    }

    const meta = hoverRef ? manifest?.pageMeta?.[hoverRef] : null;

    return (
        <div className="mt-3">
            <div className="font-bold">{title}</div>
            <div className="mt-2 space-y-2 text-sm">
                {items.map((a, i) => {
                    const onEnter = (e: React.MouseEvent) => {
                        if (!a.ref) return;
                        clearCloseTimer();
                        setHoverRef(a.ref);
                        setHoverXY({ x: e.clientX, y: e.clientY });
                    };
                    const onLeave = () => {
                        if (!panelHovered) scheduleClose();
                    };

                    return (
                        <div key={i} className="leading-snug">
                            <span className="font-semibold">{a.name}.</span>{" "}
                            {a.ref ? (
                                <span className="underline cursor-help" onMouseEnter={onEnter} onMouseLeave={onLeave}>
                                    {a.ref}
                                </span>
                            ) : null}
                            {a.text ? <span className="opacity-80"> {a.text}</span> : null}
                        </div>
                    );
                })}
            </div>

            {hoverRef && meta && hoverXY && (
                <HoverPanel
                    title={hoverRef}
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
        </div>
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
    immunities,
    resistances,
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
    variant = "classic",
    manifest,
}) => {
    const compact = variant === "compact";
    const subtitle = [size, creatureType, alignment].filter(Boolean).join(" ") || undefined;

    return (
        <section className={`my-6 rounded-2xl border p-4 bg-white/60 shadow-sm ${className ?? ""}`}>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-2xl font-extrabold">{title}</h3>
                    {subtitle && <div className="italic opacity-80">{subtitle}</div>}
                </div>

                <div className="text-sm text-right min-w-[200px] space-y-1">
                    {ac && <div><span className="font-semibold">AC</span> {ac}</div>}
                    {hp && <div><span className="font-semibold">HP</span> {hp}</div>}
                    {speed && <div><span className="font-semibold">Speed</span> {speed}</div>}
                </div>
            </div>

            {abilities && (
                <div className="mt-4">
                    <AbilityTable abilities={abilities} />
                </div>
            )}

            <div className={`mt-4 grid ${compact ? "grid-cols-1" : "md:grid-cols-2"} gap-3 text-sm`}>
                {saves && <div><span className="font-semibold">Saving Throws:</span> <span className="opacity-80">{saves}</span></div>}
                {skills && <div><span className="font-semibold">Skills:</span> <span className="opacity-80">{skills}</span></div>}
                {immunities && <div><span className="font-semibold">Damage Immunities:</span> <span className="opacity-80">{immunities}</span></div>}
                {resistances && <div><span className="font-semibold">Damage Resistances:</span> <span className="opacity-80">{resistances}</span></div>}
                {vulnerabilities && <div><span className="font-semibold">Damage Vulnerabilities:</span> <span className="opacity-80">{vulnerabilities}</span></div>}
                {conditionImmunities && <div><span className="font-semibold">Condition Immunities:</span> <span className="opacity-80">{conditionImmunities}</span></div>}
                {senses && <div><span className="font-semibold">Senses:</span> <span className="opacity-80">{senses}</span></div>}
                {languages && <div><span className="font-semibold">Languages:</span> <span className="opacity-80">{languages}</span></div>}
                {cr && <div><span className="font-semibold">Challenge:</span> <span className="opacity-80">{cr}</span></div>}
            </div>

            {traits && traits.length > 0 && <ActionList title="Traits" items={traits} manifest={manifest} />}
            {actions && actions.length > 0 && <ActionList title="Actions" items={actions} manifest={manifest} />}
            {reactions && reactions.length > 0 && <ActionList title="Reactions" items={reactions} manifest={manifest} />}
            {legendaryActions && legendaryActions.length > 0 && <ActionList title="Legendary Actions" items={legendaryActions} manifest={manifest} />}
        </section>
    );
};
