import { create } from "zustand";
import type { ViewerMode } from "../types/viewer";

interface ViewerModeStore {
    mode: ViewerMode;
    setMode: (m: ViewerMode) => void;
}

export const useViewerModeStore = create<ViewerModeStore>((set) => ({
    mode: import.meta.env.VITE_VIEWER_MODE === "player" ? "player" : "dm",
    setMode: (m) => set({ mode: m }),
}));