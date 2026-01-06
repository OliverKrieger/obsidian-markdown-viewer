import React, {useState} from "react";
import { WikiLink } from "./WikiLink";
import { TbMapPin } from "react-icons/tb";

export type GridMapProps = {
    title?: string;
    map?: string;
    rows?: number;
    cols?: number;
    prefix?: string;
    labelStyle?: string;
    cells?: unknown;
    // injected by MarkdownViewer wrapper
    manifest?: {
        slugMap: Record<string, string>;
        pageMeta?: Record<string, any>;
    };
};

// ─────────────────────────────
// Helpers
// ─────────────────────────────

/** Convert number → Excel-like column name: 0 → A, 25 → Z, 26 → AA */
function numberToLetters(num: number): string {
    let letters = "";
    let n = num;
    while (true) {
        letters = String.fromCharCode((n % 26) + 65) + letters;
        n = Math.floor(n / 26) - 1;
        if (n < 0) break;
    }
    return letters;
}

/** Generate a label for a grid cell (A1, B3, AA22, etc.) */
function generateLabel(
    index: number,
    _: number,// rows (unused)
    cols: number,
    style: string
): string {
    const row = Math.floor(index / cols);
    const col = index % cols;

    switch (style) {
        case "numbers":
            return String(index + 1);

        case "letters":
            return numberToLetters(index);

        case "letters-letters":
            return numberToLetters(row) + numberToLetters(col);

        case "numbers-letters":
            // numbers on columns, letters on rows → e.g. 1A, 2A, 3A
            return String(col + 1) + numberToLetters(row);

        case "letter-number-rowcol":
            // Row letters, column numbers → A1, A2, A3
            return numberToLetters(row) + (col + 1);

        case "letters-numbers":
        default:
            // Column letter + row number → A1, B3, etc
            return numberToLetters(col) + (row + 1);
    }
}

/** Normalize string[] or string into clean array */
function normaliseCells(cells: unknown): string[] {
    if (Array.isArray(cells)) {
        return cells
            .map((c) => String(c).trim())
            .filter(Boolean);
    }
    if (typeof cells === "string") {
        return cells
            .split(/[\s,]+/)
            .map((c) => c.trim())
            .filter(Boolean);
    }
    return [];
}

/** Parse cell mappings like "1 = A1" into highlightable labels */
function parseCellMappings(raw: string[]): Set<string> {
    const labels = new Set<string>();

    for (const entry of raw) {
        const parts = entry.split("=");
        if (parts.length === 2) {
            const target = parts[1].trim();
            if (target) labels.add(target);
        } else {
            labels.add(entry.trim());
        }
    }

    return labels;
}

/** Check if frontmatter meta indicates presence of a map */
function hasMapInMeta(meta: any): boolean {

    if (!meta || typeof meta !== "object") return false;
    if (meta.hasMap === true) return true;
    if (typeof meta.map === "string" && meta.map.trim().length > 0) return true;
    if (Array.isArray(meta.maps) && meta.maps.length > 0) {return true;}
    return false;
}

/** Check if value is a renderable primitive */
function isRenderablePrimitive(v: any) {
    return (
        typeof v === "string" ||
        typeof v === "number" ||
        typeof v === "boolean"
    );
}

/** Render a frontmatter value into React nodes */
function renderValue(v: any): React.ReactNode {
    if (v == null) return null;

    if (isRenderablePrimitive(v)) return String(v);

    if (Array.isArray(v)) {
        const items = v
            .map((x) => (isRenderablePrimitive(x) ? String(x) : null))
            .filter(Boolean) as string[];

        if (items.length === 0) return null;

        return (
            <ul className="list-disc pl-5">
                {items.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        );
    }

    // If someone puts an object in frontmatter, keep it readable without exploding the UI
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

// ─────────────────────────────
// Component
// ─────────────────────────────

export const GridMapComponent: React.FC<GridMapProps> = (props) => {
    const {
        title,
        map,
        rows: rawRows,
        cols: rawCols,
        prefix,
        labelStyle: rawLabelStyle,
        cells,
        manifest,
    } = props;

    const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

    const rows = rawRows && rawRows > 0 ? rawRows : 0;
    const cols = rawCols && rawCols > 0 ? rawCols : 0;
    const labelStyle = rawLabelStyle || "letters-numbers";

    const rawCells = normaliseCells(cells);
    const highlightedLabels = parseCellMappings(rawCells);

    if (!map || rows === 0 || cols === 0) {
        return (
            <section className="my-6 p-4 rounded border">
                {title && (
                    <h3 className="font-bold text-lg mb-2">{title}</h3>
                )}
                <p className="text-sm text-gray-600">
                    Grid map is missing required data (map, rows, cols).
                </p>
            </section>
        );
    }

    const totalCells = rows * cols;

    const gridCells = Array.from({ length: totalCells }, (_, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        const label = generateLabel(index, rows, cols, labelStyle);
        return { index, row, col, label };
    });

     const hoveredMeta = hoveredSlug ? manifest?.pageMeta?.[hoveredSlug] : null;

    return (
        <section className="my-6 p-4 rounded border">
            {title && (
                <h3 className="font-bold text-lg mb-4">
                    {title}
                </h3>
            )}

            <div className="relative inline-block w-full max-w-full">
                <img
                    src={map}
                    alt={title ?? map}
                    className="block w-full rounded border"
                />

                {/* Grid Overlay */}
                <div
                    className="absolute top-0 left-0 w-full h-full grid pointer-events-none"
                    style={{
                        gridTemplateColumns: `repeat(${cols}, 1fr)`,
                        gridTemplateRows: `repeat(${rows}, 1fr)`,
                    }}
                >
                    {gridCells.map((cell) => {
                        const isHighlighted =
                            highlightedLabels.has(cell.label);

                        const fullLabel = prefix
                            ? `${prefix}-${cell.label}`
                            : cell.label;

                        const href = `/page/${encodeURIComponent(fullLabel)}`;

                        const metaForCell = manifest?.pageMeta?.[fullLabel];
                        const showMapIcon = hasMapInMeta(metaForCell);

                        const cellClasses = [
                            "flex items-center justify-center text-[1rem] font-bold",
                            "border border-black/20",
                            "pointer-events-auto",
                            "relative",
                            isHighlighted
                                ? "bg-secondary-500/20"
                                : "bg-transparent",
                            "hover:bg-blue-300/40 transition-colors",
                        ].join(" ");

                        const commonMouseHandlers = {
                            onMouseEnter: () => setHoveredSlug(fullLabel),
                            onMouseLeave: () => setHoveredSlug((cur) => (cur === fullLabel ? null : cur)),
                        };

                        return (
                            <div
                                key={cell.index}
                                className="relative flex items-center justify-center"
                            >
                                {/* WikiLink handles missing pages automatically */}
                                {
                                    isHighlighted ? 
                                    (
                                        <>
                                            <WikiLink
                                                href={href}
                                                className={`${cellClasses} block w-full h-full text-center`}
                                                {...commonMouseHandlers}
                                            >
                                                {cell.label}

                                                
                                        
                                            </WikiLink>

                                            {showMapIcon && (
                                                <span
                                                    className="absolute top-1 right-1 text-secondary-100"
                                                >
                                                    <TbMapPin size={14} />
                                                </span>
                                            )}
                                        </>
                                    ) 
                                    : 
                                    (
                                        <div 
                                            className={`${cellClasses} block w-full h-full text-center text-tertiary-500`}
                                            {...commonMouseHandlers}    
                                        >
                                            {cell.label}
                                        </div>
                                    )
                                }
                                
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Hovered metadata panel */}
            {hoveredSlug && hoveredMeta && typeof hoveredMeta === "object" && (
                <div className="mt-4 rounded border p-3 bg-(--bg-page)/85 fixed top-24 left-64 max-h-96 w-full max-w-[640px] overflow-auto">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <div className="text-sm font-semibold">
                                {hoveredMeta.title ? String(hoveredMeta.title) : hoveredSlug}
                            </div>
                            <div className="text-xs opacity-70">{hoveredSlug}</div>
                        </div>

                        {hasMapInMeta(hoveredMeta) && (
                            <div className="flex items-center gap-2 text-sm">
                                <TbMapPin />
                                <span className="opacity-80">Map</span>
                            </div>
                        )}
                    </div>

                    {/* Flexible metadata dump (selected keys first, then the rest) */}
                    <div className="mt-3 grid gap-3">
                        {["connections", "npcs", "quests", "poi"].map((key) => {
                            if (!(key in hoveredMeta)) return null;
                            const rendered = renderValue(hoveredMeta[key]);
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

                        {/* Render any other keys (keeps it flexible) */}
                        {Object.keys(hoveredMeta)
                            .filter((k) => !["title", "connections", "npcs", "quests", "poi"].includes(k))
                            .map((k) => {
                                const rendered = renderValue(hoveredMeta[k]);
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
            )}
        </section>
    );
};
