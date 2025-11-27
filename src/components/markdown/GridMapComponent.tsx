import React from "react";

export type GridMapProps = {
    title?: string;
    map?: string;
    rows?: number;
    cols?: number;
    prefix?: string;
    cells?: unknown; // we'll normalise this
};

export const GridMapComponent: React.FC<GridMapProps> = ({
    title,
    map,
    rows,
    cols,
    prefix,
    cells,
}) => {
    // Normalise cells to an array of strings
    const cellList: string[] = Array.isArray(cells)
        ? (cells as string[])
        : cells != null
        ? [String(cells)]
        : [];

    console.log("Rendering GridMapComponent with props:", {
        title,
        map,
        rows,
        cols,
        prefix,
        cells,
    });

    return (
        <section className="my-6 p-4 rounded border">
            {title && (
                <h3 className="font-bold text-lg mb-2">
                    {title}
                </h3>
            )}

            {map && (
                <div className="mb-4">
                    {/* adjust this path to your image resolution logic */}
                    <img
                        src={`${map}`}
                        alt={title ?? map}
                        className="w-full rounded border"
                    />
                </div>
            )}

            <div className="text-sm mb-2 space-x-2">
                {rows != null && (
                    <span>
                        <strong>Rows:</strong> {rows}
                    </span>
                )}
                {cols != null && (
                    <span>
                        <strong>Cols:</strong> {cols}
                    </span>
                )}
                {prefix && (
                    <span>
                        <strong>Prefix:</strong> {prefix}
                    </span>
                )}
            </div>

            {!!cellList.length && (
                <div>
                    <strong>Cells:</strong>
                    <ul className="list-disc ml-6">
                        {cellList.map((c) => (
                            <li key={c}>{c}</li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
};
