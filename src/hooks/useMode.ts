import { useViewerModeStore } from "../store/viewerMode";

export function useMode() {
    return useViewerModeStore((s) => s.mode);
}

export function useSetMode() {
    return useViewerModeStore((s) => s.setMode);
}