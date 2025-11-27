import { create } from "zustand";
import type { ViewerMode } from "../types/viewer";

interface ViewerModeStore {
    mode: ViewerMode;
    hydrated: boolean;
    setMode: (m: ViewerMode) => void;
    hydrateFromFile: () => void;
}

export const useViewerModeStore = create<ViewerModeStore>((set) => ({
    // Build-time fallback (development uses toggle; production overrides)
    mode: import.meta.env.VITE_VIEWER_MODE === "player" ? "player" : "dm",

    hydrated: false,

    setMode: (m) => set({ mode: m }),

    hydrateFromFile: async () => {
        // Development mode should immediately mark as hydrated
        if (import.meta.env.VITE_MODE === "development") {
            set({ hydrated: true });
            return;
        }

        try {
            const res = await fetch("/viewer-mode.json");
            const cfg = await res.json();

            if (cfg?.mode === "player" || cfg?.mode === "dm") {
                set({ mode: cfg.mode, hydrated: true });
            } else {
                set({ hydrated: true });
            }
        } catch {
            console.warn("viewer-mode.json missing — using env default");
            set({ hydrated: true });
        }
    },
}));
