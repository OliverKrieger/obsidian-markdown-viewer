import React from "react";
import { TbMapPin, TbX } from "react-icons/tb";
import { WikiLink } from "../markdown/WikiLink";

type WikiToken =
    | { type: "text"; value: string }
    | { type: "wikilink"; slug: string; alias?: string };

function tokenizeWikiLinks(input: string): WikiToken[] {
    // matches [[...]] blocks
    const re = /\[\[([^\]]+)\]\]/g;
    const tokens: WikiToken[] = [];

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = re.exec(input)) !== null) {
        const start = match.index;
        const end = re.lastIndex;

        // text before
        if (start > lastIndex) {
            tokens.push({ type: "text", value: input.slice(lastIndex, start) });
        }

        const inner = match[1] ?? "";
        const [pathPart, aliasPart] = inner.split("|");
        const slug = (pathPart ?? "").split("#")[0].trim(); // keep it simple for now
        const alias = aliasPart?.trim();

        if (slug) {
            tokens.push({ type: "wikilink", slug, alias });
        } else {
            // malformed, treat as text
            tokens.push({ type: "text", value: match[0] });
        }

        lastIndex = end;
    }

    // trailing text
    if (lastIndex < input.length) {
        tokens.push({ type: "text", value: input.slice(lastIndex) });
    }

    return tokens;
}

function renderWikiText(input: string): React.ReactNode {
    const tokens = tokenizeWikiLinks(input);

    // If there are no wikilinks, return plain string
    const hasLinks = tokens.some((t) => t.type === "wikilink");
    if (!hasLinks) return input;

    return (
        <>
            {tokens.map((t, i) => {
                if (t.type === "text") return <React.Fragment key={i}>{t.value}</React.Fragment>;

                const href = `/page/${encodeURIComponent(t.slug)}`;
                const label = t.alias || t.slug;

                return (
                    <WikiLink key={i} href={href} className="underline decoration-1">
                        {label}
                    </WikiLink>
                );
            })}
        </>
    );
}


function hasMapInMeta(meta: any): boolean {
    if (!meta || typeof meta !== "object") return false;
    if (meta.hasMap === true) return true;
    if (typeof meta.map === "string" && meta.map.trim().length > 0) return true;
    if (Array.isArray(meta.maps) && meta.maps.length > 0) return true;
    return false;
}

function isRenderablePrimitive(v: any) {
    return typeof v === "string" || typeof v === "number" || typeof v === "boolean";
}

function renderValue(v: any): React.ReactNode {
    if (v == null) return null;

    if (typeof v === "string") return renderWikiText(v);
    if (typeof v === "number" || typeof v === "boolean") return String(v);

    if (Array.isArray(v)) {
        const items = v.filter((x: any) => isRenderablePrimitive(x));

        if (items.length === 0) return null;

        return (
            <ul className="list-disc pl-5">
                {items.map((item: any, idx: number) => (
                    <li key={`${idx}-${String(item).slice(0, 20)}`}>
                        {typeof item === "string" ? renderWikiText(item) : String(item)}
                    </li>
                ))}
            </ul>
        );
    }

    try {
        return (
            <pre className="text-xs whitespace-pre-wrap wrap-break-word p-2 rounded bg-tertiary-900/10">
                {JSON.stringify(v, null, 2)}
            </pre>
        );
    } catch {
        return null;
    }
}

export type GridMapHoverPanelProps = {
    slug: string;
    meta: Record<string, any>;
    x: number; // viewport coords
    y: number; // viewport coords
    onRequestClose: () => void;

    onMouseEnter: () => void;
    onMouseLeave: () => void;
};

const PRIORITY_KEYS = ["connections", "npcs", "quests", "poi"] as const;

export const GridMapHoverPanel: React.FC<GridMapHoverPanelProps> = ({
    slug,
    meta,
    x,
    y,
    onRequestClose,
    onMouseEnter,
    onMouseLeave,
}) => {
    // Position near cursor, but keep inside viewport
    const PANEL_W = 420;
    const PANEL_MAX_H = 360;
    const MARGIN = 12;

    const left = Math.min(x + 14, window.innerWidth - PANEL_W - MARGIN);
    const top = Math.min(y + 14, window.innerHeight - PANEL_MAX_H - MARGIN);

    const title = meta.title ? String(meta.title) : slug;

    return (
        <div
            className="fixed z-9999 w-[420px] max-w-[calc(100vw-24px)]"
            style={{ left, top }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div
                className="
                    rounded-xl border border-tertiary-900/60
                    bg-(--bg-page)/90 backdrop-blur
                    shadow-lg
                "
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 p-3 border-b border-tertiary-900/40">
                    <div className="min-w-0">
                        <div className="text-sm font-semibold truncate">{title}</div>
                        <div className="text-xs opacity-70 truncate">{slug}</div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {hasMapInMeta(meta) && (
                            <span className="inline-flex items-center gap-1 text-xs opacity-80">
                                <TbMapPin />
                                <span>Map</span>
                            </span>
                        )}

                        <button
                            type="button"
                            onClick={onRequestClose}
                            className="p-1 rounded hover:bg-tertiary-900/20"
                            title="Close"
                        >
                            <TbX />
                        </button>
                    </div>
                </div>

                {/* Body (scrollable) */}
                <div className="p-3 max-h-60 overflow-auto">
                    <div className="grid gap-3">
                        {/* Priority keys first */}
                        {PRIORITY_KEYS.map((key) => {
                            if (!(key in meta)) return null;
                            const rendered = renderValue(meta[key]);
                            if (!rendered) return null;

                            return (
                                <div key={key}>
                                    <div className="text-xs font-semibold uppercase opacity-70 mb-1">
                                        {key}
                                    </div>
                                    <div className="text-sm">{rendered}</div>
                                </div>
                            );
                        })}

                        {/* Other keys (flexible) */}
                        {Object.keys(meta)
                            .filter(
                                (k) =>
                                    !["title", ...PRIORITY_KEYS].includes(k as any)
                            )
                            .sort()
                            .map((k) => {
                                const rendered = renderValue(meta[k]);
                                if (!rendered) return null;

                                return (
                                    <div key={k}>
                                        <div className="text-xs font-semibold uppercase opacity-70 mb-1">
                                            {k}
                                        </div>
                                        <div className="text-sm">{rendered}</div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
};
