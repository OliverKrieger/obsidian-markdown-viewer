// src/components/markdown/callouts/StatBlockCallout.tsx
import React, { useRef, useState } from "react";

type ManifestLike = {
    slugMap: Record<string, string>;
    pageMeta?: Record<string, any>;
};

type StatBlockAbility = {
    name?: string;
    text?: string;
    ref?: string;
};

export type StatBlockProps = {
    title: string;
    desc?: string;

    attributes?: Record<string, string>;
    skills?: Record<string, string>;

    pace?: string;
    parry?: string;
    toughness?: string;

    edges?: string;
    hindrances?: string;
    gear?: string;

    special?: StatBlockAbility[];

    className?: string;
    variant?: "compact" | "default";

    manifest?: ManifestLike;
};

function KVGrid({ data }: { data: Record<string, string> }) {
    const entries = Object.entries(data);
    return (
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
            {entries.map(([k, v]) => (
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
            {snippet ? <div className="text-sm opacity-80 whitespace-pre-wrap">{snippet}</div> : (
                <div className="text-sm opacity-70">No preview available.</div>
            )}
        </div>
    );
}

export const StatBlockCallout: React.FC<StatBlockProps> = ({
    title,
    desc,
    attributes,
    skills,
    pace,
    parry,
    toughness,
    edges,
    hindrances,
    gear,
    special,
    className,
    variant = "default",
    manifest,
}) => {
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

    const compact = variant === "compact";
    const container = [
        "my-6 rounded-2xl border p-4",
        "bg-white/60 shadow-sm",
        className ?? "",
    ].join(" ");

    return (
        <section className={container}>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold">{title}</h3>
                    {desc && <p className="mt-2 text-sm opacity-80 whitespace-pre-wrap">{desc}</p>}
                </div>

                <div className="text-sm text-right min-w-[140px]">
                    {(pace || parry || toughness) && (
                        <div className="space-y-1">
                            {pace && <div><span className="font-semibold">Pace:</span> {pace}</div>}
                            {parry && <div><span className="font-semibold">Parry:</span> {parry}</div>}
                            {toughness && <div><span className="font-semibold">Toughness:</span> {toughness}</div>}
                        </div>
                    )}
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

            {(edges || hindrances || gear) && (
                <div className="mt-4 grid md:grid-cols-3 gap-3 text-sm">
                    {edges && (
                        <div>
                            <div className="font-bold">Edges</div>
                            <div className="opacity-80 whitespace-pre-wrap">{edges}</div>
                        </div>
                    )}
                    {hindrances && (
                        <div>
                            <div className="font-bold">Hindrances</div>
                            <div className="opacity-80 whitespace-pre-wrap">{hindrances}</div>
                        </div>
                    )}
                    {gear && (
                        <div>
                            <div className="font-bold">Gear</div>
                            <div className="opacity-80 whitespace-pre-wrap">{gear}</div>
                        </div>
                    )}
                </div>
            )}

            {special && special.length > 0 && (
                <div className="mt-4">
                    <div className="font-bold mb-2">Special Abilities</div>
                    <ul className="space-y-2 text-sm">
                        {special.map((a, i) => {
                            const label = a.name ?? a.ref ?? "Ability";
                            const isRef = Boolean(a.ref);

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
                                    <span className="font-semibold">{label}:</span>{" "}
                                    {isRef ? (
                                        <span
                                            className="underline cursor-help"
                                            onMouseEnter={onEnter}
                                            onMouseLeave={onLeave}
                                        >
                                            {a.ref}
                                        </span>
                                    ) : null}
                                    {a.text ? <span className="opacity-80"> {a.text}</span> : null}
                                    {!isRef && !a.text ? <span className="opacity-60"> —</span> : null}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

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
        </section>
    );
};
