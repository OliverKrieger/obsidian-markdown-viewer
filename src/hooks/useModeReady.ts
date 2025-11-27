import { useViewerModeStore } from "../store/viewerMode";

export function useModeReady() {
    return useViewerModeStore((s) => s.hydrated);
}