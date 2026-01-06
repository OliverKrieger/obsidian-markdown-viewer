import React, {useState, useRef} from "react";
import { WikiLink } from "./WikiLink";
import { TbMapPin } from "react-icons/tb";
import { GridMapHoverPanel } from "../gridmap/GridMapHoverPanel";

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
    const [hoverXY, setHoverXY] = useState<{ x: number; y: number } | null>(null);
    const [panelHovered, setPanelHovered] = useState(false);

    // Used to avoid flicker when moving from cell to panel
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
            setHoveredSlug(null);
            setHoverXY(null);
        }, 120); // small grace period
    }

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

                        const onEnter = (e: React.MouseEvent) => {
                            clearCloseTimer();
                            setHoveredSlug(fullLabel);
                            setHoverXY({ x: e.clientX, y: e.clientY });
                        };

                        const onLeave = () => {
                            // Only close if panel isn't hovered
                            if (!panelHovered) scheduleClose();
                        };

                        const commonMouseHandlers = {
                            onMouseEnter: onEnter,
                            onMouseLeave: onLeave,
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
            {hoveredSlug && hoveredMeta && typeof hoveredMeta === "object" && hoverXY && (
                <GridMapHoverPanel
                    slug={hoveredSlug}
                    meta={hoveredMeta}
                    x={hoverXY.x}
                    y={hoverXY.y}
                    onRequestClose={() => {
                        clearCloseTimer();
                        setHoveredSlug(null);
                        setHoverXY(null);
                    }}
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
