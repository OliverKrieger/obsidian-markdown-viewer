import { useRef, useState } from "react";
import type { ManifestLike } from "../../types";
import { WikiLink } from "../../../../WikiLink";
import { SwadeHoverPanel } from "./SwadeHoverPanel";

function slugToHref(slug: string) {
    return `/page/${encodeURIComponent(slug)}`;
}

export function SwadeAbilityRef({
    refName,
    manifest,
}: {
    refName: string;
    manifest?: ManifestLike;
}) {
    const [hoverXY, setHoverXY] = useState<{ x: number; y: number } | null>(null);
    const [panelHovered, setPanelHovered] = useState(false);
    const closeTimerRef = useRef<number | null>(null);

    const meta = manifest?.pageMeta?.[refName];

    function clearCloseTimer() {
        if (closeTimerRef.current != null) {
            window.clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    }

    function scheduleClose() {
        clearCloseTimer();
        closeTimerRef.current = window.setTimeout(() => setHoverXY(null), 120);
    }

    return (
        <>
            <WikiLink
                href={slugToHref(refName)}
                className="underline cursor-help text-brand-500"
                onMouseEnter={(e: any) => {
                    clearCloseTimer();
                    setHoverXY({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => {
                    if (!panelHovered) scheduleClose();
                }}
            >
                {refName}
            </WikiLink>

            {hoverXY && meta ? (
                <SwadeHoverPanel
                    title={refName}
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
            ) : null}
        </>
    );
}
