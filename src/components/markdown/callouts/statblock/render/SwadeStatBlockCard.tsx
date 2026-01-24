// src/components/markdown/callouts/statblock/render/SwadeStatBlockCard.tsx
import React, { useRef, useState } from "react";
import type { ManifestLike, StatBlockAbilityRef, SwadeStatBlock } from "../types";

function KVGrid({ data }: { data: Record<string, string> }) {
    return (
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
            {Object.entries(data).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2">
                    <span className="font-semibold">{k}</span>
                    <span className="opacity-80">{v}</span>
                </div>
            ))}
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

function AbilityList({
    title,
    items,
    manifest,
}: {
    title: string;
    items: StatBlockAbilityRef[];
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
        <div>
            <div className="font-bold mb-2">{title}</div>
            <ul className="space-y-2 text-sm">
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
                        <li key={i} className="leading-snug">
                            <span className="font-semibold">{a.name}:</span>{" "}
                            {a.ref ? (
                                <span
                                    className="underline cursor-help"
                                    onMouseEnter={onEnter}
                                    onMouseLeave={onLeave}
                                >
                                    {a.ref}
                                </span>
                            ) : null}
                            {a.text ? <span className="opacity-80"> {a.text}</span> : null}
                        </li>
                    );
                })}
            </ul>

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
    variant = "default",
    manifest,
}) => {
    const compact = variant === "compact";

    return (
        <section className={`my-6 rounded-2xl border p-4 bg-white/60 shadow-sm ${className ?? ""}`}>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold">{title}</h3>
                    {type && <div className="text-sm opacity-80">{type}</div>}
                    {desc && <p className="mt-2 text-sm opacity-80 whitespace-pre-wrap">{desc}</p>}
                </div>

                <div className="text-sm text-right min-w-40 space-y-1">
                    {pace && <div><span className="font-semibold">Pace:</span> {pace}</div>}
                    {parry && <div><span className="font-semibold">Parry:</span> {parry}</div>}
                    {toughness && <div><span className="font-semibold">Tough:</span> {toughness}</div>}
                    {charisma && <div><span className="font-semibold">Cha:</span> {charisma}</div>}
                </div>
            </div>

            <div className={`mt-4 grid ${compact ? "grid-cols-1" : "md:grid-cols-2"} gap-4`}>
                {attributes && (
                    <div>
                        <div className="font-bold mb-2">Attributes</div>
                        <KVGrid data={attributes} />
                    </div>
                )}
                {skills && (
                    <div>
                        <div className="font-bold mb-2">Skills</div>
                        <KVGrid data={skills} />
                    </div>
                )}
            </div>

            <div className="mt-4 grid md:grid-cols-3 gap-4">
                {edges && edges.length > 0 && <AbilityList title="Edges" items={edges} manifest={manifest} />}
                {hindrances && hindrances.length > 0 && <AbilityList title="Hindrances" items={hindrances} manifest={manifest} />}
                {special && special.length > 0 && <AbilityList title="Special" items={special} manifest={manifest} />}
            </div>

            {gear && gear.length > 0 && (
                <div className="mt-4">
                    <div className="font-bold mb-2">Gear</div>
                    <ul className="text-sm space-y-1 opacity-90">
                        {gear.map((g, i) => <li key={i}>• {g}</li>)}
                    </ul>
                </div>
            )}
        </section>
    );
};
