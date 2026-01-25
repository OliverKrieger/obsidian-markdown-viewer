export function HoverPanel({
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
