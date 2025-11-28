// src/components/markdown/GridMapComponent.tsx
import React from "react";

export type GridMapProps = {
    title?: string;
    map?: string;
    rows?: number;
    cols?: number;
    prefix?: string; // kept for future use if needed
    labelStyle?: string;
    cells?: unknown;
};

type NormalisedCell = {
    index: number;
    row: number;
    col: number;
    label: string;
};

type CellMapping = {
    alias: string;
    target: string;
};

function numberToLetters(num: number): string {
    // 0 -> A, 25 -> Z, 26 -> AA
    let n = num;
    let letters = "";
    while (true) {
        letters = String.fromCharCode((n % 26) + 65) + letters;
        n = Math.floor(n / 26) - 1;
        if (n < 0) break;
    }
    return letters;
}

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
            // Column letter + row number: A1, A2, ..., B1, ...
            return numberToLetters(col) + (row + 1);
    }
}

function normaliseCells(cells: unknown): string[] {
    if (Array.isArray(cells)) {
        return cells
            .map((c) => String(c).trim())
            .filter((c) => c.length > 0);
    }
    if (typeof cells === "string") {
        return cells
            .split(/[\n,]/)
            .map((c) => c.trim())
            .filter((c) => c.length > 0);
    }
    return [];
}

function parseCellMappings(raw: string[]): {
    labels: Set<string>;
    mappings: CellMapping[];
} {
    const labels = new Set<string>();
    const mappings: CellMapping[] = [];

    for (const entry of raw) {
        const parts = entry.split("=");
        if (parts.length === 2) {
            const alias = parts[0].trim();
            const target = parts[1].trim();
            if (target) labels.add(target);
            mappings.push({ alias, target });
        } else {
            labels.add(entry.trim());
        }
    }

    return { labels, mappings };
}

export const GridMapComponent: React.FC<GridMapProps> = (props) => {
    const {
        title,
        map,
        rows: rawRows,
        cols: rawCols,
        labelStyle: rawLabelStyle,
        cells,
    } = props;

    console.log("Rendering GridMapComponent with props:", props);

    const rows = typeof rawRows === "number" && rawRows > 0 ? rawRows : 0;
    const cols = typeof rawCols === "number" && rawCols > 0 ? rawCols : 0;
    const labelStyle = rawLabelStyle || "letters-numbers";

    const rawCells = normaliseCells(cells);
    const { labels: highlightedLabels } = parseCellMappings(rawCells);

    if (!map || rows === 0 || cols === 0) {
        return (
            <section className="my-6 p-4 rounded border bg-slate-50">
                {title && (
                    <h3 className="font-bold text-lg mb-2">
                        {title}
                    </h3>
                )}
                <p className="text-sm text-gray-600">
                    Grid map is missing required data (map, rows, cols).
                </p>
            </section>
        );
    }

    const totalCells = rows * cols;
    const gridCells: NormalisedCell[] = Array.from(
        { length: totalCells },
        (_, index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;
            const label = generateLabel(
                index,
                rows,
                cols,
                labelStyle
            );
            return { index, row, col, label };
        }
    );

    return (
        <section className="my-6 p-4 rounded border">
            {title && (
                <h3 className="font-bold text-lg mb-4">
                    {title}
                </h3>
            )}

            <div className="relative inline-block">
                <img
                    src={map}
                    alt={title ?? map}
                    className="block w-full rounded border"
                />

                <div
                    className="absolute top-0 left-0 w-full h-full grid"
                    style={{
                        gridTemplateColumns: `repeat(${cols}, 1fr)`,
                        gridTemplateRows: `repeat(${rows}, 1fr)`,
                    }}
                >
                    {gridCells.map((cell) => {
                        const isHighlighted =
                            highlightedLabels.has(cell.label);

                        return (
                            <div
                                key={cell.index}
                                className={`border border-black/20 flex items-center justify-center text-[0.65rem] font-bold select-none ${
                                    isHighlighted
                                        ? "bg-yellow-300/40"
                                        : "bg-transparent"
                                }`}
                                style={{
                                    // Allow future interaction
                                    pointerEvents: "auto",
                                }}
                                title={cell.label}
                            >
                                {cell.label}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
