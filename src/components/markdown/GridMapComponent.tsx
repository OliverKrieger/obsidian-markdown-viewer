import React from "react";
import { WikiLink } from "./WikiLink";

export type GridMapProps = {
    title?: string;
    map?: string;
    rows?: number;
    cols?: number;
    prefix?: string;
    labelStyle?: string;
    cells?: unknown;
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
    rows: number,
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

        case "letters-numbers":
        default:
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
            .split(/[\n,]/)
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
    } = props;

    const rows = rawRows && rawRows > 0 ? rawRows : 0;
    const cols = rawCols && rawCols > 0 ? rawCols : 0;
    const labelStyle = rawLabelStyle || "letters-numbers";

    const rawCells = normaliseCells(cells);
    const highlightedLabels = parseCellMappings(rawCells);

    if (!map || rows === 0 || cols === 0) {
        return (
            <section className="my-6 p-4 rounded border bg-slate-50">
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

    return (
        <section className="my-6 p-4 rounded border bg-slate-50">
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

                        const cellClasses = [
                            "flex items-center justify-center text-[0.65rem] font-bold",
                            "border border-black/20",
                            "pointer-events-auto",
                            isHighlighted
                                ? "bg-yellow-300/40"
                                : "bg-transparent",
                            "hover:bg-blue-300/40 transition-colors",
                        ].join(" ");

                        return (
                            <div
                                key={cell.index}
                                className="relative flex items-center justify-center"
                            >
                                {/* WikiLink handles missing pages automatically */}
                                <WikiLink
                                    href={href}
                                    className={`${cellClasses} block w-full h-full text-center`}
                                >
                                    {cell.label}
                                </WikiLink>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
