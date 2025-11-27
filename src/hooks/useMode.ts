import { useEffect } from "react";
import { useViewerModeStore } from "../store/viewerMode";

export function useMode() {
    const mode = useViewerModeStore((s) => s.mode);
    const hydrated = useViewerModeStore((s) => s.hydrated);
    const hydrate = useViewerModeStore((s) => s.hydrateFromFile);

    useEffect(() => {
        if (!hydrated) {
            hydrate();
        }
    }, [hydrated]);

    return mode;
}

export function useSetMode() {
    return useViewerModeStore((s) => s.setMode);
}