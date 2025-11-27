import { useEffect, useState } from "react";
import type { ViewerMode } from "../types/viewer";

export function useMode() {
    const allowSwitch = import.meta.env.VITE_MODE === "development";
    const initial: ViewerMode = import.meta.env.VITE_VIEWER_MODE === "player" ? "player" : "dm";
    const [mode, setMode] = useState(initial);

    useEffect(() => {
        if (!allowSwitch) return;
        (window as any).setViewerMode = setMode; // dev convenience
    }, []);

    return mode;
}